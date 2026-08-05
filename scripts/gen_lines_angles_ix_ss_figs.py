"""
Redraws the twelve supporting figures for the 22 plain MCQs of
`Books/selfstudys_com_file (25).pdf` (Lines and Angles, Class IX, math-ix-c06).

The source PDF carries NO diagrams at all — it is pure text. These figures are
built from each question's own hypothesis so that a student meets the standard
NCERT picture for the configuration the question describes. Every builder ends
in `assert` statements that recompute the angles/lengths/collinearity from the
drawn coordinates, so a figure that merely "looks right" cannot ship.

LANGUAGE-NEUTRAL ON PURPOSE: one PNG serves both the English and the Assamese
document, so only point letters, digits, degree signs and the symbols
∥ / ⊥ are drawn — no English or Assamese words.

Run:  python scripts/gen_lines_angles_ix_ss_figs.py --out <dir>
"""
import argparse
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_circles_ix_ex1023 import (  # noqa: E402
    INK, ACC, LBL, LW, FS, new_ax, line, dot, label, angle_arc,
    right_angle, save,
)

P = np.array
TOL = 1e-9


# ── small geometry helpers ─────────────────────────────────────────────────
def ang(v):
    """Direction of vector v in degrees, 0..360."""
    return np.degrees(np.arctan2(v[1], v[0])) % 360.0


def interior(v, a, b):
    """Measure of angle a-v-b in degrees (the one <= 180)."""
    d = abs(ang(a - v) - ang(b - v)) % 360.0
    return min(d, 360.0 - d)


def close(a, b, tol=1e-7):
    return abs(a - b) < tol


def pol(a_deg, r=1.0, c=(0.0, 0.0)):
    t = np.radians(a_deg)
    return P([c[0] + r * np.cos(t), c[1] + r * np.sin(t)])


def collinear(a, b, c):
    """Signed area x2 — zero iff a, b, c lie on one line."""
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


def meet(p1, d1, p2, d2):
    """Intersection of line p1+t*d1 with p2+s*d2."""
    A = np.array([[d1[0], -d2[0]], [d1[1], -d2[1]]], dtype=float)
    b = np.array([p2[0] - p1[0], p2[1] - p1[1]], dtype=float)
    t, _ = np.linalg.solve(A, b)
    return p1 + t * d1


def arrow_line(ax, p, q, both=True, color=INK, lw=LW):
    """Draw segment p-q with arrow heads showing the line continues."""
    d = (q - p) / np.linalg.norm(q - p)
    ax.annotate("", xy=tuple(q), xytext=tuple(p),
                arrowprops=dict(arrowstyle="-|>" if not both else "<|-|>",
                                color=color, lw=lw, shrinkA=0, shrinkB=0,
                                mutation_scale=16))
    return d


def seg(ax, p, q, **kw):
    line(ax, p, q, **kw)


def bisector_dir(v, a, b):
    """Direction (deg) of the internal bisector of angle a-v-b — i.e. the ray
    lying strictly inside the (<= 180°) opening. Naively averaging the two ray
    directions lands on the *external* bisector whenever the opening straddles
    0°/360°, which silently threw eight labels outside their own arc."""
    a0, a1 = ang(a - v), ang(b - v)
    d = (a1 - a0) % 360.0
    if d > 180.0:
        a0, d = a1, 360.0 - d
    return (a0 + d / 2.0) % 360.0


def alab(ax, v, a, b, text, r=0.42, fs=13, color=ACC):
    """Text placed on the internal bisector of angle a-v-b, at radius r."""
    m = bisector_dir(v, a, b)
    # the label must sit inside its own arc: the direction we picked has to be
    # at most half the opening away from each arm.
    half = interior(v, a, b) / 2.0
    for arm in (a, b):
        got = abs(((ang(arm - v) - m + 180.0) % 360.0) - 180.0)
        assert abs(got - half) < 1e-6, (text, got, half)
    p = pol(m, r, v)
    ax.text(p[0], p[1], text, fontsize=fs, color=color, ha="center",
            va="center", fontweight="bold", zorder=7)


def tickmark(ax, p, q, n=1, size=0.09, color=ACC):
    m = (p + q) / 2.0
    d = (q - p) / np.linalg.norm(q - p)
    nr = P([-d[1], d[0]])
    for i in range(n):
        b = m + d * ((i - (n - 1) / 2.0) * 0.10)
        ax.plot([b[0] - nr[0] * size, b[0] + nr[0] * size],
                [b[1] - nr[1] * size, b[1] + nr[1] * size], color=color, lw=1.9)


