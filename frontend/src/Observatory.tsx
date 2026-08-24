import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import {
  AdditiveBlending,
  ACESFilmicToneMapping,
  BackSide,
  CanvasTexture,
  DoubleSide,
  Group,
  Mesh,
  Points,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three'
import { useState } from 'react'
import './styles/observatory.css'
import { withBase } from './lib/format'

type EpochId = 'singularity' | 'inflation' | 'quarksoup' | 'firstlight' | 'cosmicdawn' | 'galaxyera' | 'stellarforge' | 'eventhorizon' | 'solsystem'

const EPOCHS: { id: EpochId; label: string; time: string; title: string; description: string; accent: string }[] = [
  { id: 'singularity', label: 'THE SINGULARITY', time: 'T = 0', title: 'Before the first second', description: 'Everything that will ever exist compressed smaller than an atom. Orbit the white-hot beginning where space and time have not yet unfolded.', accent: '#fff7e6' },
  { id: 'inflation', label: 'INFLATION', time: 'T + 10⁻³² s', title: 'Space tears open', description: 'A microscopic universe expands faster than light. Streaks of spacetime rush past as the cosmos finds its first shape.', accent: '#b49bdd' },
  { id: 'quarksoup', label: 'THE QUARK SOUP', time: 'T + 1 μs', title: 'Matter, undecided', description: 'A trillion-degree plasma of quarks and gluons. Particles collide, glow, and briefly become the ingredients of everything.', accent: '#ff8a3d' },
  { id: 'firstlight', label: 'FIRST LIGHT', time: 'T + 380 kyr', title: 'The fog clears', description: 'The oldest light in existence is released. A translucent shell of ancient radiation still surrounds the universe today.', accent: '#ff9b6d' },
  { id: 'cosmicdawn', label: 'COSMIC DAWN', time: 'T + 200 Myr', title: 'The first stars ignite', description: 'After a hundred million years of darkness, blue giants switch on—brief, brilliant furnaces that forge new elements.', accent: '#9fd9ff' },
  { id: 'galaxyera', label: 'THE GALAXY ERA', time: 'T + 2 Gyr', title: 'Gravity braids the dark', description: 'Hundreds of billions of stars gather into spiral architecture. Dust lanes, warm cores, and newborn suns turn chaos into structure.', accent: '#b69ae8' },
  { id: 'stellarforge', label: 'STELLAR FORGE', time: 'T + 6 Gyr', title: 'A star gives back', description: 'A supernova throws calcium, iron, and gold into the dark. The debris becomes the raw material for future worlds—and you.', accent: '#ffb45f' },
  { id: 'eventhorizon', label: 'EVENT HORIZON', time: 'T + 9 Gyr', title: 'Where time runs out', description: 'Four million Suns compressed into a region smaller than Mercury’s orbit. Bend the view around the black hole and its blazing disk.', accent: '#ffe3a6' },
  { id: 'solsystem', label: 'YOU ARE HERE', time: 'T + 13.8 Gyr', title: 'A small blue world', description: 'Eight planets orbit one ordinary star. Zoom through the system, rotate the worlds, and find the one carrying every story you know.', accent: '#75d8ff' },
]

function glowTexture(color: string, size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.22, color)
  gradient.addColorStop(1, `${color}00`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.generateMipmaps = false
  return texture
}

function seeded(seed: number) {
  let value = seed
  return () => (value = (value * 1664525 + 1013904223) % 4294967296) / 4294967296
}

const observatoryTextureLoader = new TextureLoader()
function useObservatoryTexture(file: string) {
  return useMemo(() => {
    const texture = observatoryTextureLoader.load(withBase(`assets/textures/${file}`))
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 8
    return texture
  }, [file])
}

function ParticleCloud({ color, count = 900, spread = 24, mode = 'cloud' }: { color: string; count?: number; spread?: number; mode?: 'cloud' | 'spiral' | 'streak' }) {
  const points = useRef<Points>(null)
  const positions = useMemo(() => {
    const random = seeded(count + spread)
    const data = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = i / count
      const angle = t * Math.PI * 16 + random() * 0.8
      const radius = mode === 'spiral' ? 1 + Math.pow(random(), 0.7) * spread : random() * spread
      data[i * 3] = mode === 'spiral' ? Math.cos(angle) * radius : (random() - 0.5) * spread
      data[i * 3 + 1] = mode === 'streak' ? (random() - 0.5) * spread : (random() - 0.5) * (mode === 'spiral' ? 3 : spread)
      data[i * 3 + 2] = mode === 'spiral' ? Math.sin(angle) * radius : (mode === 'streak' ? -random() * 50 : (random() - 0.5) * spread)
    }
    return data
  }, [count, mode, spread])
  const map = useMemo(() => glowTexture(color, 64), [color])
  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * (mode === 'spiral' ? 0.08 : 0.015)
  })
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial map={map} color={color} size={mode === 'streak' ? 0.5 : 0.8} transparent opacity={0.85} depthWrite={false} blending={AdditiveBlending} sizeAttenuation />
    </points>
  )
}

