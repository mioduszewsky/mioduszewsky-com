import sharp from 'sharp';
const src = '/Users/kacpermioduszewski/mioduszewsky-com/docs/moodboard/screens/scan-serious-business/05-full-page.png';
const dst = '/Users/kacpermioduszewski/mioduszewsky-com/docs/moodboard/screens/scan-serious-business/06-services-stack.png';

const img = sharp(src);
const meta = await img.metadata();
console.log('Source:', meta.width, 'x', meta.height);

// Crop the services section (Brand Strategy / Visual Identity / Website / Product)
// Image is at deviceScaleFactor 2x. Section starts ~10% and ends ~32% of total height.
const top = Math.round(meta.height * 0.155);
const bottom = Math.round(meta.height * 0.42);
const height = bottom - top;
console.log(`Crop y=${top} h=${height}`);

await sharp(src)
  .extract({ left: 0, top, width: meta.width, height })
  .toFile(dst);
console.log('Wrote', dst);
