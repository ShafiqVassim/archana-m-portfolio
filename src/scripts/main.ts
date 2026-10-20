import Lenis from 'lenis';
import { site } from '../data/site';

const html = document.documentElement;
const motionOK = html.classList.contains('motion-ok');
const finePointer = window.matchMedia('(pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/* ── Smooth scroll ─────────────────────────────── */
let lenis: Lenis | null = null;
// Lenis only smooths wheel scrolling, so phones skip it entirely. On desktop it starts on first intent.
if (motionOK && finePointer) {
  const boot = () => {
    if (lenis) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
    if (html.classList.contains('splash-on') && document.getElementById('splash')) lenis.stop();
    ['wheel', 'keydown'].forEach((t) => window.removeEventListener(t, boot));
  };
  ['wheel', 'keydown'].forEach((t) => window.addEventListener(t, boot, { passive: true }));
}

/* ── Splash: CSS runs the show; JS only handles skip + cleanup ── */
const splash = $('#splash');
if (html.classList.contains('splash-on') && splash) {
  let done = false;
  const finish = (skipped = false) => {
    if (done) return;
    done = true;
    if (skipped) html.classList.add('splash-done');
    lenis?.start();
    window.setTimeout(() => { splash.remove(); updateSticky(); }, skipped ? 320 : 420);
    window.removeEventListener('keydown', onKey);
  };
  const onKey = () => finish(true);
  splash.addEventListener('pointerdown', () => finish(true));
  window.addEventListener('keydown', onKey);
  window.setTimeout(() => finish(false), 1050);
}

/* ── Toast (receipt) ───────────────────────────── */
const toastEl = $('#toast');
let toastTimer = 0;
function toast(title: string, lines: string[]) {
  if (!toastEl) return;
  toastEl.innerHTML = '';
  const t = document.createElement('strong'); t.textContent = title;
  const hr = document.createElement('hr');
  toastEl.append(t, hr, ...lines.map((l) => { const d = document.createElement('div'); d.textContent = l; return d; }));
  toastEl.classList.add('is-on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-on'), 2800);
}

/* ── Contents dialog ───────────────────────────── */
const dialog = $<HTMLDialogElement>('#contents');
$$('[data-open-contents]').forEach((b) => b.addEventListener('click', () => { dialog?.showModal(); lenis?.stop(); }));
dialog?.addEventListener('close', () => { if (lenis?.isStopped) lenis.start(); });
dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
$$('[data-close-contents]', dialog ?? document).forEach((b) => { if (b.tagName === 'BUTTON') b.addEventListener('click', () => dialog?.close()); });

/* ── Anchor links → smooth scroll + focus ──────── */
$$<HTMLAnchorElement>('a[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    const fromDialog = !!dialog?.open;
    if (fromDialog) { dialog!.close(); lenis?.start(); } // start now so the close handler can't reset the scroll
    const focus = () => { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); };
    const go = () => {
      if (lenis) lenis.scrollTo(id === 'top' ? 0 : target, { duration: 1.3, onComplete: focus, force: true });
      else { target.scrollIntoView({ block: 'start', behavior: motionOK ? 'smooth' : 'auto' }); focus(); }
    };
    fromDialog ? requestAnimationFrame(go) : go();
    history.replaceState(null, '', `#${id}`);
  });
});

/* ── Nav: shrink, hide on scroll down, active link ── */
const navEl = $('#nav');
let lastY = window.scrollY, ticking = false;
const spinners = $$('[data-scroll-spin]');
const visible = new Set<Element>();
function onScroll() {
  const y = window.scrollY;
  if (navEl) {
    navEl.classList.toggle('is-scrolled', y > 24);
    navEl.classList.toggle('is-hidden', y > lastY && y > 320 && !dialog?.open);
  }
  for (const el of spinners) if (visible.has(el)) (el as HTMLElement).style.rotate = `${y * Number((el as HTMLElement).dataset.scrollSpin)}deg`;
  lastY = y; ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

if ('IntersectionObserver' in window) {
  const spinIO = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))));
  if (motionOK) spinners.forEach((s) => spinIO.observe(s));

  const links = new Map($$<HTMLAnchorElement>('.nav__links a').map((a) => [a.getAttribute('href')!.slice(1), a]));
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    const a = links.get(e.target.id); if (!a) return;
    if (e.isIntersecting) { links.forEach((l) => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) secIO.observe(s); });

  /* Reveal hooks (only the few places designed to animate) */
  const revealIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach((el) => revealIO.observe(el));
} else {
  $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
}