def par_chevron(ax, p, q, n=1, size=0.10, color=ACC):
    """n chevrons (>) on segment p-q marking parallel lines."""
    m = (p + q) / 2.0
    d = (q - p) / np.linalg.norm(q - p)
    nr = P([-d[1], d[0]])
    for i in range(n):
        b = m + d * (i * 0.16 - (n - 1) * 0.08)
        ax.plot([b[0] - d[0] * size + nr[0] * size, b[0], b[0] - d[0] * size - nr[0] * size],
                [b[1] - d[1] * size + nr[1] * size, b[1], b[1] - d[1] * size - nr[1] * size],
                color=color, lw=1.9, solid_capstyle="round")


# ── Q1 — right-angled isosceles triangle, ∠A = 90°, AB = AC ────────────────
def fig_q01(out):
    A, B, C = P([0.0, 0.0]), P([2.4, 0.0]), P([0.0, 2.4])
    assert close(interior(A, B, C), 90.0), interior(A, B, C)
    assert close(np.linalg.norm(B - A), np.linalg.norm(C - A))
    assert close(interior(B, A, C), 45.0) and close(interior(C, A, B), 45.0)
    assert close(interior(A, B, C) + interior(B, A, C) + interior(C, A, B), 180.0)

    fig, ax = new_ax((-0.75, 3.15), (-0.75, 3.15), figsize=(4.4, 4.4))
    for p, q in ((A, B), (B, C), (C, A)):
        seg(ax, p, q)
    right_angle(ax, A, B, C, size=0.26)
    tickmark(ax, A, B, 1)
    tickmark(ax, A, C, 1)
    angle_arc(ax, B, A, C, r=0.52)
    angle_arc(ax, C, A, B, r=0.52)
    for p, t, d in ((A, "A", (-0.24, -0.20)), (B, "B", (0.24, -0.20)), (C, "C", (-0.24, 0.22))):
        dot(ax, p)
        label(ax, p, t, *d)
    save(fig, out, "ss-mcq-q01-right-isosceles-v2.png")


# ── Q3 — four points, no three collinear, all six joining lines ────────────
def fig_q03(out):
    A, B, C, D = P([0.0, 0.0]), P([2.9, 0.35]), P([2.15, 2.55]), P([0.45, 1.95])
    pts = [A, B, C, D]
    pairs = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)]
    assert len(pairs) == 6
    for i in range(4):
        for j in range(i + 1, 4):
            for k in range(j + 1, 4):
                assert abs(collinear(pts[i], pts[j], pts[k])) > 0.3, (i, j, k)

    fig, ax = new_ax((-0.75, 3.7), (-0.75, 3.35), figsize=(4.6, 4.3))
    for i, j in pairs:
        seg(ax, pts[i], pts[j])
    for p, t, d in ((A, "A", (-0.26, -0.22)), (B, "B", (0.28, -0.20)),
                    (C, "C", (0.28, 0.22)), (D, "D", (-0.28, 0.22))):
        dot(ax, p)
        label(ax, p, t, *d)
    save(fig, out, "ss-mcq-q03-four-points-six-lines-v2.png")


# ── Q6 / Q22 — two intersecting lines, the four angles 1..4 ────────────────
def fig_q06(out):
    O = P([0.0, 0.0])
    A, Bp = pol(0.0, 2.1, O), pol(180.0, 2.1, O)     # line AB
    Cp, Dp = pol(55.0, 2.1, O), pol(235.0, 2.1, O)   # line CD
    a1 = interior(O, A, Cp)      # ∠1  AOC
    a2 = interior(O, Cp, Bp)     # ∠2  COB
    a3 = interior(O, Bp, Dp)     # ∠3  BOD
    a4 = interior(O, Dp, A)      # ∠4  DOA
    assert close(a1, 55.0) and close(a3, 55.0)
    assert close(a2, 125.0) and close(a4, 125.0)
    assert close(a1, a3) and close(a2, a4)              # vertically opposite
    assert close(a1 + a2 + a3 + a4, 360.0)
    assert close(a1 + a2, 180.0)                        # linear pair

    fig, ax = new_ax((-2.85, 2.85), (-2.35, 2.35), figsize=(5.0, 4.2))
    seg(ax, Bp, A)
    seg(ax, Dp, Cp)
    angle_arc(ax, O, A, Cp, r=0.55)
    angle_arc(ax, O, Cp, Bp, r=0.72)
    angle_arc(ax, O, Bp, Dp, r=0.55)
    angle_arc(ax, O, Dp, A, r=0.72)
    alab(ax, O, A, Cp, "1", r=0.88)
    alab(ax, O, Cp, Bp, "2", r=1.05)
    alab(ax, O, Bp, Dp, "3", r=0.95)
    alab(ax, O, Dp, A, "4", r=1.22)
    dot(ax, O)
    label(ax, O, "O", 0.02, -0.34)
    label(ax, A, "A", 0.26, -0.04)
    label(ax, Bp, "B", -0.26, 0.04)
    label(ax, Cp, "C", 0.16, 0.22)
    label(ax, Dp, "D", -0.16, -0.22)
    save(fig, out, "ss-mcq-q06-vertically-opposite-v2.png")


