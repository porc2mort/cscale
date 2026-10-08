import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Social crawlers need absolute URLs for og:image / og:url. Netlify sets URL
// (the site's primary URL) at build time; SITE_URL overrides it if needed.
const siteUrl = (process.env.SITE_URL || process.env.URL || '').replace(/\/$/, '')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
  ],
})
