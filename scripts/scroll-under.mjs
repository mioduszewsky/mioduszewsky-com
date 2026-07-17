import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900}, hasTouch:false });
await p.goto('http://localhost:4354/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(6000);
const peekOp = () => p.evaluate(()=>{const el=document.querySelector('.row-peek'); return el?Math.round(+getComputedStyle(el).opacity*100)/100:-1;});
// ustaw kursor gdzies na srodku ekranu, potem scrolluj tak by wiersze More work przejechaly pod nim
// najpierw idz troche nad More work
const row = p.locator('.mrow[data-thumb]').first();
await row.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
// przewin w gore o troche, zeby wiersze byly ponizej kursora, kursor nieruchomy na srodku
await p.mouse.move(720, 450); await p.waitForTimeout(300);
await p.evaluate(()=>window.scrollTo(0, 0)); await p.waitForTimeout(1000);
// teraz powoli scrolluj w dol (bez ruchu myszy) - wiersze przejda pod kursorem (720,450)
let maxSeen = 0;
for (let i=0;i<40;i++){ await p.mouse.wheel(0, 220); await p.waitForTimeout(60); const o=await peekOp(); if(o>maxSeen)maxSeen=o; }
await p.waitForTimeout(500);
console.log('MAX opacity peek podczas scrollowania bez ruchu myszy:', maxSeen, '(cel 0 - nie ma sie pokazac)');
console.log('opacity po zatrzymaniu:', await peekOp());
await b.close();
