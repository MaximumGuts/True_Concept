/**
 * YouTubeThumbnail — replaces inline YouTube iframe embeds.
 *
 * Shows the video's hqdefault thumbnail with a play button overlay.
 * On tap/click opens the YouTube app (Android) or YouTube website (browser)
 * so ads play in the proper YouTube environment — guaranteeing ad revenue
 * for monetized videos. An iframe embed inside a WebView suppresses ads.
 */

interface Props {
  youtubeId: string;
  label?: string;
  /** Called just before opening YouTube — use for analytics tracking. */
  onBeforeOpen?: () => void;
}

export default function YouTubeThumbnail({ youtubeId, label, onBeforeOpen }: Props) {
  const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  const handleOpen = () => {
    onBeforeOpen?.();
    // On Android Capacitor, window.open routes through the OS intent system,
    // which opens the YouTube app directly if installed.
    // On web, it opens a new browser tab.
    window.open(watchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="relative w-full rounded-2xl overflow-hidden shadow-lg group block"
      style={{ aspectRatio: "16 / 9", background: "#000" }}
      aria-label={label ?? "Watch on YouTube"}
    >
      {/* Thumbnail */}
      <img
        src={thumbUrl}
        alt={label ?? "YouTube video"}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          // Fallback to maxresdefault if hqdefault fails
          (e.target as HTMLImageElement).src =
            `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110"
          style={{ background: "#ff0000" }}
        >
          {/* YouTube play triangle */}
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* "Watch on YouTube" label */}
        <span className="text-white text-xs font-black px-3 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.55)" }}>
          Watch on YouTube
        </span>
      </div>
    </button>
  );
}
