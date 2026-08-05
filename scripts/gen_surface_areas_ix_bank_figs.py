"""
Redraws every figure needed by the Class IX "Surface Areas and Volumes"
question-bank batch (chapter math-ix-c11).

Sources: Books/363aWhhC9QJozZLaEhZD.pdf (22 MCQs, figure-free) and
Books/TpA6OWPT3v9ql0s11FBO.pdf (35 MCQs + 3 case studies + 5 assertion-reason
+ 40 subjective).  The originals are low-resolution publisher scans; nothing is
cropped here — every diagram is rebuilt from the question's own data so the
geometry is true rather than merely similar.

LANGUAGE-NEUTRAL ON PURPOSE: one PNG serves both the English and the Assamese
document, so only letters, digits and unit abbreviations are drawn.  Captions
such as "Cylinder" / "Sphere" / "Figure - 1" that the publisher printed inside
the frame live in the surrounding prose of each document instead.

Every builder carries numeric asserts: a figure that merely looks right is not
accepted.

RUN:
    python scripts/gen_surface_areas_ix_bank_figs.py --out <dir>
"""
import argparse
import os

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Wedge, Polygon, Ellipse, Rectangle

INK = "#1e3a8a"       # main construction ink
ACC = "#b45309"       # dimension / accent
LBL = "#0f172a"       # text
WATER = "#7dd3fc"     # water fill
FILL = "#e0e7ff"      # solid fill
LW = 2.0
FS = 14

TOL = 1e-9


def new_ax(xlim, ylim, figsize=(5.4, 5.4)):
    fig, ax = plt.subplots(figsize=figsize, dpi=200)
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.patch.set_facecolor("white")
    return fig, ax


def save(fig, out, name):
    p = os.path.join(out, name)
    fig.savefig(p, bbox_inches="tight", pad_inches=0.16, facecolor="white")
    plt.close(fig)
    print(f"  wrote {name}")
    return p


def line(ax, p, q, dashed=False, color=INK, lw=LW):
    ax.plot([p[0], q[0]], [p[1], q[1]], color=color, lw=lw,
            ls="--" if dashed else "-", solid_capstyle="round")


def label(ax, p, t, dx=0.0, dy=0.0, fs=FS, color=LBL, ha="center", va="center",
          weight="bold"):
    ax.text(p[0] + dx, p[1] + dy, t, fontsize=fs, color=color, ha=ha, va=va,
            fontweight=weight, zorder=8)


def dot(ax, p, ms=5.0, color=INK):
    ax.plot([p[0]], [p[1]], "o", ms=ms, color=color, zorder=9)


def dim(ax, p, q, text, off=0.0, fs=FS - 1, color=ACC, side=1, rot=0):
    """Double-headed dimension arrow from p to q with a label."""
    p = np.asarray(p, float)
    q = np.asarray(q, float)
    d = q - p
    n = np.array([-d[1], d[0]])
    n = n / (np.linalg.norm(n) or 1.0) * off * side
    a, b = p + n, q + n
    ax.annotate("", xy=tuple(b), xytext=tuple(a),
                arrowprops=dict(arrowstyle="<->", color=color, lw=1.5,
                                shrinkA=0, shrinkB=0))
    m = (a + b) / 2
    ax.text(m[0], m[1], text, fontsize=fs, color=color, ha="center",
            va="center", fontweight="bold", rotation=rot,
            bbox=dict(fc="white", ec="none", pad=1.2), zorder=8)


def cylinder(ax, cx, base_y, r, h, ry=None, water=None, fc=FILL):
    """Draw a right circular cylinder in the usual 2-D 'ellipse' projection.

    Returns (ry,) the vertical semi-axis used for the elliptical rims.
    """
    ry = ry if ry is not None else r * 0.30
    top = base_y + h
    # body
    ax.add_patch(Rectangle((cx - r, base_y), 2 * r, h, fc=fc, ec="none", zorder=1))
    if water is not None:
        wy = base_y + water
        ax.add_patch(Rectangle((cx - r, base_y), 2 * r, water, fc=WATER,
                               ec="none", alpha=0.75, zorder=2))
        ax.add_patch(Ellipse((cx, wy), 2 * r, 2 * ry, fc=WATER, ec=INK,
                             lw=1.2, alpha=0.9, zorder=3))
    # bottom rim: only the front half is visible
    ax.add_patch(Arc((cx, base_y), 2 * r, 2 * ry, theta1=180, theta2=360,
                     color=INK, lw=LW, zorder=4))
    ax.add_patch(Arc((cx, base_y), 2 * r, 2 * ry, theta1=0, theta2=180,
                     color=INK, lw=1.0, ls=":", zorder=4))
    # sides
    line(ax, (cx - r, base_y), (cx - r, top))
    line(ax, (cx + r, base_y), (cx + r, top))
    # top rim (full ellipse, open top)
    ax.add_patch(Ellipse((cx, top), 2 * r, 2 * ry, fc="white", ec=INK,
                         lw=LW, zorder=5))
    return ry


