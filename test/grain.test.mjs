// Invariant tests for the grain plugin. No Claude Code needed.
// grain ships only markdown + manifests, so these guard the two things that
// must never regress: the vendor-neutral / no-personal-coupling rule, and
// grain's own em-dash hard ban (dogfooding). Run with: node --test (or npm test)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Every shipped text file (skip VCS, deps, and the license boilerplate).
function shippedFiles(exts) {
  return readdirSync(ROOT, { recursive: true })
    .map((p) => p.toString())
    .filter((p) => !p.startsWith('.git') && !p.includes('node_modules'))
    .filter((p) => exts.some((e) => p.endsWith(e)));
}

const textFiles = shippedFiles(['.md', '.json']);
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

// Catalog section letters in document order, e.g. ['A','B',...].
function catalogSections() {
  return [...read('references/patterns.md').matchAll(/^## ([A-Z])\. /gm)].map((m) => m[1]);
}

const COUNT_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty',
];

test('manifests are valid JSON with a consistent version and name', () => {
  const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
  const market = JSON.parse(read('.claude-plugin/marketplace.json'));
  assert.equal(plugin.name, 'grain');
  assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
  assert.equal(plugin.license, 'MIT');
  const entry = market.plugins.find((p) => p.name === 'grain');
  assert.ok(entry, 'marketplace.json must list a grain plugin');
  assert.equal(market.owner.name, 'retemper');
});

test('the grain skill has valid frontmatter (name + description)', () => {
  const skill = read('skills/grain/SKILL.md');
  assert.match(skill, /^---\n/, 'SKILL.md must open with YAML frontmatter');
  assert.match(skill, /\nname:\s*grain\b/, 'skill name must be grain');
  assert.match(skill, /\ndescription:\s*\S/, 'skill needs a non-empty description');
});

test('the pattern catalog exists and keeps its cited sources', () => {
  const patterns = read('references/patterns.md');
  assert.match(patterns, /## 근거 소스/, 'patterns.md must keep the sources section');
  assert.match(patterns, /KatFishNet/, 'the Korean-detection citation must survive');
});

// The retemper hard rule: 100% generic, no coupling to any person or org, no
// telemetry / phone-home. Only packaging metadata may name "retemper".
test('no personal or organizational coupling anywhere', () => {
  const forbidden = [
    /minhyeok/i,
    /강민혁/,
    /\b볼트\b/,
    /obsidian/i,
    /vercel/i,
    /\bflex\b/i, // the org the sibling concept came from; must never appear
  ];
  for (const rel of textFiles) {
    const body = read(rel);
    for (const re of forbidden) {
      assert.ok(!re.test(body), `${rel} must not reference ${re}`);
    }
  }
});

test('no network calls or telemetry sinks in shipped text', () => {
  const sinks = [/fetch\s*\(/, /XMLHttpRequest/, /sendBeacon/, /axios/, /require\(['"]https?['"]\)/];
  for (const rel of textFiles) {
    const body = read(rel);
    for (const re of sinks) {
      assert.ok(!re.test(body), `${rel} must not contain a network sink (${re})`);
    }
  }
});

// grain's one hard rule, applied to grain itself. A dash character (— or –) may
// appear ONLY on a line that is explaining the rule (i.e. names "em dash" /
// "en dash" / "대시"). Any other occurrence is a real punctuation use and fails.
test('grain obeys its own em-dash ban (dash chars only in rule explanations)', () => {
  const explains = /(em[\s-]?dash|en[\s-]?dash|대시)/i;
  const offenders = [];
  for (const rel of textFiles) {
    read(rel).split('\n').forEach((line, i) => {
      if (/[—–]/.test(line) && !explains.test(line)) {
        offenders.push(`${rel}:${i + 1}  ${line.trim()}`);
      }
    });
  }
  assert.equal(offenders.length, 0, `dash used as punctuation:\n${offenders.join('\n')}`);
});

// The catalog grows one letter at a time. These three guards catch the drift that
// a growing catalog actually causes: a skipped letter, a pattern nobody wired into
// the skill, and a stale "A through X" range in the docs.
test('catalog sections run contiguously from A', () => {
  const letters = catalogSections();
  assert.ok(letters.length >= 9, 'catalog must keep its sections');
  const expected = letters.map((_, i) => String.fromCharCode(65 + i));
  assert.deepEqual(letters, expected, 'catalog sections must run A..Z with no gap or repeat');
});

test('every catalog section is referenced by the skill', () => {
  const skill = read('skills/grain/SKILL.md');
  for (const letter of catalogSections()) {
    const cited = new RegExp(`\\(${letter}[,)]|(?:^|[\\s·|])${letter}(?:의|를|은|는|와|·|[\\s|])`, 'm');
    assert.ok(cited.test(skill), `SKILL.md must reference catalog section ${letter}`);
  }
});

test('docs state the real catalog range', () => {
  const letters = catalogSections();
  const last = letters.at(-1);
  const word = COUNT_WORDS[letters.length];
  assert.ok(word, 'catalog outgrew the count-word table; extend COUNT_WORDS');
  for (const rel of ['README.md', 'CLAUDE.md', 'CONTRIBUTING.md']) {
    const body = read(rel);
    assert.ok(
      body.includes(`A through ${last}`),
      `${rel} must state the full catalog range (A through ${last})`,
    );
    // Sub-ranges like "G through K" are fine, but none may reach past the catalog.
    for (const m of body.matchAll(/\b([A-Z]) through ([A-Z])\b/g)) {
      assert.ok(
        m[2] <= last,
        `${rel} claims a range ending at ${m[2]}, past the catalog's last section ${last}`,
      );
    }
    for (const m of body.matchAll(/(\w+) groups \(A through/g)) {
      assert.equal(m[1], word, `${rel} says "${m[1]} groups" but the catalog has ${letters.length}`);
    }
  }
});

test('plugin and package versions agree', () => {
  const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
  const pkg = JSON.parse(read('package.json'));
  assert.equal(plugin.version, pkg.version, 'plugin.json and package.json versions must match');
});
