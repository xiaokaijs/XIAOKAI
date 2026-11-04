// Keep quality separate from autoplay policy: a touch screen is not a reason
// to serve 360P, and opting out of motion should not lower image quality.
export const VIDEO_VERSION = '20261104-hd'

export function resolveVideoQuality(policy, quality = 'auto') {
  if (quality !== 'auto') return quality
  if (policy.limited) return 'data'
  return policy.compact ? 'balanced' : 'high'
}

export function videoSource(path, policy, quality = 'auto') {
  if (!path.includes('/media/films/')) return path
  const tier = { high: 'films', balanced: 'previews', data: 'mobile' }[resolveVideoQuality(policy, quality)]
  const source = path.replace('/media/films/', `/media/${tier}/`)
  // Public files keep their names, so invalidate the previously cached 540P.
  return `${source}${source.includes('?') ? '&' : '?'}v=${VIDEO_VERSION}`
}