# ── Q7 — transversal on two parallel lines, a corresponding pair ───────────
def fig_q07(out):
    yl, ym = 0.0, 1.85
    d_t = pol(66.0)                      # transversal direction
    Tp = P([0.35, -0.85])
    B = meet(Tp, d_t, P([0.0, yl]), P([1.0, 0.0]))
    C = meet(Tp, d_t, P([0.0, ym]), P([1.0, 0.0]))
    assert close(B[1], yl) and close(C[1], ym)
    Lp, Lq = P([-1.9, yl]), P([2.9, yl])
    Mp, Mq = P([-1.9, ym]), P([2.9, ym])
    # corresponding pair: ∠(Lq-B-C) at the lower line and ∠(Mq-C-up) at the upper
    up = C + (C - B) / np.linalg.norm(C - B) * 1.2
    a_low = interior(B, Lq, C)
    a_up = interior(C, Mq, up)
    assert close(a_low, 66.0), a_low
    assert close(a_up, 66.0), a_up
    assert close(a_low, a_up)                                # corresponding
    # co-interior check: ∠(Lq,B,C) + ∠(Mq,C,B) = 180
    assert close(interior(B, Lq, C) + interior(C, Mq, B), 180.0)

    fig, ax = new_ax((-2.5, 3.6), (-1.5, 3.5), figsize=(5.4, 4.6))
    seg(ax, Lp, Lq)
    seg(ax, Mp, Mq)
    seg(ax, Tp, up)
    par_chevron(ax, P([-1.4, yl]), P([-0.4, yl]), 1)
    par_chevron(ax, P([-1.4, ym]), P([-0.4, ym]), 1)
    angle_arc(ax, B, Lq, C, r=0.45)
    angle_arc(ax, C, Mq, up, r=0.45)
    alab(ax, B, Lq, C, "x", r=0.72)
    alab(ax, C, Mq, up, "y", r=0.72)
    dot(ax, B)
    dot(ax, C)
    label(ax, B, "B", -0.16, -0.26)
    label(ax, C, "C", -0.16, -0.26)
    label(ax, Lq, "l", 0.26, 0.0)
    label(ax, Mq, "m", 0.28, 0.0)
    label(ax, up, "t", 0.10, 0.24)
    save(fig, out, "ss-mcq-q07-corresponding-angles-v2.png")


