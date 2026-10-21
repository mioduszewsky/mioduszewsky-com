// Zrzuty referencji (kierunki case'u Igora) i żywej strony Igora. Wynik do katalogu z argv[2].
import { chromium } from 'playwright';
const out = process.argv[2];
const refs = [
  ['r01-moma-object', 'https://www.moma.org/collection/works/79802'],
  ['r02-tate-artwork', 'https://www.tate.org.uk/art/artworks/rothko-black-on-maroon-t01163'],
  ['r03-rijks-object', 'https://www.rijksmuseum.nl/en/collection/object/The-Night-Watch--bd59b2a4b8fe93d3e7b3f36a5b7a8f2b'],
  ['r04-zwirner', 'https://www.davidzwirner.com/exhibitions'],
  ['r05-verse-refik', 'https://verse.works/items/ethereum/0x7a15b36cb834aea88553de69077d3777460d73ac/5280336779268220421569573059971679349075200194886069432279714075018412549812'],
  ['r06-whitney-collection', 'https://whitney.org/collection/works/6203'],
  ['r07-serpentine', 'https://www.serpentinegalleries.org/whats-on/'],
  ['r08-christies-lot', 'https://www.christies.com/en/lot/lot-6352384'],
];
const b = await chromium.launch();
for (const [name, url] of refs) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(3500);
    // pasek cookies zasłania kadr: klik w typowe przyciski zgody, jeśli są
    for (const t of ['Accept all', 'Accept All', 'Accept', 'I agree', 'Allow all', 'Agree', 'OK']) {
      const btn = p.getByRole('button', { name: t, exact: true });
      if (await btn.count()) { await btn.first().click({ timeout: 1500 }).catch(() => {}); break; }
    }
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/${name}-a.jpg`, quality: 70 });
    await p.mouse.wheel(0, 900); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}/${name}-b.jpg`, quality: 70 });
    console.log('ok', name, await p.title());
  } catch (e) { console.log('ERR', name, e.message.split('\n')[0]); }
  await p.close();
}
await b.close();
