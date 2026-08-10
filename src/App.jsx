import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Boxes,
  Cpu,
  Download,
  Gamepad2,
  Mail,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  SearchCheck,
  Sparkles,
} from 'lucide-react'
import Grainient from './Grainient.jsx'

gsap.registerPlugin(ScrollTrigger)

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const navItems = [
  { href: '#profile', label: '01 PROFILE' },
  { href: '#work', label: '02 WORKS' },
  { href: '#additional-work', label: '03 MORE WORK' },
  { href: '#capabilities', label: '04 CAPABILITIES' },
]

const profileFilm = {
  sequence: 'PROFILE FILM / 01',
  eyebrow: 'MMD03 · FINAL RENDER',
  title: '风格化角色最终演出',
  description:
    '截取最终演出中段的连续角色近景与动作，作为材质、灯光和镜头效果的动态预览。',
  duration: '00:15',
  format: '1080P · LOOP',
  src: assetPath('/media/films/mmd03-middle-loop.mp4'),
  poster: assetPath('/media/posters/mmd03-middle-loop.jpg'),
  playback: 'loop',
  size: 'profile',
}

const projects = [
  {
    index: '01',
    slug: 'character-rendering',
    tone: 'blue',
    eyebrow: 'MATERIAL / CHARACTER',
    title: 'UE5.8 风格化角色渲染',
    description:
      '从贴图通道拆分开始，逐步搭建 Lambert 明暗、Toon Ramp、Face SDF、Kajiya-Kay 与 GGX 高光、眼睛透视、MatCap、边缘光、角色描边和后处理边缘高光，并通过 Sequencer / MRQ 验证最终镜头。',
    tags: [
      'UE5.8',
      'VRM4U',
      'Packed Mask',
      'Toon Ramp',
      'Face SDF',
      'Kajiya-Kay',
      'GGX Specular',
      'Eye Parallax',
      'Character Outline',
      'Post-process Edge',
    ],
    role: '个人学习与实现',
    year: '2026 · 进行中',
    media: {
      type: 'video',
      sequence: 'WORK FILM / 01',
      eyebrow: 'TECH BREAKDOWN',
      title: '风格化渲染技术拆解',
      description:
        '在 UE 编辑器内逐项展示材质结构与画面作用，记录高光、面部阴影和描边问题的调整过程。',
      duration: '01:52',
      format: '1080P · 30 FPS',
      src: assetPath('/media/films/stylized-breakdown-web.mp4'),
      poster: assetPath('/media/posters/stylized-breakdown.jpg'),
      playback: 'interactive',
      size: 'standard',
    },
  },
  {
    index: '02',
    slug: 'pcg-forest',
    tone: 'acid',
    eyebrow: 'PROCEDURAL WORLD',
    title: 'UE PCG Forest',
    description:
      '担任小组组长，负责主程序、PCG 相关内容与项目集成；使用 UE PCG 与 PCGEx 完成道路、植被和遗迹区域控制，并统筹接入碰撞、NavMesh、敌人、道具与胜负流程。项目获第十四届未来设计师 NCDA 云南省赛二等奖。',
    tags: ['UE5.6', 'PCG', 'PCGEx', 'Blueprint', 'NavMesh'],
    role: '组长 / 主程序 / PCG 内容 / 项目集成',
    year: '2026.06',
    award: 'NCDA 云南省赛二等奖',
    media: {
      type: 'video',
      sequence: 'WORK FILM / 02',
      eyebrow: 'ENVIRONMENT DEMO',
      title: 'PCG Forest 漫游演示',
      description: '展示夜间森林、路线、遗迹区域和可玩流程的最终画面。',
      duration: '00:28',
      format: '1080P · 30 FPS',
      src: assetPath('/media/films/pcg-demo.mp4'),
      poster: assetPath('/media/posters/pcg-demo.jpg'),
      playback: 'loop',
      size: 'standard',
    },
  },
  {
    index: '03',
    slug: 'escape',
    tone: 'cyan',
    eyebrow: 'GAMEPLAY / PC',
    title: 'Escape',
    description:
      '在小组项目中承担主程序、项目集成、关卡和主要美术资产工作，完成 PC 逃生流程与 NPC 状态逻辑；除策划外，项目其他实现与集成工作主要由我完成。',
    tags: ['UE5', 'Blueprint', 'PC Gameplay', 'AI State', 'Level Integration', 'Game Asset'],
    role: '主程序 / 项目集成 / 关卡与美术资产',
    year: '2026.01',
    media: {
      type: 'video',
      sequence: 'WORK FILM / 03',
      eyebrow: 'PC GAMEPLAY',
      title: 'Escape PC 原作演示',
      description: '展示第一人称探索、钥匙收集、门锁反馈与关卡推进。',
      duration: '00:28',
      format: '720P · 30 FPS',
      src: assetPath('/media/films/escape-pc-demo.mp4'),
      poster: assetPath('/media/posters/escape-pc-demo.jpg'),
      playback: 'loop',
      size: 'standard',
    },
  },
  {
    index: '04',
    slug: 'vr-extension',
    tone: 'silver',
    eyebrow: 'GAMEPLAY / XR',
    title: 'Escape VR 扩展',
    description:
      '在 Escape PC 原作基础上，使用 OpenXR 与 VRExpansionPlugin 扩展 VR 移动、抓取、武器操作和交互反馈，并完成真机流程验证与项目集成。',
    tags: ['OpenXR', 'VRExpansionPlugin', 'VR Movement', 'Grab Interaction', 'Weapon Interaction', 'Integration'],
    role: '主程序 / VR 交互 / 项目集成',
    year: '2026.06',
    media: {
      type: 'video',
      sequence: 'WORK FILM / 04',
      eyebrow: 'VR HIGHLIGHT',
      title: 'VR 扩展演示',
      description: '展示 VR 场景移动、抓取、武器操作和交互反馈。',
      duration: '00:42',
      format: '1080P · 30 FPS',
      src: assetPath('/media/films/vr-extension-demo.mp4'),
      poster: assetPath('/media/posters/vr-extension-demo.jpg'),
      playback: 'loop',
      size: 'standard',
    },
  },
  {
    index: '05',
    slug: 'dagger',
    tone: 'coral',
    eyebrow: 'GAME ASSET / PBR',
    title: '匕首 PBR 道具',
    description:
      '完成模型与拓扑、UV、高低模烘焙，以及金属、木材、皮革和宝石材质分层，建立从建模到最终渲染的完整游戏资产流程。',
    tags: ['Maya', 'RizomUV', 'Substance 3D Painter', 'PBR'],
    role: '个人资产制作',
    year: '2026.05',
    media: {
      type: 'image',
      sequence: 'ASSET VIEW / 05',
      eyebrow: 'FINAL ASSET',
      title: '匕首与刀鞘最终渲染',
      description: '以材质分区、磨损层次和不同表面质感为重点完成最终展示。',
      src: assetPath('/media/dagger-render.webp'),
      size: 'compact',
    },
  },
]

