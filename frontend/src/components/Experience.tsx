import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';

interface ProjectImage { src: string; alt: string; }

interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack: string[];
  images: ProjectImage[];
  year: string;
  links: { label: string; url?: string; icon: React.ReactNode; disabled: boolean }[];
}

const PROJECTS: Project[] = [
  {
    id: 'cerco',
    number: '01',
    title: 'Cerco',
    subtitle: 'Local Service Provider Platform',
    description: 'A community-focused platform that bridges local service providers with community members. Built during a hackathon, Cerco demonstrates rapid prototyping and user-first design — from service discovery to booking, in a clean and accessible interface.',
    features: [
      'Intuitive service discovery by category',
      'Provider profiles with detailed offerings',
      'Responsive design for mobile and desktop',
      'Streamlined contact and inquiry workflow',
    ],
    techStack: ['React', 'JavaScript', 'CSS3', 'HTML5'],
    year: '2025',
    images: [
      { src: '/projects/cerco/01.png', alt: 'Cerco — Homepage hero section' },
      { src: '/projects/cerco/02.png', alt: 'Cerco — Service listings' },
      { src: '/projects/cerco/03.png', alt: 'Cerco — Contact section' },
    ],
    links: [],
  },
  {
    id: 'scn',
    number: '02',
    title: 'SCN',
    subtitle: 'Strategic Creative Notes — Personal Notes Manager',
    description: 'A full-featured notes management application with a rich-text editor, category-based organization, and a dashboard designed for focused writing. Built for students and professionals who need distraction-free note-taking with strong organization tools.',
    features: [
      'Rich-text editor with formatting capabilities',
      'Folder and category-based organization',
      'Dashboard with search and quick access',
      'Responsive layout for on-the-go access',
    ],
    techStack: ['React', 'JavaScript', 'CSS3', 'Firebase'],
    year: '2025–2026',
    images: [
      { src: '/projects/scn/01.png', alt: 'SCN — Authentication screen' },
      { src: '/projects/scn/02.png', alt: 'SCN — Main dashboard' },
      { src: '/projects/scn/03.png', alt: 'SCN — Note editor' },
      { src: '/projects/scn/04.png', alt: 'SCN — Note detail view' },
    ],
    links: [
      {
        label: 'Live Demo',
        url: 'https://strategic-creative-notes.vercel.app/',
        icon: <ExternalLink size={14} />,
        disabled: false,
      },
    ],
  },
];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, currentIndex, onClose, onPrev, onNext, onGoTo }: {
  images: ProjectImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(10,10,11,0.97)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Image ${currentIndex + 1} of ${images.length}`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px',
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid rgba(165,165,172,0.2)',
            background: 'transparent', color: 'var(--fg-white)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Counter */}
        <div style={{
          position: 'absolute', top: '24px', left: '24px',
          fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--fg-mute)',
        }}>
          {currentIndex + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            style={{
              position: 'absolute', left: '16px',
              width: '44px', height: '44px', borderRadius: '50%',
              border: '1px solid rgba(165,165,172,0.2)',
              background: 'transparent', color: 'var(--fg-white)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          style={{ maxWidth: '90vw', maxHeight: '85vh', padding: '0 80px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{
              position: 'absolute', right: '16px',
              width: '44px', height: '44px', borderRadius: '50%',
              border: '1px solid rgba(165,165,172,0.2)',
              background: 'transparent', color: 'var(--fg-white)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px',
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onGoTo(i); }}
                style={{
                  width: i === currentIndex ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === currentIndex ? 'var(--accent)' : 'rgba(165,165,172,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 0,
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

// ── Project row ───────────────────────────────────────────────────────────────
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const isInView = useInView(rowRef, { once: true, margin: '-40px' });

  // Spring physics for magnetic pull (hardware-accelerated, 60fps)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 160, damping: 18, mass: 0.1 });
  const smoothY = useSpring(mouseY, { stiffness: 160, damping: 18, mass: 0.1 });

  const openLightbox = useCallback((i: number) => { setLightboxIndex(i); setLightboxOpen(true); }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const goToPrev = useCallback(() => setLightboxIndex(p => p === 0 ? project.images.length - 1 : p - 1), [project.images.length]);
  const goToNext = useCallback(() => setLightboxIndex(p => p === project.images.length - 1 ? 0 : p + 1), [project.images.length]);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
    // Refresh ScrollTrigger after CSS transition completes
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 420);
  };

  // Cache rect only on mouse enter to eliminate getBoundingClientRect thrashing!
  const handleMouseEnter = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rectRef.current) return;
    const { left, top, width, height } = rectRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const dx = (e.clientX - centerX) * 0.035;
    const dy = (e.clientY - centerY) * 0.08;
    mouseX.set(dx);
    mouseY.set(dy);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <>
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0, x: -32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="project-row-container"
        style={{
          borderRadius: '16px',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* — Row header with magnetic motion — */}
        <motion.button
          ref={btnRef}
          onClick={toggleExpanded}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="project-row-btn"
          style={{
            x: smoothX,
            y: smoothY,
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '28px 16px',
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto auto',
            alignItems: 'center',
            gap: '24px',
            textAlign: 'left',
            borderTop: '1px solid rgba(165,165,172,0.12)',
            borderRadius: '16px',
            transition: 'background 0.25s ease',
            willChange: 'transform, background',
          }}
          aria-expanded={expanded}
          id={`project-btn-${project.id}`}
          aria-controls={`project-panel-${project.id}`}
        >
          {/* Number */}
          <span
            className="project-number"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: expanded ? 'var(--accent)' : 'var(--fg-mute)',
              letterSpacing: '0.1em',
              display: 'inline-block',
              transition: 'color 0.25s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
              transformOrigin: 'left center',
            }}
          >
            {project.number}
          </span>

          {/* Title + subtitle */}
          <div>
            <span
              className="project-title-text"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: expanded ? 'var(--fg-white)' : 'rgba(255,255,255,0.85)',
                display: 'block',
                transition: 'color 0.25s ease, transform 0.25s ease',
              }}
            >
              {project.title}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--fg-mute)',
                letterSpacing: '0.05em',
              }}
            >
              {project.subtitle}
            </span>
          </div>

          {/* Tech tags (desktop) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="project-tags">
            {project.techStack.slice(0, 3).map(t => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1px solid rgba(47,230,255,0.2)',
                  color: 'var(--fg-mute)',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Expand icon */}
          <div
            className="project-expand-icon"
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              border: expanded ? '1px solid var(--accent)' : '1px solid rgba(165,165,172,0.25)',
              background: expanded ? 'rgba(47,230,255,0.1)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: expanded ? 'var(--accent)' : 'var(--fg-mute)',
              transition: 'color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
              flexShrink: 0,
            }}
          >
            {expanded ? <Minus size={16} /> : <Plus size={16} />}
          </div>
        </motion.button>

        {/* — Expanded panel (GPU Hardware-Accelerated CSS Grid Accordion) — */}
        <div
          id={`project-panel-${project.id}`}
          role="region"
          aria-labelledby={`project-btn-${project.id}`}
          style={{
            display: 'grid',
            gridTemplateRows: expanded ? '1fr' : '0fr',
            opacity: expanded ? 1 : 0,
            transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
            willChange: 'grid-template-rows, opacity',
          }}
        >
          <div style={{ overflow: 'hidden', minHeight: 0 }}>
            <div
              style={{
                padding: '12px 16px 40px 104px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '48px',
              }}
              className="project-panel-inner"
            >
              {/* Left: info */}
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: 'var(--fg-mute)',
                  lineHeight: 1.75,
                  marginBottom: '24px',
                }}>
                  {project.description}
                </p>

                <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
                  {project.features.map(f => (
                    <li key={f} style={{
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      color: 'var(--fg-mute)', marginBottom: '8px',
                    }}>
                      <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>→</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {project.links.map(link => {
                    const btnStyle: React.CSSProperties = {
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      borderRadius: '999px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      border: link.disabled
                        ? '1px solid rgba(165,165,172,0.15)'
                        : '1px solid rgba(47,230,255,0.4)',
                      background: link.disabled ? 'transparent' : 'rgba(47,230,255,0.06)',
                      color: link.disabled ? 'var(--fg-mute)' : 'var(--accent)',
                      cursor: link.disabled ? 'not-allowed' : 'pointer',
                      opacity: link.disabled ? 0.5 : 1,
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s',
                    };

                    if (link.url && !link.disabled) {
                      return (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnStyle}
                          className="project-link-active"
                        >
                          {link.icon}
                          {link.label}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={link.label}
                        disabled={link.disabled}
                        style={btnStyle}
                        title={link.disabled ? 'Coming soon' : undefined}
                      >
                        {link.icon}
                        {link.label}
                        {link.disabled && <span style={{ fontSize: '10px', opacity: 0.6 }}>(Soon)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: image gallery */}
              {project.images.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex', gap: '10px', overflowX: 'auto',
                    paddingBottom: '8px', scrollbarWidth: 'thin',
                  }}>
                    {project.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => openLightbox(i)}
                        style={{
                          flexShrink: 0, width: '180px', height: '120px',
                          border: '1px solid rgba(165,165,172,0.15)',
                          borderRadius: '10px', overflow: 'hidden',
                          cursor: 'pointer', background: 'none', padding: 0,
                          transition: 'border-color 0.2s, transform 0.2s',
                        }}
                        className="project-thumb-btn"
                        aria-label={`View ${img.alt}`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'var(--fg-mute)', letterSpacing: '0.1em',
                  }}>
                    Click to enlarge · {project.images.length} screenshots
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {lightboxOpen && (
        <Lightbox
          images={project.images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
          onGoTo={setLightboxIndex}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .project-tags { display: none !important; }
          .project-panel-inner {
            grid-template-columns: 1fr !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      id="work"
      ref={sectionRef}
      className="section-pad"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: 0,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle at 100% 50%, rgba(47,230,255,0.04), transparent 70%)',
          pointerEvents: 'none',
          transform: 'translateY(-50%)',
        }}
      />

      <div className="container-wide">
        {/* Section header with animated rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            02 — Selected Work
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(to right, rgba(47,230,255,0.4), transparent)',
              transformOrigin: 'left',
            }}
          />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--fg-white)',
            marginBottom: '8px',
          }}
        >
          Things I've built.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--fg-mute)',
            marginBottom: '56px',
          }}
        >
          Click any project to explore the details, screenshots, and tech stack.
        </motion.p>

        {/* Project list */}
        <div>
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
          {/* Bottom border */}
          <div style={{ height: '1px', background: 'rgba(165,165,172,0.12)' }} />
        </div>
      </div>

      <style>{`
        .project-row-btn:hover {
          background: rgba(47, 230, 255, 0.035) !important;
        }
        .project-row-btn:hover .project-number {
          color: var(--accent) !important;
          transform: scale(1.15);
        }
        .project-row-btn:hover .project-title-text {
          color: var(--fg-white) !important;
          transform: translateX(4px);
        }
        .project-row-btn:hover .project-expand-icon {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          transform: scale(1.08);
        }
        .project-thumb-btn:hover {
          border-color: var(--accent) !important;
          transform: translateY(-2px);
        }
        .project-link-active:hover {
          background: rgba(47, 230, 255, 0.16) !important;
          border-color: var(--accent) !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px -4px rgba(47, 230, 255, 0.35);
        }
        @media (max-width: 768px) {
          .project-tags { display: none !important; }
          .project-panel-inner {
            grid-template-columns: 1fr !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}