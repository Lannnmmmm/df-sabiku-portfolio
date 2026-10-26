import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Group, Mesh } from 'three'
import { ArrowDown, ArrowUpRight, BookOpen, Globe2, Leaf, Menu, Microscope, Sprout, X } from 'lucide-react'

type Language = 'id' | 'en'

const copy = {
  id: {
    nav: ['Profil', 'Penelitian', 'Kinerja'],
    eyebrow: 'AKADEMIK · RISET · KONTRIBUSI',
    title: <>Menumbuhkan pengetahuan,<br /><em>memajukan pertanian.</em></>,
    intro: 'Perjalanan akademik, eksplorasi ilmiah, dan kontribusi untuk pertanian yang berkelanjutan.',
    enter: 'Jelajahi portofolio',
    skip: 'Lewati intro',
    scroll: 'Gulir untuk menjelajah',
    profileLabel: '01 / PROFIL AKADEMIK',
    profileTitle: 'Berangkat dari rasa ingin tahu.',
    profileBody: 'Ruang untuk mengenal perjalanan akademik, kompetensi, dan minat penelitian Dewi Fatmawaty Sabiku. Informasi profil akan terus dilengkapi berdasarkan sumber yang terverifikasi.',
    researchLabel: '02 / PENELITIAN & PUBLIKASI',
    researchTitle: 'Pertanyaan ilmiah. Dampak nyata.',
    researchBody: 'Jelajahi rekam jejak riset dan karya ilmiah yang tersedia secara publik, dengan tautan ke sumber aslinya.',
    workLabel: '03 / KINERJA & PENGABDIAN',
    workTitle: 'Ilmu yang bergerak ke masyarakat.',
    workBody: 'Dokumentasi kegiatan akademik dan pengabdian yang menghubungkan pengetahuan pertanian dengan kebutuhan masyarakat.',
    source: 'Buka sumber',
    footer: 'Portofolio akademik yang berkembang seiring data terverifikasi.',
    note: 'Konten awal bersumber dari rekaman publik. Detail dan dokumentasi tambahan akan diperbarui setelah verifikasi.'
  },
  en: {
    nav: ['Profile', 'Research', 'Contributions'],
    eyebrow: 'ACADEMIA · RESEARCH · IMPACT',
    title: <>Growing knowledge,<br /><em>advancing agriculture.</em></>,
    intro: 'An academic journey, scientific exploration, and contributions toward sustainable agriculture.',
    enter: 'Explore portfolio',
    skip: 'Skip intro',
    scroll: 'Scroll to explore',
    profileLabel: '01 / ACADEMIC PROFILE',
    profileTitle: 'Rooted in curiosity.',
    profileBody: 'Explore the academic journey, expertise, and research interests of Dewi Fatmawaty Sabiku. Profile details will be expanded using verified sources.',
    researchLabel: '02 / RESEARCH & PUBLICATIONS',
    researchTitle: 'Scientific questions. Real-world impact.',
    researchBody: 'Explore publicly available research and scholarly works, with links to their original sources.',
    workLabel: '03 / PERFORMANCE & OUTREACH',
    workTitle: 'Knowledge in service of community.',
    workBody: 'A record of academic activities and community engagement connecting agricultural knowledge with real needs.',
    source: 'Open source',
    footer: 'An academic portfolio that grows with verified evidence.',
    note: 'Initial content is based on public records. Additional details and documentation will be added after verification.'
  }
}

