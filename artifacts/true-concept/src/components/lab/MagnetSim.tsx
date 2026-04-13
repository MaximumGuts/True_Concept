import { useRef, useEffect } from "react";

export default function MagnetSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f1729";
    ctx.fillRect(0, 0, W, H);

    // Draw magnetic field lines
    const numLines = 12;
    for (let i = 0; i < numLines; i++) {
      const t = (i / numLines) * Math.PI * 2;
      const startAngle = t;

      ctx.beginPath();
      // Parametric field line of a dipole
      const steps = 80;
      let first = true;
      for (let s = 0; s <= steps; s++) {
        const r = 60 + s * 1.5;
        const theta = startAngle;
        const x = cx + 70 * Math.cos(theta) + r * Math.cos(theta + (s / steps) * Math.PI * 0.8);
        const y = cy + r * Math.sin(theta + (s / steps) * Math.PI * 0.6);
        if (first) { ctx.moveTo(x, y); first = false; }
        else ctx.lineTo(x, y);
      }

      const alpha = 0.15 + 0.35 * Math.abs(Math.sin(t));
      ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Better field lines using actual dipole approximation
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f1729";
    ctx.fillRect(0, 0, W, H);

    const drawFieldLine = (startX: number, startY: number, color: string) => {
      const MX = cx;
      ctx.beginPath();
      let x = startX;
      let y = startY;
      ctx.moveTo(x, y);

      for (let step = 0; step < 200; step++) {
        const dx = x - cx;
        const dy = y - cy;
        const r2 = dx * dx + dy * dy;
        const r = Math.sqrt(r2);
        if (r < 40 || r > 280) break;

        // Dipole field: Bx, By proportional to dipole moment
        const mu = 50000;
        const Bx = mu * (3 * dx * dy) / Math.pow(r2, 2.5);
        const By = mu * (2 * dy * dy - dx * dx) / Math.pow(r2, 2.5);
        const Bmag = Math.sqrt(Bx * Bx + By * By);
        if (Bmag === 0) break;

        x += (Bx / Bmag) * 3;
        y += (By / Bmag) * 3;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const colors = ["#60a5fa", "#93c5fd", "#bfdbfe"];
    const startAngles = [0.3, 0.7, 1.1, 1.5, 1.9, 2.3, 2.7, 3.1, 3.5, 3.9, 4.3, 4.7, 5.1, 5.5, 5.9, 6.1];
    startAngles.forEach((a, i) => {
      const r = 80;
      drawFieldLine(cx + r * Math.cos(a), cy + r * Math.sin(a), colors[i % colors.length]);
    });

    // Bar magnet
    const mW = 100;
    const mH = 30;

    // N pole (left half - blue end actually, let's use convention)
    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(cx - mW / 2, cy - mH / 2, mW / 2, mH);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(cx, cy - mH / 2, mW / 2, mH);

    // Border
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - mW / 2, cy - mH / 2, mW, mH);

    // Dividing line
    ctx.beginPath();
    ctx.moveTo(cx, cy - mH / 2);
    ctx.lineTo(cx, cy + mH / 2);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 14px Inter";
    ctx.fillStyle = "#bfdbfe";
    ctx.fillText("S", cx - mW / 4 - 4, cy + 6);
    ctx.fillStyle = "#fca5a5";
    ctx.fillText("N", cx + mW / 4 - 4, cy + 6);

    ctx.font = "11px Inter";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Bar Magnet", cx - 35, cy + mH / 2 + 18);
    ctx.fillText("Field lines from N to S (outside)", cx - 90, cy - mH / 2 - 12);
  }, []);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={480} height={280} className="w-full rounded-xl bg-[#0f1729]" data-testid="canvas-simulation" />
      <p className="text-xs text-muted-foreground text-center">
        Magnetic field lines emerge from North pole and enter South pole. Lines are denser near poles (stronger field).
      </p>
    </div>
  );
}