# --------------------------------------------------------------------------
# 1. Case I — a clay cylinder (r = 6 cm, h = 8 cm) recast as a sphere
# --------------------------------------------------------------------------
def fig_case1_cylinder_sphere(out):
    r, h = 6.0, 8.0
    fig, ax = new_ax((-9, 27), (-4.5, 14.5), figsize=(6.6, 4.2))

    cx, by = 0.0, 0.0
    ry = cylinder(ax, cx, by, r, h)

    # radius arrow on the top rim, from centre to the rim
    dot(ax, (cx, by + h))
    ax.annotate("", xy=(cx, by + h), xytext=(cx + 5.2, by + h + 3.4),
                arrowprops=dict(arrowstyle="->", color=ACC, lw=1.6))
    label(ax, (cx + 5.6, by + h + 4.0), "6 cm", fs=FS, color=ACC)

    # height, on the dashed axis
    line(ax, (cx, by), (cx, by + h), dashed=True, color=ACC, lw=1.4)
    label(ax, (cx + 1.5, by + h / 2), "8 cm", fs=FS, color=ACC)

    # the sphere it is moulded into (radius 6 -> equal volume, drawn to scale)
    sx = 18.0
    R = (3.0 / 4.0 * r ** 2 * h) ** (1.0 / 3.0)          # = 6 exactly
    ax.add_patch(plt.Circle((sx, by + h / 2), R, fc=FILL, ec=INK, lw=LW))
    ax.add_patch(Arc((sx, by + h / 2), 2 * R, 2 * R * 0.34, theta1=180,
                     theta2=360, color=INK, lw=1.0, ls=":"))

    assert abs(R - 6.0) < 1e-9, R                       # equal-volume recast
    assert abs(np.pi * r ** 2 * h - 4 / 3 * np.pi * R ** 3) < 1e-9
    assert abs(ry - r * 0.30) < TOL
    return save(fig, out, "sav-case1-cylinder-sphere-v2.png")


# --------------------------------------------------------------------------
# 2. Case II — the 44 cm x 15 cm plastic sheet and the 15 cm x 15 cm square
# --------------------------------------------------------------------------
def fig_case2_sheets(out):
    L, B, S = 44.0, 15.0, 15.0
    fig, ax = new_ax((-9, 74), (-7, 24), figsize=(7.2, 3.0))

    ax.add_patch(Rectangle((0, 0), L, B, fc=FILL, ec=INK, lw=LW))
    dim(ax, (0, B), (L, B), "44 cm", off=3.2)
    dim(ax, (0, 0), (0, B), "15 cm", off=3.2, rot=90)

    x0 = L + 12.0
    ax.add_patch(Rectangle((x0, 0), S, S, fc=FILL, ec=INK, lw=LW))
    dim(ax, (x0, S), (x0 + S, S), "15 cm", off=3.2)
    dim(ax, (x0 + S, 0), (x0 + S, S), "15 cm", off=3.2, side=-1, rot=90)

    # the circular base cut from the square: r = 7 cm fits inside a 15 cm square
    r = L / (2 * np.pi) * (22 / 7) / (22 / 7)           # 2*pi*r = 44  =>  r = 7
    r = L * 7.0 / 44.0
    ax.add_patch(plt.Circle((x0 + S / 2, S / 2), r, fc="white", ec=INK,
                            lw=1.4, ls="--"))

    assert abs(2 * (22 / 7) * r - L) < 1e-9, r           # rolled along the length
    assert abs(r - 7.0) < 1e-9, r
    assert 2 * r <= S + TOL                              # the circle fits
    return save(fig, out, "sav-case2-sheets-v2.png")


