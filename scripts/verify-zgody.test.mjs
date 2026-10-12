import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { DEFAULT_ENGINE, ZASTANE, verify } from './verify-zgody.mjs';

function site(pages, realizacje = {}) {
  const root = mkdtempSync(join(tmpdir(), 'zgody-'));
  mkdirSync(join(root, 'scripts'));
  for (const ref of pages) {
    const dir = join(root, 'src/pages', ref.split('/').slice(0, -1).join('/'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(root, 'src/pages', `${ref}.astro`), '---\n---\n');
  }
  writeFileSync(join(root, 'scripts/realizacje-pokazane.json'), JSON.stringify({ miejsce: 'STRONA', realizacje }));
  return root;
}

// Atrapa rejestru: ten sam interfejs co src/www_gate.py, odpowiedź ustalona w teście.
function fakeEngine(answers, doZdjecia = []) {
  const dir = mkdtempSync(join(tmpdir(), 'silnik-'));
  mkdirSync(join(dir, 'src'));
  const script = `import json, sys
p = json.load(sys.stdin)
a = ${JSON.stringify(answers)}
print(json.dumps({"wyniki": [{"ref": r["ref"], "odpowiedz": a.get(r["ref"], "NIE"), "dziala": a.get(r["ref"]) == "TAK",
  "powod": "atrapa", "zasada": "X"} for r in p["realizacje"]], "do_zdjecia": ${JSON.stringify(doZdjecia)}, "zgody_w_rejestrze": 0}))
`;
  writeFileSync(join(dir, 'src', 'www_gate.py'), script);
  return { engineDir: dir };
}

const shown = { pokazane: [{ osoba: 'klient:nowy', elementy: ['NAZWA_FIRMY'] }] };

test('lista zastanych jest zamknięta', () => {
  assert.deepEqual([...ZASTANE].sort(), ['pl/realizacje/glassstone', 'pl/realizacje/igor-grabowski', 'work/igor-grabowski']);
});

test('brak realizacji przechodzi bez rejestru', () => {
  const result = verify(site([]), { engineDir: '/nie/ma' });
  assert.equal(result.code, 0);
});

test('strona zbiorcza index nie jest realizacją', () => {
  assert.equal(verify(site(['pl/realizacje/index', 'work/index']), { engineDir: '/nie/ma' }).code, 0);
});

test('nowa realizacja bez wpisu blokuje', () => {
  const result = verify(site(['pl/realizacje/nowa']), fakeEngine({}));
  assert.equal(result.code, 1);
  assert.equal(result.report.rows[0].stan, 'BLOKADA');
});

test('nowa realizacja z TAK z rejestru przechodzi', () => {
  const result = verify(site(['pl/realizacje/nowa'], { 'pl/realizacje/nowa': shown }), fakeEngine({ 'pl/realizacje/nowa': 'TAK' }));
  assert.equal(result.code, 0);
});

test('nowa realizacja z NIE albo DO_CZLOWIEKA blokuje', () => {
  for (const answer of ['NIE', 'DO_CZLOWIEKA']) {
    const result = verify(site(['pl/realizacje/nowa'], { 'pl/realizacje/nowa': shown }), fakeEngine({ 'pl/realizacje/nowa': answer }));
    assert.equal(result.code, 1, answer);
  }
});

test('zastana bez zgody jest raportowana, nie blokuje i nie jest usuwana', () => {
  const root = site(['pl/realizacje/glassstone'], { 'pl/realizacje/glassstone': shown });
  const result = verify(root, fakeEngine({ 'pl/realizacje/glassstone': 'DO_CZLOWIEKA' }));
  assert.equal(result.code, 0);
  assert.equal(result.report.rows[0].stan, 'ZASTANA_BRAK_ZGODY');
  assert.ok(existsSync(join(root, 'src/pages/pl/realizacje/glassstone.astro')));
});

test('lista do zdjęcia pochodzi z rejestru', () => {
  const root = site(['pl/realizacje/glassstone'], { 'pl/realizacje/glassstone': shown });
  const result = verify(root, fakeEngine({}, ['pl/realizacje/glassstone']));
  assert.deepEqual(result.report.doZdjecia, ['pl/realizacje/glassstone']);
  assert.ok(result.lines.some((l) => l.includes('Lista do zdjęcia') && l.includes('glassstone')));
});

test('wyjątek bez osoby wymaga powodu i decyzji', () => {
  const bad = verify(site(['pl/realizacje/wlasna'], { 'pl/realizacje/wlasna': { pokazane: [] } }), fakeEngine({}));
  assert.equal(bad.code, 2);
  const ok = verify(site(['pl/realizacje/wlasna'], {
    'pl/realizacje/wlasna': { pokazane: [], wyjatek: { powod: 'projekt własny', decyzja: 'Kacper 2026-10-12' } },
  }), fakeEngine({ 'pl/realizacje/wlasna': 'TAK' }));
  assert.equal(ok.code, 0);
});

test('brak rejestru zatrzymuje (kod 2)', () => {
  const result = verify(site(['pl/realizacje/nowa'], { 'pl/realizacje/nowa': shown }), { engineDir: '/nie/ma' });
  assert.equal(result.code, 2);
});

test('trasa dynamiczna realizacji zatrzymuje', () => {
  assert.equal(verify(site(['pl/realizacje/[slug]']), fakeEngine({})).code, 2);
});

test('prawdziwy rejestr: pusty rejestr nie daje TAK, nowa blokuje, zastana tylko raport', { skip: !existsSync(join(DEFAULT_ENGINE, 'src', 'www_gate.py')) }, () => {
  const tmp = mkdtempSync(join(tmpdir(), 'rejestr-'));
  const options = { extraArgs: ['--registry', join(tmp, 'brak.sqlite3'), '--journal', join(tmp, 'zapisy.sqlite3')] };
  const root = site(['pl/realizacje/glassstone', 'pl/realizacje/nowa'], {
    'pl/realizacje/glassstone': { pokazane: [{ osoba: 'klient:glassstone', elementy: ['NAZWA_FIRMY'] }] },
    'pl/realizacje/nowa': shown,
  });
  const result = verify(root, options);
  assert.equal(result.code, 1);
  const states = Object.fromEntries(result.report.rows.map((r) => [r.ref, r.stan]));
  assert.deepEqual(states, { 'pl/realizacje/glassstone': 'ZASTANA_BRAK_ZGODY', 'pl/realizacje/nowa': 'BLOKADA' });
});
