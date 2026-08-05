"""
Figures for the 22 MCQs of `Books/selfstudys_com_file (26).pdf` (Triangles,
Class IX, chapter math-ix-c07).

The source carries exactly ONE printed diagram — Q22's parallelogram with equal
diagonals.  Q6 and Q11 are configuration questions whose wording alone is hard
to hold in the head, so a diagram is drawn for them too; both are constructed
from the question's own hypothesis, never traced.

Every builder ends in `assert` statements proving the drawn configuration really
satisfies the stated data (equal sides genuinely equal to 1e-9, feet of
perpendiculars genuinely perpendicular, the bisector genuinely bisecting).  A
figure that merely "looks right" would teach a different theorem.

LANGUAGE-NEUTRAL ON PURPOSE: one PNG serves the English and the Assamese doc, so
only point letters and tick/right-angle marks are drawn — no words in either
language.

Run:  python scripts/gen_tri_ix_mcq_figs.py --out <dir>
"""
import argparse
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_circles_ix_ex1023 import (  # noqa: E402
    INK, ACC, LW, FS, new_ax, line, dot, label, tick, angle_arc, right_angle, save,
)

P = np.array


def ang(v):
    """Direction of vector v in degrees, 0..360."""
    return np.degrees(np.arctan2(v[1], v[0])) % 360.0


def interior(v, a, b):
    """Angle a-v-b in degrees (always the one <= 180)."""
    d = abs(ang(a - v) - ang(b - v)) % 360.0
    return min(d, 360.0 - d)


def close(a, b, tol=1e-9):
    return abs(a - b) < tol


def norm(v):
    return float(np.linalg.norm(v))


def foot(p, a, b):
    """Foot of the perpendicular from p onto line ab."""
    d = (b - a) / norm(b - a)
    return a + d * float(np.dot(p - a, d))


def on_segment(p, a, b, tol=1e-9):
    """p is collinear with a,b and strictly between them."""
    if abs(float(np.cross(b - a, p - a))) > tol:
        return False
    t = float(np.dot(p - a, b - a)) / float(np.dot(b - a, b - a))
    return 0.0 < t < 1.0


def poly(ax, pts, close_it=True):
    n = len(pts)
    for i in range(n if close_it else n - 1):
        line(ax, pts[i], pts[(i + 1) % n])


# ── Q6 — D on BC, AD bisects angle BAC; the answer is BA > BD ───────────────
def fig_q06(out):
    """D is placed by the internal-bisector theorem (BD : DC = AB : AC), so AD
    really is the bisector of angle A rather than an eyeballed cevian."""
    B, C = P([0.0, 0.0]), P([4.0, 0.0])
    A = P([1.10, 2.40])
    c, b = norm(A - B), norm(A - C)                 # c = AB, b = AC
    D = B + (C - B) * (c / (b + c))                 # BD : DC = AB : AC

    assert close(interior(A, B, D), interior(A, D, C), 1e-9), (
        interior(A, B, D), interior(A, D, C))       # AD bisects angle BAC
    assert on_segment(D, B, C, 1e-9)                # D really lies on BC
    assert norm(A - B) > norm(D - B) + 1e-9         # the answer: BA > BD
    # the triangle must be scalene, or "BD = CD" would accidentally look true too
    assert abs(c - b) > 0.5 and abs(norm(D - B) - norm(D - C)) > 0.5

    fig, ax = new_ax((-0.65, 4.65), (-0.70, 3.00), figsize=(5.4, 3.6))
    poly(ax, [A, B, C])
    line(ax, A, D)
    angle_arc(ax, A, B, D, r=0.46)
    angle_arc(ax, A, D, C, r=0.60)
    for p, s, dx, dy in ((A, "A", -0.04, 0.26), (B, "B", -0.24, -0.16),
                         (C, "C", 0.24, -0.16), (D, "D", 0.02, -0.26)):
        dot(ax, p, s=14)
        label(ax, p, s, dx, dy)
    save(fig, out, "tri-mcq-q06-angle-bisector-d-v2.png")


