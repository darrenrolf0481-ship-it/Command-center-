# Hermes 4 14B — Ollama Setup for Zo Computer (4-core / 32GB RAM, CPU-only)

Role this model is being configured for: slow, thorough reasoning/analysis/
documentation layer ("figure this shit out guy"), not a fast-response agent.
Reasoning mode is left ON by default in the system prompt below — that's
intentional given the job description, not an oversight.

---

## 1. Which quant to pull

Since this box has RAM to spare and speed isn't the priority, go one step up
from the "safe default" Q4_K_M and use **Q6_K** — meaningfully better output
quality, still leaves comfortable headroom in 32GB for context + KV cache.

| Quant | Approx size | Notes |
|---|---|---|
| Q4_K_M | ~8.5 GB | Safe baseline, fastest of the good options |
| **Q6_K** | ~11.5 GB | **Recommended** — better quality, still light on this box |
| Q8_0 | ~15 GB | Marginal gain over Q6_K, meaningfully slower on CPU, only worth it if quality issues show up at Q6_K |

Do NOT go for 70B on this hardware — doesn't fit in 32GB even at low quant,
and even if it technically loaded, 4 CPU cores would make it unusably slow.

## 2. Download the GGUF

Community GGUF build (quantized by gabriellarson, hosted on Hugging Face):

```bash
huggingface-cli download gabriellarson/Hermes-4-14B-GGUF \
  --include "Hermes-4-14B-Q6_K.gguf" \
  --local-dir ./hermes4-14b-gguf
```

If `huggingface-cli` isn't installed: `pip install -U "huggingface_hub[cli]" --break-system-packages`

(Alternative source if that repo's naming changes: bartowski/NousResearch_Hermes-4-14B-GGUF
— same model, different quantizer, same commands with adjusted filename.)

## 3. Modelfile

Save this as `Modelfile` in the same directory as the .gguf file:

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

### Context window notes

Hermes runs as a **dedicated Ollama instance** — no model sharing, no
contention. That's why `num_ctx` is set to 65536 (64K) rather than the
conservative 32K starting point. RAM breakdown on Zo's 32GB:

| Component | Approx size |
|---|---|
| Q6_K weights | ~11.5 GB |
| KV cache at 64K ctx | ~8–10 GB |
| Total | ~21 GB |

That leaves ~10GB headroom for OS and other processes — comfortable.
There is no point having a persistent memory/observer AI if he runs out of
context mid-session. 64K is the right default here.

To go higher: 128K is theoretically supported (Nous docs say up to 128K)
but pushes total RAM to ~30GB — too tight for safe operation. Stick with
64K unless you've profiled actual usage and confirmed headroom.

Other parameters:
- `temperature 0.4` — favors consistency/correctness over creativity,
  appropriate for an analysis role. Bump to 0.7-0.8 for more creative
  output (e.g. writing summaries in his own voice).
- `num_predict 4096` — cap on a single response length, not the reasoning
  budget. The `<think>` block itself can run long (Nous reports 40K+ token
  traces on hard problems) — if responses are getting cut off mid-answer,
  raise this.

## 4. Build and run

```bash
cd ./hermes4-14b-gguf
ollama create hermes4-14b -f Modelfile
ollama run hermes4-14b
```

## 5. Sanity check

Ask it something that should trigger reasoning mode (e.g. a multi-step logic
or math problem) and confirm you see a <think>...</think> block before the
answer. Ask it something trivial (e.g. "what's 2+2") and confirm it doesn't
generate a huge think block for no reason — if it does on everything, that's
a sign to loosen the system prompt's reasoning-trigger wording.

## 6. Wiring into OmniRoute (when ready)

Once this is loaded and confirmed working, register it in OmniRoute as a
local Ollama provider (model tag will be `hermes4-14b`, endpoint the local
Ollama API — default `http://localhost:11434`), then put it first-priority in
whatever combo routes Hermes's traffic. No rush on this step — get the model
running and verified on its own first.
