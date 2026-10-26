import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import type { Mesh } from 'three'
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Globe2, Leaf, Menu, Microscope, Move3D, Sprout, X } from 'lucide-react'

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

function SeedObject() {
  const group = useRef<Mesh>(null)
  const core = useRef<Mesh>(null)
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.24) * 0.13
    }
    if (core.current) core.current.rotation.z -= delta * 0.12
  })
  return (
    <group ref={group} rotation={[0.2, 0.1, -0.18]}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh ref={core} scale={[0.82, 1.18, 0.72]}>
          <icosahedronGeometry args={[1, 5]} />
          <meshStandardMaterial color="#b3a16d" roughness={0.28} metalness={0.48} />
        </mesh>
        <mesh scale={[0.86, 1.22, 0.76]}>
          <icosahedronGeometry args={[1, 4]} />
          <meshPhysicalMaterial color="#d7c99b" roughness={0.32} metalness={0.24} transparent opacity={0.18} transmission={0.22} thickness={0.35} />
        </mesh>
        <mesh position={[0, -1.32, 0]} scale={[0.035, 0.72, 0.035]} rotation={[0.1, 0, -0.15]}>
          <cylinderGeometry args={[0.035, 0.008, 1, 8]} />
          <meshStandardMaterial color="#718b68" roughness={0.55} />
        </mesh>
        <mesh position={[-0.28, -1.13, 0.02]} rotation={[0, 0, -0.65]} scale={[0.48, 0.13, 0.08]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#8fa67c" roughness={0.5} />
        </mesh>
      </Float>
    </group>
  )
}

function SeedScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.4], fov: 38 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 4, 3]} intensity={3.2} color="#fff0c9" />
      <pointLight position={[-3, -1, 2]} intensity={2} color="#759c79" />
      <Suspense fallback={null}>
        <SeedObject />
        <Sparkles count={55} scale={5.4} size={1.7} speed={0.22} color="#d7c99b" opacity={0.55} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={4.1} maxDistance={7} minPolarAngle={Math.PI * 0.28} maxPolarAngle={Math.PI * 0.72} rotateSpeed={0.65} />
    </Canvas>
  )
}

export default function App() {
  const [language, setLanguage] = useState<Language>('id')
  const [intro, setIntro] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = copy[language]
  const enterSite = () => {
    setIntro(false)
    window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }
  const goTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      {intro && <section className="intro-screen" aria-label="Portfolio introduction">
        <div className="intro-top"><span>DF / ACADEMIC PORTFOLIO</span><span>EST. IN CURIOSITY</span></div>
        <div className="intro-grid">
          <div className="intro-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> {t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p className="intro-description">{t.intro}</p>
            <button className="primary-button" onClick={enterSite}>{t.enter}<ArrowRight size={17} /></button>
            <button className="text-button skip-button" onClick={enterSite}>{t.skip}</button>
          </div>
          <div className="seed-stage">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="seed-caption"><span>01</span><span>SEED OF KNOWLEDGE</span></div>
            <SeedScene />
            <div className="drag-hint"><Move3D size={14} /> Drag to explore</div>
          </div>
        </div>
        <div className="intro-bottom"><span>AGRICULTURE · SCIENCE · PEOPLE</span><button className="text-button" onClick={enterSite}>{t.skip}<ArrowDown size={14} /></button></div>
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
