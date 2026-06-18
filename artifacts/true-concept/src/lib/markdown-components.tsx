/**
 * Shared `components` overrides for <ReactMarkdown>.
 *
 * `img` rewrites relative `/api/...` srcs (uploaded note images) to an absolute
 * URL so they load inside the Capacitor APK, where the WebView origin is
 * `http://localhost`. See lib/asset-url.ts for the full rationale. Works for
 * raw-HTML <img> tags too (rehypeRaw turns them into hast `img` nodes, which
 * react-markdown maps to this component).
 */

import type { Components } from "react-markdown";
import { resolveAssetUrl } from "./asset-url";

export const markdownComponents: Components = {
  img: ({ src, ...props }) => <img src={resolveAssetUrl(src as string)} {...props} />,
};