# ── Q8 — isosceles ABC (AB = AC), base-angle bisectors meeting at O ────────
def fig_q08(out):
    B, C = P([0.0, 0.0]), P([3.2, 0.0])
    apex_h = 1.6 * np.tan(np.radians(50.0))
    A = P([1.6, apex_h])
    assert close(interior(B, A, C), 50.0), interior(B, A, C)
    assert close(interior(C, A, B), 50.0)
    assert close(interior(A, B, C), 80.0), interior(A, B, C)
    assert close(np.linalg.norm(A - B), np.linalg.norm(A - C))

    O = meet(B, pol(25.0), C, pol(180.0 - 25.0))
    assert close(interior(B, C, O), 25.0)          # BO bisects ∠B (50/2)
    assert close(interior(C, B, O), 25.0)          # CO bisects ∠C
    assert close(interior(O, B, C), 130.0), interior(O, B, C)
    assert close(interior(O, B, C) + 25.0 + 25.0, 180.0)

    fig, ax = new_ax((-0.8, 4.05), (-0.85, 2.9), figsize=(5.0, 4.2))
    for p, q in ((A, B), (B, C), (C, A)):
        seg(ax, p, q)
    seg(ax, B, O, color=ACC, lw=1.7)
    seg(ax, C, O, color=ACC, lw=1.7)
    tickmark(ax, A, B, 1)
    tickmark(ax, A, C, 1)
    angle_arc(ax, B, O, C, r=0.40)
    angle_arc(ax, B, A, O, r=0.52)
    angle_arc(ax, C, O, B, r=0.40)
    angle_arc(ax, C, A, O, r=0.52)
    alab(ax, B, O, C, "25°", r=0.66, fs=11)
    alab(ax, B, A, O, "25°", r=0.80, fs=11)
    alab(ax, C, O, B, "25°", r=0.66, fs=11)
    alab(ax, C, A, O, "25°", r=0.80, fs=11)
    for p, t, d in ((A, "A", (0.0, 0.28)), (B, "B", (-0.26, -0.22)),
                    (C, "C", (0.26, -0.22)), (O, "O", (0.0, 0.30))):
        dot(ax, p)
        label(ax, p, t, *d)
    save(fig, out, "ss-mcq-q08-base-bisectors-v2.png")


# ── Q9 — triangle whose angles are in the ratio 2 : 3 : 4 ──────────────────
def fig_q09(out):
    # angles 40°, 60°, 80° at A, B, C respectively
    B = P([0.0, 0.0])
    C = P([2.15, 0.0])
    A = meet(B, pol(60.0), C, pol(180.0 - 80.0))
    a_A, a_B, a_C = interior(A, B, C), interior(B, A, C), interior(C, A, B)
    assert close(a_B, 60.0), a_B
    assert close(a_C, 80.0), a_C
    assert close(a_A, 40.0), a_A
    assert close(a_A + a_B + a_C, 180.0)
    assert close(a_A / 20.0, 2.0) and close(a_B / 20.0, 3.0) and close(a_C / 20.0, 4.0)

    xlim, ylim = (-0.85, 3.0), (-0.9, 3.5)
    # the apex must actually fit inside the frame (it silently clipped once)
    assert xlim[0] + 0.3 < A[0] < xlim[1] - 0.3, A
    assert ylim[0] + 0.3 < A[1] < ylim[1] - 0.45, A
    fig, ax = new_ax(xlim, ylim, figsize=(4.5, 4.4))
    for p, q in ((A, B), (B, C), (C, A)):
        seg(ax, p, q)
    angle_arc(ax, A, B, C, r=0.45)
    angle_arc(ax, B, A, C, r=0.45)
    angle_arc(ax, C, A, B, r=0.45)
    alab(ax, A, B, C, "40°", r=0.78, fs=12)
    alab(ax, B, A, C, "60°", r=0.78, fs=12)
    alab(ax, C, A, B, "80°", r=0.78, fs=12)
    for p, t, d in ((A, "A", (0.0, 0.30)), (B, "B", (-0.28, -0.22)), (C, "C", (0.28, -0.22))):
        dot(ax, p)
        label(ax, p, t, *d)
    save(fig, out, "ss-mcq-q09-ratio-triangle-v2.png")


# ── Q11 / Q14 — two parallel lines never meet ──────────────────────────────
def fig_q11(out):
    y1, y2 = 0.0, 1.5
    Ap, Aq = P([-2.6, y1]), P([2.6, y1])
    Bp, Bq = P([-2.6, y2]), P([2.6, y2])
    d1 = (Aq - Ap) / np.linalg.norm(Aq - Ap)
    d2 = (Bq - Bp) / np.linalg.norm(Bq - Bp)
    assert close(abs(d1 @ d2), 1.0)                 # same direction => parallel
    assert abs(collinear(Ap, Aq, Bp)) > 1e-3        # distinct lines
    assert close(abs(Bp[1] - Ap[1]), 1.5)           # constant gap
    assert close(abs(Bq[1] - Aq[1]), 1.5)

    fig, ax = new_ax((-3.4, 3.4), (-1.0, 2.6), figsize=(5.4, 3.2))
    arrow_line(ax, Ap, Aq)
    arrow_line(ax, Bp, Bq)
    par_chevron(ax, P([-0.5, y1]), P([0.5, y1]), 1)
    par_chevron(ax, P([-0.5, y2]), P([0.5, y2]), 1)
    label(ax, Aq, "l", 0.34, 0.0)
    label(ax, Bq, "m", 0.36, 0.0)
    save(fig, out, "ss-mcq-q11-parallel-no-common-v2.png")