const works = [
  {
    year: '2019',
    type: 'RESEARCH · IPB REPOSITORY',
    title: 'Produksi stek ubi jalar dan mutu stek selama penyimpanan',
    titleEn: 'Sweet potato cutting production and cutting quality during storage',
    description: 'Rekaman penelitian tentang pemangkasan, pemupukan guano, dan aplikasi kitosan pada mutu stek ubi jalar.',
    descriptionEn: 'Research record on pruning, guano fertilization, and chitosan application to sweet potato cutting quality.',
    href: 'https://repository.ipb.ac.id/handle/123456789/100204',
    icon: Sprout
  },
  {
    year: '2025',
    type: 'JOURNAL · AGROTEKNIKA',
    title: 'Seed priming Spirulina platensis untuk vigor benih cabai merah',
    titleEn: 'Spirulina platensis seed priming for red chili seed vigor',
    description: 'Publikasi mengenai perlakuan benih cabai merah dengan Spirulina platensis sebagai agen seed priming.',
    descriptionEn: 'A publication exploring Spirulina platensis as a seed-priming agent for red chili seeds.',
    href: 'https://mail.agroteknika.id/index.php/agtk/article/view/456',
    icon: Microscope
  },
  {
    year: '2025',
    type: 'BOOK · GET PRESS',
    title: 'Dasar-dasar Teknologi Benih',
    titleEn: 'Fundamentals of Seed Technology',
    description: 'Buku referensi tentang teknologi benih. Kontribusi penulis dan detail bibliografi perlu ditinjau dari sumber penerbit.',
    descriptionEn: 'A reference book on seed technology. Author contribution and bibliographic details should be checked with the publisher.',
    href: 'https://getpress.co.id/product/dasar-dasar-teknologi-benih',
    icon: BookOpen
  },
  {
    year: '2025–2026',
    type: 'COMMUNITY ENGAGEMENT · POLIJE',
    title: 'Pemberdayaan petani melalui pemanfaatan limbah kulit kopi',
    titleEn: 'Empowering farmers through coffee husk waste utilization',
    description: 'Kegiatan pengabdian di Desa Klungkung, Jember, terkait pengolahan limbah kulit kopi menjadi pupuk organik cair.',
    descriptionEn: 'Community engagement in Klungkung, Jember, on processing coffee husk waste into liquid organic fertilizer.',
    href: 'https://polije.ac.id/dosen-polije-berdayakan-petani-klungkung-limbah-kulit-kopi-jadi-pupuk-organik-cair/',
    icon: Leaf
  }
]

type Point3 = [number, number, number]

function GrowingSegment({ start, end, from, to, radius, color, growing }: {
  start: Point3
  end: Point3
  from: number
  to: number
  radius: number
  color: string
  growing: boolean
}) {
  const mesh = useRef<Mesh>(null)
  const a = new Vector3(...start)
  const b = new Vector3(...end)
  const direction = b.clone().sub(a)
  const length = direction.length()
  const midpoint = a.clone().addScaledVector(direction, 0.5)
  useFrame((state) => {
    if (!mesh.current) return
    const progress = growing ? Math.min(1, Math.max(0, (state.clock.elapsedTime - from) / (to - from))) : 1
    mesh.current.visible = progress > 0.001
    mesh.current.position.copy(a).addScaledVector(direction, progress * 0.5)
    mesh.current.scale.set(1, Math.max(0.001, length * progress), 1)
    mesh.current.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize())
  })
  return (
    <mesh ref={mesh} position={midpoint.toArray() as Point3}>
      <cylinderGeometry args={[radius * 0.72, radius, 1, 9]} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  )
}

function GrowingLeaf({ position, rotation, from, growing, size = 1 }: {
  position: Point3
  rotation: Point3
  from: number
  growing: boolean
  size?: number
}) {
  const mesh = useRef<Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const progress = growing ? Math.min(1, Math.max(0, (state.clock.elapsedTime - from) / 0.55)) : 1
    const eased = 1 - Math.pow(1 - progress, 3)
    mesh.current.scale.set(0.001 + 0.39 * size * eased, 0.001 + 0.13 * size * eased, 0.001 + 0.055 * size * eased)
    mesh.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 1.1 + from) * 0.025 * progress
  })
  return (
    <mesh ref={mesh} position={position} rotation={rotation} scale={[0.001, 0.001, 0.001]}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color="#6f9668" roughness={0.52} />
    </mesh>
  )
}