/* ── Hero parallax (fine pointers only) ────────── */
const collage = $('[data-parallax]');
if (collage && motionOK && finePointer) {
  const hero = collage.closest('section')!;
  let raf = 0;
  hero.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = collage.getBoundingClientRect();
      const mx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width)));
      const my = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height)));
      collage.style.setProperty('--mx', mx.toFixed(3));
      collage.style.setProperty('--my', my.toFixed(3));
    });
  });
  hero.addEventListener('pointerleave', () => { collage.style.setProperty('--mx', '0'); collage.style.setProperty('--my', '0'); });
}

/* ── Hero: rearrange the desk. Mouse: just drag. Touch: press & hold, then drag (a quick swipe still scrolls). ── */
const tidyBtns = $$('[data-tidy]');
if (collage) {
  const hero = collage.closest('section')!;
  let z = 10;
  const pieces = $$('.c', collage);
  const begin = (el: HTMLElement, x0: number, y0: number) => {
    const baseX = parseFloat(el.style.getPropertyValue('--dx')) || 0;
    const baseY = parseFloat(el.style.getPropertyValue('--dy')) || 0;
    const box = hero.getBoundingClientRect(), r0 = el.getBoundingClientRect();
    el.classList.remove('is-returning', 'is-pressing');
    el.classList.add('is-dragging');
    el.style.zIndex = String(++z);
    return {
      move(x: number, y: number) {
        // keep at least half of the piece inside the hero
        const dx = Math.max(box.left - r0.left - r0.width / 2, Math.min(box.right - r0.right + r0.width / 2, x - x0));
        const dy = Math.max(box.top - r0.top - r0.height / 2, Math.min(box.bottom - r0.bottom + r0.height / 2, y - y0));
        el.style.setProperty('--dx', `${baseX + dx}px`);
        el.style.setProperty('--dy', `${baseY + dy}px`);
      },
      end() { el.classList.remove('is-dragging'); tidyBtns.forEach((b) => b.classList.add('is-on')); },
    };
  };
  pieces.forEach((el) => {
    // Mouse / pen
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      let d: ReturnType<typeof begin> | null = null;
      el.setPointerCapture(e.pointerId);
      const move = (ev: PointerEvent) => {
        if (!d) { if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return; d = begin(el, sx, sy); }
        d.move(ev.clientX, ev.clientY);
      };
      const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); d?.end(); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    // Touch: press & hold
    let timer = 0, sx = 0, sy = 0;
    let d: ReturnType<typeof begin> | null = null;
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      el.classList.add('is-pressing');
      timer = window.setTimeout(() => { d = begin(el, sx, sy); navigator.vibrate?.(12); }, 280);
    }, { passive: true });
    el.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (d) { e.preventDefault(); d.move(t.clientX, t.clientY); return; }
      if (Math.hypot(t.clientX - sx, t.clientY - sy) > 8) { clearTimeout(timer); el.classList.remove('is-pressing'); }
    }, { passive: false });
    const endTouch = () => { clearTimeout(timer); el.classList.remove('is-pressing'); if (d) { d.end(); d = null; } };
    el.addEventListener('touchend', endTouch);
    el.addEventListener('touchcancel', endTouch);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('dragstart', (e) => e.preventDefault());
  });
  const tidy = () => {
    pieces.forEach((el) => { el.classList.add('is-returning'); el.style.removeProperty('--dx'); el.style.removeProperty('--dy'); el.style.zIndex = ''; });
    tidyBtns.forEach((b) => b.classList.remove('is-on'));
  };
  tidyBtns.forEach((b) => b.addEventListener('click', tidy));
}

