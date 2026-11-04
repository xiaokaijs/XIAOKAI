// Derived web assets only. Original recordings are never modified.
import { spawn } from 'node:child_process'
import { mkdir, copyFile, readFile, writeFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const media = resolve(root, 'public/media')
const staging = resolve(root, 'tmp/video-quality-20261104')
const clips = [
  { name: 'portfolio-hero-web', source: 'F:/Videos/作品集/作品集.mp4', cuts: [[0, 115]] },
  { name: 'mmd03-middle-loop', source: 'F:/Videos/作品集/MMD03.mp4', cuts: [[48, 15]] },
  { name: 'stylized-breakdown-web', source: 'F:/Videos/作品集/角色风格化渲染技术内容.mp4', audio: true },
  { name: 'bg3-ai-reconstruction', source: 'F:/Videos/博德之门3.mp4' },
  { name: 'unity-genshin-furina', source: 'F:/Videos/Furina01.mp4' },
  { name: 'pcg-demo', source: 'F:/Videos/作品集/PCGDemo演示.mp4' },
  { name: 'escape-pc-demo', source: 'F:/Videos/作品集/EscapeDemo演示.mp4', cuts: [[32, 28]] },
  { name: 'vr-extension-demo', source: 'F:/Videos/作品集/VR扩展演示.mp4' },
  { name: 'unity-ar-pet', source: 'F:/Videos/作品集/UnityAR桌宠.mp4', cuts: [[8, 24]], portrait: true },
  { name: 'zero-echo-highlights', source: 'F:/Videos/作品集/【云南大学工程实训-学生作业】—— 零点回声(ZERO_ECHO)/1-【云南大学工程实训-学生作业】—— 零点回声(ZERO_ECHO)-1080P 高码率-AVC.mp4', cuts: [[318, 15], [46, 12], [347, 6]] },
  { name: 'taptap-first-light', source: 'F:/Videos/作品集/TapTapGameJam.mp4', audio: true },
]

function run(exe, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(exe, args, { windowsHide: true })
    let stdout = '', stderr = ''
    child.stdout.on('data', data => { stdout += data })
    child.stderr.on('data', data => { stderr += data })
    child.on('error', reject)
    child.on('close', code => code === 0 ? resolvePromise(stdout) : reject(new Error(`${exe}: ${stderr.slice(-3000)}`)))
  })
}

async function probe(path) {
  return JSON.parse(await run('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt:format=duration,size', '-of', 'json', path]))
}

async function encode(clip, tier) {
  const target = resolve(staging, tier, `${clip.name}.mp4`)
  await mkdir(dirname(target), { recursive: true })
  const high = tier === 'films'
  const width = clip.portrait ? (high ? 720 : 540) : (high ? 1920 : 1280)
  const scale = `fps=30,scale=w='min(${width},iw)':h=-2:flags=lanczos,setsar=1,format=yuv420p`
  const args = ['-hide_banner', '-v', 'error', '-nostdin', '-y']
  if (clip.cuts?.length === 1) args.push('-ss', `${clip.cuts[0][0]}`)
  args.push('-i', clip.source)
  if (clip.cuts?.length > 1) {
    const trims = clip.cuts.map(([start, length], i) => `[0:v]trim=start=${start}:duration=${length},setpts=PTS-STARTPTS[v${i}];`).join('')
    const inputs = clip.cuts.map((_, i) => `[v${i}]`).join('')
    args.push('-filter_complex_threads', '2', '-filter_complex', `${trims}${inputs}concat=n=${clip.cuts.length}:v=1:a=0,${scale}[out]`, '-map', '[out]')
  } else {
    args.push('-map', '0:v:0', '-vf', scale)
    if (clip.cuts) args.push('-t', `${clip.cuts[0][1]}`)
  }
  if (clip.audio) args.push('-map', '0:a:0?', '-c:a', 'aac', '-b:a', '128k')
  else args.push('-an')
  args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', high ? '20' : '23',
    '-maxrate', high ? '6000k' : '2400k', '-bufsize', high ? '12000k' : '4800k',
    '-profile:v', 'high', '-level:v', high ? '4.0' : '3.1', '-g', '60', '-keyint_min', '30',
    '-movflags', '+faststart', '-threads', '4', target)
  await run('ffmpeg', args)
  const result = await probe(target)
  const source = await probe(clip.source)
  const video = result.streams.find(stream => stream.codec_type === 'video')
  const expected = clip.cuts ? clip.cuts.reduce((sum, cut) => sum + cut[1], 0) : Number(source.format.duration)
  if (Math.abs(Number(result.format.duration) - expected) > 0.15) throw new Error(`Duration mismatch: ${clip.name}`)
  if (video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p') throw new Error(`Incompatible codec: ${clip.name}`)
  if (clip.audio && !result.streams.some(stream => stream.codec_type === 'audio')) throw new Error(`Audio missing: ${clip.name}`)
  const bytes = await readFile(target)
  if (bytes.indexOf(Buffer.from('moov')) > bytes.indexOf(Buffer.from('mdat'))) throw new Error(`Not faststart: ${clip.name}`)
  if ((await stat(target)).size > 95_000_000) throw new Error(`File exceeds publishing budget: ${clip.name}`)
  await copyFile(target, resolve(media, tier, `${clip.name}.mp4`))
  const row = { name: clip.name, tier, width: video.width, height: video.height, duration: result.format.duration, bytes: result.format.size, source: clip.source, cuts: clip.cuts }
  console.log(JSON.stringify(row))
  return row
}

await mkdir(staging, { recursive: true })
const selected = process.argv[2] ? clips.filter(clip => clip.name === process.argv[2]) : clips
if (!selected.length) throw new Error('Unknown clip name')
const queue = selected.flatMap(clip => ['films', 'previews'].map(tier => ({ clip, tier })))
const report = []
await Promise.all(Array.from({ length: 2 }, async () => {
  while (queue.length) {
    const { clip, tier } = queue.shift()
    const result = await encode(clip, tier)
    if (result) report.push(result)
  }
}))
await writeFile(resolve(staging, process.argv[2] ? `${process.argv[2]}-report.json` : 'report.json'), JSON.stringify(report, null, 2))
console.log(`Validated ${report.length} video encodes. Low-data assets and originals unchanged.`)
