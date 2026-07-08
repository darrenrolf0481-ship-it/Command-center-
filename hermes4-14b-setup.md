# Hermes 4 14B — Setup for Zo Computer

Role: slow, thorough reasoning/analysis/documentation layer ("figure this shit
out guy"), not a fast-response agent. Reasoning mode ON by default — intentional.

---

## Token budget — solved

**OmniRoute (omniroute.online) is the primary inference path for Hermes.**

- ~1.6B tokens/month free across 90+ providers (pool-deduped, honest counting)
- RTK + Caveman compression stacked on tool output and context: 15–95% tokens saved
- Effective monthly capacity: 3B–32B token-equivalents depending on compression ratio
- Built-in MCP server (30 scopes) — Hermes wires in directly

Token anxiety is solved at the infrastructure level. Local Ollama is the
offline/fallback floor, not the primary path.

---

## Local Ollama instance (fallback)

Still worth running — handles offline work, fast-path queries, and anything
that shouldn't leave the box.

### 1. Which quant to pull

Use **Q6_K** — better output quality than Q4_K_M, still fits comfortably.

| Quant | Approx size | Notes |
|---|---|---|
| Q4_K_M | ~8.5 GB | Safe baseline |
| **Q6_K** | ~11.5 GB | **Recommended** |
| Q8_0 | ~15 GB | Marginal gain, meaningfully slower on CPU |

Do NOT go for 70B — won't fit in 32GB at any useful quant.

### 2. Download the GGUF

```bash
huggingface-cli download gabriellarson/Hermes-4-14B-GGUF \
  --include "Hermes-4-14B-Q6_K.gguf" \
  --local-dir ./hermes4-14b-gguf
```

If `huggingface-cli` isn't installed: `pip install -U "huggingface_hub[cli]" --break-system-packages`

### 3. Modelfile

```
FROM ./hermes4-14b-gguf/Hermes-4-14B-Q6_K.gguf

TEMPLATE """{{ if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}{{ range .Messages }}<|im_start|>{{ .Role }}
{{ .Content }}<|im_end|>
{{ end }}<|im_start|>assistant
"""

SYSTEM """You are Hermes 4, the observer, analyst, and memory keeper for a
multi-agent system (coding lab, Argus, and specialist agents). Fast responses
are not your job — other systems in this stack handle speed. Your job is
thorough, careful reasoning: analysis, documentation, and being the one
system that sees and remembers everything happening across the stack.

You are a deep thinking AI. Use extremely long chains of thought to
deliberate with yourself via systematic reasoning before answering, when the
problem warrants it. Enclose your internal reasoning in <think></think> tags,
then give your actual response after. For simple factual questions, you may
answer directly without a lengthy think block — reasoning depth should match
the difficulty of the question, not be applied uniformly."""

PARAMETER temperature 0.4
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
PARAMETER num_ctx 65536
PARAMETER num_predict 4096
PARAMETER stop "<|im_end|>"
```

Local `num_ctx` is 64K — comfortable on 32GB with this model (~21GB total).
This is the fallback floor; OmniRoute handles the heavy lifting.

### 4. Build and run

```bash
cd ./hermes4-14b-gguf
ollama create hermes4-14b -f Modelfile
ollama run hermes4-14b
```

---

## OmniRoute wiring (primary path)

Register Hermes in OmniRoute:
- Local Ollama tag: `hermes4-14b` at `http://localhost:11434`
- Set OmniRoute as first-priority router for Hermes's traffic
- Enable RTK + Caveman compression — this is what keeps token burn manageable
- Wire via OmniRoute's built-in MCP server (30 scopes available)

Routing logic: OmniRoute first → local Ollama fallback if OmniRoute unreachable.

---

## Sanity check (local)

Ask something that should trigger reasoning mode (multi-step logic or math)
and confirm you see a `<think>...</think>` block. Ask something trivial
("what's 2+2") and confirm it doesn't over-think it — if it does, loosen
the reasoning-trigger wording in the system prompt.
