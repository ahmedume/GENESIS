import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'
import { motionPreference } from '../hooks/useReducedMotion'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    float n = fbm(vUv * 3.0 + uTime * 0.02 + uSeed);
    n = smoothstep(0.32, 0.88, n);
    float edge = smoothstep(0.5, 0.12, length(vUv - 0.5));
    gl_FragColor = vec4(mix(uColorA, uColorB, n), n * edge * uOpacity);
  }
`

export interface NebulaSpec {
  position: [number, number, number]
  size: number
  colorA: string
  colorB: string
  seed?: number
  opacity?: number
}

/** One fbm-noise gas billboard with self-advancing drift — compose several per epoch for depth. */
export function Nebula({ position, size, colorA, colorB, seed = 1, opacity = 0.5 }: NebulaSpec) {
  const mat = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      // vec3 uniforms need real Color objects — raw hex strings throw in uniform3fv
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
      uTime: { value: seed * 10 },
      uSeed: { value: seed },
      uOpacity: { value: opacity },
    }),
    // spec props are static per mount by design
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((_, delta) => {
    if (mat.current && !motionPreference.reduced) mat.current.uniforms.uTime.value += delta
  })

  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
