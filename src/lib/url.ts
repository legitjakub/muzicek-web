// Base-aware internal URLs (the site is also published under /muzicek-web on GitHub Pages).
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
export const u = (path: string) => (/^(https?:|mailto:|tel:|#)/.test(path) ? path : base + (path.startsWith('/') ? path : `/${path}`))
