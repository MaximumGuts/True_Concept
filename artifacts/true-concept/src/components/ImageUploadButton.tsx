import { useRef, useState } from "react";
import { Image, AlignLeft, AlignCenter, AlignRight, Loader2, X, Check } from "lucide-react";

type Alignment = "left" | "center" | "right";
type WidthPreset = { label: string; value: string };

const WIDTH_PRESETS: WidthPreset[] = [
  { label: "Full", value: "100%" },
  { label: "¾", value: "75%" },
  { label: "Half", value: "50%" },
  { label: "300px", value: "300px" },
  { label: "200px", value: "200px" },
];

const ALIGNMENT_STYLES: Record<Alignment, string> = {
  left: "display:block;margin-right:auto;",
  center: "display:block;margin:0 auto;",
  right: "display:block;margin-left:auto;",
};

interface Props {
  onInsert: (html: string) => void;
  compact?: boolean;
}

interface UploadedImage {
  objectPath: string;
  previewUrl: string;
}

export default function ImageUploadButton({ onInsert, compact = false }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const [width, setWidth] = useState("100%");
  const [align, setAlign] = useState<Alignment>("center");
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      // Single-shot proxy upload: the storage Cloud Function accepts the raw
      // file bytes with Content-Type and writes them to GCS itself. We send
      // the admin's auth token so the function's requireAdmin() check passes.
      const token = localStorage.getItem("trueconcept_token");
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: file,
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}): ${errBody}`);
      }
      const { objectPath } = await res.json();

      const previewUrl = URL.createObjectURL(file);
      setUploaded({ objectPath, previewUrl });
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleInsert = () => {
    if (!uploaded) return;
    const servingUrl = `/api/storage${uploaded.objectPath}`;
    const styleStr = `width:${width};${ALIGNMENT_STYLES[align]}`;
    const html = `\n<img src="${servingUrl}" alt="image" style="${styleStr}" />\n`;
    onInsert(html);
    setUploaded(null);
    setWidth("100%");
    setAlign("center");
  };

  const handleCancel = () => {
    setUploaded(null);
    setError("");
    setWidth("100%");
    setAlign("center");
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!uploaded && (
        <button
          type="button"
          title="Insert Image"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className={`flex items-center gap-1.5 rounded-lg transition-all text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-white hover:shadow-sm ${
            compact ? "px-2 py-1 text-xs font-black" : "p-1.5"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          ) : (
            <Image className="w-4 h-4" />
          )}
          {compact && <span>Image</span>}
        </button>
      )}

      {uploaded && (
        <div
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="bg-white dark:bg-gray-900 w-full sm:rounded-2xl shadow-2xl sm:max-w-md flex flex-col"
            style={{ maxHeight: "92vh" }}
          >
            {/* Fixed header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0 rounded-t-2xl">
              <h3 className="font-black text-gray-900 dark:text-gray-100 text-base">Configure Image</h3>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Upload preview — capped height */}
              <div
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
                style={{ height: 160 }}
              >
                <img
                  src={uploaded.previewUrl}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 160, objectFit: "contain" }}
                />
              </div>

              {/* Width */}
              <div>
                <p className="text-xs font-black text-gray-600 dark:text-gray-300 mb-2">Width</p>
                <div className="flex gap-2 flex-wrap">
                  {WIDTH_PRESETS.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setWidth(p.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        width === p.value
                          ? "text-white shadow-md"
                          : "text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300"
                      }`}
                      style={
                        width === p.value
                          ? { background: "linear-gradient(135deg,#da6b45,#b85535)" }
                          : {}
                      }
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alignment */}
              <div>
                <p className="text-xs font-black text-gray-600 dark:text-gray-300 mb-2">Alignment</p>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as Alignment[]).map(a => {
                    const Icon =
                      a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAlign(a)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black capitalize transition-all ${
                          align === a
                            ? "text-white shadow-md"
                            : "text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300"
                        }`}
                        style={
                          align === a
                            ? { background: "linear-gradient(135deg,#da6b45,#b85535)" }
                            : {}
                        }
                      >
                        <Icon className="w-3.5 h-3.5" /> {a}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live alignment preview — capped height */}
              <div>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 mb-2">Preview</p>
                <div
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-2 overflow-hidden"
                  style={{ height: 100 }}
                >
                  <img
                    src={uploaded.previewUrl}
                    alt="aligned preview"
                    style={{
                      width,
                      maxWidth: "100%",
                      maxHeight: 90,
                      objectFit: "contain",
                      display: "block",
                      margin:
                        align === "center"
                          ? "0 auto"
                          : align === "right"
                          ? "0 0 0 auto"
                          : "0",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Fixed footer — always visible */}
            <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0 rounded-b-2xl">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsert}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-black shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#da6b45,#b85535)" }}
              >
                <Check className="w-4 h-4" /> Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <span className="text-xs text-red-500 font-bold">{error}</span>}
    </>
  );
}
