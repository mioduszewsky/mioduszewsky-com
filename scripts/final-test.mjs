import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900}, hasTouch:false });
await p.goto('http://localhost:4354/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(6000);
const peekOp = () => p.evaluate(()=>{const el=document.querySelector('.row-peek'); return el?Math.round(+getComputedStyle(el).opacity*100)/100:-1;});
const navHidden = () => p.evaluate(()=>document.querySelector('.nav').classList.contains('nav-hide'));

// PEEK: hover wiersza More work
const row = p.locator('.mrow[data-thumb]').first();
await row.scrollIntoViewIfNeeded(); await p.waitForTimeout(1000);
const box = await row.boundingBox();
await p.mouse.move(box.x+box.width/2, box.y+box.height/2);
await p.waitForTimeout(500);
console.log('PEEK po hover:', await peekOp(), '(cel ~1)');
// SMOOTH scroll Lenisem (wheel), BEZ ruchu myszy
await p.mouse.wheel(0, 900);
await p.waitForTimeout(1600); // przeczekaj animacje Lenisa
console.log('PEEK po smooth-scroll bez ruchu:', await peekOp(), '(cel 0)');

// NAV: pozycja w srodku strony (nie finał) -> widoczny
await p.evaluate(()=>window.scrollTo(0, 2500)); await p.waitForTimeout(1200);
console.log('NAV hidden w srodku strony:', await navHidden(), '(cel false = widoczny)');
// NAV: finał
const H = await p.evaluate(()=>document.body.scrollHeight);
await p.evaluate((h)=>window.scrollTo(0, h), H); await p.waitForTimeout(1200);
console.log('NAV hidden na finale:', await navHidden(), '(cel true = ukryty)');
await b.close();
