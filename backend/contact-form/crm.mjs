// Zapis zgłoszenia z formularza do CRM Autofirmy (DynamoDB `autofirma-crm-dev`, TAK Kacpra 05.11.2026).
// Ten sam słownik co api/crm.py w repo MONITORING: strona (PARTY#), identyfikator (ID#email#...),
// sprawa (CASE#) i zdarzenie (EVENT#). Mail przez SES zostaje drogą główną; błąd zapisu w CRM
// nigdy nie przerywa odpowiedzi dla człowieka (wynik: { crm: false }).
// Logi: tylko typ błędu, zero imion, maili i treści.
// Przyjęte świadomie przy jednym formularzu i kilku zgłoszeniach w miesiącu (recenzja Codexa 05.11.2026):
// kontrola duplikatów przez indeks GSI1 (ostatecznie spójny), cztery osobne zapisy bez transakcji,
// odświeżenie META pełnym PutItem. Przy wzroście ruchu: TransactWriteItems i UpdateItem na polach.

// SDK ładowany leniwie: w Lambdzie jest wbudowany, lokalnie testy podstawiają własnego klienta i komendy.
async function cmdsOf(crm) {
  if (!crm.cmds) {
    const lib = await import('@aws-sdk/lib-dynamodb');
    crm.cmds = { query: (i) => new lib.QueryCommand(i), get: (i) => new lib.GetCommand(i), put: (i) => new lib.PutCommand(i) };
  }
  return crm.cmds;
}

const nowIso = () => new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
const today = () => new Date().toISOString().slice(0, 10);
const norm = (email) => String(email || '').trim().toLowerCase();

export function slug(text) {
  const t = String(text || '').toLowerCase().replace(/ł/g, 'l').normalize('NFKD').replace(/[̀-ͯ]/g, '');
  return t.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'bez-nazwy';
}

function eventId() {
  const d = new Date();
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `ev-${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}${p(d.getUTCMilliseconds(), 3)}000-${Math.random().toString(16).slice(2, 8)}`;
}

export function createCrmClient(table, docClient, cmds) {
  return { table, doc: docClient || null, cmds: cmds || null };
}

async function docOf(crm) {
  if (!crm.doc) {
    const { DynamoDBClient } = await import('@aws-sdk/client-dynamodb');
    const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
    crm.doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-central-1' }));
  }
  return crm.doc;
}

/** Zapisuje lead: istniejący klient (po e-mailu) dostaje zdarzenie, nowy dostaje stronę, identyfikator, sprawę OPEN i zdarzenie. */
export async function recordLead(crm, { name, email, message, utm }) {
  const { table } = crm;
  const doc = await docOf(crm);
  const C = await cmdsOf(crm);
  const ts = nowIso();
  const day = today();
  const emailNorm = norm(email);
  const text = String(message || '').slice(0, 4000);
  const utmNote = utm ? ` [${utm}]` : '';

  const hit = await doc.send(C.query({
    TableName: table, IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :k',
    ExpressionAttributeValues: { ':k': `ID#email#${emailNorm}` },
    Limit: 1,
  }));
  let partyId = hit.Items && hit.Items[0] ? hit.Items[0].GSI1SK : null;
  let created = false;

  if (!partyId) {
    const base = `person-${slug(name)}`;
    partyId = base;
    for (let n = 2; ; n++) {
      const exists = await doc.send(C.get({ TableName: table, Key: { PK: `PARTY#${partyId}`, SK: 'META' } }));
      if (!exists.Item) break;
      // Po 10 kolizjach nazwy losowy przyrostek: zawsze jest wolny identyfikator.
      partyId = n <= 10 ? `${base}-${n}` : `${base}-${Math.random().toString(16).slice(2, 8)}`;
    }
    const meta = {
      PK: `PARTY#${partyId}`, SK: 'META', GSI1PK: 'PARTY', GSI1SK: ts,
      party_id: partyId, party_type: 'PERSON', display_name: String(name).slice(0, 120), status: 'ACTIVE',
      source: 'Formularz', source_ref: `formularz:${day}`, email: String(email).trim().slice(0, 200),
      created_at: ts, updated_at: ts, last_event_at: day, last_event_label: 'Lead z formularza strony',
    };
    await doc.send(C.put({ TableName: table, Item: meta, ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' }));
    await doc.send(C.put({ TableName: table, Item: {
      PK: `PARTY#${partyId}`, SK: `ID#email#${emailNorm}`, GSI1PK: `ID#email#${emailNorm}`, GSI1SK: partyId,
      identifier_id: `id-${partyId}-email-${Math.random().toString(16).slice(2, 10)}`, identifier_type: 'email',
      normalized_value: emailNorm, display_value: String(email).trim(), active: true, source: 'formularz', valid_from: ts,
    } }));
    await doc.send(C.put({ TableName: table, Item: {
      PK: `CASE#${partyId}`, SK: 'META', GSI1PK: 'STAGE#OPEN', GSI1SK: ts, case_id: partyId, party_id: partyId,
      stage: 'OPEN', next_action: 'Odpowiedzieć na zapytanie', due_at: day, offer_expires_at: '', amount_minor: 0,
      currency: 'PLN', source: 'Formularz', revision: 1, created_at: ts, updated_at: ts,
    } }));
    created = true;
  } else {
    const metaRes = await doc.send(C.get({ TableName: table, Key: { PK: `PARTY#${partyId}`, SK: 'META' } }));
    const meta = metaRes.Item;
    if (meta) {
      await doc.send(C.put({ TableName: table, Item: { ...meta, updated_at: ts, GSI1SK: ts, last_event_at: day, last_event_label: 'Lead z formularza strony' } }));
    }
  }

  const id = eventId();
  await doc.send(C.put({ TableName: table, Item: {
    PK: `PARTY#${partyId}`, SK: `EVENT#${day}#${id}`, event_id: id, event_type: 'lead_received',
    title: 'Lead z formularza strony', text: text + utmNote, occurred_at: day, source: 'formularz',
    idempotency_key: id, created_at: ts,
  }, ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' }));

  return { partyId, created };
}
