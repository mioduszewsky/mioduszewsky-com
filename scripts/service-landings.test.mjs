import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const slugs = ['wdrozenie-ai', 'aplikacje-i-systemy', 'cofounder-as-a-service'];
const page = (path) => readFile(new URL(`../dist${path}index.html`, import.meta.url), 'utf8');

test('every landing has one H1, its own canonical and working local links', async () => {
  for (const slug of slugs) {
    const path = `/pl/uslugi/${slug}/`;
    const html = await page(path);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, slug);
    assert.ok(html.includes(`https://mioduszewsky.com${path}`), slug);
    assert.ok(!html.includes('id="copy-editor"'), 'editor must not ship to production');
    for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"?]*)(?:\?[^"#]*)?"/g)) {
      const url = new URL(href, 'https://mioduszewsky.com');
      await access(new URL(`../dist${url.pathname}index.html`, import.meta.url));
      if (url.hash) assert.ok((await page(url.pathname)).includes(`id="${url.hash.slice(1)}"`), href);
    }
  }
});

test('consultation and its form are absent from the build, with source preserved', async () => {
  await assert.rejects(page('/pl/uslugi/konsultacja-biznesowa/'));
  await assert.rejects(page('/pl/konsultacja/kontakt/'));
  await access(new URL('../src/components/ConsultationContact.astro', import.meta.url));
  const html = await page('/pl/');
  assert.ok(!html.includes('Pojedyncza konsultacja'));
  assert.ok(!html.includes('200 zł netto'));
});

async function submitLocally(path, search, fields, responseOk = true) {
  const html = await page(path);
  const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('const CONTACT_ENDPOINT'));
  assert.ok(script, 'compiled contact handler must exist');
  const listeners = {};
  const calls = [];
  const node = () => ({ textContent: '', hidden: false, classList: { add() {}, remove() {} }, setAttribute() {}, removeAttribute() {}, focus() {}, closest() { return this; } });
  const label = node();
  const button = { ...node(), disabled: false, querySelector: () => label };
  const form = { ...node(), querySelectorAll: () => [], querySelector: s => s.startsWith('button') ? button : node(), addEventListener: (name, cb) => { listeners[name] = cb; } };
  const message = node();
  const success = { ...node(), hidden: true };
  const sandbox = {
    document: { getElementById: id => ({ ctForm: form, ctMsg: message, ctSuccess: success })[id] || null, querySelector: () => node(), addEventListener() {} },
    URLSearchParams, location: { search }, localStorage: { getItem: () => 'rejected' }, sessionStorage: { getItem: () => null },
    window: {}, navigator: {}, addEventListener() {}, matchMedia: () => ({ matches: false }),
    FormData: class { get(key) { return fields[key] ?? null; } },
    fetch: async (url, options) => { calls.push({ url, body: JSON.parse(options.body) }); return { ok: responseOk }; },
  };
  vm.runInNewContext(script, sandbox);
  await listeners.submit({ preventDefault() {} });
  return { calls, message, form, success, button };
}
const fields = { name: 'Test', email: 'test@example.com', message: 'Syntetyczny opis', consent: 'on', hp: '' };
test('Cofounder submission carries its offer and UTM through existing payload', async () => {
  const result = await submitLocally('/pl/kontakt/', '?service=Cofounder%20as%20a%20Service&utm_source=test', fields);
  assert.equal(result.calls.length, 1);
  assert.match(result.calls[0].body.message, /\[Usługa\] Cofounder as a Service/);
  assert.match(result.calls[0].body.message, /utm_source=test/);
  assert.equal(result.success.hidden, false);
});
test('AI context is preserved; unrecognized service is not echoed', async () => {
  const result = await submitLocally('/pl/kontakt/', '?service=Wdro%C5%BCenie%20AI', fields);
  assert.match(result.calls[0].body.message, /\[Usługa\] Wdrożenie AI/);
  const unknown = await submitLocally('/pl/kontakt/', '?service=unknown', fields);
  assert.equal(unknown.calls[0].body.message, 'Syntetyczny opis');
});
test('validation prevents submission without required fields or consent', async () => {
  for (const invalid of [{}, { ...fields, consent: '' }, { ...fields, email: 'bad' }]) {
    const result = await submitLocally('/pl/kontakt/', '', invalid);
    assert.equal(result.calls.length, 0);
    assert.ok(result.message.textContent);
  }
});
test('network failure keeps the form usable and does not display success', async () => {
  const result = await submitLocally('/pl/kontakt/', '', fields, false);
  assert.equal(result.success.hidden, true);
  assert.equal(result.form.hidden, false);
  assert.equal(result.button.disabled, false);
  assert.match(result.message.textContent, /kacper@mioduszewsky.com/);
});

// Full rendered copy must match the frozen handoff, including owner-approved hero.
test('all supplied copy survives the final HTML verbatim', async () => {
  const data = await readFile(new URL('../src/content/services-pl.ts', import.meta.url), 'utf8');
  const services = JSON.parse(data.split('export const services: Service[] = ')[1].split(';\nexport const servicePath')[0]);
  const plain = html => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
  for (const s of services.filter(s => !s.consultation)) {
    const text = plain(await page(`/pl/uslugi/${s.slug}/`));
    for (const fragment of [s.title, s.lead, s.cta, ...s.sections.flatMap(section => [section.title,...section.paragraphs])]) {
      assert.ok(text.includes(fragment), `${s.slug}: ${fragment}`);
    }
    assert.ok(!text.includes('60 minut'));
    assert.ok(!text.includes('Wszystkie usługi'));
  }
  const app = services.find(s => s.slug === 'aplikacje-i-systemy');
  assert.equal(app.title, 'Zbuduj własną aplikację. Bez szukania wspólnika technicznego.');
});

test('only three secondary pages; no hub or development landing; consultation stays off sitemap', async () => {
  await assert.rejects(access(new URL('../dist/pl/uslugi/index.html', import.meta.url)));
  await assert.rejects(access(new URL('../dist/pl/uslugi/rozwoj-produktu/index.html', import.meta.url)));
  const html = await page('/pl/');
  for (const slug of slugs) assert.ok(html.includes(`/pl/uslugi/${slug}/`));
  assert.ok(!html.includes('/pl/uslugi/rozwoj-produktu/'));
  const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(!sitemap.includes('konsultacja'));
  for (const slug of slugs) assert.ok(sitemap.includes(`/pl/uslugi/${slug}/`));
});
