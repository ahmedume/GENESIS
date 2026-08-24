import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, DoubleSide, ShaderMaterial } from 'three'
import { pointAt } from '../../lib/cameraPath'

const BH_U = 0.79 // encounter parameter — subject anchored AHEAD of it (see LEAD)

// flyby cinematography: place the black hole ahead of the camera's arrival point so the
// silhouette/disk/photon-ring loom dead-ahead during approach instead of beside the frame
const LEAD = 0.035
const OFFSET: [number, number] = [10, -6]

const VERT = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy / 18.0; // normalize by plane half-size
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** Accretion disk: doppler-beamed brightness + orbital streak noise (Interstellar-style). */
const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vP;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    float r = length(vP);
    // annulus band between horizon and outer edge
    float band = smoothstep(0.30, 0.36, r) * smoothstep(0.98, 0.78, r);
    if (band <= 0.0) discard;

    float ang = atan(vP.y, vP.x);
    // doppler beaming — material orbiting toward the viewer burns brighter
    float doppler = 0.35 + 1.25 * pow(0.5 + 0.5 * sin(ang), 2.0);
    // streaky orbital shear
    vec2 sp = vec2(ang * 6.0 - uTime * 0.9 / max(r, 0.32), r * 22.0);
    float n = noise(sp) * 0.6 + noise(sp * 2.3) * 0.4;
    n = smoothstep(0.25, 0.85, n);

    vec3 hot = vec3(1.0, 0.96, 0.86);
    vec3 warm = vec3(1.0, 0.42, 0.12);
    vec3 col = mix(hot, warm, smoothstep(0.36, 0.9, r));
    float a = band * doppler * n;
    gl_FragColor = vec4(col * a * 2.4, a);
  }
`

function photonTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 40, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,240,210,0)')
  g.addColorStop(0.82, 'rgba(255,244,220,1)')
  g.addColorStop(1, 'rgba(255,200,120,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
}

/** EPOCH 7 — EVENT HORIZON: silhouette, doppler accretion disk, photon ring (STORYBOARD E7). */
export function EventHorizon() {
  const diskMat = useRef<ShaderMaterial>(null)

  const anchor = useMemo(() => {
    const p = pointAt(BH_U + LEAD)
    return [p.x + OFFSET[0], p.y + OFFSET[1], p.z] as [number, number, number]
  }, [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const photonMap = useMemo(photonTexture, [])

  useFrame((_, delta) => {
    if (diskMat.current) diskMat.current.uniforms.uTime.value += delta
  })

  return (
    <group position={anchor}>
      {/* silhouette — swallows the starfield behind it */}
      <mesh>
        <sphereGeometry args={[5, 48, 48]} />
        <meshBasicMaterial color="#000003" toneMapped={false} />
      </mesh>
      {/* accretion disk — tilted near edge-on */}
      <mesh rotation={[-1.25, 0.15, 0]}>
        <planeGeometry args={[36, 36]} />
        <shaderMaterial
          ref={diskMat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {/* photon ring — sprites face the camera natively */}
      <sprite scale={[11.4, 11.4, 1]}>
        <spriteMaterial map={photonMap} blending={AdditiveBlending} depthWrite={false} opacity={0.95} fog={false} />
      </sprite>
    </group>
  )
}