const additionalProjects = [
  {
    index: 'A1',
    slug: 'unity-ar-pet',
    tone: 'cyan',
    eyebrow: 'UNITY / MOBILE AR',
    title: 'Unity AR 桌宠原型',
    description:
      '个人使用 Unity 2022 完成的移动端 AR 项目。基于图像追踪将角色锚定到现实图片，完成召唤、跟随、角色切换、位置重置、触摸反馈，以及心情、饱食、能量和亲密度状态。角色模型为第三方学习资产。',
    role: '个人项目 / 程序与交互',
    year: '2025.12',
    tags: ['Unity 2022', 'AR Foundation', 'ARCore', 'Image Tracking', 'State System', 'Mobile Interaction'],
    media: {
      type: 'video',
      sequence: 'LAB FILM / A1',
      eyebrow: 'MOBILE AR DEMO',
      title: 'AR 桌宠真机演示',
      description: '展示图像识别、角色锚定、移动反馈与桌宠状态界面。',
      duration: '00:24',
      format: '540 × 960 · 30 FPS',
      src: assetPath('/media/films/unity-ar-pet.mp4'),
      poster: assetPath('/media/posters/unity-ar-pet.jpg'),
      playback: 'loop',
      size: 'standard',
      orientation: 'portrait',
    },
  },
  {
    index: 'A2',
    slug: 'zero-echo',
    tone: 'silver',
    eyebrow: 'WEB3D / GAME CLIENT',
    title: '零点回声：黑匣协议',
    description:
      '工程实训小组 Web3D 解谜游戏。负责 Three.js 第一人称客户端、程序化工业场景、Pointer Lock 相机、AABB 碰撞滑动、中心射线交互、HUD 与状态机，并完成前端接口集成。',
    role: '前端 / 三维客户端 / 项目集成',
    year: '2026.07',
    tags: ['Three.js', 'WebGL', 'Pointer Lock', 'AABB Collision', 'Raycaster', 'HUD / State Machine'],
    media: {
      type: 'video',
      sequence: 'LAB FILM / A2',
      eyebrow: 'SELECTED GAMEPLAY',
      title: '零点回声精选流程',
      description: '截取三章流程中的场景探索、设备交互与谜题推进片段。',
      duration: '00:33',
      format: '720P · 30 FPS',
      src: assetPath('/media/films/zero-echo-highlights.mp4'),
      poster: assetPath('/media/posters/zero-echo-highlights.jpg'),
      playback: 'loop',
      size: 'standard',
    },
  },
]

