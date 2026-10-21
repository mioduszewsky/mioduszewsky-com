// Runda 2 referencji case'u Igora: energia marki i strona klienta w dużej skali. argv[2] = katalog.
import { chromium } from 'playwright';
const out = process.argv[2];
const refs = process.argv.slice(3).map((s) => s.split('|'));
const b = await chromium.launch();
await Promise.all(refs.map(async ([name, url]) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(4000);
    for (const t of ['Accept all', 'Accept All', 'Accept', 'Allow all', 'I agree', 'Agree', 'OK', 'Got it', 'Accept Cookies']) {
      const btn = p.getByRole('button', { name: t, exact: true });
      if (await btn.count()) { await btn.first().click({ timeout: 1500 }).catch(() => {}); break; }
    }
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${name}-a.jpg`, quality: 70, type: 'jpeg' });
    for (const k of ['b', 'c']) { await p.mouse.wheel(0, 1100); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/${name}-${k}.jpg`, quality: 70, type: 'jpeg' }); }
    console.log('ok', name, (await p.title()).slice(0, 60));
  } catch (e) { console.log('ERR', name, e.message.split('\n')[0].slice(0, 80)); }
  await p.close();
}));
await b.close();
