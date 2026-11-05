// Testy bez AWS: node --test backend/contact-form/test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { recordLead, createCrmClient, slug } from './crm.mjs';
// Lokalnie nie ma pakietu @aws-sdk: komendy to zwykłe obiekty { kind, input }.
const CMDS = { query: (i) => ({ kind: 'QueryCommand', input: i }), get: (i) => ({ kind: 'GetCommand', input: i }), put: (i) => ({ kind: 'PutCommand', input: i }) };
const mk = (doc) => createCrmClient('t', doc, CMDS);

function fakeDoc(seed = {}) {
  const items = new Map(Object.entries(seed));
  const key = (k) => `${k.PK}|${k.SK}`;
  return {
    items,
    async send(cmd) {
      const n = cmd.kind;
      const i = cmd.input;
      if (n === 'QueryCommand') {
        const v = i.ExpressionAttributeValues[':k'];
        return { Items: [...items.values()].filter((x) => x.GSI1PK === v) };
      }
      if (n === 'GetCommand') return { Item: items.get(key(i.Key)) };
      if (n === 'PutCommand') {
        const k = key(i.Item);
        if (i.ConditionExpression && items.has(k)) { const e = new Error('cond'); e.name = 'ConditionalCheckFailedException'; throw e; }
        items.set(k, i.Item); return {};
      }
      throw new Error('nieznana komenda ' + n);
    },
  };
}

test('slug', () => {
  assert.equal(slug('Zakład Kamieniarski Nowak'), 'zaklad-kamieniarski-nowak');
  assert.equal(slug('  '), 'bez-nazwy');
});

test('nowy lead: strona, identyfikator, sprawa OPEN, zdarzenie', async () => {
  const doc = fakeDoc();
  const r = await recordLead(mk(doc), { name: 'Anna Lis', email: 'Anna@Lis.PL ', message: 'Potrzebuję strony', utm: 'utm_source=meta' });
  assert.equal(r.created, true);
  assert.equal(r.partyId, 'person-anna-lis');
  const meta = doc.items.get('PARTY#person-anna-lis|META');
  assert.equal(meta.source, 'Formularz');
  assert.equal(meta.party_type, 'PERSON');
  assert.equal(doc.items.get('PARTY#person-anna-lis|ID#email#anna@lis.pl').GSI1SK, 'person-anna-lis');
  assert.equal(doc.items.get('CASE#person-anna-lis|META').stage, 'OPEN');
  const ev = [...doc.items.values()].find((x) => x.SK.startsWith('EVENT#'));
  assert.equal(ev.event_type, 'lead_received');
  assert.match(ev.text, /Potrzebuję strony \[utm_source=meta\]/);
});

test('ten sam e-mail: bez nowej strony, tylko zdarzenie i odswiezenie META', async () => {
  const doc = fakeDoc();
  const crm = mk(doc);
  await recordLead(crm, { name: 'Anna Lis', email: 'anna@lis.pl', message: 'raz' });
  const przed = doc.items.size;
  const r = await recordLead(crm, { name: 'A. Lis', email: 'ANNA@lis.pl', message: 'dwa' });
  assert.equal(r.created, false);
  assert.equal(r.partyId, 'person-anna-lis');
  assert.equal(doc.items.size, przed + 1);
  assert.equal(doc.items.get('PARTY#person-anna-lis|META').display_name, 'Anna Lis');
});

test('ta sama nazwa, inny e-mail: kolejny identyfikator', async () => {
  const doc = fakeDoc();
  const crm = mk(doc);
  await recordLead(crm, { name: 'Jan Nowak', email: 'a@x.pl', message: 'x' });
  const r = await recordLead(crm, { name: 'Jan Nowak', email: 'b@x.pl', message: 'y' });
  assert.equal(r.partyId, 'person-jan-nowak-2');
});

test('handler: mail idzie, CRM wylaczony flaga -> crm:false; wlaczony -> crm:true; blad CRM nie psuje maila', async () => {
  const { createHandler } = await import('./index.mjs');
  const sent = [];
  const ses = { send: async (c) => { sent.push(c); return {}; } };
  const body = JSON.stringify({ name: 'Test', email: 't@x.pl', message: 'hej', consent: true });
  const ev = { requestContext: { http: { method: 'POST' } }, headers: { origin: 'https://mioduszewsky.com' }, body };

  let h = createHandler({ ses, crm: null });
  let r = await h(ev);
  assert.equal(r.statusCode, 200);
  assert.deepEqual(JSON.parse(r.body), { ok: true, crm: false });
  assert.equal(sent.length, 1);

  const doc = fakeDoc();
  h = createHandler({ ses, crm: mk(doc) });
  r = await h(ev);
  assert.deepEqual(JSON.parse(r.body), { ok: true, crm: true });
  assert.ok(doc.items.get('PARTY#person-test|META'));

  const zly = { send: async () => { throw new Error('ddb down'); } };
  h = createHandler({ ses, crm: mk(zly) });
  r = await h(ev);
  assert.equal(r.statusCode, 200);
  assert.deepEqual(JSON.parse(r.body), { ok: true, crm: false });
});

test('CRM wiszacy: odpowiedz 200 z crm:false po limicie czasu', async () => {
  const { createHandler } = await import('./index.mjs');
  const ses = { send: async () => ({}) };
  const wisi = { send: () => new Promise(() => {}) };
  const h = createHandler({ ses, crm: mk(wisi) });
  const t0 = Date.now();
  const r = await h({ requestContext: { http: { method: 'POST' } }, headers: {}, body: JSON.stringify({ name: 'T', email: 't@x.pl', message: 'm', consent: true }) });
  assert.deepEqual(JSON.parse(r.body), { ok: true, crm: false });
  assert.ok(Date.now() - t0 < 6000);
});