const capabilities = [
  {
    icon: Sparkles,
    index: '01',
    title: '实时渲染与材质',
    meta: 'SHADER / MATERIAL',
    description:
      '理解 PBR、Packed Mask、Toon Ramp、Face SDF、Kajiya-Kay、MatCap、Rim 与 Outline 的组合关系，并能围绕镜头表现持续迭代。',
  },
  {
    icon: Cpu,
    index: '02',
    title: 'UE5 系统实现',
    meta: 'ENGINE / BLUEPRINT',
    description:
      '使用 Blueprint 完成交互、AI、关卡流程、输入映射、Sequencer 与 MRQ 输出，把资产、逻辑和最终展示整合进同一工程。',
  },
  {
    icon: Boxes,
    index: '03',
    title: '程序化与沉浸交互',
    meta: 'PCG / XR',
    description:
      '具备 PCG / PCGEx、OpenXR 与 VRExpansionPlugin 实践，关注生成结果的可控性、真机反馈和演示稳定性。',
  },
  {
    icon: SearchCheck,
    index: '04',
    title: '问题定位与 Agent 协作',
    meta: 'DEBUG / AGENT',
    description:
      '从最终画面或交互现象回查贴图、材质、灯光、Blueprint 与时序设置，并借助 Codex Agent 和 MCP 核对工程状态与日志。',
  },
]

function addMediaReveal(timeline, media, position = '<0.12') {
  if (!timeline || !media) return

  const frame = media.querySelector('.inline-media-frame')
  const visual = frame?.querySelector('video, img')
  const captionItems = media.querySelectorAll('figcaption > *')

  if (frame) {
    timeline.fromTo(
      frame,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.28, ease: 'power4.inOut' },
      position,
    )
  }

  if (visual) {
    timeline.fromTo(
      visual,
      { scale: 1.075 },
      { scale: 1, duration: 1.45, ease: 'power3.out' },
      '<',
    )
  }

  if (captionItems.length) {
    timeline.fromTo(
      captionItems,
      { y: 34, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.82, stagger: 0.08, ease: 'power4.out' },
      '<0.62',
    )
  }
}

