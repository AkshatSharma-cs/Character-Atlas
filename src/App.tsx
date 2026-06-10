import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, Flame, Sword, Shield, Star, ChevronDown, Wind, Zap, X, ExternalLink, Play, Music2 } from 'lucide-react'
import ScrollReveal from './components/ScrollReveal'
import Reveal from './components/Reveal'
import NavItem from './components/NavItem'

const VIDEO_URL = '/mavuika.mp4'
const BLAZING_HEART_VIDEO_URL = 'https://youtu.be/fd5vxULcZYw?si=hLP4gar9GJIeZdop'
const BLAZING_HEART_INSTRUMENTAL_URL = 'https://youtu.be/8d5cM3RrSKI'

function getYouTubeEmbed(url: string) {
  try {
    // youtu.be/ID or youtube.com/watch?v=ID or embed URLs
    const shortMatch = url.match(/youtu\.be\/([-_A-Za-z0-9]+)/)
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`
    const watchMatch = url.match(/[?&]v=([-_A-Za-z0-9]+)/)
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`
    const embedMatch = url.match(/embed\/([-_A-Za-z0-9]+)/)
    if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}?autoplay=1`
  } catch (e) {
    // fallthrough
  }
  return url
}

// ─── Lore content ────────────────────────────────────────────────────────────
const LORE_SECTIONS = [
  {
    heading: 'Profile',
    body: `Mavuika, also known by her divine name Haborym and bearing the Ancient Name Kiongozi, is the God of War and Pyro Archon of The Seven, presiding over Natlan. As the current Pyro Archon, she possesses a seat among the Divine Thrones of Celestia, granting her access to the Pyro Authority. She previously also possessed the Pyro Gnosis before lending it to the Traveler in order to assist Nahida in burning down Irminsul.`,
  },
  {
    heading: 'Personality',
    body: `As the current God of War, Mavuika embodies a profound sense of duty and responsibility towards her nation, Natlan. Intelligent and calculating, she came up with a plan to eradicate the Abyss invasions threatening Natlan, driven by her desire to secure a peaceful future for her people. This ambitious plan came at a great personal cost — 500 years ago, she left her family behind and sacrificed her life in the Sacred Flame to be reborn in the present day.\n\nMavuika's bravery is unmatched, evidenced by her decision to confront Capitano in combat when he attempted to take her Gnosis. Beyond her role as an Archon, she is friendly and approachable, cultivating warm connections with those around her.`,
  },
  {
    heading: 'Appearance',
    body: `Mavuika uses the tall female model. She has light skin and red eyes with yellow sun-shaped forms around her reddish-yellow pupils. She has red, knee-long, wavy hair with yellow undersides which resemble flames. It parts symmetrically.\n\nWhen Mavuika channels her power of the divine throne, her hair glows a fiery yellow.`,
  },
  {
    heading: 'History — Past',
    body: `Mavuika was born over 500 years ago to the Scions of the Canopy tribe, decades prior to the Cataclysm. She was raised alongside her younger sister Hine and had a Yumkasaur companion named Hitata. Through her martial prowess, Mavuika ascended to become one of many Pyro Archons.\n\nRealizing the threat posed by the Abyss, Mavuika conceived of a plan to sacrifice herself to the Sacred Flame in order to preserve her life force until the time came when the Abyss could be driven out from Natlan for good. When Teyvat was struck by Abyssal corruption during the Cataclysm, she fought alongside the other Archons before placing her life within the Sacred Flame with the intent of returning 500 years later.`,
  },
  {
    heading: 'History — Present',
    body: `Several years prior to the Traveler's arrival in Natlan, Mavuika reawakened from the Sacred Flame, ready to put her plan in full motion. After winning the Pilgrimage of the Return of the Sacred Flame for a second time, she once more ascended to become the Pyro Archon.\n\nShe eventually assembled all six heroes and, channeling her full Authority, landed a massive blow that revealed the false sky above Natlan. Descending into the depths of the Night Kingdom alongside the Traveler, she personally defeated Gosoythoth, purging the Night Kingdom of abyssal influence and ending Natlan's war for good.`,
  },
  {
    heading: 'Aliases & Titles',
    body: `• Haborym — divine name\n• Kiongozi — Ancient Name\n• Pyro Archon\n• God of War`,
  },
]

