import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
await mkdir('/tmp/service-landings-review', {recursive:true});
const results=[];
for(const width of [320,390,768,1280,1920]) {
 const context=await browser.newContext({viewport:{width,height:width<600?844:900},reducedMotion:'reduce'});
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const slug of ['wdrozenie-ai','aplikacje-i-systemy','cofounder-as-a-service']) {
  await page.goto('http://127.0.0.1:4330/pl/uslugi/'+slug+'/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  if(await page.locator('#cookieReject').isVisible()) await page.locator('#cookieReject').click();
  const measured=await page.evaluate(()=>{
    const h=document.querySelector('h1'),cta=document.querySelector('.hero .btn'),lead=document.querySelector('.hero-sub');
    return {sectionTop:document.querySelector('.lrow').getBoundingClientRect().top,viewportHeight:innerHeight,emphasis:document.querySelectorAll('main strong').length,footer:document.querySelector('.footer-mail').getAttribute('href'),title:h.innerText,titleHeight:h.offsetHeight,ctaBottom:cta.getBoundingClientRect().bottom,leadSize:getComputedStyle(lead).fontSize,
     overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+.5||r.left<-.5)}).map(e=>e.tagName+'.'+e.className),
     headings:[...document.querySelectorAll('h2')].map(e=>({text:e.innerText,align:getComputedStyle(e).textAlign})),
     videoPaused:document.querySelector('video').paused};
  });
  assert.ok(measured.sectionTop >= measured.viewportHeight-1, `${slug}: next section enters hero viewport`);
  assert.deepEqual(measured.overflow,[]); assert.deepEqual(errors,[]);
  assert.ok(measured.emphasis>2); assert.equal(measured.footer,'mailto:kacper@mioduszewsky.com');
  results.push({slug,width,...measured,errors:[...errors]});
  if([320,390,1280].includes(width)) await page.screenshot({path:`/tmp/service-landings-review/${slug}-${width}.png`,fullPage:true});
 }
 await context.close();
}
await browser.close();
await writeFile('/tmp/service-landings-review/metrics.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(({slug,width,titleHeight,ctaBottom,overflow,errors,videoPaused})=>({slug,width,titleHeight,ctaBottom,overflow,errors,videoPaused})),null,2));
