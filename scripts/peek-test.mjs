import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:4336/', { waitUntil:'networkidle' });
await p.waitForTimeout(1000);
const op = () => p.evaluate(()=>{const el=document.querySelector('.row-peek'); return el?+getComputedStyle(el).opacity:-1;});
// znajdź wiersz More work z data-thumb
const row = await p.$('.mrow[data-thumb]');
await row.scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
const box = await row.boundingBox();
// 1. najedź na wiersz
await p.mouse.move(box.x + box.width/2, box.y + box.height/2);
await p.waitForTimeout(500);
console.log('po najechaniu na wiersz  -> opacity:', await op(), '(ma byc ~1)');
// 2. scroll KÓŁKIEM bez ruchu myszy (przypadek Lenisa)
await p.mouse.wheel(0, 600);
await p.waitForTimeout(600);
console.log('po scrollu bez ruchu     -> opacity:', await op(), '(ma byc 0)');
// 3. znowu najedź, potem rusz na pusty obszar
await row.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
const box2 = await row.boundingBox();
await p.mouse.move(box2.x + box2.width/2, box2.y + box2.height/2);
await p.waitForTimeout(500);
console.log('ponowne najechanie       -> opacity:', await op(), '(ma byc ~1)');
await p.mouse.move(50, 50);
await p.waitForTimeout(500);
console.log('ruch na pusty obszar     -> opacity:', await op(), '(ma byc 0)');
await b.close();