// ─── Gallery images (Genshin Impact official / wiki artwork) ─────────────────
const GALLERY_IMAGES = [
  { url: '/images/art9.jpg', label: 'Portrait'},
  { url: '/images/art8.jpg', label: 'Official Artwork' },
  { url: '/images/art1.jpg', label: 'Wish Art' },
  
  { url: '/images/art7.jpg', label: 'SunSet' },
  { url: '/images/art3.jpg', label: 'Portrait' },
  { url: '/images/art4.jpg', label: 'Portrait' },
  { url: '/images/art5.jpg', label: 'Introduction Card' },
  { url: '/images/art6.jpg', label: 'Portrait' },
  { url: '/images/art2.jpg', label: 'Name Card' },
  
  

]

// ─── Footer link data ─────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    title: 'Character',
    links: [
      { label: 'Overview', href: 'https://genshin-impact.fandom.com/wiki/Mavuika' },
      { label: 'Abilities', href: 'https://genshin-impact.fandom.com/wiki/Mavuika#Abilities' },
      { label: 'Constellations', href: 'https://genshin-impact.fandom.com/wiki/Mavuika#Constellation' },
      { label: 'Talent Materials', href: 'https://traveler.gg/mavuika-ascension-and-talent-materials/' },   
     ],
  },
  {
    title: 'Story',
    links: [
      { label: 'Archon Quest', href: 'https://genshin-impact.fandom.com/wiki/Chapter_V' },
      { label: 'Character Quest', href: 'https://genshin-impact.fandom.com/wiki/Mavuika#Story' },
      { label: 'World Lore', href: 'https://genshin-impact.fandom.com/wiki/Natlan' },
      { label: 'Voice Lines', href: 'https://genshin-impact.fandom.com/wiki/Mavuika/Voice-Overs#Story' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: ' Mavuika Guide 5.3+', href: 'https://sites.google.com/view/mavuika' },
      { label: 'Mero.moe Guide', href: 'https://chef.mero.moe/mavuika/' },
    ],
  },
  {
    title: 'Gallery',
    links: [
      { label: 'Artwork', href: 'https://genshin-impact.fandom.com/wiki/Mavuika/Gallery' },
      { label: 'Cinematic', href: 'https://youtu.be/aGtkhL8gDYE?si=1aNv7DAOkToRAWmf' },
      { label: 'Screenshots', href: 'https://genshin-impact.fandom.com/wiki/Mavuika/Gallery' },
      
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Community', href: 'https://discord.com/invite/gEfMeef6SV' },
      { label: 'Hoyolab', href: 'https://www.hoyolab.com' },
      { label: 'Discord', href: 'https://discord.com/invite/gEfMeef6SV' },
      { label: 'Updates', href: 'https://genshin.hoyoverse.com/en/news' },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function MavuikaEmblem() {
  return (
    <div
      className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
      style={{ border: '1px solid rgba(255,255,255,0.25)' }}
    >
      <img
        src="/images/mavuika_icon.jpg"
        alt="Mavuika"
        className="w-full h-full object-cover object-top"
      />
    </div>
  )
}

function GlowOrb({ size, x, y, color, blur, opacity }: {
  size: number; x: string; y: string; color: string; blur: number; opacity: number
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

// ─── Lore Modal ───────────────────────────────────────────────────────────────
function LoreModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }} />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'rgba(18,18,18,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-8 py-5 rounded-t-3xl"
          style={{
            background: 'rgba(18,18,18,0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-3">
            <MavuikaEmblem />
            <div>
              <p className="text-white font-bold text-base tracking-tight">Mavuika</p>
              <p className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                Lore & History
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/40 hover:text-white transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Flame accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,120,40,0.5), transparent)' }} />

        {/* Body */}
        <div className="px-8 py-8 space-y-8">
          {/* Pull quote */}
          <blockquote
            className="py-5 px-6 rounded-2xl italic text-white/60 text-sm leading-relaxed"
            style={{ background: 'rgba(255,100,30,0.07)', border: '1px solid rgba(255,120,40,0.15)' }}
          >
            "A pilgrimage for a wish; a battle to earn a name... Burnt to cinders for a dream."
            <span className="block mt-2 not-italic text-white/35 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              — Haborym, Agnidus Agate Gemstone
            </span>
          </blockquote>

          {/* Sections */}
          {LORE_SECTIONS.map((sec) => (
            <div key={sec.heading}>
              <h3
                className="text-white/80 text-xs tracking-[0.25em] uppercase font-semibold mb-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {sec.heading}
              </h3>
              <div className="h-px w-12 mb-4" style={{ background: 'rgba(255,120,40,0.4)' }} />
              {sec.body.split('\n\n').map((para, i) => (
                <p key={i} className="text-white/60 text-sm leading-[1.8] mb-3 last:mb-0 whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          className="sticky bottom-0 px-8 py-5 flex items-center justify-between rounded-b-3xl"
          style={{
            background: 'rgba(18,18,18,0.98)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-white/30 text-xs">Fan-made tribute. Not affiliated with HoYoverse.</p>
          <a
            href="https://genshin-impact.fandom.com/wiki/Mavuika"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors duration-200"
          >
            Full Wiki <ExternalLink size={11} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ onClose, embedSrc }: { onClose: () => void; embedSrc?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }} />

      <motion.div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '16/9' }}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <iframe
          src={embedSrc || 'https://www.youtube.com/embed/aGtkhL8gDYE?si=1aNv7DAOkToRAWmf&autoplay=1'}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title="Mavuika Legend Video"
          style={{ border: 'none' }}
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors z-10"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <X size={16} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Gallery Modal ────────────────────────────────────────────────────────────
function GalleryModal({ image, label, onClose }: { image: string; label: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }} />
      <motion.div
        className="relative max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
        onClick={e => e.stopPropagation()}
      >
        <img src={image} alt={label} className="w-full rounded-2xl object-contain max-h-[80vh]" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span
            className="text-white/60 text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-mono)' }}
          >
            {label}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const screen3Ref = useRef<HTMLElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLore, setShowLore] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoEmbed, setVideoEmbed] = useState<string | null>(null)
  const [galleryImg, setGalleryImg] = useState<{ url: string; label: string } | null>(null)
  

  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150])

  // Background video should play independently of scroll — no scroll-driven seeking.

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-[320vh] bg-black">

      {/* ─── Modals ─── */}
      <AnimatePresence>
        {showLore && <LoreModal onClose={() => setShowLore(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showVideo && (
          <VideoModal
            embedSrc={videoEmbed || undefined}
            onClose={() => {
              setShowVideo(false)
              setVideoEmbed(null)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {galleryImg && (
          <GalleryModal
            image={galleryImg.url}
            label={galleryImg.label}
            onClose={() => setGalleryImg(null)}
          />
        )}
      </AnimatePresence>

      {/* ─── Fixed cinematic video background ─── */}
      <div ref={videoContainerRef} className="fixed inset-0 z-0 bg-black overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
            style={{ objectPosition: 'center center' }}
            >
           <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

        {/* Ambient flame glows */}
        <GlowOrb size={600} x="20%" y="60%" color="rgba(255,80,20,0.12)" blur={120} opacity={1} />
        <GlowOrb size={400} x="75%" y="40%" color="rgba(255,120,40,0.08)" blur={100} opacity={1} />
        <GlowOrb size={300} x="50%" y="80%" color="rgba(200,60,10,0.1)" blur={80} opacity={1} />
      </div>

      {/* ─── Fixed Header ─── */}
      <motion.header className="fixed top-0 left-0 right-0 z-20 px-6 md:px-10" style={{ y: headerY }}>
        <div
          className="mx-auto mt-4 flex items-center justify-between px-6 py-3 rounded-2xl"
          style={{
            background: 'rgba(10,10,10,0.55)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            maxWidth: '90vw',
          }}
        >
          <div className="flex items-center gap-3">
            <MavuikaEmblem />
            <span className="text-white/90 font-semibold tracking-[0.15em] text-sm uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              Mavuika
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', href: '#home' },
              { label: 'Legacy', href: '#legacy' },
              { label: 'Story', href: '#story' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Contact', href: '#contact' },
            ].map(item => (
              <NavItem key={item.label} label={item.label} href={item.href} />
            ))}
          </nav>

          <motion.a
            href="https://genshin-impact.fandom.com/wiki/Mavuika"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold tracking-wide text-white/80 hover:text-white transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            whileHover={{ background: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.97 }}
          >
            Explore the Journey
            <ArrowRight size={14} />
          </motion.a>
        </div>
      </motion.header>

      {/* ─── Scrollable content ─── */}
      <div className="relative z-10 pointer-events-none">

        {/* ══════════════ HERO ══════════════ */}
        <section id="home" className="relative min-h-screen grid grid-cols-12 pointer-events-auto" style={{ paddingTop: '120px' }}>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-xs tracking-[0.2em] uppercase font-mono">Scroll</span>
            <ChevronDown size={16} />
          </motion.div>

          {/* Hero content */}
          <div className="col-span-12 md:col-span-8 lg:col-span-7 flex flex-col justify-end pb-24 px-6 md:px-[5vw] min-h-screen">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-white/40" />
              <span className="text-xs tracking-[0.3em] uppercase text-white/50 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                Natlan — Archon of Pyro
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-bold text-white leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              THE FLAME<br />
              THAT <span style={{ color: 'rgba(255,140,60,0.95)' }}>DEFIES</span><br />
              FATE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/60 max-w-lg leading-relaxed mb-10"
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
            >
              Born from the eternal furnace, she carries the weight of a people's will.{' '}
              <strong className="text-white/85 font-semibold">Mavuika</strong> — Pyro Archon of Natlan —
              is more than power. She is the promise that no flame dies in vain, the{' '}
              <strong className="text-white/85 font-semibold">resilience of a nation</strong> written in fire.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 flex-wrap"
            >
              {/* Witness Her Legend — opens YouTube */}
              <motion.button
                onClick={() => {
                  setVideoEmbed('https://www.youtube.com/embed/aGtkhL8gDYE?si=1aNv7DAOkToRAWmf&autoplay=1')
                  setShowVideo(true)
                }}
                className="group flex items-center gap-0 overflow-hidden rounded-2xl font-semibold text-sm tracking-wide"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(80px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="px-6 py-3.5 text-white/85 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Play size={14} />
                  Witness Her Legend
                </span>
                <span className="px-4 py-3.5 flex items-center border-l border-white/10 text-white/60 group-hover:text-white transition-all duration-300 group-hover:bg-white/10">
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </motion.button>

              {/* View Lore — opens lore modal */}
              <motion.button
                onClick={() => setShowLore(true)}
                className="px-6 py-3.5 rounded-2xl text-sm font-medium text-white/50 hover:text-white/80 transition-colors duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.97 }}
              >
                View Lore ↓
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.02, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 w-full max-w-lg rounded-2xl p-4 sm:p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(255,120,40,0.12), rgba(255,255,255,0.045))',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white/75" style={{ background: 'rgba(255,120,40,0.16)' }}>
                      <Music2 size={15} />
                    </span>
                    <span className="text-[0.65rem] tracking-[0.28em] uppercase text-white/35 font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
                      Featured Track
                    </span>
                  </div>
                  <h2 className="text-white/90 font-bold text-lg leading-tight">Blazing Heart</h2>
                  <p className="text-white/45 text-sm mt-1 leading-relaxed">Mavuika's official song.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                  <motion.button
                    onClick={() => {
                      setVideoEmbed(getYouTubeEmbed(BLAZING_HEART_VIDEO_URL))
                      setShowVideo(true)
                    }}
                    aria-label="Play the official Blazing Heart video"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-black bg-white hover:bg-white/90 transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play size={13} />
                    Official Video
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setVideoEmbed(getYouTubeEmbed(BLAZING_HEART_INSTRUMENTAL_URL))
                      setShowVideo(true)
                    }}
                    aria-label="Play the Blazing Heart instrumental"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-white/65 hover:text-white transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Instrumental
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stat cards */}
          <div className="hidden lg:flex col-span-5 flex-col justify-end pb-24 px-6 gap-3">
            {[
              { icon: <Flame size={14} />, label: 'Element', value: 'Pyro' },
              { icon: <Sword size={14} />, label: 'Weapon', value: 'Claymore' },
              { icon: <Shield size={14} />, label: 'Region', value: 'Natlan' },
              { icon: <Star size={14} />, label: 'Rarity', value: '5-Star' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 px-5 py-3 rounded-xl"
                style={{
                  background: 'rgba(26,26,26,0.45)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span className="text-white/35">{stat.icon}</span>
                <span className="text-white/40 text-xs tracking-widest uppercase font-mono flex-1">{stat.label}</span>
                <span className="text-white/80 text-sm font-semibold">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="h-[60vh]" />

        {/* ══════════════ STORY & LEGACY ══════════════ */}
        <section id="legacy" className="relative pointer-events-auto py-32 px-6 md:px-[5vw]" style={{ maxWidth: '90vw', margin: '0 auto' }}>
          <div className="mb-20">
            <Reveal delay={0.1}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-white/30" />
                <span className="text-xs tracking-[0.35em] uppercase text-white/40 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                  Heritage & Power
                </span>
              </div>
            </Reveal>
            <div style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}>
              <ScrollReveal baseRotation={12} baseOpacity={0} blurStrength="10px" className="text-white font-bold leading-tight">
                Forged in fire. Carried by faith. Remembered in flame.
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Flame size={20} />, tag: '01',
                title: 'The Eternal Flame',
                body: "Mavuika's flame is not just power — it is memory, will, and the collective warmth of every soul who refused to surrender. Born into the Scions of the Canopy, she was destined for something greater.",
              },
              {
                icon: <Wind size={20} />, tag: '02',
                title: 'Courage In Motion',
                body: 'Strength born from confronting impossible odds. She sacrificed herself to the Sacred Flame 500 years ago — willingly, knowingly — so that Natlan might one day know peace.',
              },
              {
                icon: <Zap size={20} />, tag: '03',
                title: 'Echoes Of Battle',
                body: 'The memories, sacrifices, and legends carried forward. Together with the Traveler, she descended into the Night Kingdom and personally destroyed Gosoythoth, ending Natlan\'s war for good.',
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={0.15 + i * 0.12}>
                <div
                  className="group relative p-8 rounded-3xl h-full flex flex-col gap-6 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: 'rgba(26,26,26,0.55)',
                    backdropFilter: 'blur(80px)',
                    WebkitBackdropFilter: 'blur(80px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,100,30,0.08) 0%, transparent 70%)' }} />
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-white/60"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {card.icon}
                    </div>
                    <span className="text-white/20 font-mono text-xs tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>{card.tag}</span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="text-white font-bold text-lg tracking-tight">{card.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{card.body}</p>
                  </div>
                  <div className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(255,120,40,0.3), transparent)' }} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* Quote */}
          <Reveal delay={0.1} className="mt-24">
            <div className="relative py-16 text-center">
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'rgba(26,26,26,0.35)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.06)' }} />
              <div className="relative px-8 md:px-16">
                <div className="text-white/20 font-mono text-5xl leading-none mb-4 select-none">"</div>
                <blockquote className="text-white/75 font-medium leading-snug mx-auto" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', maxWidth: '680px' }}>
                  "Many insects have a compulsion to follow the light, and humans are the same, except we call that light hope.""
                </blockquote>
                <p className="mt-5 text-white/30 text-sm tracking-widest uppercase font-mono">— Mavuika</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ══════════════ GALLERY ══════════════ */}
        <section id="gallery" className="relative pointer-events-auto py-24 px-6 md:px-[5vw]" style={{ maxWidth: '90vw', margin: '0 auto' }}>
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-white/30" />
              <span className="text-xs tracking-[0.35em] uppercase text-white/40 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                Gallery
              </span>
            </div>
            <h2 className="text-white font-bold mb-12" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}>
              The Art of the Archon
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <Reveal key={img.label} delay={0.08 * i}>
                <motion.button
                  className="group relative w-full overflow-hidden rounded-2xl aspect-[3/4] bg-white/5 cursor-pointer"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGalleryImg(img)}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white/80 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                      {img.label}
                    </span>
                  </div>
                  {/* Placeholder when image fails */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 text-xs tracking-widest uppercase pointer-events-none"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                    <Flame size={24} className="mb-2 opacity-30" />
                    {img.label}
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-[20vh]" />

        {/* ══════════════ FOOTER / CTA ══════════════ */}
        <section ref={screen3Ref} id="contact" className="relative pointer-events-auto pb-0">
          <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))' }} />

          <div className="relative" style={{ maxWidth: '90vw', margin: '0 auto', padding: '0 max(1.5rem, 5vw)' }}>

            {/* CTA Card */}
            <Reveal>
              <div
                className="rounded-3xl p-12 md:p-20 relative overflow-hidden"
                style={{
                  background: 'rgba(26,26,26,0.6)',
                  backdropFilter: 'blur(80px)',
                  WebkitBackdropFilter: 'blur(80px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(255,120,40,0.4), transparent)' }} />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(255,80,20,0.08) 0%, transparent 70%)' }} />

                <div className="relative text-center">
                  <Reveal delay={0.1}>
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-10 h-px bg-white/20" />
                      <span className="text-xs tracking-[0.35em] uppercase text-white/35 font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                        Begin Your Journey
                      </span>
                      <div className="w-10 h-px bg-white/20" />
                    </div>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <h2 className="text-white font-bold leading-tight tracking-tight mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                      READY TO WALK<br />
                      <span style={{ color: 'rgba(255,140,60,0.9)' }}>THROUGH FIRE?</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                      Every legend begins with a single step forward.<br />
                      The flame does not wait for the fearless — it creates them.
                    </p>
                  </Reveal>
                  <Reveal delay={0.4}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <motion.a
                        href="https://genshin.hoyoverse.com/en/map?region=6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide text-black bg-white hover:bg-white/90 transition-all duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Enter Natlan
                        <ArrowRight size={16} />
                      </motion.a>
                      <motion.button
                        onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide text-white/70 hover:text-white transition-all duration-300"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        whileHover={{ background: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        View Gallery
                      </motion.button>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Reveal>

            {/* Footer grid */}
            <footer className="pt-16 pb-10">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                {FOOTER_COLS.map(col => (
                  <div key={col.title}>
                    <h4 className="text-white/80 font-semibold text-sm tracking-wider uppercase mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                      {col.title}
                    </h4>
                    <ul className="space-y-3">
                      {col.links.map(link => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/35 text-sm hover:text-white/70 transition-colors duration-300 flex items-center gap-1.5 group"
                          >
                            {link.label}
                            <ExternalLink size={10} className="opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <MavuikaEmblem />
                  <span className="text-white/30 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                    Mavuika
                  </span>
                </div>
                <p className="text-white/25 text-xs text-center">
                  © {new Date().getFullYear()} Mavuika Character Showcase. Fan-made tribute. Not affiliated with HoYoverse.
                </p>
                <div className="flex items-center gap-5">
                  {['Privacy', 'Terms', 'Credits'].map(item => (
                    <a key={item} href="#" className="text-white/25 text-xs hover:text-white/50 transition-colors duration-300 tracking-wide">{item}</a>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </section>

      </div>
    </div>
  )
}