function usePortfolioMotion(scopeRef) {
  useLayoutEffect(() => {
    const root = scopeRef.current
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasDeepLink = Boolean(window.location.hash && window.location.hash !== '#top')
    let cancelled = false
    let desktopMotion
    let deepLinkFrame = 0
    let refreshTimer = 0
    const previousScrollRestoration = window.history.scrollRestoration

    window.history.scrollRestoration = 'manual'

    root.classList.add('motion-ready')

    if (reducedMotion) {
      root.classList.add('motion-reduced')
      const opening = root.querySelector('.hero-opening')
      if (opening) opening.style.display = 'none'

      return () => {
        root.classList.remove('motion-ready', 'motion-reduced')
      }
    }

    const context = gsap.context(() => {
      const opening = root.querySelector('.hero-opening')

      if (hasDeepLink) {
        gsap.set(opening, { display: 'none' })
      } else {
        const openingTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })

        openingTimeline
          .fromTo(
            '.hero-opening-signature > *',
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.08 },
            0.08,
          )
          .fromTo(
            '.hero-opening-rule',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.76, transformOrigin: 'left center' },
            0.12,
          )
          .to(
            '.hero-opening-signature',
            { y: -24, autoAlpha: 0, duration: 0.34, ease: 'power3.in' },
            0.74,
          )
          .to(
            '.hero-opening-panel',
            { scaleY: 0, duration: 1.08, stagger: 0.055, ease: 'power4.inOut' },
            0.82,
          )
          .fromTo('.hero-video', { scale: 1.11 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0.78)
          .fromTo(
            '.site-header',
            { yPercent: -120, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.9 },
            1.02,
          )
          .fromTo(
            '.hero-kicker',
            { x: -52, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.84 },
            1.02,
          )
          .fromTo(
            '.hero-title-word',
            { yPercent: 125, scaleX: 0.66 },
            { yPercent: 0, scaleX: 1, duration: 1.22, stagger: 0.14, ease: 'expo.out' },
            1.05,
          )
          .fromTo(
            '.hero-bottom > *',
            { y: 44, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.92, stagger: 0.1 },
            1.54,
          )
          .fromTo(
            '.hero-index span',
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.68, stagger: 0.07 },
            1.68,
          )
          .fromTo(
            ['.hero-next', '.hero-video-toggle'],
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 },
            1.75,
          )
          .set(opening, { display: 'none' }, 2.18)
      }

      root.querySelectorAll('.section-heading').forEach((heading) => {
        const displayTitle = heading.querySelector('.section-display-title')
        const code = heading.querySelector('.section-code')
        const title = heading.querySelector('.section-title-block h2')
        const description = heading.querySelector('.section-title-block p')
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })

        if (displayTitle) {
          timeline.fromTo(
            displayTitle,
            { xPercent: -16, scaleX: 0.7, clipPath: 'inset(0 100% 0 0)' },
            {
              xPercent: 0,
              scaleX: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.18,
              ease: 'expo.out',
            },
          )
        }

        timeline
          .fromTo(code, { y: 52, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.82, ease: 'power4.out' }, 0.18)
          .fromTo(
            [title, description].filter(Boolean),
            { y: 58, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.96, stagger: 0.1, ease: 'power4.out' },
            0.26,
          )
      })

      const profileMedia = root.querySelector('.profile-section .inline-media')
      if (profileMedia) {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: profileMedia, start: 'top 82%', toggleActions: 'play none none none' },
        })
        addMediaReveal(timeline, profileMedia, 0)
      }

      const revealGroup = (groupSelector, itemSelector, start = 'top 84%') => {
        const group = root.querySelector(groupSelector)
        const items = group?.querySelectorAll(itemSelector)
        if (!group || !items?.length) return

        gsap.fromTo(
          items,
          { y: 58, autoAlpha: 0, clipPath: 'inset(0 0 18% 0)' },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.94,
            stagger: 0.09,
            ease: 'power4.out',
            scrollTrigger: { trigger: group, start, toggleActions: 'play none none none' },
          },
        )
      }

      revealGroup('.profile-copy', ':scope > *')
      revealGroup('.profile-facts', ':scope > *')
      revealGroup('.metrics', ':scope > div')
      revealGroup('.work-directory', ':scope > a', 'top 86%')
      revealGroup('.additional-directory', ':scope > a', 'top 86%')
      revealGroup('.capability-grid', ':scope > article', 'top 82%')

      root.querySelectorAll('.project-entry').forEach((entry) => {
        const number = entry.querySelector('.project-index')
        const name = entry.querySelector('.project-name')
        const summary = entry.querySelector('.project-summary')
        const media = entry.querySelector('.inline-media')
        const tags = entry.querySelectorAll('.project-tags > span')
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: entry, start: 'top 74%', toggleActions: 'play none none none' },
        })

        timeline
          .fromTo(
            number,
            { x: -36, scaleX: 0.78, autoAlpha: 0 },
            { x: 0, scaleX: 1, autoAlpha: 1, duration: 1.02, ease: 'expo.out' },
          )
          .fromTo(
            name,
            { y: 58, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.92, ease: 'power4.out' },
            0.12,
          )
          .fromTo(
            summary,
            { y: 66, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.02, ease: 'power4.out' },
            0.22,
          )

        addMediaReveal(timeline, media, 0.46)

        if (tags.length) {
          timeline.fromTo(
            tags,
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.58, stagger: 0.055, ease: 'power3.out' },
            1.08,
          )
        }
      })

      const toolchain = root.querySelector('.toolchain')
      if (toolchain) {
        gsap.fromTo(
          toolchain,
          { clipPath: 'inset(0 100% 0 0)', x: -48 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            x: 0,
            duration: 1.06,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: toolchain, start: 'top 88%', toggleActions: 'play none none none' },
          },
        )
      }

      const contact = root.querySelector('.contact-section')
      if (contact) {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: contact, start: 'top 72%', toggleActions: 'play none none none' },
        })
        timeline
          .fromTo(
            contact.querySelector('.contact-label'),
            { x: -46, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.78, ease: 'power4.out' },
          )
          .fromTo(
            contact.querySelectorAll('.contact-title-word'),
            { yPercent: 126, scaleX: 0.68 },
            { yPercent: 0, scaleX: 1, duration: 1.12, stagger: 0.12, ease: 'expo.out' },
            0.12,
          )
          .fromTo(
            contact.querySelector('.contact-inner > p'),
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.82, ease: 'power4.out' },
            0.48,
          )
          .fromTo(
            contact.querySelectorAll('.contact-actions > a'),
            { y: 38, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.78, stagger: 0.1, ease: 'power4.out' },
            0.58,
          )
          .fromTo(
            contact.querySelector('.site-footer'),
            { y: 34, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.86, ease: 'power4.out' },
            0.72,
          )
      }

      desktopMotion = gsap.matchMedia()
      desktopMotion.add('(min-width: 1200px) and (pointer: fine)', () => {
        root
          .querySelectorAll('.inline-media.is-loop:not(.is-portrait) .inline-media-frame')
          .forEach((frame) => {
            const visual = frame.querySelector('video, img')
            if (!visual) return

            gsap.fromTo(
              visual,
              { yPercent: -3.2 },
              {
                yPercent: 3.2,
                ease: 'none',
                scrollTrigger: {
                  trigger: frame,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8,
                },
              },
            )
          })
      })
    }, root)

    const alignDeepLink = () => {
      if (!hasDeepLink || cancelled) return

      const targetId = window.location.hash.slice(1)
      const target = document.getElementById(targetId)
      if (!target) return

      const previousScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      target.scrollIntoView({ block: 'start' })
      document.documentElement.style.scrollBehavior = previousScrollBehavior
      ScrollTrigger.update()
    }

    const scheduleRefresh = () => {
      if (cancelled) return
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => {
        if (cancelled) return
        ScrollTrigger.refresh()
        alignDeepLink()
      }, 80)
    }

    if (hasDeepLink) deepLinkFrame = window.requestAnimationFrame(alignDeepLink)

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleRefresh)
    } else {
      scheduleRefresh()
    }

    return () => {
      cancelled = true
      window.cancelAnimationFrame(deepLinkFrame)
      window.clearTimeout(refreshTimer)
      window.history.scrollRestoration = previousScrollRestoration
      desktopMotion?.revert()
      context.revert()
      root.classList.remove('motion-ready')
    }
  }, [scopeRef])
}

