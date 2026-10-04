/*
 * Motion core. Native scrolling is never touched: scroll position is only read and turned into CSS variables.
 * Everything here is progressive enhancement — without JS (or with reduced motion) pages render as plain, readable layouts.
 */
const root = document.documentElement
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)')
export const isReduced = () => reducedQuery.matches
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * t * (t * (t * 6 - 15) + 10)
}
reducedQuery.addEventListener('change', () => root.classList.toggle('rm', reducedQuery.matches))

/* ---------- one rAF loop for every scroll-linked thing ---------- */
type Scrub = {el: HTMLElement; mode: 'track' | 'view'; fn: (p: number, rect: DOMRect) => void; on: boolean}
const scrubs = new Map<Element, Scrub>()
let frame = 0
const visibility = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const s = scrubs.get(e.target)
      if (s) s.on = e.isIntersecting
    }
    schedule()
  },
  {rootMargin: '30% 0px 30% 0px'},
)
function schedule() {
  if (!frame) frame = requestAnimationFrame(tick)
}
function tick() {
  frame = 0
  const vh = innerHeight
  for (const s of scrubs.values()) {
    if (!s.on) continue
    const rect = s.el.getBoundingClientRect()
    const p = s.mode === 'track' ? clamp(-rect.top / Math.max(1, rect.height - vh)) : clamp((vh - rect.top) / (vh + rect.height))
    s.fn(p, rect)
  }
}
export function scrub(el: HTMLElement, mode: 'track' | 'view', fn: Scrub['fn']) {
  scrubs.set(el, {el, mode, fn, on: false})
  visibility.observe(el)
}
export function unscrub(el: HTMLElement) {
  scrubs.delete(el)
  visibility.unobserve(el)
}
addEventListener('scroll', schedule, {passive: true})
addEventListener('resize', schedule, {passive: true})

/* ---------- media query helper for pinned (desktop, motion-allowed) layouts ---------- */
export function whenPinned(run: () => () => void, query = '(min-width: 900px)') {
  const mq = matchMedia(query)
  let stop: (() => void) | undefined
  const sync = () => {
    const should = mq.matches && !reducedQuery.matches
    if (should && !stop) stop = run()
    else if (!should && stop) { stop(); stop = undefined }
  }
  mq.addEventListener('change', sync)
  reducedQuery.addEventListener('change', sync)
  sync()
}

/* ---------- state tracks: a tall section + sticky stage, N states driven by scroll progress ---------- */
export type StatesOptions = {n: number; w?: number; onIndex?: (i: number) => void; onFrame?: (s: number, p: number) => void}
export function states(track: HTMLElement, {n, w = 0.16, onIndex, onFrame}: StatesOptions) {
  const items = [...track.querySelectorAll<HTMLElement>('[data-state]')]
  let last = -1
  const fn = (p: number) => {
    const s = p * n
    track.style.setProperty('--p', p.toFixed(4))
    track.style.setProperty('--s', s.toFixed(3))
    for (const el of items) {
      const k = Number(el.dataset.state)
      el.style.setProperty('--in', (k === 0 ? 1 : smooth(k - w, k + w, s)).toFixed(4))
      el.style.setProperty('--out', (k === n - 1 ? 0 : smooth(k + 1 - w, k + 1 + w, s)).toFixed(4))
    }
    const i = Math.min(n - 1, Math.floor(s + 1e-6))
    if (i !== last) { last = i; track.dataset.i = String(i); onIndex?.(i) }
    onFrame?.(s, p)
  }
  track.classList.add('is-pinned')
  scrub(track, 'track', fn)
  return () => {
    unscrub(track)
    track.classList.remove('is-pinned')
    delete track.dataset.i
    for (const prop of ['--p', '--s']) track.style.removeProperty(prop)
    for (const el of items) { el.style.removeProperty('--in'); el.style.removeProperty('--out') }
    last = -1
  }
}
/** Scroll position (px) that lands in the middle of state k of a track. */
export function stateTop(track: HTMLElement, k: number, n: number) {
  const top = track.getBoundingClientRect().top + scrollY
  return top + ((k + 0.5) / n) * (track.offsetHeight - innerHeight)
}


/* ---------- pinned horizontal rail: vertical scroll moves a wide row sideways ---------- */
export function hscroll(track: HTMLElement) {
  const rail = track.querySelector<HTMLElement>('[data-rail]')
  if (!rail) return () => {}
  let dist = 0
  const measure = () => {
    dist = Math.max(0, rail.scrollWidth - innerWidth)
    track.style.height = `${innerHeight + dist}px`
    schedule()
  }
  measure()
  addEventListener('resize', measure, {passive: true})
  const imgs = [...rail.querySelectorAll('img')]
  imgs.forEach((i) => i.addEventListener('load', measure, {once: true}))
  track.classList.add('is-pinned')
  scrub(track, 'track', (p) => rail.style.setProperty('--hx', `${(-p * dist).toFixed(1)}px`))
  return () => {
    removeEventListener('resize', measure)
    unscrub(track)
    track.classList.remove('is-pinned')
    track.style.removeProperty('height')
    rail.style.removeProperty('--hx')
  }
}

