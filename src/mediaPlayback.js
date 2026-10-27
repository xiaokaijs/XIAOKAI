import { useEffect, useRef, useState } from 'react'

// Autoplay is decorative. Touch devices and limited connections should receive
// an immediate poster and choose when to spend data on a film.
export function getPlaybackPolicy() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const compact = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const limited = Boolean(connection?.saveData || /(^|-)2g$|3g/.test(connection?.effectiveType || ''))
  return { manual: compact || reduced || limited, compact, reduced, limited }
}

let owner = null
let ownerIsManual = false

function claim(video, manual) {
  if (owner && owner !== video && !owner.paused) {
    const rect = owner.getBoundingClientRect()
    const stillVisible = rect.bottom > 0 && rect.top < window.innerHeight
    // A scrolling preview must never interrupt a film the visitor started.
    if (!manual && ownerIsManual && stillVisible) return false
    owner.pause()
    owner.preload = 'metadata'
  }
  owner = video
  ownerIsManual = manual
  return true
}

function release(video) {
  if (owner !== video) return
  owner = null
  ownerIsManual = false
}

export function useManagedVideo({ src, autoplay = false }) {
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const [policy] = useState(getPlaybackPolicy)
  const [status, setStatus] = useState('idle')
  const [paused, setPaused] = useState(true)
  const visible = useRef(false)
  const manualPause = useRef(false)
  const playIntent = useRef(0)
  const resumeAt = useRef(0)
  const manualIntent = useRef(false)
  const slowTimer = useRef(0)
  const [slow, setSlow] = useState(false)
  const mayAutoplay = autoplay && !policy.manual

  const clearSlowTimer = () => {
    window.clearTimeout(slowTimer.current)
    slowTimer.current = 0
    setSlow(false)
  }

  const markLoading = () => {
    setStatus('loading')
    if (!slowTimer.current) {
      slowTimer.current = window.setTimeout(() => setSlow(true), 10000)
    }
  }

  const attach = (preload = 'metadata', retry = false) => {
    const video = videoRef.current
    if (!video) return null
    video.preload = preload
    // Calling load on every intersection discards the buffer. Only initialize
    // a new source here; a retry is an explicit action by the visitor.
    if (video.getAttribute('src') !== src || retry) {
      video.src = src
      video.load()
    }
    return video
  }

  const pause = () => {
    const video = videoRef.current
    playIntent.current += 1
    if (!video) return
    video.pause()
    video.preload = 'metadata'
    release(video)
    clearSlowTimer()
  }

  const play = (manual = true, retry = false) => {
    const video = videoRef.current
    if (!video || document.hidden || !claim(video, manual)) return
    manualPause.current = false
    manualIntent.current = manual
    const intent = ++playIntent.current
    attach('auto', retry)
    if (video.readyState < 3) markLoading()
    // Keep this call in the tap/click stack so iOS can authorize playback.
    const promise = video.play()
    promise?.catch((error) => {
      if (intent !== playIntent.current || error.name === 'AbortError') return
      release(video)
      clearSlowTimer()
      setPaused(true)
      setStatus(error.name === 'NotAllowedError' ? 'paused' : 'error')
    })
  }

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) play(true, status === 'error')
    else {
      manualPause.current = true
      pause()
    }
  }

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video) return undefined
    let unloadTimer = 0

    const unload = () => {
      if (!video.getAttribute('src')) return
      resumeAt.current = Number.isFinite(video.currentTime) ? video.currentTime : 0
      pause()
      video.removeAttribute('src')
      video.load() // Stop off-screen network requests and release decoder memory.
      setStatus('idle')
    }

    const warmObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(unloadTimer)
        if (entry.isIntersecting) {
          if (mayAutoplay) attach('metadata')
        } else {
          pause()
          unloadTimer = window.setTimeout(unload, 6000)
        }
      },
      { rootMargin: '240px 0px', threshold: 0 },
    )
    const playObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.2
        if (visible.current && mayAutoplay && !manualPause.current && !document.hidden) play(false)
        else if (!visible.current) pause()
      },
      { threshold: [0, 0.2, 0.5] },
    )
    const onVisibility = () => {
      if (document.hidden) pause()
      else if (visible.current && mayAutoplay && !manualPause.current) play(false)
    }
    warmObserver?.observe(frame)
    playObserver?.observe(frame)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(unloadTimer)
      window.clearTimeout(slowTimer.current)
      slowTimer.current = 0
      warmObserver?.disconnect()
      playObserver?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      playIntent.current += 1
      video.pause()
      release(video)
    }
  }, [src, mayAutoplay])

  const events = {
    onLoadedMetadata: () => {
      const video = videoRef.current
      if (resumeAt.current > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(resumeAt.current, Math.max(0, video.duration - 0.1))
        resumeAt.current = 0
      }
    },
    onCanPlay: () => {
      clearSlowTimer()
      setStatus((previous) => previous === 'playing' ? previous : 'ready')
    },
    onPlay: () => {
      const video = videoRef.current
      if (!video || video.paused || !video.getAttribute('src')) return
      if (!claim(video, manualIntent.current || !autoplay)) {
        video.pause()
        return
      }
      setPaused(false)
    },
    onPlaying: () => {
      clearSlowTimer()
      setStatus('playing')
      setPaused(false)
    },
    onPause: () => {
      setPaused(true)
      setStatus((previous) => previous === 'error' || previous === 'idle' ? previous : 'paused')
      release(videoRef.current)
    },
    onWaiting: markLoading,
    onError: () => {
      clearSlowTimer()
      setStatus('error')
      setPaused(true)
      release(videoRef.current)
    },
  }

  return { frameRef, videoRef, status, paused, slow, policy, toggle, pause, events }
}