/* ── Magnetic buttons ──────────────────────────── */
if (motionOK && finePointer) {
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });
}

/* ── Résumé: approval stamp ────────────────────── */
$$('[data-stamp]').forEach((el) => el.addEventListener('click', () => {
  el.classList.remove('is-stamped'); void el.offsetWidth; el.classList.add('is-stamped');
  toast('Résumé released ✓', ['Archana-M-Resume.pdf', 'Approved by: Archana', 'Audited by: also Archana']);
}));

/* ── Email: copy + receipt, mail app still opens ── */
$$('[data-email]').forEach((el) => el.addEventListener('click', () => {
  const ok = () => toast('Email copied ✓', [site.email, 'Opening your mail app…', 'Draft accordingly.']);
  const fallback = () => toast('Opening your mail app…', [site.email]);
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(site.email).then(ok, fallback); else fallback();
}));

/* ── Player: spin + Spotify ───────────────────── */
const scope = $('[data-player-scope]');
const disc = $('[data-disc]');
const setPlaying = (on: boolean) => { scope?.classList.toggle('is-playing', on); disc?.setAttribute('aria-pressed', String(on)); };
const player = $('[data-player]');
const trackId = player?.dataset.trackId;
const embed = $('[data-embed]');
// With a track ID, the record loads Spotify's player right here (only on click, so the page stays light).
function loadEmbed() {
  if (!trackId || !embed || embed.firstChild) return false;
  const f = document.createElement('iframe');
  f.src = `https://open.spotify.com/embed/track/${encodeURIComponent(trackId)}?utm_source=generator`;
  f.title = `${site.song.title} on Spotify`;
  f.loading = 'lazy';
  f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  embed.append(f); embed.hidden = false;
  return true;
}
if (trackId && disc) disc.setAttribute('aria-label', `Play ${site.song.title} here`);
disc?.addEventListener('click', () => { loadEmbed(); setPlaying(!scope?.classList.contains('is-playing')); });
$$('[data-play]').forEach((el) => el.addEventListener('click', () => {
  setPlaying(true);
  toast('Opening Spotify ↗', [site.song.title, `${site.song.film} (${site.song.year})`, 'Volume: responsibly.']);
}));

/* ── Liabilities: tap to audit ─────────────────── */
$$('[data-liab]').forEach((b) => b.addEventListener('click', () => {
  const a = $('[data-a]', b)!, c = $('[data-b]', b)!, hint = $('.liab__hint', b)!;
  const audited = a.hidden;
  a.hidden = !audited; c.hidden = audited;
  hint.textContent = audited ? 'Tap to audit' : 'Tap to restate';
  b.classList.remove('is-wobble'); void b.offsetWidth; b.classList.add('is-wobble');
}));

/* ── Carousel dots ─────────────────────────────── */
const track = $('[data-track]');
const dots = $$('.dots i');
if (track && dots.length) {
  let r = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(r);
    r = requestAnimationFrame(() => {
      const first = track.firstElementChild as HTMLElement | null; if (!first) return;
      const step = first.getBoundingClientRect().width + 14;
      const max = track.scrollWidth - track.clientWidth;
      const i = track.scrollLeft >= max - 4 ? dots.length - 1 : Math.round(track.scrollLeft / step);
      dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
    });
  }, { passive: true });
}

/* ── Mobile sticky action bar ──────────────────── */
const sticky = $('#sticky');
const heroCtas = $('#hero-ctas');
const contact = $('#contact');
let ctasVisible = true, contactVisible = false;
function updateSticky() {
  if (!sticky) return;
  const on = !ctasVisible && !contactVisible && !$('#splash');
  sticky.classList.toggle('is-on', on);
  sticky.toggleAttribute('inert', !on);
  sticky.setAttribute('aria-hidden', String(!on));
}
if (sticky && heroCtas && contact && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { ctasVisible = e.isIntersecting || e.boundingClientRect.top > 0; updateSticky(); }).observe(heroCtas);
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; updateSticky(); }, { rootMargin: '0px 0px -30% 0px' }).observe(contact);
}
