# grain: how to use it

grain takes the AI tells out of writing. It polishes a draft so it reads like a person wrote it, or drafts one that way from the start. Korean and English.

## When to reach for grain

Invoke the `/grain` skill whenever the user asks to:

- polish a draft so it stops sounding AI-written ("윤문해줘", "AI 티 없애줘", "자연스럽게 다듬어줘", "사람이 쓴 것처럼", "make it sound human", "remove the AI tells", "de-AI this");
- write a blog post, worklog, or essay draft that should read human from the start.

`$ARGUMENTS` decides the mode: a file path or pasted text → **Mode A (polish)**; a topic or request only → **Mode B (draft)**.

## The two rules that matter most

- **Always read `references/patterns.md` before working.** It is the pattern catalog (A through I) with cited sources. The skill's diagnosis and fixes all lean on it.
- **em dash (—) is a hard ban, no exceptions.** Every other rule is applied unevenly on purpose (uniformity is itself an AI signal), but `—` is removed 100% of the time. Search for the character before output and confirm zero.

## What grain is not

- Not a style enforcer. It does not impose one person's voice. In polish mode it works *inside* the tone the original already set; it never overwrites the author's voice with a new one.
- Not an AI-detector-score optimizer. Evading a detector is not the goal; readable, human prose is.
- Not a fact editor. In polish mode it changes style only, never the numbers, names, dates, quotes, or claims.

## How it works

grain is a single request-triggered skill plus one reference file. No hooks, no MCP server, no network calls, no telemetry. It reads `patterns.md` at work time, so edits to the catalog take effect immediately.