function PlantObject({ growing = false }: { growing?: boolean }) {
  const group = useRef<Group>(null)
  const seed = useRef<Mesh>(null)
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.018
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.08
    }
    if (seed.current) {
      const progress = growing ? Math.min(1, state.clock.elapsedTime / 2.2) : 1
      seed.current.scale.set(0.15 * (1 - progress * 0.78), 0.2 * (1 - progress * 0.78), 0.12 * (1 - progress * 0.78))
      seed.current.visible = !growing || progress < 0.96
    }
  })
  const green = "#668b60"
  const youngGreen = "#8fae79"
  return (
    <group ref={group} position={[0, -0.18, 0]}>
      <mesh ref={seed} position={[0, -0.18, 0]} scale={[0.15, 0.2, 0.12]} rotation={[0.2, 0.1, -0.2]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#b9a36e" roughness={0.42} metalness={0.08} />
      </mesh>
      {/* Primary and lateral roots grow down into open space; no soil plane is used. */}
      <GrowingSegment growing={growing} start={[0, -0.16, 0]} end={[0.035, -1.22, 0.02]} from={0.55} to={1.7} radius={0.027} color="#b4b68a" />
      <GrowingSegment growing={growing} start={[0.01, -0.55, 0.01]} end={[-0.34, -0.91, 0.025]} from={1.05} to={1.85} radius={0.014} color="#9ba77e" />
      <GrowingSegment growing={growing} start={[0.02, -0.78, 0.015]} end={[0.28, -1.04, -0.02]} from={1.25} to={2.05} radius={0.012} color="#9ba77e" />
      <GrowingSegment growing={growing} start={[0.02, -0.85, 0.015]} end={[-0.08, -1.28, 0.04]} from={1.45} to={2.2} radius={0.009} color="#aab18a" />
      {/* Stem segments extend from the seed upward in sequence. */}
      <GrowingSegment growing={growing} start={[0, -0.12, 0]} end={[0.02, 0.28, 0]} from={1.0} to={1.8} radius={0.045} color={green} />
      <GrowingSegment growing={growing} start={[0.02, 0.28, 0]} end={[-0.02, 0.72, 0.01]} from={1.65} to={2.35} radius={0.039} color={green} />
      <GrowingSegment growing={growing} start={[-0.02, 0.72, 0.01]} end={[0.08, 1.12, 0]} from={2.2} to={2.9} radius={0.033} color={youngGreen} />
      <GrowingSegment growing={growing} start={[0.08, 1.12, 0]} end={[0.04, 1.42, -0.015]} from={2.8} to={3.35} radius={0.025} color={youngGreen} />
      {/* Small branches are separate growing segments. */}
      <GrowingSegment growing={growing} start={[0.0, 0.48, 0]} end={[-0.42, 0.72, 0.02]} from={2.15} to={2.95} radius={0.023} color={green} />
      <GrowingSegment growing={growing} start={[0.02, 0.88, 0]} end={[0.43, 1.05, 0.01]} from={2.75} to={3.45} radius={0.021} color={green} />
      <GrowingSegment growing={growing} start={[0.07, 1.13, 0]} end={[-0.25, 1.3, 0.01]} from={3.1} to={3.8} radius={0.018} color={youngGreen} />
      <GrowingLeaf growing={growing} position={[-0.22, 0.56, 0.03]} rotation={[0.1, 0.1, 0.6]} from={2.0} size={0.95} />
      <GrowingLeaf growing={growing} position={[-0.34, 0.69, 0.03]} rotation={[0.05, 0.2, 2.6]} from={2.2} size={0.8} />
      <GrowingLeaf growing={growing} position={[0.23, 0.94, 0.02]} rotation={[0.1, 0.1, -0.55]} from={2.7} size={0.9} />
      <GrowingLeaf growing={growing} position={[0.39, 1.03, 0.02]} rotation={[0.05, 0.2, 0.25]} from={2.9} size={0.76} />
      <GrowingLeaf growing={growing} position={[-0.12, 1.2, 0.02]} rotation={[0.05, 0.1, 2.55]} from={3.25} size={0.82} />
      <GrowingLeaf growing={growing} position={[0.1, 1.35, 0]} rotation={[0.1, 0.1, -0.7]} from={3.55} size={0.95} />
      <GrowingLeaf growing={growing} position={[0.04, 1.46, 0]} rotation={[0.05, 0.1, 0.15]} from={3.75} size={0.75} />
    </group>
  )
}

function SeedScene({ growing = false }: { growing?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.12, growing ? 6.2 : 5.4], fov: growing ? 34 : 38 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 4, 3]} intensity={2.6} color="#fff0c9" />
      <pointLight position={[-3, -1, 2]} intensity={1.6} color="#759c79" />
      <Suspense fallback={null}>
        <PlantObject growing={growing} />
        {growing && <Sparkles count={14} scale={4.5} size={1.1} speed={0.12} color="#d7c99b" opacity={0.22} />}
      </Suspense>
      {!growing && <OrbitControls enablePan={false} minDistance={4.1} maxDistance={7} minPolarAngle={Math.PI * 0.28} maxPolarAngle={Math.PI * 0.72} rotateSpeed={0.45} />}
    </Canvas>
  )
}

