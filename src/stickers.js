// Hand-drawn Chinatown sticker art (no emoji). Each sticker is drawn in a unit box (about -0.5..0.5),
// twice: pass 0 lays down a white die-cut outline, pass 1 paints the colours on top.

const OUT = 0.12;                                   // die-cut outline width (half of it shows)
const TAU = Math.PI * 2;
const P = (d) => new Path2D(d);
const ell = (cx, cy, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, rot, 0, TAU); return p; };
const circ = (cx, cy, r) => ell(cx, cy, r, r);
const xf = (path, m) => { const p = new Path2D(); p.addPath(path, m); return p; };
const mat = (tx = 0, ty = 0, deg = 0, sc = 1) => new DOMMatrix().translate(tx, ty).rotate(deg).scale(sc);
const spiral = (cx, cy, r, turns = 2.2) => {
  let d = ''; const n = 26;
  for (let i = 0; i <= n; i++) { const a = (i / n) * turns * TAU, rad = r * (i / n); d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rad).toFixed(3)} ${(cy + Math.sin(a) * rad).toFixed(3)}`; }
  return P(d);
};

const GOLD = '#e8a92a', GOLD_D = '#b97a00', RED = '#d7132a', RED_D = '#a50f20', CREAM = '#fff6e3';
const PET = P('M0 0 C-.17 -.08 -.2 -.34 -.07 -.43 L0 -.37 L.07 -.43 C.2 -.34 .17 -.08 0 0Z');
const HEART = P('M0 .38 C-.55 .0 -.35 -.38 0 -.1 C.35 -.38 .55 .0 0 .38Z');

const ART = {
  lantern: ({ o, ln, fl, sl }) => {
    sl(P('M0 -.5 V-.4'), GOLD, .025);
    o(P('M-.12 -.42 h.24 v.07 h-.24Z'), GOLD);
    o(ell(0, -.04, .36, .3), RED);
    ln(ell(0, -.04, .2, .3), '#ff8a8a', .022); ln(P('M0 -.34 V.26'), '#ff8a8a', .022);
    fl(ell(-.18, -.14, .05, .1, .5), 'rgba(255,255,255,.35)');
    o(P('M-.12 .26 h.24 v.07 h-.24Z'), GOLD);
    sl(P('M0 .33 V.44'), GOLD, .03);
    o(P('M-.05 .42 h.1 l.05 .1 h-.2Z'), GOLD);
  },
  sky: ({ o, ln, fl, lg }) => {
    o(P('M-.22 -.46 L.22 -.46 L.34 .3 L-.34 .3Z'), lg(-.46, .3, [[0, '#9c3d17'], [.55, '#f0792b'], [1, '#ffc15a']]));
    ln(P('M0 -.46 V.3 M-.11 -.46 L-.17 .3 M.11 -.46 L.17 .3'), 'rgba(120,40,10,.3)', .016);
    o(ell(0, .3, .34, .08), '#ffd36b');
    fl(ell(0, .3, .24, .05), '#fff3c4');
  },
  blossom: ({ o, ln, fl, x, v }) => {
    const all = new Path2D(); for (let i = 0; i < 5; i++) all.addPath(PET, mat(0, 0, i * 72));
    const g = x.createRadialGradient(0, 0, 0, 0, 0, .44);
    g.addColorStop(0, v % 2 ? '#f48fb1' : '#f8a5bf'); g.addColorStop(1, v % 2 ? '#ffd9e4' : '#ffe9ef');
    o(all, g);
    for (let i = 0; i < 5; i++) ln(xf(P('M0 -.06 V-.3'), mat(0, 0, i * 72)), '#f48fb1', .018);
    fl(circ(0, 0, .07), '#f06292');
    for (let i = 0; i < 5; i++) { const a = ((i * 72 + 36 - 90) * Math.PI) / 180; fl(circ(Math.cos(a) * .14, Math.sin(a) * .14, .022), '#c2185b'); }
  },
  petal: ({ o, ln }) => {
    o(xf(PET, mat(0, .22, 0, 1.15)), '#ffc2d4');
    ln(xf(P('M0 -.04 V-.26'), mat(0, .22, 0, 1.15)), '#f48fb1', .02);
  },
  mooncake: ({ o, ln, fl, x }) => {
    const g = x.createRadialGradient(-.1, -.1, .05, 0, 0, .44); g.addColorStop(0, '#eeb25a'); g.addColorStop(1, '#c4772a');
    o(circ(0, 0, .43), g);
    let t = ''; for (let i = 0; i < 28; i++) { const a = (i / 28) * TAU; t += `M${Math.cos(a) * .37} ${Math.sin(a) * .37}L${Math.cos(a) * .43} ${Math.sin(a) * .43}`; }
    ln(P(t), '#9a5316', .022);
    ln(circ(0, 0, .33), '#9a5316', .024); ln(circ(0, 0, .22), '#9a5316', .02);
    for (let i = 0; i < 8; i++) fl(xf(ell(0, -.14, .035, .085), mat(0, 0, i * 45)), '#9a5316');
    fl(circ(0, 0, .045), '#9a5316');
  },
  puff: ({ o, ln, fl, lg }) => {
    o(P('M-.4 .1 L.4 .1 Q.36 .4 0 .42 Q-.36 .4 -.4 .1Z'), '#d9923d');
    o(P('M-.44 .03 Q-.36 .18 -.28 .06 Q-.2 .2 -.1 .08 Q0 .22 .1 .08 Q.2 .2 .28 .06 Q.36 .18 .44 .03 L.44 -.06 L-.44 -.06Z'), CREAM);
    o(P('M-.44 0 C-.5 -.34 -.2 -.46 0 -.46 C.2 -.46 .5 -.34 .44 0 Q.3 .06 0 .04 Q-.3 .06 -.44 0Z'), lg(-.46, 0, [[0, '#f6c776'], [1, '#e09a42']]));
    [[-.2, -.28], [0, -.37], [.2, -.27], [-.08, -.18], [.14, -.14], [-.3, -.12], [.32, -.1]].forEach(([a, b]) => fl(circ(a, b, .022), '#fff'));
    ln(P('M-.32 -.1 Q-.22 -.28 -.1 -.33'), 'rgba(255,255,255,.55)', .03);
  },
  boba: ({ o, ln, fl, lg }) => {
    o(P('M.02 -.5 L.1 -.5 L.12 -.1 L.04 -.1Z'), '#ff6f91');
    o(P('M-.24 -.26 L.24 -.26 L.18 .42 Q0 .48 -.18 .42Z'), lg(-.26, .46, [[0, '#fff1dc'], [.45, '#e9c49b'], [1, '#d3a06a']]));
    [[-.1, .35], [.02, .38], [.12, .34], [-.04, .28], [.07, .27], [-.14, .27], [.14, .26]].forEach(([a, b]) => { fl(circ(a, b, .047), '#3a2418'); fl(circ(a - .015, b - .015, .012), 'rgba(255,255,255,.7)'); });
    fl(xf(HEART, mat(0, .0, 0, .2)), '#ff6f91');
    o(P('M-.28 -.3 Q-.28 -.38 -.2 -.38 L.2 -.38 Q.28 -.38 .28 -.3 L.28 -.25 L-.28 -.25Z'), '#fff');
    ln(P('M-.26 -.27 H.26'), '#e2d4c6', .02);
    ln(P('M-.17 -.18 L-.13 .26'), 'rgba(255,255,255,.75)', .03);
  },
  pearls: ({ o, fl }) => {
    [[-.17, .1], [.17, .1], [0, -.17]].forEach(([a, b]) => { o(circ(a, b, .17), '#3a2418'); });
    [[-.17, .1], [.17, .1], [0, -.17]].forEach(([a, b]) => fl(ell(a - .06, b - .06, .045, .028, -.6), 'rgba(255,255,255,.75)'));
  },
  coin: ({ o, ln, fl, lg }) => {
    o(circ(0, 0, .42), lg(-.4, .4, [[0, '#ffe27a'], [1, '#f2a516']]));
    ln(circ(0, 0, .34), '#c98a00', .03);
    ln(P('M0 -.31 V-.2 M0 .2 V.31 M-.31 0 H-.2 M.2 0 H.31'), '#c98a00', .03);
    fl(P('M-.09 -.09 H.09 V.09 H-.09Z'), '#8a5a00');
  },
  ingot: ({ o, ln, fl, lg }) => {
    o(P('M-.46 -.06 Q-.42 -.2 -.22 -.18 Q0 -.36 .22 -.18 Q.42 -.2 .46 -.06 Q.38 .3 .22 .32 L-.22 .32 Q-.38 .3 -.46 -.06Z'), lg(-.3, .32, [[0, '#ffe27a'], [1, '#e8a017']]));
    ln(P('M-.3 -.02 Q0 -.22 .3 -.02'), '#c98a00', .028);
    ln(P('M-.2 .12 H.2'), '#c98a00', .024);
    fl(ell(-.2, -.1, .06, .03, -.4), 'rgba(255,255,255,.6)');
  },
  hongbao: ({ o, ln, fl }) => {
    o(P('M-.28 -.44 H.28 Q.32 -.44 .32 -.4 V.4 Q.32 .44 .28 .44 H-.28 Q-.32 .44 -.32 .4 V-.4 Q-.32 -.44 -.28 -.44Z'), RED);
    fl(P('M-.32 -.4 Q-.32 -.44 -.28 -.44 H.28 Q.32 -.44 .32 -.4 L0 -.02Z'), RED_D);
    ln(P('M-.26 -.36 L0 -.1 L.26 -.36'), '#ffc93c', .02);
    fl(circ(0, .12, .12), '#ffc93c'); ln(circ(0, .12, .085), '#c98a00', .02);
    fl(P('M-.03 .09 H.03 V.15 H-.03Z'), '#c98a00');
    fl(circ(-.2, .34, .02), '#ffc93c'); fl(circ(0, .36, .02), '#ffc93c'); fl(circ(.2, .34, .02), '#ffc93c');
  },
  knot: ({ o, ln, fl, sl }) => {
    sl(circ(0, -.4, .06), GOLD, .025);
    o(P('M-.06 .24 H.06 L.1 .5 H-.1Z'), RED);
    o(P('M0 -.34 L.3 -.04 L0 .26 L-.3 -.04Z'), RED);
    ln(P('M0 -.2 L.16 -.04 L0 .12 L-.16 -.04Z'), '#ff8a8a', .03);
    ln(P('M0 -.34 V.26 M-.3 -.04 H.3'), '#ff8a8a', .018);
    fl(circ(0, .28, .05), GOLD);
    fl(circ(0, -.04, .035), GOLD);
  },
  flake: ({ o, ln, lg }) => {
    o(P('M-.42 .1 Q-.1 -.32 .42 -.1 Q.12 .3 -.42 .1Z'), lg(-.3, .3, [[0, '#f6d27a'], [1, '#c98a25']]));
    ln(P('M-.3 .08 Q0 -.16 .3 -.08'), 'rgba(255,255,255,.55)', .03);
  },
  snow: ({ sl }) => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = ((i * 60 - 90) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
      d += `M0 0L${c * .42} ${s * .42}`;
      const bx = c * .26, by = s * .26;
      for (const k of [-1, 1]) { const b = a + k * 0.85; d += `M${bx} ${by}L${bx + Math.cos(b) * .13} ${by + Math.sin(b) * .13}`; }
    }
    sl(P(d), '#f4c95d', .055);
  },
  cloud: ({ o, ln, lg }) => {
    const c = new Path2D(); c.addPath(circ(-.24, .06, .2)); c.addPath(circ(0, -.06, .27)); c.addPath(circ(.25, .05, .21)); c.addPath(ell(0, .15, .42, .13));
    o(c, lg(-.3, .3, [[0, '#fffaf0'], [1, '#f3dfb4']]));
    ln(spiral(-.24, .06, .13), '#dcc088', .022); ln(spiral(0, -.06, .17), '#dcc088', .022); ln(spiral(.25, .05, .13), '#dcc088', .022);
  },
  dumpling: ({ o, ln, fl }) => {
    o(P('M-.44 .12 Q-.34 -.34 .02 -.34 Q.36 -.32 .44 .12 Q0 .3 -.44 .12Z'), '#fff8ec');
    let d = ''; for (let i = 0; i < 7; i++) { const px = -.32 + i * .107, py = -.3 + .3 * (px / .44) ** 2; d += `M${px} ${py}l.03 .1`; }
    ln(P(d), '#dcc08a', .022);
    ln(P('M-.36 .12 Q0 .24 .36 .12'), '#eadbbb', .02);
    fl(ell(-.2, .02, .07, .035, -.4), 'rgba(255,255,255,.7)');
  },
  bao: ({ o, ln, fl, sl }) => {
    o(P('M-.46 .24 H.46 L.4 .42 H-.4Z'), '#d9a766');
    ln(P('M-.2 .26 V.4 M0 .26 V.4 M.2 .26 V.4'), '#b98448', .018);
    o(P('M-.4 .28 C-.5 -.08 -.3 -.42 0 -.42 C.3 -.42 .5 -.08 .4 .28 Q0 .38 -.4 .28Z'), '#fffaf0');
    ln(P('M0 -.34 Q-.18 -.2 -.26 -.02 M0 -.34 Q-.06 -.18 -.1 .02 M0 -.34 Q.06 -.18 .1 .02 M0 -.34 Q.18 -.2 .26 -.02'), '#e2cfa6', .022);
    fl(circ(0, -.36, .03), '#ff6b6b');
  },
  cookie: ({ o, ln, fl }) => {
    o(P('M.18 .02 L.48 -.16 L.52 -.08 L.24 .1Z'), '#fff');
    ln(P('M.3 -.02 L.42 -.09'), RED, .02);
    o(P('M-.44 .14 Q-.5 -.2 -.1 -.26 Q.3 -.3 .44 .1 Q.2 .3 0 .1 Q-.2 .3 -.44 .14Z'), '#f1c27a');
    ln(P('M-.1 -.26 Q-.02 .0 0 .1'), '#d49a4a', .028);
    ln(P('M-.36 -.06 Q-.26 -.16 -.14 -.18'), 'rgba(255,255,255,.55)', .03);
  },
  koi: ({ o, ln, fl }) => {
    o(P('M.3 0 Q.46 -.2 .5 -.3 Q.4 0 .5 .3 Q.46 .2 .3 0Z'), '#ff9a5a');
    o(P('M-.46 0 Q-.22 -.26 .08 -.2 Q.3 -.1 .36 0 Q.3 .1 .08 .2 Q-.22 .26 -.46 0Z'), '#ff7a2f');
    o(P('M-.06 -.18 Q.04 -.36 .16 -.16Z'), '#ff9a5a');
    fl(ell(-.02, -.07, .13, .08, -.1), '#fff');
    fl(circ(-.32, -.04, .04), '#fff'); fl(circ(-.32, -.04, .02), '#222');
    ln(P('M-.1 .1 Q0 .16 .1 .1'), '#ffc08a', .02);
  },
  heart: ({ o, ln, v }) => {
    o(xf(HEART, mat(0, -.02, 0, 1.15)), v % 2 ? '#ff5c7a' : '#ff93ad');
    ln(P('M-.26 -.16 Q-.32 -.02 -.2 .06'), 'rgba(255,255,255,.6)', .04);
  },
  sparkle: ({ o, lg }) => {
    o(P('M0 -.46 Q.04 -.04 .46 0 Q.04 .04 0 .46 Q-.04 .04 -.46 0 Q-.04 -.04 0 -.46Z'), lg(-.46, .46, [[0, '#fff0a8'], [1, '#f2b92e']]));
  },
  tape: ({ x, k, v }) => {                          // washi tape, no die-cut outline
    if (!k) return;
    let d = 'M-.5 -.15'; for (let i = 0; i < 3; i++) d += `l.045 .05l-.045 .05`; d += 'H.5';
    for (let i = 0; i < 3; i++) d += `l-.045 -.05l.045 -.05`; d += 'Z';
    d = 'M-.5 -.15H.5L.46 -.1L.5 -.05L.46 0L.5 .05L.46 .1L.5 .15H-.5L-.46 .1L-.5 .05L-.46 0L-.5 -.05L-.46 -.1Z';
    x.fillStyle = ['rgba(255,179,193,.88)', 'rgba(255,224,138,.88)', 'rgba(189,224,254,.88)', 'rgba(199,242,180,.88)'][v % 4];
    x.fill(P(d));
    x.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = -4; i <= 4; i++) x.fillRect(i * .11 - .02, -.15, .04, .3);
  },
};

// size multiplier per sticker so small things don't look tiny
const SCALE = { flake: .7, snow: .8, petal: .75, pearls: .85, sparkle: .75, heart: .85, cloud: 1.15, tape: 1.1, coin: .95, blossom: 1.05 };

export const PACKS = [
  { id: 'none', name: 'None' },
  { id: 'mix', name: 'Chinatown mix', thumb: 'lantern', kinds: ['lantern', 'sky', 'blossom', 'mooncake', 'puff', 'boba', 'coin', 'dumpling', 'cloud', 'hongbao', 'snow', 'flake'] },
  { id: 'lanterns', name: 'Lanterns', thumb: 'sky', kinds: ['lantern', 'sky', 'lantern', 'flake', 'snow', 'sky'] },
  { id: 'blossom', name: 'Blossoms', thumb: 'blossom', kinds: ['blossom', 'petal', 'blossom', 'petal', 'sparkle'] },
  { id: 'dimsum', name: 'Dim sum', thumb: 'dumpling', kinds: ['mooncake', 'puff', 'dumpling', 'bao', 'cookie'] },
  { id: 'boba', name: 'Bubble tea', thumb: 'boba', kinds: ['boba', 'pearls', 'boba', 'heart', 'pearls', 'blossom'] },
  { id: 'luck', name: 'Good luck', thumb: 'coin', kinds: ['coin', 'hongbao', 'knot', 'ingot', 'koi', 'flake'] },
  { id: 'cloud', name: 'Clouds', thumb: 'cloud', kinds: ['cloud', 'snow', 'flake', 'sparkle'] },
  { id: 'cute', name: 'Cute basics', thumb: 'heart', kinds: ['heart', 'sparkle', 'tape'] },
];

// Draw one sticker centred on the current origin. size = its width/height in px, v = colour variant.
export function drawSticker(x, kind, size, v = 0, shadow = false, plain = false) {
  const art = ART[kind]; if (!art) return;
  const s = size * (SCALE[kind] || 1);
  x.save(); x.scale(s, s); x.lineCap = 'round'; x.lineJoin = 'round';
  for (let k = 0; k < 2; k++) {
    if (plain && k === 0) continue;                  // frame decorations skip the white sticker outline
    if (shadow && k === 0) { x.shadowColor = 'rgba(0,0,0,.28)'; x.shadowBlur = 8; x.shadowOffsetY = 3; }
    if (k === 1) { x.shadowColor = 'transparent'; x.shadowBlur = 0; x.shadowOffsetY = 0; }
    const h = {
      x, k, v,
      o: (d, fill) => { if (!k) { x.fillStyle = x.strokeStyle = '#fff'; x.lineWidth = OUT; x.fill(d); x.stroke(d); } else { x.fillStyle = fill; x.fill(d); } },
      ln: (d, col, w = .03) => { if (k) { x.strokeStyle = col; x.lineWidth = w; x.stroke(d); } },
      sl: (d, col, w) => { x.strokeStyle = k ? col : '#fff'; x.lineWidth = k ? w : w + OUT; x.stroke(d); },
      fl: (d, fill) => { if (k) { x.fillStyle = fill; x.fill(d); } },
      lg: (y0, y1, stops) => { const g = x.createLinearGradient(0, y0, 0, y1); stops.forEach(([t, c]) => g.addColorStop(t, c)); return g; },
    };
    art(h);
  }
  x.restore();
}