function SingularityObject() {
  const glow = useMemo(() => glowTexture('#fff7e6', 256), [])
  const disk = useRef<Mesh>(null)
  useFrame((_, delta) => { if (disk.current) disk.current.rotation.z += delta * 0.16 })
  return <group><mesh><sphereGeometry args={[1.4, 96, 96]} /><meshBasicMaterial color="#fff7e6" toneMapped={false} /></mesh><mesh ref={disk} rotation={[0.35, 0, 0]}><torusGeometry args={[3.2, 0.22, 32, 160]} /><meshBasicMaterial color="#ffe2a0" blending={AdditiveBlending} toneMapped={false} /></mesh><sprite scale={[18, 18, 1]}><spriteMaterial map={glow} blending={AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite></group>
}

function FirstLightObject() {
  const material = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ time: { value: 0 } }), [])
  useFrame((_, delta) => { if (material.current) material.current.uniforms.time.value += delta })
  return <mesh><sphereGeometry args={[12, 96, 96]} /><shaderMaterial ref={material} uniforms={uniforms} side={BackSide} transparent depthWrite={false} vertexShader={`varying vec3 v; void main(){v=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`uniform float time; varying vec3 v; float hash(vec3 p){return fract(sin(dot(p,vec3(12.9,78.2,37.7)))*43758.5);} void main(){float n=0.5+0.5*sin(v.x*2.8+v.y*3.2+sin(v.z*.7+time*.3)); n += (hash(floor(v*2.))-.5)*.18; gl_FragColor=vec4(mix(vec3(.9,.25,.12),vec3(1.,.75,.35),clamp(n,0.,1.)),.22+n*.18);}`} /></mesh>
}

function CosmicDawnObject() {
  const group = useRef<Group>(null)
  const map = useMemo(() => glowTexture('#b9e4ff'), [])
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.03 })
  return <group ref={group}>{[[-5, 3, 0], [4, 2, -2], [-1, -4, 1], [6, -3, -1], [-7, -2, -3]].map((p, i) => <group key={i} position={p as [number, number, number]}><mesh><sphereGeometry args={[0.4 + (i % 2) * 0.2, 24, 24]} /><meshBasicMaterial color="#eaf6ff" toneMapped={false} /></mesh><sprite scale={[5, 5, 1]}><spriteMaterial map={map} blending={AdditiveBlending} depthWrite={false} /></sprite></group>)}</group>
}

function EventHorizonObject() {
  const disk = useRef<Mesh>(null)
  useFrame((_, delta) => { if (disk.current) disk.current.rotation.z += delta * 0.18 })
  return <group><mesh><sphereGeometry args={[4, 96, 96]} /><meshBasicMaterial color="#000005" /></mesh><mesh ref={disk} rotation={[0.25, 0, 0]}><torusGeometry args={[5.3, 0.7, 48, 192]} /><meshBasicMaterial color="#ffd88a" toneMapped={false} blending={AdditiveBlending} /></mesh><mesh rotation={[0.25, 0, 0]}><torusGeometry args={[6.8, 0.08, 24, 192]} /><meshBasicMaterial color="#fff7df" toneMapped={false} /></mesh><pointLight color="#ffbe69" intensity={180} distance={50} decay={2} /></group>
}

function SolarSystemObject() {
  const mars = useObservatoryTexture('2k_mars.jpg')
  const earth = useObservatoryTexture('2k_earth_daymap.jpg')
  const jupiter = useObservatoryTexture('2k_jupiter.jpg')
  const saturn = useObservatoryTexture('2k_saturn.jpg')
  const moon = useObservatoryTexture('2k_moon.jpg')
  const sun = useObservatoryTexture('2k_sun.jpg')
  const ring = useObservatoryTexture('2k_saturn_ring_alpha.png')
  const group = useRef<Group>(null)
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.035 })
  return <group ref={group} scale={0.5}>
    <pointLight intensity={150} distance={120} decay={1.8} color="#fff0c4" />
    <mesh>
      <sphereGeometry args={[2.2, 96, 96]} />
      <meshBasicMaterial map={sun} color="#ffd45f" toneMapped={false} />
    </mesh>
    <sprite scale={[10, 10, 1]}><spriteMaterial map={glowTexture('#ffb53d', 256)} blending={AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>
    <mesh position={[4, 0, 0]}>
      <sphereGeometry args={[0.7, 96, 96]} />
      <meshStandardMaterial color="#b9b0a5" roughness={0.94} metalness={0.02} />
    </mesh>
    <mesh position={[7, 0, 0]}>
      <sphereGeometry args={[1.1, 96, 96]} />
      <meshStandardMaterial color="#dfb17b" roughness={0.86} />
    </mesh>
    <mesh position={[10, 0, 0]}>
      <sphereGeometry args={[1.35, 96, 96]} />
      <meshStandardMaterial map={mars} color="#ffffff" roughness={0.9} />
    </mesh>
    <group position={[14, 0, 0]}>
      <mesh><sphereGeometry args={[1.55, 128, 128]} /><meshStandardMaterial map={earth} color="#ffffff" roughness={0.76} metalness={0.02} /></mesh>
      <mesh scale={1.045}><sphereGeometry args={[1.55, 64, 64]} /><meshBasicMaterial color="#55bfff" transparent opacity={0.18} side={BackSide} blending={AdditiveBlending} depthWrite={false} /></mesh>
      <mesh position={[2.6, 0.3, 0]}><sphereGeometry args={[0.35, 64, 64]} /><meshStandardMaterial map={moon} roughness={0.96} /></mesh>
    </group>
    <mesh position={[20, 0, 0]}>
      <sphereGeometry args={[3.1, 128, 128]} />
      <meshStandardMaterial map={jupiter} color="#ffffff" roughness={0.82} />
    </mesh>
    <group position={[27, 0, 0]} rotation={[0.15, 0, 0.2]}>
      <mesh><sphereGeometry args={[2.6, 128, 128]} /><meshStandardMaterial map={saturn} color="#ffffff" roughness={0.84} /></mesh>
      <mesh rotation={[Math.PI / 2.25, 0.2, 0]}><ringGeometry args={[3.8, 6.2, 128]} /><meshBasicMaterial map={ring} color="#e3cfaa" transparent opacity={0.84} side={DoubleSide} depthWrite={false} /></mesh>
    </group>
  </group>
}

function ShowcaseObject({ id }: { id: EpochId }) {
  switch (id) {
    case 'singularity': return <SingularityObject />
    case 'inflation': return <ParticleCloud color="#b49bdd" count={1100} spread={30} mode="streak" />
    case 'quarksoup': return <ParticleCloud color="#ff8a3d" count={1400} spread={18} />
    case 'firstlight': return <FirstLightObject />
    case 'cosmicdawn': return <CosmicDawnObject />
    case 'galaxyera': return <ParticleCloud color="#c1a9ff" count={1800} spread={14} mode="spiral" />
    case 'stellarforge': return <><SingularityObject /><ParticleCloud color="#ffb45f" count={600} spread={18} /></>
    case 'eventhorizon': return <EventHorizonObject />
    case 'solsystem': return <SolarSystemObject />
  }
}

function ObservatoryCanvas({ epoch, resetKey }: { epoch: EpochId; resetKey: number }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const isSolarSystem = epoch === 'solsystem'
  const cameraPosition: [number, number, number] = isSolarSystem ? [10, 4, 28] : [0, 4, 20]
  const target: [number, number, number] = isSolarSystem ? [6, 0, 0] : [0, 0, 0]
  return <Canvas key={resetKey} shadows camera={{ position: cameraPosition, fov: 45, near: 0.1, far: 500 }} dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.08 }}>
    <color attach="background" args={['#000005']} />
    <fog attach="fog" args={['#000005', 18, 120]} />
    <ambientLight intensity={0.16} />
    <directionalLight position={[8, 12, 10]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
    <ShowcaseObject id={epoch} />
    <OrbitControls ref={controls} target={target} enableDamping dampingFactor={0.08} minDistance={2.2} maxDistance={80} enablePan={false} rotateSpeed={0.55} zoomSpeed={0.7} />
    <EffectComposer multisampling={0}><Bloom intensity={1.15} luminanceThreshold={0.72} mipmapBlur radius={0.85} /><Vignette darkness={0.48} offset={0.2} /></EffectComposer>
  </Canvas>
}

export default function Observatory() {
  const [selected, setSelected] = useState<EpochId>('singularity')
  const [resetKey, setResetKey] = useState(0)
  const epoch = EPOCHS.find((item) => item.id === selected) ?? EPOCHS[0]
  return <main className="observatory-page">
    <header className="observatory-header"><a className="observatory-back" href={withBase('')}>← TIMELINE</a><div><p className="observatory-eyebrow">A Closer View</p><h1>THE OBSERVATORY</h1></div><button className="observatory-reset" onClick={() => setResetKey((key) => key + 1)}>RESET VIEW</button></header>
    <section className="observatory-stage" aria-label={`${epoch.label} 3D object viewer`}><ObservatoryCanvas epoch={selected} resetKey={resetKey} /><div className="observatory-hint">DRAG TO ORBIT AND PINCH OR SCROLL TO ZOOM</div></section>
    <aside className="observatory-info"><p className="observatory-time">{epoch.time}</p><h2>{epoch.title}</h2><p>{epoch.description}</p><p className="observatory-info__prompt">SELECT AN EPOCH TO REFRAME THE UNIVERSE.</p></aside>
    <nav className="observatory-nav" aria-label="Choose an epoch">{EPOCHS.map((item) => <button key={item.id} className={item.id === selected ? 'is-active' : ''} onClick={() => { setSelected(item.id); setResetKey((key) => key + 1) }} aria-current={item.id === selected ? 'page' : undefined}>{item.label}</button>)}</nav>
  </main>
}
