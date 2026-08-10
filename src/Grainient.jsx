import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Grainient.css'

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]

  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ]
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}

void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(uColor3,uColor2,S(edge0,edge1,blendX));
  vec3 layer2=mix(uColor2,uColor1,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  o=vec4(clamp(col,0.0,1.0),1.0);
}

void main(){
  vec4 color=vec4(0.0);
  mainImage(color,gl_FragCoord.xy);
  fragColor=color;
}
`

const Grainient = ({
  timeSpeed = 0.22,
  colorBalance = 0.02,
  warpStrength = 1.05,
  warpFrequency = 4.2,
  warpSpeed = 1.25,
  warpAmplitude = 46,
  blendAngle = -22,
  blendSoftness = 0.12,
  rotationAmount = 380,
  noiseScale = 1.85,
  grainAmount = 0.045,
  grainScale = 2.2,
  grainAnimated = false,
  contrast = 1.08,
  gamma = 1.02,
  saturation = 0.88,
  centerX = -0.08,
  centerY = 0.03,
  zoom = 0.98,
  color1 = '#F2FFF9',
  color2 = '#62D8D0',
  color3 = '#293644',
  className = '',
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile =
      window.matchMedia('(max-width: 900px)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      (navigator.maxTouchPoints ?? 0) > 1
    const connection = navigator.connection
    const isLowPower = Boolean(
      connection?.saveData ||
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g',
    )
    const targetFps = reducedMotion || isLowPower ? 0 : isMobile ? 24 : 30
    const frameInterval = targetFps > 0 ? 1000 / targetFps : 0
    const pixelRatio = reducedMotion || isLowPower || isMobile ? 1 : 1.25
    let renderer

    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, pixelRatio),
      })
    } catch {
      container.classList.add('is-fallback')
      return undefined
    }

    const gl = renderer.gl
    const canvas = gl.canvas
    canvas.setAttribute('aria-hidden', 'true')
    container.appendChild(canvas)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: timeSpeed },
        uColorBalance: { value: colorBalance },
        uWarpStrength: { value: warpStrength },
        uWarpFrequency: { value: warpFrequency },
        uWarpSpeed: { value: warpSpeed },
        uWarpAmplitude: { value: warpAmplitude },
        uBlendAngle: { value: blendAngle },
        uBlendSoftness: { value: blendSoftness },
        uRotationAmount: { value: rotationAmount },
        uNoiseScale: { value: noiseScale },
        uGrainAmount: { value: grainAmount },
        uGrainScale: { value: grainScale },
        uGrainAnimated: { value: grainAnimated ? 1 : 0 },
        uContrast: { value: contrast },
        uGamma: { value: gamma },
        uSaturation: { value: saturation },
        uCenterOffset: { value: new Float32Array([centerX, centerY]) },
        uZoom: { value: zoom },
        uColor1: { value: new Float32Array(hexToRgb(color1)) },
        uColor2: { value: new Float32Array(hexToRgb(color2)) },
        uColor3: { value: new Float32Array(hexToRgb(color3)) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    const render = () => renderer.render({ scene: mesh })
    const setSizeNow = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)))
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight
      render()
    }

    let resizeFrameId = 0
    const scheduleResize = () => {
      if (resizeFrameId) return
      resizeFrameId = requestAnimationFrame(() => {
        resizeFrameId = 0
        setSizeNow()
      })
    }

    const resizeObserver = new ResizeObserver(scheduleResize)
    resizeObserver.observe(container)
    setSizeNow()

    let frameId = 0
    let pageVisible = !document.hidden
    // Wait for the first intersection callback before starting the render loop.
    // The background is fixed, but this also prevents an off-screen mount from
    // consuming a frame budget during initial page setup.
    let layerVisible = false
    let lastFrame = 0
    const startTime = performance.now()

    const loop = (time) => {
      if (time - lastFrame >= frameInterval) {
        program.uniforms.iTime.value = (time - startTime) * 0.001
        render()
        lastFrame = time
      }
      frameId = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (!frameId) return
      cancelAnimationFrame(frameId)
      frameId = 0
    }

    const start = () => {
      if (reducedMotion || !pageVisible || !layerVisible || frameId) return
      frameId = requestAnimationFrame(loop)
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      layerVisible = entry.isIntersecting
      if (layerVisible) start()
      else stop()
    })
    intersectionObserver.observe(container)

    const onVisibilityChange = () => {
      pageVisible = !document.hidden
      if (pageVisible) start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      if (resizeFrameId) cancelAnimationFrame(resizeFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      geometry.remove?.()
      program.remove?.()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      renderer = null
      canvas.remove()
    }
  }, [
    blendAngle,
    blendSoftness,
    centerX,
    centerY,
    color1,
    color2,
    color3,
    colorBalance,
    contrast,
    gamma,
    grainAmount,
    grainAnimated,
    grainScale,
    noiseScale,
    rotationAmount,
    saturation,
    timeSpeed,
    warpAmplitude,
    warpFrequency,
    warpSpeed,
    warpStrength,
    zoom,
  ])

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} aria-hidden="true" />
}

export default Grainient