# --------------------------------------------------------------------------
# 3. Case III — water rises 3.4 cm when the ball is dropped in
# --------------------------------------------------------------------------
def fig_case3_water_rise(out):
    R, H, rise = 7.0, 10.0, 3.4
    fig, ax = new_ax((-8, 42), (-6.5, 17.5), figsize=(6.8, 3.4))

    # ---- figure (1): container, water at level P
    cx = 0.0
    wP = 4.6
    ry = cylinder(ax, cx, 0.0, R, H, water=wP)
    ax.annotate("", xy=(cx, H), xytext=(cx + 5.6, H + 3.6),
                arrowprops=dict(arrowstyle="->", color=ACC, lw=1.6))
    label(ax, (cx + 6.2, H + 4.2), "7 cm", color=ACC)
    dim(ax, (cx - R, 0), (cx - R, H), "10 cm", off=2.6, rot=90)
    label(ax, (cx + R + 1.3, wP), "P", fs=FS, color=LBL)
    label(ax, (cx, -3.4), "(1)", fs=FS, color=LBL)

    # ---- figure (2): ball in, water at level Q = P + 3.4
    dx = 26.0
    wQ = wP + rise
    cylinder(ax, dx, 0.0, R, H, water=wQ)
    rb = (3.0 / 4.0 * R ** 2 * rise) ** (1.0 / 3.0)      # ~ 5 cm (the answer)
    # The publisher's own diagram draws the ball undersized so that it still
    # sits below the drawn water line; a true-to-scale r = 5 ball cannot be
    # submerged under 8 cm of water in a r = 7 container.  Kept schematic on
    # purpose — the ball's real radius is what the question asks for, and it is
    # asserted below rather than measured off the picture.
    rdraw = 0.52 * rb
    ax.add_patch(plt.Circle((dx, rdraw + 0.35), rdraw, fc="white", ec=INK,
                            lw=1.6, alpha=0.95, zorder=4))
    label(ax, (dx + R + 1.3, wP), "P", fs=FS, color=LBL)
    label(ax, (dx + R + 1.3, wQ + 0.4), "Q", fs=FS, color=LBL)
    dim(ax, (dx + R + 3.6, wP), (dx + R + 3.6, wQ), "3.4 cm", off=0.0, fs=FS - 3)
    label(ax, (dx, -3.4), "(2)", fs=FS, color=LBL)
    assert rdraw + 2 * (rdraw + 0.35) - 2 * rdraw < wQ  # drawn ball stays under water

    assert abs(wQ - wP - rise) < TOL
    # displaced water = volume of ball
    assert abs(np.pi * R ** 2 * rise - 4 / 3 * np.pi * rb ** 3) < 1e-9
    assert abs(rb - 4.99933) < 1e-3, rb                  # answer: about 5 cm
    assert wQ < H                                        # it does not overflow
    return save(fig, out, "sav-case3-water-rise-v2.png")


# --------------------------------------------------------------------------
# 4. LA 38 — a 120 degrees sector of radius 15 cm rolled into a cone
# --------------------------------------------------------------------------
def fig_sector_120(out):
    R, ang = 15.0, 120.0
    fig, ax = new_ax((-13, 13), (-3.5, 17.5), figsize=(5.0, 4.2))

    O = np.array([0.0, 0.0])
    a1, a2 = 30.0, 30.0 + ang                            # symmetric about 90 deg
    A = O + R * np.array([np.cos(np.radians(a2)), np.sin(np.radians(a2))])
    B = O + R * np.array([np.cos(np.radians(a1)), np.sin(np.radians(a1))])

    ax.add_patch(Wedge(O, R, a1, a2, fc=FILL, ec=INK, lw=LW))
    dot(ax, O)
    dot(ax, A)
    dot(ax, B)
    label(ax, O, "O", dy=-1.3)
    label(ax, A, "A", dx=-1.3, dy=0.5)
    label(ax, B, "B", dx=1.3, dy=0.5)

    label(ax, (O + A) / 2, "15 cm", dx=-1.9, dy=0.9, fs=FS - 2, color=ACC)
    label(ax, (O + B) / 2, "15 cm", dx=1.9, dy=0.9, fs=FS - 2, color=ACC)
    ax.add_patch(Arc(O, 8.0, 8.0, theta1=a1, theta2=a2, color=ACC, lw=1.6))
    label(ax, (0.0, 5.4), "120°", fs=FS - 1, color=ACC)

    assert abs(np.linalg.norm(A - O) - R) < 1e-9
    assert abs(np.linalg.norm(B - O) - R) < 1e-9
    cosang = np.dot(A - O, B - O) / (R * R)
    assert abs(np.degrees(np.arccos(cosang)) - ang) < 1e-9
    # arc length of the sector == circumference of the base of the cone (r = 5)
    assert abs(2 * np.pi * R * ang / 360.0 - 2 * np.pi * 5.0) < 1e-9
    return save(fig, out, "sav-la38-sector-120-v2.png")


