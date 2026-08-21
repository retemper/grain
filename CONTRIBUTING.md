# Contributing to grain

Thanks for helping. grain is a small plugin: one request-triggered skill plus one reference catalog. There is no build step and nothing to compile. Edit the markdown, run the tests, commit.

## Project principle: stay generic

grain is generic open source. It must **not** contain telemetry, phone-home behaviour, network calls, or coupling to any specific person, product, or organisation. It must not impose one person's writing voice. Only the packaging metadata (author / marketplace / repository) may name `retemper`.

The test suite enforces this automatically (see below), so a change that reintroduces a personal reference, a network sink, or a stray em dash will fail CI. Please do not weaken those guards to get a change through.

## Repo layout

| Path | What it is | Build step? |
|------|-----------|-------------|
| `skills/grain/SKILL.md` | The `/grain` skill (polish + draft modes) | None |
| `references/patterns.md` | AI-tell catalog (A through K) with cited sources | None |
| `.claude-plugin/*.json` | Plugin + marketplace manifests | None |
| `CLAUDE.md`, `README.md` | Docs | None |
| `test/grain.test.mjs` | Invariant guard | Run it |

## Tests

```bash
npm test
```

The suite checks these invariants:

- **Manifests** are valid JSON with a consistent name, semver version, and MIT license.
- **The skill** has valid frontmatter (`name: grain` + a description).
- **The catalog** exists and keeps its cited-sources section.
- **No coupling**: no personal or organisational references, no network / telemetry sinks.
- **The em-dash ban applies to grain itself**: a dash character (`—` or `–`) may appear only on a line that explains the rule (one naming "em dash" / "en dash" / "대시"). Any other use is real punctuation and fails.
- **Catalog drift**: sections run contiguously from A with no gap, every section is referenced somewhere in `SKILL.md`, the docs state the catalog's real range, and `plugin.json` and `package.json` carry the same version.

## Editing the catalog

`references/patterns.md` is the engine. When you add a pattern, keep it language- and vendor-neutral, and cite a source in the sources section when you can. The "고침" examples are default directions, not a mandated style; grain works inside the author's own voice.

## The one hard rule

The em dash (`—`) is banned in grain's own output and in grain's own docs. Every other rule bends to the text; this one does not. If you need to refer to the character while documenting the rule, name it ("em dash") on the same line so the test recognises it as an explanation, not a use.