# ── Q12 — bisectors of two adjacent supplementary angles ───────────────────
def fig_q12(out):
    O = P([0.0, 0.0])
    X, Y = pol(180.0, 2.3, O), pol(0.0, 2.3, O)
    Z = pol(70.0, 2.0, O)
    Pp = pol(35.0, 1.6, O)          # bisector of ∠YOZ  (0°..70°)
    Q = pol(125.0, 1.6, O)          # bisector of ∠ZOX  (70°..180°)
    assert close(interior(O, Y, Z) + interior(O, Z, X), 180.0)
    assert close(interior(O, Y, Pp), interior(O, Pp, Z))     # OP bisects ∠YOZ
    assert close(interior(O, Z, Q), interior(O, Q, X))       # OQ bisects ∠ZOX
    assert close(interior(O, Pp, Q), 90.0), interior(O, Pp, Q)

    fig, ax = new_ax((-3.0, 3.0), (-1.1, 2.75), figsize=(5.2, 3.7))
    seg(ax, X, Y)
    seg(ax, O, Z)
    seg(ax, O, Pp, color=ACC, lw=1.7)
    seg(ax, O, Q, color=ACC, lw=1.7)
    right_angle(ax, O, Pp, Q, size=0.34)
    angle_arc(ax, O, Y, Pp, r=0.62)
    angle_arc(ax, O, Pp, Z, r=0.62)
    angle_arc(ax, O, Z, Q, r=0.86)
    angle_arc(ax, O, Q, X, r=0.86)
    alab(ax, O, Pp, Q, "90°", r=1.18, fs=12)
    dot(ax, O)
    label(ax, O, "O", -0.06, -0.30)
    label(ax, X, "X", -0.26, -0.02)
    label(ax, Y, "Y", 0.26, -0.02)
    label(ax, Z, "Z", 0.10, 0.28)
    label(ax, Pp, "P", 0.26, 0.14)
    label(ax, Q, "Q", -0.24, 0.18)
    save(fig, out, "ss-mcq-q12-adjacent-bisectors-v2.png")


# ── Q15 — exterior angle of a triangle ─────────────────────────────────────
def fig_q15(out):
    B, C = P([0.0, 0.0]), P([3.0, 0.0])
    A = P([0.95, 2.15])
    D = C + (C - B) / np.linalg.norm(C - B) * 1.30
    assert close(collinear(B, C, D), 0.0)                    # D on BC produced
    ext = interior(C, A, D)
    assert close(ext, interior(A, B, C) + interior(B, A, C)), (ext, interior(A, B, C), interior(B, A, C))
    assert close(ext + interior(C, A, B), 180.0)             # linear pair at C

    fig, ax = new_ax((-0.85, 4.85), (-0.95, 2.95), figsize=(5.6, 3.9))
    for p, q in ((A, B), (B, C), (C, A)):
        seg(ax, p, q)
    arrow_line(ax, C, D, both=False)
    angle_arc(ax, A, B, C, r=0.42)
    angle_arc(ax, B, A, C, r=0.42)
    angle_arc(ax, C, A, D, r=0.42)
    alab(ax, A, B, C, "1", r=0.68)
    alab(ax, B, A, C, "2", r=0.68)
    alab(ax, C, A, D, "3", r=0.70)
    for p, t, d in ((A, "A", (0.0, 0.28)), (B, "B", (-0.28, -0.22)),
                    (C, "C", (-0.10, -0.30)), (D, "D", (0.24, -0.22))):
        dot(ax, p)
        label(ax, p, t, *d)
    save(fig, out, "ss-mcq-q15-exterior-angle-v2.png")


