const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = window.matchMedia('(pointer: fine)')

type MotionKind = 'rise' | 'mask'

function decorate(element: Element | null, kind: MotionKind, delay = 0) {
  if (!(element instanceof HTMLElement) || element.dataset.motion) return
  element.dataset.motion = kind
  element.style.setProperty('--motion-delay', `${Math.min(delay, 480)}ms`)
}

function splitHeadline(element: HTMLElement) {
  if (element.dataset.wordReveal) return
  const plainText = (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim()
  if (!plainText) return
  // Sanity embeds zero-width editing metadata in its strings. Splitting that
  // payload across spans corrupts the visual-editing decoder.
  if (/[\u200b-\u200d\ufeff]/.test(plainText)) {
    decorate(element, 'rise', 100)
    return
  }
  element.dataset.wordReveal = 'true'
  element.setAttribute('aria-label', plainText)

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  let index = 0
  for (const node of nodes) {
    const fragment = document.createDocumentFragment()
    for (const part of (node.textContent || '').split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part))
        continue
      }
      const clip = document.createElement('span')
      const word = document.createElement('span')
      clip.className = 'motion-word-clip'
      word.className = 'motion-word'
      word.textContent = part
      word.style.setProperty('--word-delay', `${Math.min(index * 58, 650)}ms`)
      clip.setAttribute('aria-hidden', 'true')
      clip.append(word)
      fragment.append(clip)
      index += 1
    }
    node.replaceWith(fragment)
  }
}

function setupMotion() {
  if (reducedMotion.matches) {
    document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((video) => {
      video.pause()
      video.removeAttribute('autoplay')
    })
    return
  }

  const heroSelectors = '.auto-hero__copy, .workshop-hero__copy, .detail-hero__copy, .service-hero__copy, .catalog__head, .vehicle-hero__copy'
  document.querySelectorAll<HTMLElement>(heroSelectors).forEach((hero) => {
    if (hero.matches('.workshop-hero__copy')) hero.querySelectorAll<HTMLElement>('h1').forEach(splitHeadline)
    const pieces = hero.querySelectorAll<HTMLElement>('.kicker, p:not(.kicker), .auto-hero__actions, .button, .text-link')
    pieces.forEach((piece, index) => decorate(piece, 'rise', 130 + index * 90))
  })

  const rowSelectors = [
    '.route-index__list a', '.service-ledger a',
    '.service-paths__list > a', '.catalog-car',
  ].join(', ')
  document.querySelectorAll<HTMLElement>(rowSelectors).forEach((element) => {
    const siblings = element.parentElement?.children
    const index = siblings ? Array.prototype.indexOf.call(siblings, element) : 0
    decorate(element, 'rise', (index % 5) * 70)
  })

  const maskSelectors = [
    '.auto-hero figure', '.ice-story__mosaic',
    '.detail-statement figure', '.service-hero figure',
    '.vehicle-hero__image',
  ].join(', ')
  document.querySelectorAll<HTMLElement>(maskSelectors).forEach((element) => decorate(element, 'mask'))

  const observed = document.querySelectorAll<HTMLElement>('[data-motion], [data-word-reveal]')
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' })

  observed.forEach((element) => observer.observe(element))
  document.documentElement.classList.add('motion-enabled')

  const parallaxImages = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
  const story = document.querySelector<HTMLElement>('[data-story]')
  const storySteps = story ? [...story.querySelectorAll<HTMLElement>('[data-story-step]')] : []
  const storyImages = story ? [...story.querySelectorAll<HTMLElement>('[data-story-image]')] : []
  const horizontal = document.querySelector<HTMLElement>('[data-horizontal]')
  const horizontalViewport = horizontal?.querySelector<HTMLElement>('[data-horizontal-viewport]')
  const horizontalTrack = horizontal?.querySelector<HTMLElement>('[data-horizontal-track]')
  let horizontalDistance = 0
  let frame = 0

  function measure() {
    if (!horizontal || !horizontalViewport || !horizontalTrack) return
    if (window.innerWidth < 900 || reducedMotion.matches) {
      horizontal.classList.remove('horizontal-active')
      horizontal.style.removeProperty('--horizontal-height')
      horizontal.style.removeProperty('--horizontal-progress')
      horizontal.style.removeProperty('--gallery-copy-opacity')
      horizontalTrack.style.removeProperty('transform')
      horizontalDistance = 0
      return
    }
    horizontal.classList.add('horizontal-active')
    horizontalDistance = Math.max(0, horizontalViewport.scrollWidth - horizontalViewport.clientWidth)
    horizontal.style.setProperty('--horizontal-height', `${window.innerHeight + horizontalDistance + 120}px`)
    horizontal.classList.toggle('horizontal-active', horizontalDistance > 0)
    update()
  }

  function update() {
    frame = 0
    const viewportHeight = window.innerHeight
    for (const image of parallaxImages) {
      const parent = image.parentElement || image
      const rect = parent.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > viewportHeight) continue
      const ratio = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight))
      image.style.setProperty('--parallax-y', `${(-ratio * 28).toFixed(1)}px`)
    }

    if (story && storySteps.length && window.innerWidth >= 900) {
      let active = 0
      let nearest = Number.POSITIVE_INFINITY
      storySteps.forEach((step, index) => {
        const rect = step.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight * 0.52)
        if (distance < nearest) { nearest = distance; active = index }
      })
      storySteps.forEach((step, index) => step.classList.toggle('is-current', index === active))
      storyImages.forEach((image, index) => image.classList.toggle('is-current', index === active))
    }

    if (horizontal?.classList.contains('horizontal-active') && horizontalTrack) {
      const rect = horizontal.getBoundingClientRect()
      const available = Math.max(1, rect.height - viewportHeight)
      const progress = Math.max(0, Math.min(1, -rect.top / available))
      horizontalTrack.style.transform = `translate3d(${-horizontalDistance * progress}px,0,0)`
      horizontal.style.setProperty('--horizontal-progress', String(progress))
      horizontal.style.setProperty('--gallery-copy-opacity', String(Math.max(0, 1 - progress * 4)))
    }
  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update)
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  window.addEventListener('load', measure, { once: true })
  if (finePointer.matches || window.innerWidth >= 900) measure()
  else update()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupMotion, { once: true })
else setupMotion()