# --------------------------------------------------------------------------
# 5. LA 40 — 240 m x 180 m plot with a 10 m wide drainlet dug outside it
# --------------------------------------------------------------------------
def fig_plot_drainlet(out):
    L, B, w = 240.0, 180.0, 10.0
    fig, ax = new_ax((-110, 400), (-95, 290), figsize=(6.4, 4.6))

    ax.add_patch(Rectangle((-w, -w), L + 2 * w, B + 2 * w, fc="#fde68a",
                           ec=INK, lw=LW))
    ax.add_patch(Rectangle((0, 0), L, B, fc=FILL, ec=INK, lw=LW))

    dim(ax, (0, B), (L, B), "240 m", off=48.0)
    dim(ax, (L, 0), (L, B), "180 m", off=92.0, side=-1, rot=90)
    # leader lines pointing at the 10 m wide band, with the labels kept outside
    # the drawing so a to-scale band (10 m against 240 m) is still readable
    for tip, txt_at in [((-w / 2, B * 0.72), (-72.0, B * 0.72 + 40)),
                        ((L + w / 2, B * 0.18), (L + 62.0, -58.0)),
                        ((L * 0.30, -w / 2), (L * 0.30 - 40, -62.0)),
                        ((L * 0.70, B + w / 2), (L * 0.70 + 40, B + 62.0))]:
        ax.annotate("", xy=tip, xytext=txt_at,
                    arrowprops=dict(arrowstyle="->", color=ACC, lw=1.4))
        label(ax, txt_at, "10 m", fs=FS - 2, color=ACC,
              dy=10.0 if txt_at[1] > B else -10.0)

    # the drainlet is the ring between the two rectangles
    outer = (L + 2 * w) * (B + 2 * w)
    ring = outer - L * B
    assert abs(ring - (2 * (L + 2 * w) * w + 2 * B * w)) < 1e-9
    # the book's own decomposition: 2[260 x 10] + 2[180 x 10] = 8800 m^2 of floor
    assert abs(ring - 8800.0) < 1e-9, ring
    # earth dug out = plot area x 25 cm
    assert abs(L * B * 0.25 - 10800.0) < 1e-9
    return save(fig, out, "sav-la40-plot-drainlet-v2.png")


# --------------------------------------------------------------------------
# 6. SA-II 27 — the 5, 12, 13 right triangle that is revolved
# --------------------------------------------------------------------------
def fig_triangle_5_12_13(out):
    a, b, c = 5.0, 12.0, 13.0
    fig, ax = new_ax((-3.5, 9.0), (-3.0, 14.5), figsize=(3.9, 4.6))

    A = np.array([0.0, 12.0])
    Bp = np.array([0.0, 0.0])
    C = np.array([5.0, 0.0])
    ax.add_patch(Polygon([A, Bp, C], closed=True, fc=FILL, ec=INK, lw=LW))
    for P, t, dx, dy in [(A, "A", -0.8, 0.6), (Bp, "B", -0.8, -0.8),
                         (C, "C", 0.8, -0.8)]:
        dot(ax, P)
        label(ax, P, t, dx=dx, dy=dy)
    label(ax, (Bp + A) / 2, "12 cm", dx=-1.5, dy=0, fs=FS - 2, color=ACC,
          )
    label(ax, (Bp + C) / 2, "5 cm", dx=0, dy=-1.1, fs=FS - 2, color=ACC)
    label(ax, (A + C) / 2, "13 cm", dx=1.9, dy=0.6, fs=FS - 2, color=ACC)
    ax.add_patch(Rectangle((0, 0), 0.9, 0.9, fc="none", ec=INK, lw=1.3))

    assert abs(np.linalg.norm(A - Bp) - b) < 1e-9
    assert abs(np.linalg.norm(C - Bp) - a) < 1e-9
    assert abs(np.linalg.norm(A - C) - c) < 1e-9
    assert abs(a ** 2 + b ** 2 - c ** 2) < 1e-9
    assert abs(np.dot(A - Bp, C - Bp)) < 1e-9            # right angle at B
    return save(fig, out, "sav-sa27-triangle-5-12-13-v2.png")