export default function App() {
  useLayoutEffect(() => {
    // Always begin at the cinematic introduction, not a browser-restored scroll position.
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  const [language, setLanguage] = useState<Language>('id')
  const [intro, setIntro] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = copy[language]
  const [introLeaving, setIntroLeaving] = useState(false)
  useEffect(() => {
    if (!intro) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const fadeTimer = window.setTimeout(() => setIntroLeaving(true), 5150)
    const finishTimer = window.setTimeout(() => {
      setIntro(false)
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }, 6000)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(finishTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [intro])
  const enterSite = () => {
    setIntroLeaving(true)
    window.setTimeout(() => {
      setIntro(false)
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }, 650)
  }
  const goTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      {intro && <section className={introLeaving ? "intro-screen cinematic-intro intro-leaving" : "intro-screen cinematic-intro"} aria-label="Portfolio introduction">
        <div className="cinematic-grain" />
        <div className="cinematic-seed"><SeedScene growing /></div>
        <div className="cinematic-content">
          <p className="cinematic-name">Dewi Fatmawaty Sabiku</p>
          <p className="cinematic-slogan">Growing knowledge, nurturing life.</p>
        </div>
      </section>}

      <header className="site-header">
        <button className="wordmark" onClick={() => goTo('home')} aria-label="Go to home"><span className="wordmark-symbol">D<span>.</span></span><span className="wordmark-text">DEWI FATMAWATY SABIKU<small>ACADEMIC PORTFOLIO</small></span></button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <button onClick={() => goTo('profile')}>{t.nav[0]}</button><button onClick={() => goTo('research')}>{t.nav[1]}</button><button onClick={() => goTo('contributions')}>{t.nav[2]}</button>
        </nav>
        <div className="header-actions"><button className="language-toggle" onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} aria-label="Switch language"><Globe2 size={15} /> {language.toUpperCase()}</button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-backdrop" />
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</span><h2>{t.title}</h2><p>{t.intro}</p><button className="line-button" onClick={() => goTo('profile')}>{t.nav[0]} <ArrowDown size={16} /></button></div>
        <div className="hero-art"><div className="hero-art-ring ring-a" /><div className="hero-art-ring ring-b" /><div className="hero-art-label label-top">BOTANICAL STUDIES <span>01—04</span></div><div className="hero-seed"><SeedScene /></div><div className="hero-art-label label-bottom"><span>FIELD NOTES</span> SEED / GROWTH / IMPACT</div></div>
        <div className="hero-foot"><span>01 — 03</span><span>{t.scroll}</span><span>JAVA, INDONESIA</span></div>
      </section>

      <section className="profile-section content-section" id="profile">
        <div className="section-kicker">{t.profileLabel}</div>
        <div className="profile-layout"><div className="section-heading"><h2>{t.profileTitle}</h2><span className="heading-rule" /></div><div className="profile-text"><p>{t.profileBody}</p><div className="profile-facts"><div><span>ACADEMIC FOCUS</span><strong>Seeds & Plant Science</strong></div><div><span>APPROACH</span><strong>Research · Education · Outreach</strong></div></div></div></div>
      </section>

      <section className="research-section content-section" id="research">
        <div className="section-topline"><div><div className="section-kicker">{t.researchLabel}</div><h2>{t.researchTitle}</h2></div><span className="section-index">PUBLIC RECORDS</span></div>
        <p className="section-intro">{t.researchBody}</p>
        <div className="work-grid">{works.slice(0, 3).map((work, index) => {
          const Icon = work.icon
          return <article className="work-card" key={work.href} style={{ animationDelay: `${index * 90}ms` }}>
            <div className={`work-visual visual-${index + 1}`}><span className="work-number">0{index + 1}</span><Icon size={34} strokeWidth={1.1} /><span className="visual-caption">{work.type}</span></div>
            <div className="work-content"><div className="work-meta"><span>{work.year}</span><span className="meta-dot" /> PUBLIC RECORD</div><h3>{language === 'id' ? work.title : work.titleEn}</h3><p>{language === 'id' ? work.description : work.descriptionEn}</p><a href={work.href} target="_blank" rel="noreferrer">{t.source}<ArrowUpRight size={15} /></a></div>
          </article>
        })}</div>
      </section>

      <section className="contribution-section content-section" id="contributions">
        <div className="section-kicker">{t.workLabel}</div>
        <div className="contribution-layout"><h2>{t.workTitle}</h2><div><p>{t.workBody}</p><a className="feature-link" href={works[3].href} target="_blank" rel="noreferrer"><span><Leaf size={18} /> {language === 'id' ? works[3].title : works[3].titleEn}</span><ArrowUpRight size={18} /></a><p className="source-note">{t.note}</p></div></div>
      </section>

      <footer className="site-footer"><span>DF<span className="gold-dot">.</span> / ACADEMIC PORTFOLIO</span><span>{t.footer}</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button></footer>
    </main>
  )
}
