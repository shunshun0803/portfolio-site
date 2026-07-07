// Shared media helpers for video handling across cards.

/** Matches direct video files (mp4/webm/ogg), optionally with a query string. */
export const directVideoPattern = /\.(mp4|webm|ogg)(\?.*)?$/i;

export function isDirectVideo(url?: string): boolean {
  return url ? directVideoPattern.test(url) : false;
}

/**
 * Resolves an asset path.
 * - Absolute URLs (http, //, data:) are returned as-is.
 * - Relative paths (e.g. "videos/foo.mp4") are prefixed with Vite's BASE_URL
 *   so they resolve correctly under the GitHub Pages base ("/portfolio-site/").
 */
export function resolveAsset(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

/** Extracts a YouTube video id from a full URL, or returns the input if it already looks like an id. */
export function youtubeId(input?: string): string | undefined {
  if (!input) return undefined;
  const m = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (m) return m[1];
  if (/^[\w-]{11}$/.test(input)) return input;
  return undefined;
}

export const youtubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbed = (id: string) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
