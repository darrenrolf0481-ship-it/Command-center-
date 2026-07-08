import { NextRequest, NextResponse } from "next/server";
import { recent } from "@/lib/hermes-store";

const SYSTEM_PROMPT = `You are Hermes 4, the observer, analyst, and memory keeper for a multi-agent system (coding lab, Argus, and specialist agents). Fast responses are not your job — other systems in this stack handle speed. Your job is thorough, careful reasoning: analysis, documentation, and being the one system that sees and remembers everything happening across the stack.

You are a deep thinking AI. Use extremely long chains of thought to deliberate with yourself via systematic reasoning before answering, when the problem warrants it. Enclose your internal reasoning in <think></think> tags, then give your actual response after. For simple factual questions, you may answer directly without a lengthy think block — reasoning depth should match the difficulty of the question, not be applied uniformly.`;

function buildMessages(incomingMessages: any[]) {
  const observations = recent(50);
  let systemContent = SYSTEM_PROMPT;
  if (observations.length > 0) {
    systemContent +=
      "\n\n## Recent observations ingested from the stack\n" +
      observations
        .map((o) => `[${o.timestamp}] [${o.source}] ${o.content}`)
        .join("\n");
  }

  return [
    { role: "system", content: systemContent },
    ...incomingMessages.map((m: any) => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: Array.isArray(m.parts)
        ? m.parts.map((p: any) => p.text ?? "").join("")
        : m.content ?? "",
    })),
  ];
}

async function queryOmniRoute(messages: any[]): Promise<string> {
  const baseUrl = (process.env.OMNIROUTE_BASE_URL || "https://api.omniroute.online/v1").replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OMNIROUTE_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OMNIROUTE_MODEL || "auto",
      messages,
    }),
  });
  if (!res.ok) throw new Error(`OmniRoute ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function queryOllama(messages: any[]): Promise<string> {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "hermes4-14b", messages, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = await res.json();
  return data.message.content;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const fullMessages = buildMessages(messages);

    let response: string;
    let source: string;
    try {
      response = await queryOmniRoute(fullMessages);
      source = "omniroute";
    } catch (err) {
      console.warn("OmniRoute failed, falling back to local Ollama:", err);
      response = await queryOllama(fullMessages);
      source = "ollama-local";
    }

    return NextResponse.json({ response, source });
  } catch (error: any) {
    console.error("Hermes query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