function HeroVideo() {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    let observer
    let heroVisible = true
    const startPlayback = () => {
      if (
        document.hidden ||
        !heroVisible ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) return
      const result = video.play()
      if (result?.then) result.then(() => setPaused(false)).catch(() => setPaused(true))
    }
    const onVisibilityChange = () => {
      if (document.hidden) video.pause()
      else startPlayback()
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting
        if (heroVisible) startPlayback()
        else video.pause()
      },
      { threshold: 0.18 },
    )
    observer.observe(video)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      video.pause()
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      const result = video.play()
      if (result?.catch) result.catch(() => undefined)
      setPaused(false)
    } else {
      video.pause()
      setPaused(true)
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className={`hero-video ${ready ? 'is-ready' : ''}`}
        src={assetPath('/media/films/portfolio-hero-web.mp4')}
        poster={assetPath('/media/posters/portfolio-hero.jpg')}
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setReady(true)}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-hidden="true"
      />
      <button
        className="hero-video-toggle"
        type="button"
        onClick={togglePlayback}
        aria-label={paused ? '播放背景视频' : '暂停背景视频'}
        title={paused ? '播放背景视频' : '暂停背景视频'}
      >
        {paused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
      </button>
    </>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const scrolledRef = useRef(false)

  useEffect(() => {
    let frameId = 0
    const update = () => {
      frameId = 0
      const next = window.scrollY > 32
      if (next === scrolledRef.current) return
      scrolledRef.current = next
      setScrolled(next)
    }
    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="返回首页">
        <strong>XIAOKAI</strong>
        <span>PORTFOLIO / 2026</span>
      </a>
      <nav aria-label="主导航">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-mail" href="mailto:3126976394@qq.com" aria-label="发送邮件">
        <Mail size={18} strokeWidth={1.7} />
      </a>
    </header>
  )
}

function SectionHeading({ index, label, title, description, inverse = false }) {
  return (
    <header className={`section-heading ${inverse ? 'is-inverse' : ''}`} data-reveal>
      <span className="section-display-title" aria-hidden="true">{label}</span>
      <div className="section-code">
        <strong>{index}</strong>
        <span>{label}</span>
      </div>
      <div className="section-title-block">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </header>
  )
}

function InlineMedia({ media, primary = false }) {
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const isLoop = media.playback === 'loop'
  const [manualPause, setManualPause] = useState(false)
  const [paused, setPaused] = useState(true)
  const [mediaLoaded, setMediaLoaded] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || media.type !== 'video') return undefined

    // Loop previews can warm up shortly before entering the viewport. Full
    // interactive films wait for an explicit play intent instead.
    if (!isLoop) return undefined

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setMediaLoaded(true)
        loadObserver.disconnect()
      },
      { rootMargin: '20% 0px', threshold: 0 },
    )

    loadObserver.observe(frame)
    return () => loadObserver.disconnect()
  }, [isLoop, media.type])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !mediaLoaded) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isLoop && !manualPause && !document.hidden) {
          const result = video.play()
          if (result?.catch) result.catch(() => setPaused(true))
        } else if (!entry.isIntersecting) {
          video.pause()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [isLoop, manualPause, mediaLoaded])

  const toggleLoopPlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (!mediaLoaded) {
      video.src = media.src
      video.load()
      setMediaLoaded(true)
      setManualPause(false)
      const result = video.play()
      if (result?.catch) result.catch(() => setPaused(true))
      return
    }

    if (video.paused) {
      setManualPause(false)
      const result = video.play()
      if (result?.catch) result.catch(() => setPaused(true))
    } else {
      setManualPause(true)
      video.pause()
    }
  }

  return (
    <figure
      className={`inline-media size-${media.size ?? 'standard'} ${isLoop ? 'is-loop' : 'is-interactive'} ${media.orientation === 'portrait' ? 'is-portrait' : ''} ${primary ? 'is-primary' : ''}`}
      data-reveal
    >
      <div ref={frameRef} className="inline-media-frame">
        {media.type === 'image' ? (
          <img src={media.src} alt={media.title} loading="lazy" decoding="async" fetchPriority="low" />
        ) : (
          <video
            ref={videoRef}
            src={isLoop ? (mediaLoaded ? media.src : undefined) : media.src}
            poster={media.poster}
            controls={!isLoop}
            muted={isLoop}
            loop={isLoop}
            playsInline
            preload={isLoop && mediaLoaded ? 'metadata' : 'none'}
            onPlay={() => {
              setMediaLoaded(true)
              setPaused(false)
            }}
            onPause={() => setPaused(true)}
            aria-label={`${media.title} 视频`}
          >
            当前浏览器不支持视频播放。
          </video>
        )}
        {isLoop && (
          <button
            className="inline-media-toggle"
            type="button"
            onClick={toggleLoopPlayback}
            aria-label={paused ? `播放${media.title}` : `暂停${media.title}`}
            title={paused ? `播放${media.title}` : `暂停${media.title}`}
          >
            {paused ? <Play size={17} fill="currentColor" /> : <Pause size={17} fill="currentColor" />}
          </button>
        )}
      </div>
      <figcaption>
        <div>
          <div className="media-caption-kicker">
            <span className="media-sequence">{media.sequence}</span>
            <span className="media-eyebrow">{media.eyebrow}</span>
          </div>
          <h3>{media.title}</h3>
        </div>
        <p>{media.description}</p>
      </figcaption>
    </figure>
  )
}

