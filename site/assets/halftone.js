// Turns a photo into a field of light dots on black and keeps it quietly alive.
//
// Markup: <div class="dots" data-halftone data-cell="7" data-gamma="1.1"><img src="…" alt="…"></div>
// Without JavaScript the <img> stays and CSS shows it in black and white; with it, a canvas is drawn
// over the image, which stays in the page (visually hidden) so screen readers still get its alt text.
//
// Motion, all slow and small:
//  - breathing: a long diagonal wave swells the dots by about 6%, one cycle every ~7 s
//  - light sweep: every 9 s a soft band of light crosses the picture in 2.4 s
//  - pointer: dots near the cursor grow and lean away from it, easing in and settling back out
// Under prefers-reduced-motion the picture is drawn once and stays still. Off screen, nothing runs.

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

for (const host of document.querySelectorAll('[data-halftone]')) {
  const img = host.querySelector('img');
  if (!img) continue;
  if (img.complete && img.naturalWidth) start(host, img);
  else img.addEventListener('load', () => start(host, img), { once: true });
}

function start(host, img) {
  const c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  img.after(c); // right after the image, so captions and buttons layered on top stay visible
  host.classList.add('is-live');
  const ctx = c.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  const cell = Number(host.dataset.cell || 7);
  const gamma = Number(host.dataset.gamma || 1.6);
  const tint = host.dataset.tint || '#f2f2f0';
  let w = 0, h = 0, cols = 0, rows = 0, L = new Float32Array(0);

  function sample() {
    w = c.clientWidth; h = c.clientHeight;
    if (!w || !h) return;
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true });
    const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight); // cover-fit
    o.drawImage(img, (cols - img.naturalWidth * s) / 2, (rows - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    const px = o.getImageData(0, 0, cols, rows).data;
    L = new Float32Array(cols * rows);
    let lo = 1, hi = 0;
    for (let k = 0; k < L.length; k++) {
      const v = (0.2126 * px[k * 4] + 0.7152 * px[k * 4 + 1] + 0.0722 * px[k * 4 + 2]) / 255;
      L[k] = v; if (v < lo) lo = v; if (v > hi) hi = v;
    }
    // stretch the photo's own light range, then curve it, so every photo reads the same
    for (let k = 0; k < L.length; k++) L[k] = Math.pow((L[k] - lo) / Math.max(0.01, hi - lo), gamma);
  }

  const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, on: 0, target: 0 };
  host.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return; // a hover effect; taps don't need it
    const r = c.getBoundingClientRect();
    pointer.tx = e.clientX - r.left; pointer.ty = e.clientY - r.top;
    if (pointer.target === 0) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    pointer.target = 1;
    kick();
  });
  host.addEventListener('pointerleave', () => { pointer.target = 0; });

  const R = 170, PERIOD = 9000, SWEEP = 2400;
  const t0 = performance.now();
  let running = false, visible = true;

  function frame(now) {
    if (!L.length) { running = false; return; }
    const t = (now - t0) / 1000;
    pointer.x += (pointer.tx - pointer.x) * 0.09;
    pointer.y += (pointer.ty - pointer.y) * 0.09;
    pointer.on += (pointer.target - pointer.on) * (pointer.target ? 0.05 : 0.035);
    const cycle = (now - t0 + 2600) % PERIOD;
    const band = still || cycle >= SWEEP ? -1e9 : -0.35 + ease(cycle / SWEEP) * 1.7;

    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = tint;
    ctx.beginPath();
    const max = cell * 0.56;
    for (let y = 0; y < rows; y++) {
      const cy = (y + 0.5) * cell, vv = cy / h;
      for (let x = 0; x < cols; x++) {
        const v = L[y * cols + x];
        const cx = (x + 0.5) * cell, u = cx / w;
        const breath = still ? 1 : 1 + 0.06 * Math.sin(t * 0.9 - (u + vv) * 4.2);
        const d = u * 0.75 + vv * 0.45 - band;
        const lift = Math.exp(-(d * d) / 0.006) * 0.55;
        let r = Math.min(1, v + lift * (1 - v) * 0.7) * max * breath;
        let px = cx, py = cy;
        if (pointer.on > 0.001) {
          const dx = cx - pointer.x, dy = cy - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < R * R * 2.2) {
            const f = Math.exp(-d2 / (R * R * 0.45)) * pointer.on;
            r = Math.max(r * (1 + 0.75 * f), max * 0.22 * f);
            const dist = Math.sqrt(d2) || 1;
            const push = 9 * f * Math.sin(Math.min(1, dist / R) * Math.PI);
            px += (dx / dist) * push; py += (dy / dist) * push;
          }
        }
        if (r < 0.35) continue;
        const rr = Math.min(r, max * 1.25) * dpr;
        ctx.moveTo(px * dpr + rr, py * dpr);
        ctx.arc(px * dpr, py * dpr, rr, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    running = !still && visible;
    if (running) requestAnimationFrame(frame);
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(host);
  sample();
  kick();
  // a resize clears the canvas: sample again and draw at least once
  new ResizeObserver(() => { sample(); kick(); }).observe(host);
}
