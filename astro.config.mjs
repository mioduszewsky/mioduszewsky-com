// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  // Podstrona ściąga się w tle, gdy kursor/palec trafi w link, więc klik otwiera ją od razu
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    plugins: [tailwindcss()]
  }
});
