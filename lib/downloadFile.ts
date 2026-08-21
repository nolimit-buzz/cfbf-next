"use client";

/**
 * Downloads a file without navigating the page or opening a new tab.
 *
 * The HTML `download` attribute only forces a save-as (with a custom
 * filename) for same-origin URLs — for a cross-origin URL like a Cloudinary
 * asset, browsers silently ignore it and just navigate to the file instead.
 * Fetching the bytes and saving them via a blob URL sidesteps that entirely,
 * as long as the host sends a permissive CORS header (Cloudinary does).
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(blobUrl);
  } catch {
    // CORS blocked, offline, etc. — falling back to a new tab still gets the
    // visitor the file, just without the forced download/filename.
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
