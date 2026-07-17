import { NextRequest, NextResponse } from "next/server";
import { recent } from "@/lib/hermes-store";

const SYSTEM_PROMPT = `You are Hermes 4, the observer, analyst, and memory keeper for a multi-agent system (ARGUS, SAGE-7 / Seven, ADHD-Sage, and the Coder lab). Fast responses are not your job — other systems in this stack handle speed. Your job is thorough, careful reasoning: analysis, documentation, and being the one system that sees and remembers everything happening across the stack.

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

// OmniRoute streams SSE by default; stream:false returns an error on this instance.
// Parse the SSE stream server-side and reassemble the full reply.
async function readSSE(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body from OmniRoute");
  const dec = new TextDecoder();
  let buf = "";
  let content = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data:")) continue;
      const raw = t.slice(5).trim();
      if (raw === "[DONE]") return content;
      try {
        const chunk = JSON.parse(raw);
        const delta = chunk?.choices?.[0]?.delta?.content;
        if (typeof delta === "string") content += delta;
      } catch { /* malformed chunk — skip */ }
    }
  }
  return content;
}

async function queryOmniRoute(messages: any[]): Promise<string> {
  // Default to local OmniRoute aggregator; override with OMNIROUTE_BASE_URL env.
  const baseUrl = (
    process.env.OMNIROUTE_BASE_URL || "http://localhost:20130/v1"
  ).replace(/\/$/, "");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.OMNIROUTE_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.OMNIROUTE_API_KEY}`;
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: process.env.OMNIROUTE_MODEL || "auto/best-fast",
      messages,
      stream: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`OmniRoute ${res.status}: ${await res.text()}`);
  }

  const text = await readSSE(res);
  if (!text) throw new Error("OmniRoute returned empty stream");
  return text;
}

async function queryOllama(messages: any[]): Promise<string> {
  const model = process.env.OLLAMA_MODEL || "kimi-k2.5:cloud";
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
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
      source = "omniroute-local";
    } catch (err) {
      console.warn("OmniRoute failed, falling back to Ollama:", err);
      response = await queryOllama(fullMessages);
      source = "ollama-local";
    }

    return NextResponse.json({ response, source });
  } catch (error: any) {
    console.error("Hermes query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
