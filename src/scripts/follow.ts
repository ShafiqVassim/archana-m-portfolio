/* Pakkuru in third person — he follows the pointer outside the hero, sits, naps, gets curious, pounces.
   Desktop with a fine pointer only; off with reduced motion; footer switch remembers "staying". */
const el = document.querySelector<HTMLElement>('[data-follow]');
const toggle = document.querySelector<HTMLButtonElement>('[data-follow-toggle]');
const can = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY = 'pk-follow';
const read = () => { try { return localStorage.getItem(KEY) !== 'stay'; } catch { return true; } };
const write = (on: boolean) => { try { localStorage.setItem(KEY, on ? 'follow' : 'stay'); } catch { /* private mode: fine */ } };

if (el && can) {
  let enabled = read();
  const hero = document.getElementById('top');
  const OFF_X = 22, OFF_Y = 20;            // trails behind and below the pointer, never under it
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, placed = false, inHero = true, inside = true;
  let sitT = 0, napT = 0, overClickable = false, pounceT = 0;

  const setState = (s: string) => { if (el.dataset.state !== s) el.dataset.state = s; };
  const visible = () => enabled && !inHero && inside;
  const show = () => el.classList.toggle('is-on', visible());

  const settle = () => {
    window.clearTimeout(sitT); window.clearTimeout(napT);
    sitT = window.setTimeout(() => setState(overClickable ? 'curious' : 'sit'), 900);
    napT = window.setTimeout(() => setState('nap'), 8000);
  };
  const loop = () => {
    const dx = tx - x, dy = ty - y;
    x += dx * 0.12; y += dy * 0.12;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (Math.abs(dx) > 1.5) el.classList.toggle('is-left', dx < 0);
    if (Math.hypot(dx, dy) > 0.4) raf = requestAnimationFrame(loop); else raf = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  window.addEventListener('mousemove', (e) => {
    inside = true;
    inHero = !!hero && hero.contains(e.target as Node);
    tx = e.clientX + OFF_X; ty = e.clientY + OFF_Y - 49;
    if (!placed || !el.classList.contains('is-on')) { x = tx; y = ty + 12; placed = true; }   // appears with a little hop up
    show();
    if (!visible()) return;
    if (el.dataset.state !== 'pounce') setState('follow');
    settle(); kick();
  }, { passive: true });
  document.addEventListener('mouseover', (e) => {
    overClickable = !!(e.target as Element).closest?.('a, button, [role="button"], [data-poke], summary, label');
  }, { passive: true });
  window.addEventListener('mousedown', () => {
    if (!visible()) return;
    setState('pounce'); window.clearTimeout(pounceT);
    pounceT = window.setTimeout(() => { setState(overClickable ? 'curious' : 'sit'); settle(); }, 180);
  });
  document.documentElement.addEventListener('mouseleave', () => { inside = false; show(); });
  window.addEventListener('blur', () => { inside = false; show(); });

  if (toggle) {
    const paint = () => { toggle.setAttribute('aria-pressed', String(enabled)); toggle.textContent = enabled ? 'Pakkuru: following ✓' : 'Pakkuru: staying'; };
    toggle.hidden = false; paint();
    toggle.addEventListener('click', () => { enabled = !enabled; write(enabled); paint(); show(); });
  }
}
