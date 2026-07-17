import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:400} });
await p.goto('http://localhost:4341/contact', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(2500);
await p.screenshot({ path:'/tmp/ct-logo.png' });
await b.close(); console.log('ok');