/* ---------- words that light up as the statement scrolls through ---------- */
function wordScrub(el: HTMLElement) {
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
  if (!text || /[\u200b-\u200d\ufeff]/.test(text)) return
  const parts = text.split(' ')
  el.setAttribute('aria-label', text)
  el.replaceChildren(...parts.flatMap((w, i) => {
    const s = document.createElement('span'); s.className = 'ws'; s.textContent = w; s.setAttribute('aria-hidden', 'true')
    return i < parts.length - 1 ? [s, document.createTextNode(' ')] : [s]
  }))
  const spans = [...el.querySelectorAll<HTMLElement>('.ws')]
  let last = -1
  scrub(el, 'view', (p) => {
    const n = Math.round(clamp((p - 0.22) / 0.34) * spans.length)
    if (n === last) return
    last = n
    spans.forEach((w, i) => w.classList.toggle('is-lit', i < n))
  })
}

/* ---------- word / line reveals ---------- */
function splitText(el: HTMLElement) {
  if (el.classList.contains('is-split')) return
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
  // Sanity visual-editing strings carry zero-width payloads that must not be cut up.
  if (!text || /[​-‍﻿]/.test(text)) { el.classList.add('is-split'); return }
  const inner = document.createElement('span')
  inner.setAttribute('aria-hidden', 'true')
  while (el.firstChild) inner.append(el.firstChild)
  const walker = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
    const frag = document.createDocumentFragment()
    for (const part of (node.textContent || '').split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) { frag.append(' '); continue }
      const w = document.createElement('span'); w.className = 'w'
      const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part
      w.append(wi); frag.append(w)
    }
    node.replaceWith(frag)
  }
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text
  el.append(sr, inner)
  el.classList.add('is-split')
  measureLines(el)
}
function measureLines(el: HTMLElement) {
  let line = -1, top = -9999, k = 0
  for (const w of el.querySelectorAll<HTMLElement>('.w')) {
    const t = Math.round(w.offsetTop / 4)
    if (t !== top) { top = t; line++; k = 0 }
    w.style.setProperty('--l', String(line)); w.style.setProperty('--k', String(k++))
  }
}

/* ---------- boot ---------- */
function boot() {
  const splits = [...document.querySelectorAll<HTMLElement>('[data-split]')]
  const run = () => splits.forEach(splitText)
  if (isReduced()) { splits.forEach((s) => s.classList.add('is-split', 'is-in')) }
  else (document.fonts?.ready ?? Promise.resolve()).then(run).catch(run)
  let rs = 0
  addEventListener('resize', () => { clearTimeout(rs); rs = window.setTimeout(() => splits.forEach((s) => s.classList.contains('is-split') && measureLines(s)), 150) }, {passive: true})

  const revealables = document.querySelectorAll<HTMLElement>('[data-split], [data-reveal], [data-stagger]')
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i))))
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
  }, {threshold: 0, rootMargin: '0px 0px -9% 0px'})
  revealables.forEach((el) => io.observe(el))

  // parallax: images that drift inside their mask
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const host = (el.closest('[data-parallax-host]') as HTMLElement) || el.parentElement!
    const amount = Number(el.dataset.parallax) || 0.1
    scrub(host, 'view', (p, rect) => {
      if (isReduced()) return
      el.style.setProperty('--py', `${((0.5 - p) * rect.height * amount * 2).toFixed(1)}px`)
    })
  })

  // generic 0..1 progress for any section that wants it
  document.querySelectorAll<HTMLElement>('[data-progress]').forEach((el) => {
    const mode = el.dataset.progress === 'track' ? 'track' : 'view'
    scrub(el, mode, (p) => el.style.setProperty('--p', p.toFixed(4)))
  })

  if (!isReduced()) document.querySelectorAll<HTMLElement>('[data-wordscrub]').forEach(wordScrub)
  document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((t) => whenPinned(() => hscroll(t)))
  header()
  menu()
  schedule()
}

function header() {
  const h = document.querySelector<HTMLElement>('.site-header')
  if (!h) return
  const over = h.hasAttribute('data-over')
  let last = scrollY
  const update = () => {
    const y = scrollY
    const solid = !over || y > innerHeight * 0.7
    h.classList.toggle('is-solid', solid)
    h.classList.toggle('is-hidden', y > last + 4 && y > innerHeight * 0.9 && !document.body.classList.contains('menu-open'))
    if (y < last - 4) h.classList.remove('is-hidden')
    last = y
  }
  addEventListener('scroll', update, {passive: true})
  update()
}

function menu() {
  const btn = document.querySelector<HTMLButtonElement>('.menu-btn')
  const panel = document.getElementById('menu')
  if (!btn || !panel) return
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open))
    document.body.classList.toggle('menu-open', open)
    panel.toggleAttribute('inert', !open)
    btn.querySelector('[data-label]')!.textContent = open ? 'Zavřít' : 'Menu'
    if (open) (panel.querySelector('a') as HTMLElement | null)?.focus({preventScroll: true})
  }
  set(false)
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'))
  panel.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false) })
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { set(false); btn.focus() } })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once: true})
else boot()