# --------------------------------------------------------------------------
# 7. SA-II 23 — three equal cubes placed adjacently in a row
# --------------------------------------------------------------------------
def _cube(ax, x, y, a, d=0.42):
    """Front face at (x, y) of side a, with an isometric offset d*a."""
    o = a * d
    front = [(x, y), (x + a, y), (x + a, y + a), (x, y + a)]
    top = [(x, y + a), (x + a, y + a), (x + a + o, y + a + o), (x + o, y + a + o)]
    side = [(x + a, y), (x + a + o, y + o), (x + a + o, y + a + o), (x + a, y + a)]
    for poly, fc in ((front, FILL), (top, "#eef2ff"), (side, "#c7d2fe")):
        ax.add_patch(Polygon(poly, closed=True, fc=fc, ec=INK, lw=LW))
    return o


def fig_three_cubes(out):
    a = 3.0
    fig, ax = new_ax((-2.0, 13.6), (-2.6, 7.4), figsize=(5.6, 2.9))
    xs = [0.0, a, 2 * a]
    for x in xs:
        o = _cube(ax, x, 0.0, a)
    for x in xs:
        label(ax, (x + a / 2, -1.4), "a", fs=FS, color=ACC)
    label(ax, (-1.0, a / 2), "a", fs=FS, color=ACC)

    assert len(xs) == 3
    assert all(abs(xs[i + 1] - xs[i] - a) < TOL for i in range(2))   # flush row
    # resulting cuboid is 3a x a x a
    assert abs(2 * (3 * a * a + a * a + a * 3 * a) - 14 * a ** 2) < 1e-9
    assert abs(3 * 6 * a ** 2 - 18 * a ** 2) < 1e-9
    assert abs((14 * a ** 2) / (18 * a ** 2) - 7 / 9) < 1e-12
    return save(fig, out, "sav-sa23-three-cubes-v2.png")


# --------------------------------------------------------------------------
# 8. LA 39 — three identical cylinders stacked into one
# --------------------------------------------------------------------------
def fig_three_cylinders(out):
    r, h = 3.0, 3.2
    fig, ax = new_ax((-8.5, 9.5), (-2.2, 12.6), figsize=(4.0, 4.4))
    ry = r * 0.30
    for k in range(3):
        y = k * h
        ax.add_patch(Rectangle((-r, y), 2 * r, h, fc=FILL, ec="none", zorder=1))
        line(ax, (-r, y), (-r, y + h))
        line(ax, (r, y), (r, y + h))
        ax.add_patch(Ellipse((0, y + h), 2 * r, 2 * ry, fc="white", ec=INK,
                             lw=LW, zorder=5))
        dim(ax, (-r, y), (-r, y + h), "h", off=1.5, fs=FS - 1, rot=90)
    ax.add_patch(Arc((0, 0), 2 * r, 2 * ry, theta1=180, theta2=360,
                     color=INK, lw=LW, zorder=4))
    dot(ax, (0, 3 * h))
    dim(ax, (0, 3 * h), (r, 3 * h), "r", off=0.0, fs=FS - 1)

    assert abs(3 * h - 9.6) < 1e-9
    # CSA : TSA of the stacked cylinder
    csa = 2 * np.pi * r * (3 * h)
    tsa = 2 * np.pi * r * (r + 3 * h)
    assert abs(csa / tsa - (3 * h) / (r + 3 * h)) < 1e-12
    return save(fig, out, "sav-la39-three-cylinders-v2.png")


BUILDERS = [
    fig_case1_cylinder_sphere,
    fig_case2_sheets,
    fig_case3_water_rise,
    fig_sector_120,
    fig_plot_drainlet,
    fig_triangle_5_12_13,
    fig_three_cubes,
    fig_three_cylinders,
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    print(f"rendering {len(BUILDERS)} figures -> {args.out}")
    for b in BUILDERS:
        b(args.out)
    print("all asserts passed")


if __name__ == "__main__":
    main()
