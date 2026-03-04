/** Converts any YouTube URL to an embed URL */
export function getEmbedUrl(url: string): string {
  if (!url) return ''

  // Already an embed URL
  if (url.includes('youtube.com/embed')) return url

  // youtube.com/watch?v=ID or ?v=ID anywhere
  const vMatch = url.match(/[?&]v=([^&]+)/)
  if (vMatch) return `https://www.youtube.com/embed/${vMatch[1]}`

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`

  // playlist
  const listMatch = url.match(/[?&]list=([^&]+)/)
  if (listMatch) return `https://www.youtube.com/embed/videoseries?list=${listMatch[1]}`

  return url
}
