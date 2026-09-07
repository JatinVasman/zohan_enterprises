const YT_REGEX =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export function getYouTubeId(url) {
  if (!url) return null
  const m = url.match(YT_REGEX)
  return m ? m[1] : null
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null
}
