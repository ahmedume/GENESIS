import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DoubleSide, ShaderMaterial } from 'three'
import { pointAt } from '../../lib/cameraPath'

const VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** Fine animated temperature shimmer — "frosted glass lit from everywhere". */
const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  void main() {
    float n = fbm(vPos * 0.35 + uTime * 0.05);
    // amber → crimson cooling across the shell
    vec3 warm = vec3(1.0, 0.55, 0.24);
    vec3 cool = vec3(0.72, 0.16, 0.30);
    vec3 col = mix(warm, cool, smoothstep(0.35, 0.75, n));
    gl_FragColor = vec4(col, 0.35 + 0.45 * n);
  }
`

/** EPOCH 3 — FIRST LIGHT: the CMB shell the camera passes through (STORYBOARD E3). */
export function FirstLight() {
  const mat = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const pos = useMemo(() => pointAt(0.31).toArray() as [number, number, number], [])

  useFrame((_, delta) => {
    if (mat.current) mat.current.uniforms.uTime.value += delta
  })

  return (
    <mesh position={pos}>
      <sphereGeometry args={[58, 48, 48]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        side={DoubleSide}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