# ── Q11 — isosceles ABC (AB = AC) with altitudes BE and CF; BE = CF ─────────
def fig_q11(out):
    B, C = P([-1.50, 0.0]), P([1.50, 0.0])
    A = P([0.0, 3.00])
    E = foot(B, A, C)                               # BE perpendicular to AC
    F = foot(C, A, B)                               # CF perpendicular to AB

    assert close(norm(A - B), norm(A - C), 1e-12)           # given AB = AC
    assert close(norm(B - E), norm(C - F), 1e-12)           # the answer BE = CF
    assert close(float(np.dot(E - B, C - A)), 0.0, 1e-12)   # BE really perp AC
    assert close(float(np.dot(F - C, B - A)), 0.0, 1e-12)   # CF really perp AB
    assert on_segment(E, A, C, 1e-9) and on_segment(F, A, B, 1e-9)

    fig, ax = new_ax((-2.15, 2.15), (-0.65, 3.55), figsize=(4.6, 4.2))
    poly(ax, [A, B, C])
    line(ax, B, E)
    line(ax, C, F)
    right_angle(ax, E, B, C, size=0.16)
    right_angle(ax, F, C, B, size=0.16)
    tick(ax, A, B, n=1)
    tick(ax, A, C, n=1)
    for p, s, dx, dy in ((A, "A", 0.0, 0.26), (B, "B", -0.26, -0.14),
                         (C, "C", 0.26, -0.14), (E, "E", 0.26, 0.10),
                         (F, "F", -0.26, 0.10)):
        dot(ax, p, s=13)
        label(ax, p, s, dx, dy)
    save(fig, out, "tri-mcq-q11-isosceles-altitudes-v2.png")


# ── Q22 — parallelogram ABCD whose diagonals are equal ──────────────────────
def fig_q22(out):
    """A parallelogram with equal diagonals is forced to be a rectangle, so the
    drawn figure is a genuine rectangle — exactly what the source prints, with
    D top-left, C top-right, A bottom-left, B bottom-right."""
    w, h = 3.20, 2.10
    A, B = P([0.0, 0.0]), P([w, 0.0])
    C, D = P([w, h]), P([0.0, h])

    assert close(norm(B - A), norm(C - D), 1e-12)                    # AB = DC
    assert close(norm(D - A), norm(C - B), 1e-12)                    # AD = BC
    assert close(float(np.cross(B - A, C - D)), 0.0, 1e-12)          # AB parallel DC
    assert close(float(np.cross(D - A, C - B)), 0.0, 1e-12)          # AD parallel BC
    assert close(norm(C - A), norm(D - B), 1e-12)                    # equal diagonals
    # the three side pairs that make triangle ABD congruent to triangle ABC by SSS
    assert close(norm(B - A), norm(B - A), 1e-12)                    # AB common
    assert close(norm(D - A), norm(C - B), 1e-12)                    # AD = BC
    assert close(norm(D - B), norm(C - A), 1e-12)                    # BD = AC

    fig, ax = new_ax((-0.60, 3.80), (-0.60, 2.70), figsize=(5.0, 3.6))
    poly(ax, [A, B, C, D])
    line(ax, A, C)
    line(ax, B, D)
    for p, s, dx, dy in ((A, "A", -0.24, -0.18), (B, "B", 0.24, -0.18),
                         (C, "C", 0.24, 0.18), (D, "D", -0.24, 0.18)):
        dot(ax, p, s=14)
        label(ax, p, s, dx, dy)
    save(fig, out, "tri-mcq-q22-pgram-equal-diagonals-v2.png")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    for f in (fig_q06, fig_q11, fig_q22):
        f(a.out)
    print("all figures written to", a.out)
    void = (INK, ACC, LW, FS)      # imported palette constants, kept in one place
    assert void


if __name__ == "__main__":
    main()
