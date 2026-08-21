# grain

**Take the AI tells out of writing.** `grain` is a Claude Code plugin that polishes a draft until it reads like a person wrote it, or drafts one that way from the start. It works in Korean and English, and leans on a pattern catalog grounded in cited research rather than a vague "make it more natural."

grain is **not** an AI-detector-score optimizer, and it does **not** impose a house style. It removes the structural fingerprints of machine-written prose and steers toward the things that actually read human: concrete detail, meaning-driven rhythm, one consistent voice. When it polishes, it works inside the tone your draft already has.

It belongs to no vendor, phones home to nothing, and collects no telemetry.

## How it works

grain is deliberately the simplest plugin in the family: **one skill plus one reference file.** No hooks, no MCP server.

| Piece | What it does |
|-------|--------------|
| **`/grain` skill** | Request-triggered. Polishes pasted text or a file (Mode A), or drafts from a topic (Mode B). Reads the catalog before working. |
| **Pattern catalog** | [`references/patterns.md`](references/patterns.md): eleven groups (A through K) of AI-writing tells with fixes, plus the cited sources behind them. Read at work time, so edits take effect immediately. |

## The two ideas at the core

**Subtraction is only half of it.** Removing the tells (translationese, comma overuse, empty intensifiers, the rule-of-three, hedge stacks) is necessary but not sufficient. Prose still reads AI-written without the other half: concrete specifics, rhythm the meaning drives, and a single voice held to the end. grain does both passes.

**Uniformity is itself a signal.** Applying every rule mechanically to every paragraph produces the flat evenness that flags AI writing. grain applies its rules *unevenly*, guided by the text, with exactly one exception.

## The one hard rule

**The em dash (—) is banned, no exceptions.** Spaced ( — ) and dash-use en dashes (–) included. It is the single strongest tell in English prose, so grain removes it 100% of the time and checks for zero before output. Every other rule bends to the text; this one does not.

## What you'll see

Ask grain to polish something and it runs four passes: **diagnose** (quote each flagged sentence with its pattern name), **subtract** (remove the tells), **rhythm** (vary sentence length by meaning, break repeated endings), and **add** (mark where a concrete example or number belongs, though it never fabricates one). You get the revised text plus a short summary of the main changes.

Drafting from a topic runs the same diagnosis on grain's own output before handing it back.

## Language coverage

The catalog is bilingual. The common syntax-and-rhetoric tells (D, E) apply to both languages; there is an English-vocabulary section (F) and a deep Korean layer covering translationese, comma and ending morphology, heading grammar, collocation, and transitive-verb syntax, numeral and list calques, and telegraphic compression (A through C, G through K). That layer is the part of AI writing hardest to catch, because it comes from English-centric alignment projected onto Korean.

## Install

Add the retemper marketplace and install grain:

```
/plugin marketplace add retemper/grain
/plugin install grain@retemper
```

Then just ask, in either language: "이 글 윤문해줘", "make this sound human", "AI 티 없애줘".

## License

MIT © retemper