# ── Q16 — two lines perpendicular to the same line l ───────────────────────
def fig_q16(out):
    yl = 0.0
    Lp, Lq = P([-2.7, yl]), P([2.7, yl])
    x1, x2 = -1.25, 1.35
    Mp, Mq = P([x1, -0.85]), P([x1, 2.35])
    Np, Nq = P([x2, -0.85]), P([x2, 2.35])
    F1, F2 = P([x1, yl]), P([x2, yl])
    assert close(interior(F1, Lq, Mq), 90.0)
    assert close(interior(F2, Lq, Nq), 90.0)
    dm = (Mq - Mp) / np.linalg.norm(Mq - Mp)
    dn = (Nq - Np) / np.linalg.norm(Nq - Np)
    assert close(abs(dm @ dn), 1.0)                  # m ∥ n
    assert abs(x2 - x1) > 1e-6                       # and they are distinct

    fig, ax = new_ax((-3.4, 3.4), (-1.6, 3.1), figsize=(5.4, 3.9))
    arrow_line(ax, Lp, Lq)
    arrow_line(ax, Mp, Mq)
    arrow_line(ax, Np, Nq)
    right_angle(ax, F1, Lq, Mq, size=0.26)
    right_angle(ax, F2, Lq, Nq, size=0.26)
    par_chevron(ax, P([x1, 1.35]), P([x1, 1.95]), 1)
    par_chevron(ax, P([x2, 1.35]), P([x2, 1.95]), 1)
    dot(ax, F1)
    dot(ax, F2)
    label(ax, Lq, "l", 0.32, -0.02)
    label(ax, Mq, "m", -0.06, 0.30)
    label(ax, Nq, "n", -0.06, 0.30)
    save(fig, out, "ss-mcq-q16-perp-same-line-v2.png")


# ── Q17 — a linear pair a, b on a straight line ────────────────────────────
def fig_q17(out):
    O = P([0.0, 0.0])
    X, Y = pol(180.0, 2.5, O), pol(0.0, 2.5, O)
    Z = pol(72.0, 1.95, O)
    a = interior(O, Y, Z)
    b = interior(O, Z, X)
    assert close(a + b, 180.0), (a, b)
    assert close(collinear(X, O, Y), 0.0)

    fig, ax = new_ax((-3.1, 3.1), (-1.0, 2.6), figsize=(5.2, 3.3))
    seg(ax, X, Y)
    seg(ax, O, Z)
    angle_arc(ax, O, Y, Z, r=0.55)
    angle_arc(ax, O, Z, X, r=0.72)
    alab(ax, O, Y, Z, "a", r=0.86)
    alab(ax, O, Z, X, "b", r=1.02)
    dot(ax, O)
    label(ax, O, "O", 0.0, -0.30)
    label(ax, X, "X", -0.26, -0.02)
    label(ax, Y, "Y", 0.26, -0.02)
    label(ax, Z, "Z", 0.10, 0.28)
    save(fig, out, "ss-mcq-q17-linear-pair-v2.png")


# ── Q20 — X interior to ∠BAC; ∠BAC = 70°, ∠BAX = 42° ───────────────────────
def fig_q20(out):
    A = P([0.0, 0.0])
    B = pol(0.0, 2.7, A)
    C = pol(70.0, 2.7, A)
    X = pol(42.0, 2.15, A)
    assert close(interior(A, B, C), 70.0)
    assert close(interior(A, B, X), 42.0)
    assert close(interior(A, X, C), 28.0), interior(A, X, C)
    assert close(interior(A, B, X) + interior(A, X, C), interior(A, B, C))

    fig, ax = new_ax((-0.85, 3.35), (-0.85, 3.15), figsize=(4.6, 4.1))
    arrow_line(ax, A, B, both=False)
    arrow_line(ax, A, C, both=False)
    arrow_line(ax, A, X, both=False, color=ACC)
    angle_arc(ax, A, B, X, r=0.62)
    angle_arc(ax, A, X, C, r=0.98)
    alab(ax, A, B, X, "42°", r=0.92, fs=12)
    alab(ax, A, X, C, "28°", r=1.30, fs=12)
    dot(ax, A)
    label(ax, A, "A", -0.26, -0.20)
    label(ax, B, "B", 0.24, -0.04)
    label(ax, C, "C", 0.08, 0.28)
    label(ax, X, "X", 0.26, 0.14)
    save(fig, out, "ss-mcq-q20-interior-ray-v2.png")


BUILDERS = [fig_q01, fig_q03, fig_q06, fig_q07, fig_q08, fig_q09,
            fig_q11, fig_q12, fig_q15, fig_q16, fig_q17, fig_q20]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    for b in BUILDERS:
        b(a.out)
        print("ok", b.__name__)
    print(f"{len(BUILDERS)} figures written to {a.out}")


if __name__ == "__main__":
    main()
