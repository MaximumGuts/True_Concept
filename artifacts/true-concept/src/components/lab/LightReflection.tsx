import { useRef, useEffect, useState } from "react";

export default function LightReflectionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const mx = W / 2;
    const my = H * 0.55;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#0f1729";
    ctx.fillRect(0, 0, W, H);

    // Mirror
    const gradient = ctx.createLinearGradient(50, my, W - 50, my);
    gradient.addColorStop(0, "#334155");
    gradient.addColorStop(0.5, "#94a3b8");
    gradient.addColorStop(1, "#334155");
    ctx.beginPath();
    ctx.moveTo(50, my);
    ctx.lineTo(W - 50, my);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Normal line (dashed)
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(mx, my - 120);
    ctx.lineTo(mx, my + 80);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle in radians
    const rad = (angle * Math.PI) / 180;

    // Incident ray (from top-left at given angle)
    const ix = mx - Math.sin(rad) * 130;
    const iy = my - Math.cos(rad) * 130;

    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(mx, my);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrow on incident ray
    const incAngle = Math.atan2(my - iy, mx - ix);
    const ax = mx - Math.cos(incAngle) * 20;
    const ay = my - Math.sin(incAngle) * 20;
    ctx.beginPath();
    ctx.moveTo(ax - Math.cos(incAngle - 0.4) * 10, ay - Math.sin(incAngle - 0.4) * 10);
    ctx.lineTo(ax, ay);
    ctx.lineTo(ax - Math.cos(incAngle + 0.4) * 10, ay - Math.sin(incAngle + 0.4) * 10);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Reflected ray (symmetric about normal)
    const rx = mx + Math.sin(rad) * 130;
    const ry = my - Math.cos(rad) * 130;

    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(rx, ry);
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#34d399";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrow on reflected ray
    const refAngle = Math.atan2(ry - my, rx - mx);
    const rbx = mx + Math.cos(refAngle) * 20;
    const rby = my + Math.sin(refAngle) * 20;
    ctx.beginPath();
    ctx.moveTo(rbx - Math.cos(refAngle - 0.4) * 10, rby - Math.sin(refAngle - 0.4) * 10);
    ctx.lineTo(rbx, rby);
    ctx.lineTo(rbx - Math.cos(refAngle + 0.4) * 10, rby - Math.sin(refAngle + 0.4) * 10);
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Angle arcs
    ctx.beginPath();
    ctx.arc(mx, my, 40, -Math.PI / 2 - rad, -Math.PI / 2, false);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mx, my, 40, -Math.PI / 2, -Math.PI / 2 + rad, false);
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Labels
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("Incident Ray", ix - 80, iy - 10);
    ctx.fillStyle = "#34d399";
    ctx.fillText("Reflected Ray", rx + 5, ry - 10);

    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`i = ${angle}°`, mx - 70, my - 20);
    ctx.fillText(`r = ${angle}°`, mx + 15, my - 20);

    ctx.fillStyle = "#475569";
    ctx.fillText("Mirror", W / 2 - 25, my + 25);
    ctx.fillText("Normal", mx + 5, my - 125);
  }, [angle]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={480} height={280} className="w-full rounded-xl bg-[#0f1729]" data-testid="canvas-simulation" />
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Angle of Incidence: <span className="text-primary font-bold">{angle}°</span>
        </label>
        <input
          type="range"
          min={10}
          max={80}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full"
          data-testid="slider-angle"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Notice: Angle of Incidence = Angle of Reflection = {angle}°
        </p>
      </div>
    </div>
  );
}
