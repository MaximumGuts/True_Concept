import { useRef, useEffect, useState } from "react";

export default function LightRefractionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(40);
  const N1 = 1.0;
  const N2 = 1.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f1729";
    ctx.fillRect(0, 0, W, H);

    const slabTop = H * 0.3;
    const slabBottom = H * 0.7;
    const slabLeft = W * 0.25;
    const slabRight = W * 0.75;

    // Glass slab
    ctx.fillStyle = "rgba(99, 179, 237, 0.15)";
    ctx.fillRect(slabLeft, slabTop, slabRight - slabLeft, slabBottom - slabTop);
    ctx.strokeStyle = "rgba(99, 179, 237, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(slabLeft, slabTop, slabRight - slabLeft, slabBottom - slabTop);

    ctx.fillStyle = "rgba(99, 179, 237, 0.6)";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Glass (n = 1.5)", slabLeft + 10, slabTop + 20);

    const midX = W / 2;
    const rad1 = (angle * Math.PI) / 180;
    const sinR = (N1 / N2) * Math.sin(rad1);
    const rad2 = Math.asin(Math.min(sinR, 1));

    // Normal lines
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(midX, slabTop - 50);
    ctx.lineTo(midX, slabTop + 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(midX, slabBottom - 50);
    ctx.lineTo(midX, slabBottom + 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Incident ray
    const len = 110;
    const ix = midX - Math.sin(rad1) * len;
    const iy = slabTop - Math.cos(rad1) * len;

    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(midX, slabTop);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Refracted inside glass
    const slabH = slabBottom - slabTop;
    const rx = midX + Math.sin(rad2) * (slabH / Math.cos(rad2));
    const exitX = midX + Math.sin(rad2) * slabH;
    const exitY = slabBottom;

    ctx.beginPath();
    ctx.moveTo(midX, slabTop);
    ctx.lineTo(exitX, exitY);
    ctx.strokeStyle = "#f5a584";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#f5a584";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Emergent ray (parallel to incident, displaced)
    const ex = exitX + Math.sin(rad1) * 100;
    const ey = exitY + Math.cos(rad1) * 100;

    ctx.beginPath();
    ctx.moveTo(exitX, exitY);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#34d399";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Labels
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("Incident", ix - 60, iy + 5);
    ctx.fillStyle = "#f5a584";
    ctx.fillText("Refracted", (midX + exitX) / 2 + 5, (slabTop + slabBottom) / 2);
    ctx.fillStyle = "#34d399";
    ctx.fillText("Emergent", ex - 20, ey + 15);

    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`i = ${angle}°`, midX - 55, slabTop + 18);
    ctx.fillText(`r = ${Math.round(rad2 * 180 / Math.PI)}°`, midX + 5, slabTop + 18);
  }, [angle]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={480} height={280} className="w-full rounded-xl bg-[#0f1729]" data-testid="canvas-simulation" />
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Angle of Incidence: <span className="text-primary font-bold">{angle}°</span>
          <span className="text-muted-foreground text-xs ml-3">
            (Refracted angle: {Math.round(Math.asin((N1 / N2) * Math.sin(angle * Math.PI / 180)) * 180 / Math.PI)}°)
          </span>
        </label>
        <input
          type="range"
          min={10}
          max={60}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full"
          data-testid="slider-angle"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Snell's Law: n₁ sin(i) = n₂ sin(r) · Emergent ray is parallel to incident ray (laterally displaced)
        </p>
      </div>
    </div>
  );
}
