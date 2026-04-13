import { useRef, useEffect, useState } from "react";

export default function LensSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectDist, setObjectDist] = useState(3);
  const FOCAL = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const scale = 35;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f1729";
    ctx.fillRect(0, 0, W, H);

    // Principal axis
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(20, cy);
    ctx.lineTo(W - 20, cy);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Lens
    ctx.beginPath();
    ctx.ellipse(cx, cy, 8, 70, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(99,179,237,0.2)";
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // Focal points
    ctx.beginPath();
    ctx.arc(cx + FOCAL * scale, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - FOCAL * scale, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();

    ctx.font = "11px Inter";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("F", cx + FOCAL * scale - 4, cy + 18);
    ctx.fillText("F", cx - FOCAL * scale - 4, cy + 18);

    const u = -objectDist * scale;
    const f = FOCAL * scale;
    const objX = cx + u;
    const objH = 50;

    // Object arrow
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, cy - objH);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX - 6, cy - objH + 10);
    ctx.lineTo(objX, cy - objH);
    ctx.lineTo(objX + 6, cy - objH + 10);
    ctx.strokeStyle = "#a78bfa";
    ctx.stroke();
    ctx.fillStyle = "#a78bfa";
    ctx.font = "12px Inter";
    ctx.fillText("Object", objX - 15, cy - objH - 8);

    // Lens formula: 1/v = 1/f - 1/u (all in scale)
    const uF = -objectDist * scale;
    if (uF !== -f) {
      const v = (f * uF) / (uF + f);
      const imgH = (-v / uF) * objH;
      const imgX = cx + v;

      if (imgX >= 20 && imgX <= W - 20) {
        ctx.beginPath();
        ctx.moveTo(imgX, cy);
        ctx.lineTo(imgX, cy - imgH);
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(imgX - 6, cy - imgH + 10 * Math.sign(imgH));
        ctx.lineTo(imgX, cy - imgH);
        ctx.lineTo(imgX + 6, cy - imgH + 10 * Math.sign(imgH));
        ctx.strokeStyle = "#34d399";
        ctx.stroke();
        ctx.fillStyle = "#34d399";
        ctx.font = "11px Inter";
        const label = imgH < 0 ? "Image\n(Real, Inverted)" : "Image\n(Virtual, Erect)";
        ctx.fillText(imgH < 0 ? "Image (Real)" : "Image (Virtual)", imgX - 20, cy - imgH - 8);

        // Ray from top of object parallel then through F
        ctx.beginPath();
        ctx.moveTo(objX, cy - objH);
        ctx.lineTo(cx, cy - objH);
        ctx.lineTo(imgX, cy - imgH);
        ctx.strokeStyle = "rgba(251,191,36,0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        const vDist = Math.round(v / scale * 10) / 10;
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px Inter";
        ctx.fillText(`v = ${vDist > 0 ? '+' : ''}${vDist} (u = -${objectDist})`, cx - 60, cy + 35);
      }
    }

    ctx.fillStyle = "#60a5fa";
    ctx.font = "10px Inter";
    ctx.fillText("Convex Lens", cx - 25, cy - 80);
  }, [objectDist]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={480} height={240} className="w-full rounded-xl bg-[#0f1729]" data-testid="canvas-simulation" />
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Object Distance: <span className="text-primary font-bold">{objectDist} (focal length = {FOCAL})</span>
        </label>
        <input
          type="range"
          min={1}
          max={6}
          step={0.5}
          value={objectDist}
          onChange={(e) => setObjectDist(Number(e.target.value))}
          className="w-full"
          data-testid="slider-distance"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Lens Formula: 1/f = 1/v - 1/u · Move slider to change object position
        </p>
      </div>
    </div>
  );
}
