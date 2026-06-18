const NBSP = " ";

/**
 * Makes markdown content render exactly as the author typed it, by fixing two
 * things that standard Markdown/HTML collapse:
 *
 * 1. SPACES — leading spaces and runs of 2+ spaces are converted to U+00A0
 *    (non-breaking space) so they survive the remark parser (which strips
 *    leading ASCII spaces) and HTML rendering (which collapses consecutive
 *    spaces to one).
 *
 * 2. BLANK LINES — markdown treats 2+ consecutive blank lines the same as one.
 *    Each extra blank line is replaced with a &nbsp; paragraph so the visible
 *    vertical gap the author intended actually appears. rehypeRaw (already in
 *    the plugin chain) passes the &nbsp; entity through to the DOM.
 *
 * Fenced code blocks (``` or ~~~) and 4-space-indented code blocks are skipped
 * so code formatting is never altered.
 */
export function preserveSpaces(md: string): string {
  // Step 1 — preserve extra blank lines.
  // Each blank line beyond the first paragraph-break (\n\n) becomes a &nbsp;
  // paragraph so it has visible height in the rendered output.
  // We only do this outside fenced code blocks.
  md = preserveBlankLines(md);

  // Step 2 — preserve leading spaces and multiple spaces within lines.
  let inFence = false;
  return md.split("\n").map(line => {
    if (/^(`{3,}|~{3,})/.test(line)) { inFence = !inFence; return line; }
    if (inFence || /^    /.test(line)) return line;
    line = line.replace(/^ +/, m => NBSP.repeat(m.length));
    line = line.replace(/ {2,}/g, m => NBSP.repeat(m.length - 1) + " ");
    return line;
  }).join("\n");
}

function preserveBlankLines(md: string): string {
  // Split into fenced-code vs normal segments, only process normal segments.
  const segments: { text: string; isFence: boolean }[] = [];
  let remaining = md;
  const fenceRe = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1[^\n]*$/gm;
  let last = 0;
  let m: RegExpExecArray | null;

  fenceRe.lastIndex = 0;
  while ((m = fenceRe.exec(md)) !== null) {
    if (m.index > last) segments.push({ text: md.slice(last, m.index), isFence: false });
    segments.push({ text: m[0], isFence: true });
    last = m.index + m[0].length;
  }
  if (last < md.length) segments.push({ text: md.slice(last), isFence: false });

  if (segments.length === 0) segments.push({ text: remaining, isFence: false });

  return segments.map(seg => {
    if (seg.isFence) return seg.text;
    // Lines containing only spaces/tabs (e.g. the user pressed space then
    // Enter to add a gap) are blank for paragraph-break purposes too, but
    // wouldn't match \n{3,} below without this normalization.
    const normalized = seg.text.replace(/\n[ \t]+(?=\n)/g, "\n");
    // \n{3,} = 2+ consecutive blank lines. Replace each extra blank line with
    // a &nbsp; paragraph so it has visible height when rendered.
    return normalized.replace(/\n{3,}/g, match => {
      const extraBlanks = match.length - 2;
      return "\n\n" + "&nbsp;\n\n".repeat(extraBlanks);
    });
  }).join("");
}