function ProjectEntry({ project }) {
  return (
    <article id={project.slug} className={`project-entry tone-${project.tone}`}>
      <div className="page-width">
        <header className={`project-heading size-${project.media?.size ?? 'standard'}`} data-reveal>
          <div className="project-name">
            <p>
              <span className="project-index">{project.index}</span>
              {project.eyebrow}
            </p>
            <h3>{project.title}</h3>
          </div>
          <div className="project-summary">
            <p>{project.description}</p>
            <dl>
              <div>
                <dt>ROLE</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>DATE</dt>
                <dd>{project.year}</dd>
              </div>
              {project.award && (
                <div>
                  <dt>AWARD</dt>
                  <dd>{project.award}</dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        <InlineMedia media={project.media} />

        <div className={`project-tags size-${project.media?.size ?? 'standard'}`} aria-label={`${project.title} 技术标签`} data-reveal>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

function App() {
  const appRef = useRef(null)
  usePortfolioMotion(appRef)

  return (
    <div
      id="top"
      ref={appRef}
      className="site-shell"
      style={{ '--hero-poster': `url(${assetPath('/media/posters/portfolio-hero.jpg')})` }}
    >
      <div className="site-grainient" aria-hidden="true">
        <Grainient
          color1="#F2FFF9"
          color2="#62D8D0"
          color3="#293644"
          timeSpeed={0.22}
          colorBalance={0.02}
          warpStrength={1.05}
          warpFrequency={4.2}
          warpSpeed={1.25}
          warpAmplitude={46}
          blendAngle={-22}
          blendSoftness={0.12}
          rotationAmount={380}
          noiseScale={1.85}
          grainAmount={0.045}
          grainScale={2.2}
          contrast={1.08}
          gamma={1.02}
          saturation={0.88}
          centerX={-0.08}
          centerY={0.03}
          zoom={0.98}
        />
      </div>
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-opening" aria-hidden="true">
            <div className="hero-opening-panels">
              <span className="hero-opening-panel" />
              <span className="hero-opening-panel" />
              <span className="hero-opening-panel" />
              <span className="hero-opening-panel" />
            </div>
            <div className="hero-opening-signature">
              <span>GAME DEVELOPMENT · TECHNICAL ART</span>
              <strong>XIAOKAI / PORTFOLIO 2026</strong>
              <span className="hero-opening-rule" />
            </div>
          </div>
          <HeroVideo />
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-content page-width">
            <p className="hero-kicker">GAME DEVELOPMENT · TECHNICAL ART · UE5</p>
            <h1 id="hero-title">
              <span className="hero-title-line"><span className="hero-title-word">GAME DEV</span></span>
              <span className="hero-title-line"><span className="hero-title-word">TECH ART</span></span>
            </h1>
            <div className="hero-bottom">
              <div>
                <strong>施凯峰 · XIAOKAI</strong>
                <p>游戏开发 / 技术美术 / UE5 工程实践</p>
              </div>
              <p>从最终画面出发，回到材质、逻辑与引擎实现。</p>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">
            <span>YUNNAN UNIVERSITY</span>
            <span>2027 GRADUATE</span>
            <span>KUNMING / CHINA</span>
          </div>
          <a className="hero-next" href="#profile">
            ENTER PROFILE
            <ArrowDown size={18} strokeWidth={1.8} />
          </a>
        </section>

        <section id="profile" className="profile-section section-block">
          <div className="page-width">
            <SectionHeading
              index="01"
              label="PROFILE"
              title="从作品开始认识我"
              description="先看最终效果，再回到项目背景、职责与实现过程。"
            />

            <InlineMedia media={{ ...profileFilm, type: 'video' }} primary />

            <div className="profile-copy" data-reveal>
              <p className="profile-lead">
                云南大学数字媒体技术 2027 届本科生，专业成绩前 5%。持续学习游戏开发、技术美术与 UE5 工程实践，希望在游戏方向长期深耕。
              </p>
              <div className="profile-detail">
                <p>
                  我把角色材质、Blueprint 交互、PCG、VR 真机与 PBR 资产流程放进实际项目验证，习惯从画面或交互问题回查贴图、材质、灯光、逻辑和时序设置。
                </p>
                <p>
                  目前能够使用 UE、Unity、Maya、Blender、RizomUV、Substance 3D Painter、Photoshop 与 Premiere，并结合 Codex Agent、Unreal MCP 和 Unity MCP 辅助开发与核验。
                </p>
              </div>
            </div>

            <div className="profile-facts" data-reveal>
              <a href="mailto:3126976394@qq.com">
                <Mail size={18} strokeWidth={1.7} />
                <span>3126976394@qq.com</span>
              </a>
              <span>
                <MessageCircle size={18} strokeWidth={1.7} />
                微信 xiaokaijs
              </span>
              <span>
                <MapPin size={18} strokeWidth={1.7} />
                云南 · 昆明
              </span>
              <a href={assetPath('/media/shi-kaifeng-resume.pdf')} download>
                <Download size={18} strokeWidth={1.7} />
                下载个人简历
              </a>
            </div>

            <div className="metrics" data-reveal>
              <div>
                <strong>05</strong>
                <span>核心作品</span>
              </div>
              <div>
                <strong>01</strong>
                <span>省级奖项</span>
              </div>
              <div>
                <strong>02</strong>
                <span>VR 真机平台</span>
              </div>
              <div>
                <strong>5.8</strong>
                <span>当前 UE 版本</span>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="work-intro section-block">
          <div className="page-width">
            <SectionHeading
              index="02"
              label="SELECTED WORKS"
              title="项目不是封面，是过程与结果"
              description="每个项目的主要演示直接呈现在页面中，无需再进入弹层。"
            />

            <nav className="work-directory" aria-label="项目目录" data-reveal>
              {projects.map((project) => (
                <a key={project.slug} href={`#${project.slug}`}>
                  <span>{project.index}</span>
                  <strong>{project.title}</strong>
                  <ArrowDown size={18} strokeWidth={1.5} />
                </a>
              ))}
            </nav>
          </div>
        </section>

        {projects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}

        <section id="additional-work" className="additional-work-intro section-block">
          <div className="page-width">
            <SectionHeading
              index="03"
              label="MORE WORK"
              title="实验与拓展"
              description="补充展示移动端 AR 与浏览器三维游戏客户端实践，作为 UE5 核心作品之外的跨引擎验证。"
            />

            <nav className="work-directory additional-directory" aria-label="拓展项目目录" data-reveal>
              {additionalProjects.map((project) => (
                <a key={project.slug} href={`#${project.slug}`}>
                  <span>{project.index}</span>
                  <strong>{project.title}</strong>
                  <ArrowDown size={18} strokeWidth={1.5} />
                </a>
              ))}
            </nav>
          </div>
        </section>

        {additionalProjects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}

        <section id="capabilities" className="capabilities-section section-block">
          <div className="page-width">
            <SectionHeading
              index="04"
              label="CAPABILITIES"
              title="把美术判断落到引擎里"
              description="能力以已经完成的项目、能复现的过程和能定位的问题为依据。"
            />

            <div className="capability-grid">
              {capabilities.map((capability) => {
                const Icon = capability.icon
                return (
                  <article key={capability.title} data-reveal>
                    <div className="capability-topline">
                      <span>{capability.index}</span>
                      <Icon size={25} strokeWidth={1.5} />
                    </div>
                    <p>{capability.meta}</p>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                  </article>
                )
              })}
            </div>

            <div className="toolchain" data-reveal>
              <div>
                <Braces size={22} strokeWidth={1.5} />
                <span>TOOLCHAIN</span>
              </div>
              <p>
                Unreal Engine 5 · Unity · Maya · Blender · RizomUV · Substance 3D Painter · Photoshop · Premiere · Codex Agent · Unreal / Unity MCP
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-inner page-width" data-reveal>
            <div className="contact-label">
              <Gamepad2 size={24} strokeWidth={1.5} />
              <span>AVAILABLE FOR INTERNSHIP / 2026</span>
            </div>
            <h2>
              <span className="contact-title-line"><span className="contact-title-word">LET&apos;S MAKE</span></span>
              <span className="contact-title-line"><span className="contact-title-word">THE NEXT FRAME</span></span>
            </h2>
            <p>期待游戏开发、技术美术与 UE5 工程相关的实习机会。</p>
            <div className="contact-actions">
              <a href="mailto:3126976394@qq.com">
                发送邮件
                <ArrowUpRight size={19} strokeWidth={1.8} />
              </a>
              <a href="https://space.bilibili.com/319496344" target="_blank" rel="noreferrer">
                Bilibili · 小凯JS
                <ArrowUpRight size={19} strokeWidth={1.8} />
              </a>
            </div>
          </div>

          <footer className="site-footer page-width">
            <span>© 2026 SHI KAIFENG</span>
            <span>GAME DEVELOPMENT · TECHNICAL ART · UE5</span>
            <a href="#top">BACK TO TOP <ArrowUpRight size={14} /></a>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
