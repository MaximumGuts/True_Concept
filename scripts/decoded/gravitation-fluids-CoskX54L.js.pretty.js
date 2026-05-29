import { j as e } from "./index-CkhNTvuD.js";
import { r as s, P as ne } from "./App-U7Teu2t1.js";
import { u as se, S as re, a as J, c as Z, e as oe, d as te } from "./sim-ui-Bi06fhUM.js";
import { R as ie } from "./rotate-ccw-DQs0uxq4.js";
import { P as de } from "./pause-CUcrJbbf.js";
function be() {
  const [m, Y] = s.useState(200),
    [b, z] = s.useState(20),
    [n, R] = s.useState({ x: 200, y: 150 }),
    [o, _] = s.useState({ x: 300, y: 150 }),
    k = s.useRef(n),
    h = s.useRef(o),
    B = s.useRef({ vx: 0, vy: Math.sqrt(5e3 / 100) }),
    [j, v] = s.useState(!1),
    [w, U] = s.useState(null),
    [I, D] = s.useState([]),
    [T, X] = s.useState(!0),
    y = s.useRef(null),
    i = 15 + Math.sqrt(m) * 1.5,
    A = 8 + Math.sqrt(b) * 1.5,
    G = Math.max(1, Math.hypot(o.x - n.x, o.y - n.y)),
    d = (m * b * 1e3) / (G * G);
  (s.useEffect(() => {
    ((k.current = n), (h.current = o));
  }, [n, o]),
    se(j && w === null, (l) => {
      const N = Math.min(l, 0.05) * 3,
        x = k.current.x - h.current.x,
        P = k.current.y - h.current.y,
        F = x * x + P * P,
        p = Math.max(5, Math.sqrt(F)),
        t = (500 * m) / F,
        c = t * (x / p),
        $ = t * (P / p);
      ((B.current.vx += c * N),
        (B.current.vy += $ * N),
        (h.current.x += B.current.vx * N * 20),
        (h.current.y += B.current.vy * N * 20),
        _({ x: h.current.x, y: h.current.y }),
        D((r) => {
          if (r.length === 0 || Math.hypot(r[r.length - 1].x - h.current.x, r[r.length - 1].y - h.current.y) > 2) {
            const C = [...r, { x: h.current.x, y: h.current.y }];
            return (C.length > 200 && C.shift(), C);
          }
          return r;
        }));
    }));
  const V = (l, N) => {
      (l.target.setPointerCapture(l.pointerId), U(N), v(!1));
    },
    g = (l) => {
      if (!w || !y.current) return;
      const N = y.current.createSVGPoint();
      ((N.x = l.clientX), (N.y = l.clientY));
      const x = N.matrixTransform(y.current.getScreenCTM().inverse());
      if (w === 1) ((k.current = { x: x.x, y: x.y }), R(k.current));
      else {
        ((h.current = { x: x.x, y: x.y }), _(h.current), D([]));
        const P = k.current.x - h.current.x,
          F = k.current.y - h.current.y,
          p = Math.max(10, Math.sqrt(P * P + F * F)),
          t = Math.sqrt((25 * m) / p),
          c = -F / p,
          $ = P / p;
        B.current = { vx: c * t, vy: $ * t };
      }
    },
    a = (l) => {
      w && (l.target.releasePointerCapture(l.pointerId), U(null));
    },
    H = () => {
      (v(!1),
        (k.current = { x: 200, y: 150 }),
        R(k.current),
        (h.current = { x: 300, y: 150 }),
        _(h.current),
        D([]),
        (B.current = { vx: 0, vy: Math.sqrt(5e3 / 100) }));
    },
    q = () => {
      if (!T) return null;
      const l = [],
        N = 20;
      for (let x = 0; x <= 400; x += N) {
        let P = `M ${x} 0 `;
        for (let F = 0; F <= 300; F += 15) {
          let p = x,
            t = F;
          ([
            { p: n, m },
            { p: o, m: b },
          ].forEach(({ p: c, m: $ }) => {
            const r = Math.max(10, Math.hypot(p - c.x, t - c.y)),
              C = Math.min(r - 5, ($ * 0.2) / (r / 20));
            r < 120 && ((p -= ((p - c.x) / r) * C), (t -= ((t - c.y) / r) * C));
          }),
            (P += `L ${p} ${t} `));
        }
        l.push(e.jsx("path", { d: P, fill: "none", stroke: "rgba(255,255,255,0.07)", strokeWidth: "1" }, `v${x}`));
      }
      for (let x = 0; x <= 300; x += N) {
        let P = `M 0 ${x} `;
        for (let F = 0; F <= 400; F += 15) {
          let p = F,
            t = x;
          ([
            { p: n, m },
            { p: o, m: b },
          ].forEach(({ p: c, m: $ }) => {
            const r = Math.max(10, Math.hypot(p - c.x, t - c.y)),
              C = Math.min(r - 5, ($ * 0.2) / (r / 20));
            r < 120 && ((p -= ((p - c.x) / r) * C), (t -= ((t - c.y) / r) * C));
          }),
            (P += `L ${p} ${t} `));
        }
        l.push(e.jsx("path", { d: P, fill: "none", stroke: "rgba(255,255,255,0.07)", strokeWidth: "1" }, `h${x}`));
      }
      return l;
    },
    O = Math.min(60, Math.max(10, d / 5)),
    M = Math.atan2(o.y - n.y, o.x - n.x),
    f = n.x + Math.cos(M) * i,
    S = n.y + Math.sin(M) * i,
    Q = f + Math.cos(M) * O,
    u = S + Math.sin(M) * O,
    W = o.x - Math.cos(M) * A,
    L = o.y - Math.sin(M) * A,
    ee = W - Math.cos(M) * O,
    K = L - Math.sin(M) * O;
  let E = "Drag the planets to see how distance affects gravity. Notice how space bends around them!";
  return (
    j
      ? (E = "Orbiting! Tangential velocity perfectly balances the gravitational pull, keeping it in stable orbit.")
      : d > 500
        ? (E = "Immense Gravity! The force is extremely strong due to high mass or close proximity.")
        : G > 200 && (E = "As distance increases, the force drops exponentially (Inverse-Square Law)."),
    e.jsxs(re, {
      onReset: H,
      hint: "F = G·m₁·m₂ / r². Observe the inverse-square law visually.",
      children: [
        e.jsxs("div", {
          className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4",
          children: [
            e.jsx(J, { label: "Mass m₁ (Star)", value: m, onChange: Y, min: 50, max: 500, step: 10, color: "#f59e0b" }),
            e.jsx(J, { label: "Mass m₂ (Planet)", value: b, onChange: z, min: 5, max: 100, step: 5, color: "#0ea5e9" }),
            e.jsxs("div", {
              className: "flex flex-col justify-center gap-2 col-span-2 sm:col-span-2 px-2",
              children: [
                e.jsxs("div", {
                  className: "flex gap-2",
                  children: [
                    e.jsx(te, {
                      onClick: () => v(!j),
                      color: j ? "#ef4444" : "#10b981",
                      icon: j ? e.jsx(de, { className: "w-3.5 h-3.5" }) : e.jsx(ne, { className: "w-3.5 h-3.5" }),
                      children: j ? "Pause Orbit" : "Start Orbit",
                    }),
                    e.jsx(te, {
                      onClick: H,
                      color: "#64748b",
                      icon: e.jsx(ie, { className: "w-3.5 h-3.5" }),
                      children: "Reset",
                    }),
                  ],
                }),
                e.jsxs("label", {
                  className:
                    "flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer",
                  children: [
                    e.jsx("input", {
                      type: "checkbox",
                      checked: T,
                      onChange: (l) => X(l.target.checked),
                      className: "w-3.5 h-3.5 text-indigo-500 rounded focus:ring-indigo-500",
                    }),
                    "Show Space Bending",
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "relative rounded-2xl overflow-hidden shadow-2xl mb-4 bg-[#0a0f1c] touch-none",
          style: { height: "300px" },
          onPointerMove: g,
          onPointerUp: a,
          onPointerLeave: a,
          children: [
            e.jsx("div", {
              className: "absolute inset-0 opacity-40 mix-blend-screen pointer-events-none",
              style: {
                backgroundImage:
                  "radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, #aaa, rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))",
                backgroundSize: "200px 200px",
              },
            }),
            e.jsxs("div", {
              className:
                "absolute top-3 left-3 bg-black/60 border border-white/10 backdrop-blur-md px-3 py-2 rounded-xl pointer-events-none",
              children: [
                e.jsx("div", {
                  className: "text-[10px] font-black uppercase text-gray-400 mb-1",
                  children: "Universal Gravitation",
                }),
                e.jsxs("div", {
                  className: "flex items-center gap-2 font-mono font-black text-sm text-orange-400",
                  children: [
                    e.jsx("span", { children: "F = G" }),
                    e.jsxs("div", {
                      className: "flex flex-col items-center justify-center leading-none text-xs",
                      children: [
                        e.jsx("span", { className: "border-b border-orange-400/50 pb-0.5", children: "m₁ m₂" }),
                        e.jsx("span", { className: "pt-0.5", children: "r²" }),
                      ],
                    }),
                    e.jsx("span", { className: "text-white", children: "=" }),
                    e.jsxs("span", {
                      className: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                      children: [d.toFixed(1), " N"],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("svg", {
              ref: y,
              viewBox: "0 0 400 300",
              preserveAspectRatio: "xMidYMid slice",
              className: "w-full h-full cursor-crosshair",
              children: [
                e.jsxs("defs", {
                  children: [
                    e.jsxs("radialGradient", {
                      id: "starGlow",
                      cx: "50%",
                      cy: "50%",
                      r: "50%",
                      children: [
                        e.jsx("stop", { offset: "0%", stopColor: "#fde047", stopOpacity: "1" }),
                        e.jsx("stop", { offset: "40%", stopColor: "#f59e0b", stopOpacity: "0.8" }),
                        e.jsx("stop", { offset: "100%", stopColor: "#ea580c", stopOpacity: "0" }),
                      ],
                    }),
                    e.jsxs("radialGradient", {
                      id: "planetGlow",
                      cx: "50%",
                      cy: "50%",
                      r: "50%",
                      children: [
                        e.jsx("stop", { offset: "0%", stopColor: "#7dd3fc", stopOpacity: "1" }),
                        e.jsx("stop", { offset: "60%", stopColor: "#0284c7", stopOpacity: "0.8" }),
                        e.jsx("stop", { offset: "100%", stopColor: "#0369a1", stopOpacity: "0" }),
                      ],
                    }),
                    e.jsx("marker", {
                      id: "forceArrowM1",
                      markerWidth: "6",
                      markerHeight: "6",
                      refX: "5",
                      refY: "3",
                      orient: "auto",
                      children: e.jsx("path", { d: "M0,0 L6,3 L0,6 z", fill: "#f43f5e" }),
                    }),
                    e.jsx("marker", {
                      id: "forceArrowM2",
                      markerWidth: "6",
                      markerHeight: "6",
                      refX: "5",
                      refY: "3",
                      orient: "auto",
                      children: e.jsx("path", { d: "M0,0 L6,3 L0,6 z", fill: "#f43f5e" }),
                    }),
                  ],
                }),
                q(),
                I.length > 1 &&
                  e.jsx("path", {
                    d: `M ${I.map((l) => `${l.x},${l.y}`).join(" L ")}`,
                    fill: "none",
                    stroke: "#38bdf8",
                    strokeWidth: "1.5",
                    strokeDasharray: "4 4",
                    opacity: "0.6",
                  }),
                e.jsx("line", {
                  x1: n.x,
                  y1: n.y,
                  x2: o.x,
                  y2: o.y,
                  stroke: "rgba(255,255,255,0.2)",
                  strokeWidth: "1",
                  strokeDasharray: "2 4",
                }),
                d > 0.1 &&
                  e.jsxs(e.Fragment, {
                    children: [
                      e.jsx("line", {
                        x1: f,
                        y1: S,
                        x2: Q,
                        y2: u,
                        stroke: "#f43f5e",
                        strokeWidth: "3",
                        markerEnd: "url(#forceArrowM1)",
                      }),
                      e.jsx("line", {
                        x1: W,
                        y1: L,
                        x2: ee,
                        y2: K,
                        stroke: "#f43f5e",
                        strokeWidth: "3",
                        markerEnd: "url(#forceArrowM2)",
                      }),
                    ],
                  }),
                e.jsxs("g", {
                  transform: `translate(${n.x}, ${n.y})`,
                  onPointerDown: (l) => V(l, 1),
                  className: "cursor-grab active:cursor-grabbing",
                  children: [
                    e.jsx("circle", { cx: "0", cy: "0", r: i * 3, fill: "url(#starGlow)", opacity: 0.4 + m / 1e3 }),
                    e.jsx("circle", { cx: "0", cy: "0", r: i, fill: "#fbbf24", stroke: "#fffbeb", strokeWidth: "2" }),
                    e.jsx("text", {
                      x: "0",
                      y: "4",
                      fill: "#78350f",
                      fontSize: "10",
                      fontWeight: "900",
                      textAnchor: "middle",
                      pointerEvents: "none",
                      children: "m₁",
                    }),
                  ],
                }),
                e.jsxs("g", {
                  transform: `translate(${o.x}, ${o.y})`,
                  onPointerDown: (l) => V(l, 2),
                  className: "cursor-grab active:cursor-grabbing",
                  children: [
                    e.jsx("circle", { cx: "0", cy: "0", r: A * 2.5, fill: "url(#planetGlow)", opacity: 0.4 + b / 200 }),
                    e.jsx("circle", { cx: "0", cy: "0", r: A, fill: "#0ea5e9", stroke: "#e0f2fe", strokeWidth: "1.5" }),
                    e.jsx("text", {
                      x: "0",
                      y: "3",
                      fill: "#0c4a6e",
                      fontSize: "9",
                      fontWeight: "900",
                      textAnchor: "middle",
                      pointerEvents: "none",
                      children: "m₂",
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className:
                "absolute bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-black/60 border border-indigo-500/30 backdrop-blur-md p-2.5 rounded-xl shadow-xl text-center pointer-events-none",
              children: e.jsx("p", { className: "text-xs font-bold text-indigo-100 leading-snug", children: E }),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "grid grid-cols-2 gap-2",
          children: [
            e.jsx(Z, { label: "Distance (r)", value: G, unit: "Mm", color: "#8b5cf6", precision: 0 }),
            e.jsx(Z, { label: "Gravitational Force", value: d, unit: "N", color: "#10b981", precision: 1 }),
          ],
        }),
        e.jsx(oe, {
          steps: [
            {
              title: "Mass & Force",
              body: "Increase the mass of either planet using the sliders. Watch the bidirectional force vectors grow instantly!",
            },
            {
              title: "Distance Effect",
              body: "Drag the blue planet away from the star. The force decreases exponentially due to the Inverse-Square Law.",
            },
            {
              title: "Orbit Mode",
              body: "Drag the planet, then click 'Start Orbit'. Tangential velocity perfectly balances the gravitational pull, keeping it in a stable circular orbit.",
            },
            {
              title: "Space Bending",
              body: "Toggle 'Show Space Bending' to visualize Einstein's concept: Massive objects literally distort the fabric of spacetime around them!",
            },
          ],
        }),
      ],
    })
  );
}
function ge() {
  const [m, Y] = s.useState("water"),
    [b, z] = s.useState("wood"),
    [n, R] = s.useState(6),
    [o, _] = s.useState(10),
    [k, h] = s.useState(100),
    [B, j] = s.useState(0),
    [v, w] = s.useState(!1),
    [U, I] = s.useState([]),
    D = s.useRef(0),
    T = 9.8,
    y = { water: 1, salt: 1.03, oil: 0.9, mercury: 13.6 }[m];
  s.useEffect(() => {
    (b === "wood" && (R(6), _(10)), b === "metal" && (R(78), _(10)));
  }, [b]);
  const i = 350,
    A = 400,
    G = 220,
    d = (i - G) / 2,
    V = 240,
    g = 380,
    a = 60,
    H = (t) => {
      const c = t + a / 2,
        $ = t - a / 2;
      let r = (c - V) / (1 - a / G);
      r = Math.max(0, Math.min(a, r));
      const C = V - (r * a) / G;
      $ > C && (r = a);
      const ae = o * (r / a),
        le = y * ae * T,
        ce = n * T;
      return { sub_d: r, waterLevel: C, vSub: ae, Fb: le, Fg: ce, boxBottom: c };
    },
    { sub_d: q, waterLevel: O, vSub: M, Fb: f, Fg: S, boxBottom: Q } = H(k);
  se(!v, (t) => {
    D.current += t;
    let c = (S - f) / n;
    q > 0 ? (c -= 3 * B) : (c -= 0.1 * B);
    let $ = B + c * t * 20,
      r = k + $ * t * 20;
    (r + a / 2 > g && ((r = g - a / 2), ($ *= -0.4), Math.abs($) < 1 && ($ = 0)),
      h(r),
      j($),
      Math.floor(D.current * 10) > Math.floor((D.current - t) * 10) &&
        I((C) => [...C.slice(-100), { t: D.current, vSub: M, fb: f }]));
  });
  const u = s.useRef(null),
    W = (t) => {
      (w(!0), j(0), K(t));
    },
    L = (t) => {
      v && K(t);
    },
    ee = () => {
      w(!1);
    },
    K = (t) => {
      if (!u.current) return;
      const c = u.current.createSVGPoint();
      ((c.x = t.clientX), (c.y = t.clientY));
      let r = c.matrixTransform(u.current.getScreenCTM().inverse()).y;
      ((r = Math.max(-100, Math.min(g - a / 2, r))), h(r));
    },
    E = () => {
      (h(50), j(0), (D.current = 0), I([]));
    },
    l =
      m === "water"
        ? "rgba(14,165,233,0.5)"
        : m === "salt"
          ? "rgba(16,185,129,0.5)"
          : m === "oil"
            ? "rgba(245,158,11,0.6)"
            : "rgba(148,163,184,0.9)",
    N = m === "water" ? "#38bdf8" : m === "salt" ? "#34d399" : m === "oil" ? "#fbbf24" : "#cbd5e1",
    x = n / o,
    P = b === "wood" ? "#b45309" : b === "metal" ? "#64748b" : x > 4 ? "#475569" : x < 0.8 ? "#d97706" : "#8b5cf6",
    F = b === "custom" ? (x > 4 ? "HEAVY" : x < 0.8 ? "HOLLOW" : "CUSTOM") : b.toUpperCase();
  let p = "Drag the object into the fluid to observe Archimedes' Principle in action.";
  return (
    f > S + 0.1
      ? (p = `The upward Buoyant Force (${f.toFixed(1)} N) is greater than Weight (${S.toFixed(1)} N). It's rising!`)
      : Math.abs(f - S) <= 0.5 && q > 0 && q < a
        ? (p = "Equilibrium! Buoyant Force perfectly balances Weight. The object naturally floats.")
        : f < S && Q >= g - 1
          ? (p = "Weight exceeds the maximum possible Buoyant Force. The object sinks to the bottom.")
          : f < S &&
            q > 0 &&
            (p = `Weight (${S.toFixed(1)} N) is greater than Buoyant Force (${f.toFixed(1)} N). Sinking!`),
    e.jsxs(re, {
      onReset: E,
      hint: "Archimedes' Principle: The buoyant force equals the weight of the displaced fluid.",
      children: [
        e.jsxs("div", {
          className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4",
          children: [
            e.jsxs("div", {
              className: "flex flex-col justify-center px-1",
              children: [
                e.jsx("label", {
                  className: "text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5",
                  children: "Liquid",
                }),
                e.jsxs("select", {
                  value: m,
                  onChange: (t) => {
                    (Y(t.target.value), E());
                  },
                  className:
                    "bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full",
                  children: [
                    e.jsx("option", { value: "water", children: "Water (1.0 kg/L)" }),
                    e.jsx("option", { value: "salt", children: "Salt Water (1.03 kg/L)" }),
                    e.jsx("option", { value: "oil", children: "Oil (0.9 kg/L)" }),
                    e.jsx("option", { value: "mercury", children: "Mercury (13.6 kg/L)" }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "flex flex-col justify-center px-1",
              children: [
                e.jsx("label", {
                  className: "text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5",
                  children: "Object",
                }),
                e.jsxs("select", {
                  value: b,
                  onChange: (t) => {
                    (z(t.target.value), E());
                  },
                  className:
                    "bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full",
                  children: [
                    e.jsx("option", { value: "wood", children: "Wooden Block" }),
                    e.jsx("option", { value: "metal", children: "Metal Block" }),
                    e.jsx("option", { value: "custom", children: "Custom Object" }),
                  ],
                }),
              ],
            }),
            e.jsx(J, {
              label: "Mass (m)",
              value: n,
              onChange: (t) => {
                (R(t), z("custom"));
              },
              min: 1,
              max: 100,
              step: 1,
              unit: " kg",
              color: "#f59e0b",
            }),
            e.jsx(J, {
              label: "Volume (V)",
              value: o,
              onChange: (t) => {
                (_(t), z("custom"));
              },
              min: 5,
              max: 20,
              step: 1,
              unit: " L",
              color: "#8b5cf6",
            }),
          ],
        }),
        e.jsx("div", {
          className:
            "relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#1e293b] touch-none mb-4 w-full h-[350px] sm:h-[420px]",
          onPointerDown: W,
          onPointerMove: L,
          onPointerUp: ee,
          onPointerLeave: ee,
          children: e.jsxs("svg", {
            ref: u,
            viewBox: `0 0 ${i} ${A}`,
            preserveAspectRatio: "xMidYMid meet",
            className: "w-full h-full absolute inset-0 cursor-ns-resize active:cursor-grabbing",
            children: [
              e.jsxs("defs", {
                children: [
                  e.jsx("marker", {
                    id: "arrowUp",
                    markerWidth: "6",
                    markerHeight: "6",
                    refX: "3",
                    refY: "3",
                    orient: "auto-start-reverse",
                    children: e.jsx("path", { d: "M0,0 L6,3 L0,6 z", fill: "#38bdf8" }),
                  }),
                  e.jsx("marker", {
                    id: "arrowDown",
                    markerWidth: "6",
                    markerHeight: "6",
                    refX: "3",
                    refY: "3",
                    orient: "auto-start-reverse",
                    children: e.jsx("path", { d: "M0,0 L6,3 L0,6 z", fill: "#f59e0b" }),
                  }),
                  e.jsx("pattern", {
                    id: "grid",
                    width: "20",
                    height: "20",
                    patternUnits: "userSpaceOnUse",
                    children: e.jsx("rect", {
                      width: "20",
                      height: "20",
                      fill: "none",
                      stroke: "rgba(255,255,255,0.02)",
                      strokeWidth: "1",
                    }),
                  }),
                ],
              }),
              e.jsx("rect", { width: i, height: A, fill: "url(#grid)" }),
              e.jsx("path", {
                d: `M ${d - 10} 100 L ${d} ${g} L ${i - d} ${g} L ${i - d + 10} 100`,
                fill: "rgba(255,255,255,0.05)",
              }),
              Array.from({ length: 10 }).map((t, c) =>
                e.jsx(
                  "line",
                  {
                    x1: d,
                    x2: d + 10,
                    y1: g - c * 25,
                    y2: g - c * 25,
                    stroke: "#cbd5e1",
                    strokeWidth: "2",
                    opacity: "0.3",
                  },
                  c,
                ),
              ),
              e.jsx("path", {
                d: `M ${d} ${O} L ${i - d} ${O} L ${i - d} ${g} L ${d} ${g} Z`,
                fill: l,
                className: "transition-all duration-75",
              }),
              e.jsx("line", {
                x1: d,
                x2: i - d,
                y1: O,
                y2: O,
                stroke: N,
                strokeWidth: "3",
                opacity: "0.8",
                className: "transition-all duration-75",
              }),
              e.jsxs("g", {
                transform: `translate(${i / 2}, ${k})`,
                children: [
                  e.jsx("rect", {
                    x: -a / 2,
                    y: -a / 2,
                    width: a,
                    height: a,
                    fill: P,
                    stroke: "rgba(255,255,255,0.3)",
                    strokeWidth: "2",
                    rx: "4",
                  }),
                  e.jsx("text", {
                    x: 0,
                    y: 5,
                    fill: "#fff",
                    fontSize: "14",
                    textAnchor: "middle",
                    fontWeight: "bold",
                    children: F,
                  }),
                  e.jsxs("text", {
                    x: 0,
                    y: 20,
                    fill: "rgba(255,255,255,0.8)",
                    fontSize: "10",
                    textAnchor: "middle",
                    children: [(n / o).toFixed(1), " kg/L"],
                  }),
                  f > 0 &&
                    e.jsxs("g", {
                      children: [
                        e.jsx("line", {
                          x1: -a / 2 - 20,
                          y1: a / 2,
                          x2: -a / 2 - 20,
                          y2: a / 2 - Math.min(120, f * 0.4),
                          stroke: "#38bdf8",
                          strokeWidth: "4",
                          markerEnd: "url(#arrowUp)",
                        }),
                        e.jsxs("text", {
                          x: -a / 2 - 30,
                          y: a / 2 - Math.min(120, f * 0.4) - 10,
                          fill: "#38bdf8",
                          fontSize: "12",
                          fontWeight: "bold",
                          textAnchor: "end",
                          children: ["Fb = ", f.toFixed(0), "N"],
                        }),
                      ],
                    }),
                  e.jsxs("g", {
                    children: [
                      e.jsx("line", {
                        x1: a / 2 + 20,
                        y1: 0,
                        x2: a / 2 + 20,
                        y2: Math.min(120, S * 0.4),
                        stroke: "#f59e0b",
                        strokeWidth: "4",
                        markerEnd: "url(#arrowDown)",
                      }),
                      e.jsxs("text", {
                        x: a / 2 + 30,
                        y: Math.min(120, S * 0.4) + 15,
                        fill: "#f59e0b",
                        fontSize: "12",
                        fontWeight: "bold",
                        textAnchor: "start",
                        children: ["Fg = ", S.toFixed(0), "N"],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx("path", {
                d: `M ${d - 10} 100 L ${d} ${g} L ${i - d} ${g} L ${i - d + 10} 100`,
                fill: "none",
                stroke: "#64748b",
                strokeWidth: "4",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
              e.jsx("rect", {
                x: 10,
                y: 15,
                width: 135,
                height: 70,
                rx: "6",
                fill: "rgba(0,0,0,0.7)",
                stroke: "#334155",
                strokeWidth: "1",
              }),
              e.jsx("text", {
                x: 20,
                y: 30,
                fill: "#cbd5e1",
                fontSize: "10",
                fontWeight: "bold",
                children: "F_b = ρ_f · g · V_sub",
              }),
              e.jsxs("text", {
                x: 20,
                y: 45,
                fill: "#38bdf8",
                fontSize: "11",
                fontWeight: "bold",
                children: ["F_b = ", (y * M * T).toFixed(1), " N"],
              }),
              e.jsxs("text", {
                x: 20,
                y: 65,
                fill: "#cbd5e1",
                fontSize: "10",
                children: ["Displaced: ", M.toFixed(1), " L"],
              }),
              e.jsx("rect", {
                x: i - 105,
                y: 15,
                width: 95,
                height: 60,
                rx: "6",
                fill: "rgba(0,0,0,0.7)",
                stroke: "#334155",
                strokeWidth: "1",
              }),
              e.jsx("text", {
                x: i - 57,
                y: 30,
                fill: "#f59e0b",
                fontSize: "10",
                fontWeight: "bold",
                textAnchor: "middle",
                children: "Density (kg/L)",
              }),
              e.jsxs("text", {
                x: i - 57,
                y: 45,
                fill: "#cbd5e1",
                fontSize: "10",
                textAnchor: "middle",
                children: ["Fluid: ", y.toFixed(2)],
              }),
              e.jsxs("text", {
                x: i - 57,
                y: 55,
                fill: "#cbd5e1",
                fontSize: "10",
                textAnchor: "middle",
                children: ["Object: ", (n / o).toFixed(2)],
              }),
            ],
          }),
        }),
        e.jsx("div", {
          className: "w-full bg-slate-900 border border-sky-500/30 p-3 mb-4 rounded-xl shadow-lg text-center",
          children: e.jsx("p", { className: "text-sm font-bold text-sky-100 leading-relaxed", children: p }),
        }),
        e.jsxs("div", {
          className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4",
          children: [
            e.jsx(Z, { label: "Submerged Vol", value: M, unit: " L", color: "#0891b2", precision: 1 }),
            e.jsx(Z, { label: "Buoyant Force", value: f, unit: " N", color: "#0ea5e9", precision: 1 }),
            e.jsx(Z, { label: "Weight", value: S, unit: " N", color: "#f59e0b", precision: 1 }),
            e.jsx(Z, { label: "Net Force", value: f - S, unit: " N", color: "#ec4899", precision: 1 }),
          ],
        }),
        e.jsx(oe, {
          steps: [
            {
              title: "Floating",
              body: "Select 'Wooden Block'. Since its density (0.6) is less than water (1.0), the Buoyant Force perfectly balances Weight when only partially submerged.",
            },
            {
              title: "Sinking",
              body: "Select 'Metal Block'. Its density (7.8) is huge. Even fully submerged, the maximum Buoyant Force is smaller than Weight, so it sinks to the bottom.",
            },
            {
              title: "Different Fluids",
              body: "Keep the metal block, but switch the liquid to Mercury (13.6 kg/L). Watch what happens! The extreme density of Mercury makes even dense metal float.",
            },
            {
              title: "The Formula",
              body: "Notice how Buoyant Force ONLY depends on the volume submerged (V_sub), the liquid's density (ρ), and gravity (g) - never the object's mass!",
            },
          ],
        }),
      ],
    })
  );
}
function pe() {
  const [m, Y] = s.useState("wood"),
    [b, z] = s.useState(30),
    [n, R] = s.useState(50);
  s.useEffect(() => {
    m === "wood" ? (z(30), R(50)) : m === "plastic" ? (z(48), R(50)) : m === "iron" && (z(390), R(50));
  }, [m]);
  const o = n > 0 ? b / n : 0,
    [_, k] = s.useState(!1),
    [h, B] = s.useState(!1),
    j = s.useRef(40),
    v = s.useRef(0),
    [w, U] = s.useState(40),
    [I, D] = s.useState(!1),
    T = 160,
    X = 230,
    y = 40;
  let i = (w + y / 2 - T) / (y - 15);
  i = Math.max(0, Math.min(1, i));
  const A = T - i * 15,
    G = i * n,
    d = G * 1,
    V = b;
  se(_, (u) => {
    const W = u * 2;
    let L = (j.current + y / 2 - T) / (y - 15);
    ((L = Math.max(0, Math.min(1, L))),
      L > 0.1 && j.current - v.current * W + y / 2 <= T && v.current > 100 && (D(!0), setTimeout(() => D(!1), 500)));
    const K = L * n * 1;
    let l = ((b - K) / b) * 600,
      N = L > 0 ? 8 * L * v.current : 0.2 * v.current;
    ((l -= N),
      (v.current += l * W),
      (j.current += v.current * W),
      j.current + y / 2 >= X && ((j.current = X - y / 2), (v.current = -v.current * 0.1)),
      U(j.current));
  });
  const g = s.useRef(null),
    a = (u) => {
      if (!g.current) return;
      const W = g.current.createSVGPoint();
      ((W.x = u.clientX), (W.y = u.clientY));
      const L = W.matrixTransform(g.current.getScreenCTM().inverse());
      Math.abs(L.x - 150) < 40 && Math.abs(L.y - w) < 40 && (B(!0), k(!1), (v.current = 0));
    },
    H = (u) => {
      if (!h || !g.current) return;
      const W = g.current.createSVGPoint();
      ((W.x = u.clientX), (W.y = u.clientY));
      const L = W.matrixTransform(g.current.getScreenCTM().inverse());
      ((j.current = Math.max(20, Math.min(240, L.y))), U(j.current));
    },
    q = () => {
      h && (B(!1), k(!0));
    },
    O = () => {
      ((j.current = 40), (v.current = 0), U(40), k(!1));
    };
  let M = "Suspended";
  o < 0.95 ? (M = "Floating") : o > 1.05 && (M = "Sinking");
  let f = "Drag and drop the object into the water.";
  i > 0 &&
    (w + y / 2 >= X - 1
      ? (f = `Object sinks because its density (${o.toFixed(2)}) > water (1.0). Weight > Buoyancy.`)
      : Math.abs(v.current) < 5 && i < 0.99
        ? (f = "Object floats! Submerged volume displaces enough water to equal its weight.")
        : Math.abs(v.current) < 5 && i > 0.99
          ? (f = "Object is neutrally buoyant (suspended in water).")
          : v.current > 0
            ? (f = "Object falling. Buoyancy increases as more volume enters water.")
            : (f = "Buoyancy is pushing the object upward!"));
  const S = Math.min(60, (V / 50) * 30),
    Q = Math.min(60, (d / 50) * 30);
  return e.jsxs(re, {
    onReset: O,
    hint: "If the object's density is less than the liquid's, it floats.",
    children: [
      e.jsxs("div", {
        className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4",
        children: [
          e.jsxs("div", {
            className: "flex flex-col justify-center col-span-2 sm:col-span-1",
            children: [
              e.jsx("label", {
                className: "text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5",
                children: "Material",
              }),
              e.jsxs("select", {
                value: m,
                onChange: (u) => Y(u.target.value),
                className:
                  "bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full",
                children: [
                  e.jsx("option", { value: "wood", children: "Wood (0.6 g/cm³)" }),
                  e.jsx("option", { value: "plastic", children: "Plastic (0.96 g/cm³)" }),
                  e.jsx("option", { value: "iron", children: "Iron (7.8 g/cm³)" }),
                  e.jsx("option", { value: "custom", children: "Custom" }),
                ],
              }),
            ],
          }),
          e.jsx(J, {
            label: "Mass",
            value: b,
            onChange: (u) => {
              (z(u), Y("custom"));
            },
            min: 10,
            max: 200,
            step: 5,
            unit: " g",
            color: "#da6b45",
          }),
          e.jsx(J, {
            label: "Volume",
            value: n,
            onChange: (u) => {
              (R(u), Y("custom"));
            },
            min: 20,
            max: 100,
            step: 5,
            unit: " cm³",
            color: "#8b5cf6",
          }),
          e.jsxs("div", {
            className: "flex items-center justify-center gap-2",
            children: [
              e.jsx(te, {
                onClick: () => k(!0),
                color: "#10b981",
                icon: e.jsx(ne, { className: "w-3.5 h-3.5" }),
                children: "Drop",
              }),
              e.jsx(te, {
                onClick: O,
                color: "#64748b",
                icon: e.jsx(ie, { className: "w-3.5 h-3.5" }),
                children: "Reset",
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className:
          "relative rounded-2xl overflow-hidden shadow-inner border border-white/20 dark:border-gray-700 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 touch-none mb-4",
        onPointerDown: a,
        onPointerMove: H,
        onPointerUp: q,
        onPointerLeave: q,
        children: [
          e.jsxs("svg", {
            ref: g,
            viewBox: "0 0 300 250",
            className: "w-full h-auto cursor-grab active:cursor-grabbing",
            children: [
              e.jsxs("defs", {
                children: [
                  e.jsxs("linearGradient", {
                    id: "waterGrad",
                    x1: "0",
                    y1: "0",
                    x2: "0",
                    y2: "1",
                    children: [
                      e.jsx("stop", { offset: "0%", stopColor: "#38bdf8", stopOpacity: "0.6" }),
                      e.jsx("stop", { offset: "100%", stopColor: "#0284c7", stopOpacity: "0.8" }),
                    ],
                  }),
                  e.jsxs("linearGradient", {
                    id: "objGrad",
                    x1: "0",
                    y1: "0",
                    x2: "1",
                    y2: "1",
                    children: [
                      e.jsx("stop", { offset: "0%", stopColor: o > 1.5 ? "#94a3b8" : o > 0.8 ? "#fde047" : "#fdba74" }),
                      e.jsx("stop", {
                        offset: "100%",
                        stopColor: o > 1.5 ? "#475569" : o > 0.8 ? "#eab308" : "#f97316",
                      }),
                    ],
                  }),
                  e.jsx("marker", {
                    id: "wArrow",
                    markerWidth: "5",
                    markerHeight: "5",
                    refX: "4",
                    refY: "2.5",
                    orient: "auto",
                    children: e.jsx("path", { d: "M0,0 L5,2.5 L0,5 z", fill: "#f97316" }),
                  }),
                  e.jsx("marker", {
                    id: "bArrow",
                    markerWidth: "5",
                    markerHeight: "5",
                    refX: "4",
                    refY: "2.5",
                    orient: "auto",
                    children: e.jsx("path", { d: "M0,0 L5,2.5 L0,5 z", fill: "#3b82f6" }),
                  }),
                ],
              }),
              e.jsx("rect", {
                x: "80",
                y: "50",
                width: "140",
                height: "180",
                rx: "5",
                fill: "none",
                stroke: "#cbd5e1",
                strokeWidth: "4",
              }),
              [1, 2, 3, 4, 5].map((u) =>
                e.jsx(
                  "line",
                  { x1: "80", x2: "90", y1: 50 + u * 30, y2: 50 + u * 30, stroke: "#cbd5e1", strokeWidth: "2" },
                  u,
                ),
              ),
              e.jsx("path", {
                d: `M 82 ${A} L 218 ${A} L 218 228 C 218 228 150 228 82 228 Z`,
                fill: "url(#waterGrad)",
              }),
              e.jsx("line", { x1: "82", x2: "218", y1: A, y2: A, stroke: "#7dd3fc", strokeWidth: "2", opacity: "0.8" }),
              I &&
                e.jsxs("ellipse", {
                  cx: "150",
                  cy: A,
                  rx: "30",
                  ry: "5",
                  fill: "none",
                  stroke: "#bae6fd",
                  strokeWidth: "2",
                  children: [
                    e.jsx("animate", { attributeName: "rx", from: "10", to: "50", dur: "0.5s", fill: "freeze" }),
                    e.jsx("animate", { attributeName: "opacity", from: "1", to: "0", dur: "0.5s", fill: "freeze" }),
                  ],
                }),
              e.jsx("rect", {
                x: 150 - y / 2,
                y: w - y / 2,
                width: y,
                height: y,
                rx: "4",
                fill: "url(#objGrad)",
                stroke: "#475569",
                strokeWidth: "1",
              }),
              e.jsxs("text", {
                x: "150",
                y: w + 4,
                fill: "#1e293b",
                fontSize: "12",
                fontWeight: "900",
                textAnchor: "middle",
                children: [b, "g"],
              }),
              V > 0 &&
                e.jsx("line", {
                  x1: "130",
                  y1: w,
                  x2: "130",
                  y2: w + S,
                  stroke: "#f97316",
                  strokeWidth: "3",
                  markerEnd: "url(#wArrow)",
                }),
              d > 0 &&
                e.jsx("line", {
                  x1: "170",
                  y1: w,
                  x2: "170",
                  y2: w - Q,
                  stroke: "#3b82f6",
                  strokeWidth: "3",
                  markerEnd: "url(#bArrow)",
                }),
            ],
          }),
          e.jsxs("div", {
            className:
              "absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm pointer-events-none",
            children: [
              e.jsx("div", { className: "text-[10px] font-black uppercase text-gray-500 mb-1", children: "Live Data" }),
              e.jsxs("div", {
                className: "text-[10px] font-black text-orange-500",
                children: ["W (Weight): ", b.toFixed(0)],
              }),
              e.jsxs("div", {
                className: "text-[10px] font-black text-blue-500",
                children: ["Fb (Buoyancy): ", d.toFixed(0)],
              }),
              e.jsxs("div", {
                className: "text-[10px] font-black text-emerald-500",
                children: ["V_sub: ", G.toFixed(1), " cm³"],
              }),
            ],
          }),
          e.jsx("div", {
            className:
              "absolute bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-indigo-900/80 p-2.5 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-xl text-center transition-all pointer-events-none",
            children: e.jsx("p", { className: "text-xs font-bold text-indigo-100 leading-snug", children: f }),
          }),
        ],
      }),
      e.jsxs("div", {
        className: "mb-4",
        children: [
          e.jsxs("div", {
            className: "flex justify-between items-center mb-1",
            children: [
              e.jsx("div", {
                className: "text-xs font-black text-gray-500 dark:text-gray-400 uppercase",
                children: "Density Behavior Scale",
              }),
              e.jsxs("div", {
                className:
                  "text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent",
                children: [o.toFixed(2), " g/cm³ = ", M],
              }),
            ],
          }),
          e.jsxs("div", {
            className: "relative h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner",
            children: [
              e.jsx("div", {
                className:
                  "h-full bg-emerald-400/50 flex items-center justify-center text-[10px] font-bold text-emerald-800",
                style: { width: "50%" },
                children: "Float (ρ < 1)",
              }),
              e.jsx("div", { className: "h-full w-0.5 bg-blue-500" }),
              e.jsx("div", {
                className: "h-full bg-rose-400/50 flex items-center justify-center text-[10px] font-bold text-rose-800",
                style: { width: "50%" },
                children: "Sink (ρ > 1)",
              }),
              e.jsx("div", {
                className:
                  "absolute top-0 bottom-0 w-3 bg-white border-2 border-indigo-600 rounded-full shadow-md transition-all z-10",
                style: { left: `calc(${Math.min(100, Math.max(0, (o / 2) * 100))}% - 6px)` },
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex justify-between text-[9px] font-black text-gray-400 mt-1 px-1",
            children: [
              e.jsx("span", { children: "0.0" }),
              e.jsx("span", { children: "Water (1.0)" }),
              e.jsx("span", { children: "2.0+" }),
            ],
          }),
        ],
      }),
      e.jsx(oe, {
        steps: [
          { title: "Material", body: "Select a material or set a custom mass and volume." },
          {
            title: "Forces",
            body: "Gravity pulls down (Weight = mass). Water pushes up (Buoyancy = displaced volume).",
          },
          { title: "Result", body: "If Density < 1, Buoyancy equals Weight before fully submerging, so it floats!" },
        ],
      }),
    ],
  });
}
export { ge as ArchimedesSim, pe as DensitySim, be as GravitationSim };
