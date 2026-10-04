// @ts-check
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://legitjakub.github.io',
  base: process.env.GITHUB_PAGES === 'true' ? '/muzicek-web' : '/',
  redirects: {
    '/ppf-folie': '/detailing/ppf/',
    '/wrap-folie': '/detailing/wrap-folie/',
    '/tonovani-skel': '/detailing/tonovani-skel/',
    '/myti-cisteni': '/detailing/cisteni-a-myti/',
    '/renovace-ochrana-laku': '/detailing/lesteni-a-ochrana-laku/',
    '/renovace-vozu': '/detailing/individualni-renovace/',
    '/servis-performance': '/servis/servis-a-performance/',
    '/suchy-led': '/servis/suchy-led/',
    '/ochrana-podvozku': '/servis/antikorozni-ochrana-podvozku/',
    '/preprava-vozu': '/auta/preprava-vozidel/',
    '/dovoz-vozu': '/auta/dovoz-vozidel/',
    '/zprostredkovani-prodeje-vozu': '/auta/prodej-vaseho-vozu/',
    '/nabidka-vozu': '/auta/vozy/',
    '/nabidka-vozu/audirs4': '/auta/vozy/audi-rs4/',
    '/nabidka-vozu/vw-multivan-highline': '/auta/vozy/vw-multivan-highline/',
    '/nabidka-vozu/jaguar-xj-sovereign': '/auta/vozy/jaguar-xj-sovereign/',
    '/nabidka-vozu/koda-octavia-mk1-rs-18t-132-kw-2001': '/auta/vozy/skoda-octavia-rs-mk1/',
  },
  integrations: [
    sanity({
      projectId: 'z24cfcoe',
      dataset: 'production',
      apiVersion: '2026-01-01',
      useCdn: false,
      stega: {
        enabled: process.env.NODE_ENV === 'development',
        studioUrl: 'http://127.0.0.1:3333',
      },
    }),
    react(),
  ],
  vite: {
    optimizeDeps: {
      include: [
        'react/compiler-runtime',
        'lodash/isObject.js',
        'lodash/groupBy.js',
        'lodash/keyBy.js',
        'lodash/partition.js',
        'lodash/sortedIndex.js',
      ],
    },
  },
});
