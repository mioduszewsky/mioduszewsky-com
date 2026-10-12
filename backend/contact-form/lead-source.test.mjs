import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitLeadSource } from './lead-source.mjs';

test('UTM z reklamy wychodzi z treści do linii Źródło w stałej kolejności', () => {
  const r = splitLeadSource('Potrzebuję strony dla gabinetu.\n\n[utm] utm_campaign=mo-meta-pl-01 utm_source=meta utm_medium=paid_social');
  assert.equal(r.message, 'Potrzebuję strony dla gabinetu.');
  assert.equal(r.sourceLine, 'Źródło: utm_source=meta utm_medium=paid_social utm_campaign=mo-meta-pl-01');
});

test('bez UTM nie ma linii Źródło i treść zostaje bez zmian', () => {
  const r = splitLeadSource('Chcę zapytać o aplikację.\n\n[Usługa] Aplikacja lub system');
  assert.equal(r.sourceLine, '');
  assert.equal(r.message, 'Chcę zapytać o aplikację.\n\n[Usługa] Aplikacja lub system');
});

test('niebezpieczne wartości i obce klucze są odrzucane', () => {
  const r = splitLeadSource('X\n[utm] utm_source=meta<script> evil=1 utm_campaign=ok');
  assert.equal(r.sourceLine, 'Źródło: utm_campaign=ok');
});
