import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import resumePdf from './Shreyansh Patel - Full Stack Developer.pdf';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

// ── Back to top ───────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 50,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(47,230,255,0.35)',
            background: 'var(--bg-surface)',
            color: 'var(--accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            backdropFilter: 'blur(8px)',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.background = 'rgba(47,230,255,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(47,230,255,0.35)';
            e.currentTarget.style.background = 'var(--bg-surface)';
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--fg-mute)',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    transition: 'color 0.2s',
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(22,22,26,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(47,230,255,0.08)' : '1px solid transparent',
          transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); scrollTo('#hero'); }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--fg-white)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          aria-label="Home"
        >
          Shreyansh<span style={{ color: 'var(--accent)', marginLeft: '1px' }}>.</span>
        </a>

        {/* Desktop links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
          className="nav-desktop"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={e => { e.preventDefault(); scrollTo(href); }}
              style={navLinkStyle}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--fg-white)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--fg-mute)'; }}
            >
              {label}
            </a>
          ))}

          {/* Resume download */}
          <a
            href={resumePdf}
            download
            style={{
              ...navLinkStyle,
              color: 'var(--fg-mute)',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--fg-white)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--fg-mute)'; }}
          >
            Résumé ↓
          </a>

          {/* CTA */}
          <a
            href="#contact"
            id="nav-cta"
            onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0A0A0B',
              textDecoration: 'none',
              background: 'var(--accent)',
              padding: '9px 22px',
              borderRadius: '999px',
              fontWeight: 600,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--accent-light)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(47,230,255,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Let's Connect
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--fg-white)',
            display: 'none',
          }}
        >
          <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{
              height: '1px', background: 'currentColor', display: 'block',
              transformOrigin: 'left',
              transform: mobileOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none',
              transition: 'transform 0.3s',
            }} />
            <span style={{
              height: '1px', background: 'currentColor', display: 'block',
              opacity: mobileOpen ? 0 : 1,
              transition: 'opacity 0.3s',
            }} />
            <span style={{
              height: '1px', background: 'currentColor', display: 'block',
              transformOrigin: 'left',
              transform: mobileOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none',
              transition: 'transform 0.3s',
            }} />
          </div>
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90,
              background: 'rgba(10,10,11,0.97)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px',
            }}
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                onClick={e => { e.preventDefault(); scrollTo(href); }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '36px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--fg-white)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--fg-white)'; }}
              >
                {label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.1em',
                color: '#0A0A0B',
                textDecoration: 'none',
                background: 'var(--accent)',
                padding: '14px 36px',
                borderRadius: '999px',
                fontWeight: 600,
                marginTop: '8px',
              }}
            >
              Let's Connect
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(165,165,172,0.1)',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'var(--bg-surface)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--fg-mute)',
        letterSpacing: '0.05em',
      }}>
        © 2026 Shreyansh Patel. Built with care.
      </p>

      <div style={{ display: 'flex', gap: '28px' }}>
        {[
          { label: 'About', href: '#about' },
          { label: 'Work', href: '#work' },
          { label: 'Skills', href: '#skills' },
          { label: 'Contact', href: '#contact' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={e => { e.preventDefault(); scrollTo(href); }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--fg-mute)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--fg-white)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--fg-mute)'; }}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Initialize Lenis buttery smooth scroll synced with GSAP
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
  };

  // Disable custom cursor on touch devices
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  return (
    <HelmetProvider>
      {!isTouchDevice && <CustomCursor />}
      <Helmet>
        <title>Shreyansh Patel | Full Stack Developer</title>
        <meta
          name="description"
          content="Portfolio of Shreyansh Patel — Full Stack Developer specialising in React, Node.js, and modern web architecture. Let's build something together."
        />
        <link rel="canonical" href="https://shreyansh-intro.vercel.app/" />
        <meta property="og:title" content="Shreyansh Patel | Full Stack Developer" />
        <meta
          property="og:description"
          content="Portfolio of Shreyansh Patel — Full Stack Developer specialising in React, Node.js, and modern web architecture."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shreyansh-intro.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Shreyansh Patel",
            "url": "https://shreyansh-intro.vercel.app/",
            "jobTitle": "Full Stack Developer",
            "sameAs": [
              "https://github.com/shreyansh-real",
              "https://www.linkedin.com/in/shreyansh-patel-581b41371/"
            ]
          }
        `}</script>
      </Helmet>

      {/* Preloader */}
      <AnimatePresence>
        {!preloaderDone && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {/* Main site */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ background: 'var(--bg-void)', minHeight: '100vh' }}
      >
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </motion.div>
    </HelmetProvider>
  );
}

export default App;
