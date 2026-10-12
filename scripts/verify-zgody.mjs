// Bramka zgód przed scaleniem realizacji (case study). Para consent__www, 12.10.2026.
//
// Strona nie ma własnych warunków zgody. Każdą realizację z src/pages/pl/realizacje/ i src/pages/work/
// sprawdza rejestr zgód (consent-suppression-engine, src/www_gate.py -> connections.check_post, ten sam
// punkt co Contra). Ten skrypt tylko zbiera, kto jest pokazany (scripts/realizacje-pokazane.json),
// i decyduje o kodzie wyjścia:
//   0 = można scalać (nowe realizacje mają TAK albo jawny wyjątek; zastane bez TAK są tylko raportowane),
//   1 = nowa realizacja bez wpisu albo bez TAK z rejestru: nie scalać,
//   2 = rejestr niedostępny albo błędny wpis: nie scalać, dopóki nie sprawdzone.
// Nie usuwa stron i nie zmienia rejestru. Uruchamiany ręcznie: npm run verify:zgody (nie w buildzie Vercela,
// bo rejestr żyje na Macu Kacpra, nie w repo).
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CASE_DIRS = ['src/pages/pl/realizacje', 'src/pages/work'];
export const MANIFEST = 'scripts/realizacje-pokazane.json';
export const DEFAULT_ENGINE = join(homedir(), 'workspace', 'projekty', 'mioduszewsky (AUTOFIRMA)', 'systemy',
  'consent-suppression-engine');

// Realizacje istniejące przed bramką: brak. Na produkcji (origin/main, 12.10.2026) nie ma żadnej realizacji, więc każda wymaga zgody w rejestrze (decyzja @autofirma 12.10).
export const ZASTANE = new Set([]);

export function listCases(root = REPO) {
  const cases = [];
  const errors = [];
  for (const dir of CASE_DIRS) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    for (const name of readdirSync(abs)) {
      const match = name.match(/^(.+)\.(astro|md|mdx|html)$/);
      if (!match || match[1] === 'index' || name.startsWith('_')) continue;
      const ref = `${dir.replace('src/pages/', '')}/${match[1]}`;
      if (name.includes('[')) errors.push(`${ref}: trasa dynamiczna, bramka nie zna jej realizacji`);
      else cases.push(ref);
    }
  }
  return { cases: cases.sort(), errors };
}

export function readManifest(root = REPO) {
  return JSON.parse(readFileSync(join(root, MANIFEST), 'utf8'));
}

export function validate(cases, manifest) {
  const errors = [];
  const entries = manifest.realizacje || {};
  for (const ref of cases) {
    const entry = entries[ref];
    if (!entry) continue;
    if (!Array.isArray(entry.pokazane)) errors.push(`${ref}: brak listy 'pokazane'`);
    else if (entry.pokazane.length === 0 && !(entry.wyjatek?.powod && entry.wyjatek?.decyzja)) {
      errors.push(`${ref}: pusta lista 'pokazane' wymaga 'wyjatek' z 'powod' i 'decyzja'`);
    }
  }
  return errors;
}

export function runEngine(payload, { engineDir = process.env.CONSENT_ENGINE_DIR || DEFAULT_ENGINE, extraArgs = [] } = {}) {
  const gate = join(engineDir, 'src', 'www_gate.py');
  if (!existsSync(gate)) return { error: `brak rejestru zgód: ${gate}` };
  const run = spawnSync('python3', [gate, ...extraArgs], { input: JSON.stringify(payload), encoding: 'utf8' });
  if (run.status !== 0) return { error: `rejestr zgód zwrócił błąd (${run.status}): ${run.stdout || run.stderr}` };
  try {
    return JSON.parse(run.stdout);
  } catch {
    return { error: 'rejestr zgód zwrócił nieczytelną odpowiedź' };
  }
}

export function decide(cases, manifest, engine) {
  const entries = manifest.realizacje || {};
  const byRef = new Map((engine?.wyniki || []).map((r) => [r.ref, r]));
  const rows = cases.map((ref) => {
    const zastana = ZASTANE.has(ref);
    const result = byRef.get(ref);
    if (!entries[ref]) {
      return { ref, zastana, stan: zastana ? 'ZASTANA_BEZ_WPISU' : 'BLOKADA', powod: 'brak wpisu w ' + MANIFEST };
    }
    if (result?.dziala) return { ref, zastana, stan: 'OK', powod: result.powod };
    const powod = result ? `${result.odpowiedz}: ${result.powod}` : 'brak odpowiedzi rejestru';
    return { ref, zastana, stan: zastana ? 'ZASTANA_BRAK_ZGODY' : 'BLOKADA', powod };
  });
  return { rows, blocked: rows.some((r) => r.stan === 'BLOKADA'), doZdjecia: engine?.do_zdjecia || [] };
}

export function verify(root = REPO, engineOptions = {}) {
  const { cases, errors: listErrors } = listCases(root);
  if (cases.length === 0 && listErrors.length === 0) {
    return { code: 0, lines: ['Brak realizacji na tej gałęzi. Nic do sprawdzenia.'], report: { rows: [] } };
  }
  const manifest = readManifest(root);
  const errors = [...listErrors, ...validate(cases, manifest)];
  if (errors.length) return { code: 2, lines: ['Błędne wpisy, nie scalać:', ...errors.map((e) => `  - ${e}`)] };
  const payload = {
    miejsce: manifest.miejsce || 'STRONA',
    realizacje: cases.filter((ref) => manifest.realizacje?.[ref])
      .map((ref) => ({ ref, pokazane: manifest.realizacje[ref].pokazane })),
  };
  const engine = payload.realizacje.length ? runEngine(payload, engineOptions) : { wyniki: [], do_zdjecia: [] };
  if (engine.error) return { code: 2, lines: [`Rejestr zgód niedostępny, nie scalać: ${engine.error}`] };
  const report = decide(cases, manifest, engine);
  const label = {
    OK: 'OK', BLOKADA: 'BLOKADA (nowa, nie scalać)', ZASTANA_BRAK_ZGODY: 'brak zgody w rejestrze (zastana, decyzja Kacpra)',
    ZASTANA_BEZ_WPISU: 'brak wpisu i zgody w rejestrze (zastana, decyzja Kacpra)',
  };
  const lines = [`Zgody w rejestrze: ${engine.zgody_w_rejestrze ?? 'nieznane'}. Realizacje: ${cases.length}.`];
  for (const row of report.rows) lines.push(`  ${row.ref}: ${label[row.stan]} | ${row.powod}`);
  lines.push(`Lista do zdjęcia (zgoda cofnięta albo nie obejmuje): ${report.doZdjecia.length ? report.doZdjecia.join(', ') : 'pusta'}`);
  lines.push(report.blocked ? 'WYNIK: nie scalać.' : 'WYNIK: można scalać (zastane bez zgody czekają na decyzję Kacpra).');
  return { code: report.blocked ? 1 : 0, lines, report };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv.indexOf('--raport');
  const result = verify();
  console.log(result.lines.join('\n'));
  if (out > 0 && process.argv[out + 1]) writeFileSync(process.argv[out + 1], JSON.stringify(result.report ?? {}, null, 1));
  process.exit(result.code);
}
