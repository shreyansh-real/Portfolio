import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  animate,
} from 'framer-motion';
import profilePic from '../profilepic.jpeg';

// Counter that animates smoothly from 0 to target value on enter
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setCount(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, to]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {count}{suffix}
    </span>
  );
}

// Animated text that reveals word by word
function RevealWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.3em' }}
        >
          <motion.span
            display="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{
              duration: 0.55,
              delay: delay + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

const STATS = [
  { value: 23, suffix: '+', label: 'Tech Stack' },
  { value: 5, suffix: '+', label: 'Projects Done' },
  { value: 100, suffix: '%', label: 'Passion Driven' },
  { value: 3, suffix: 'yr', label: 'CS Student' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  // Subtle parallax on the photo as you scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const smoothPhotoY = useSpring(photoY, { stiffness: 80, damping: 20 });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const lineVariant = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-pad"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient gradient top-right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '560px',
          height: '560px',
          background: 'radial-gradient(circle at 100% 0%, rgba(47,230,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `linear-gradient(rgba(47,230,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(47,230,255,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section eyebrow + rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            01 — About
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '80px',
            alignItems: 'start',
          }}
          className="about-grid"
        >
          {/* ── Left: Bio content ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Main headline with word reveal */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(34px, 4.5vw, 58px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: 'var(--fg-white)',
                marginBottom: '28px',
              }}
            >
              <RevealWords text="Building the web," delay={0} />
              <br />
              <span style={{ color: 'var(--accent)' }}>
                <RevealWords text="one interface at a time." delay={0.1} />
              </span>
            </h2>

            {/* Bio paragraph 1 */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 1.7vw, 17px)',
                color: 'var(--fg-mute)',
                lineHeight: 1.8,
                maxWidth: '560px',
                marginBottom: '20px',
              }}
            >
              I'm Shreyansh Patel — a full stack developer in my third year of a BSc Computer Science degree. I started with HTML and CSS and never stopped. Today I build end-to-end web applications using React, Node.js, and Firebase, with a focus on clean UI, solid architecture, and interfaces that actually feel good to use.
            </motion.p>

            {/* Bio paragraph 2 */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 1.7vw, 17px)',
                color: 'var(--fg-mute)',
                lineHeight: 1.8,
                maxWidth: '560px',
                marginBottom: '44px',
              }}
            >
              What drives me is the gap between a rough idea and a polished product — and the craft it takes to close it. Currently open to freelance projects and junior developer roles.
            </motion.p>

            {/* Quick fact chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}
            >
              {[
                { label: 'Based in', value: 'India 🇮🇳' },
                { label: 'Status', value: '🟢 Open to work' },
                { label: 'Focus', value: 'Full Stack Web' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="about-fact-chip"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: 'rgba(22,22,26,0.5)',
                    border: '1px solid rgba(165,165,172,0.12)',
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'default',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-mute)',
                      marginBottom: '3px',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="about-fact-value"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--fg-white)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={lineVariant}
              style={{
                height: '1px',
                background: 'rgba(165,165,172,0.12)',
                marginBottom: '40px',
                transformOrigin: 'left',
              }}
            />

            {/* Animated stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }} className="about-stats">
              {STATS.map(({ value, suffix, label }, i) => (
                <motion.div
                  key={label}
                  className="about-stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: '20px 16px',
                    borderRadius: '16px',
                    background: 'rgba(22,22,26,0.6)',
                    border: '1px solid rgba(165,165,172,0.12)',
                    cursor: 'default',
                    transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    willChange: 'transform, border-color, box-shadow',
                  }}
                >
                  <p
                    className="about-stat-number"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      lineHeight: 1,
                      marginBottom: '8px',
                      transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
                      transformOrigin: 'left center',
                      display: 'inline-block',
                    }}
                  >
                    <AnimatedCounter to={value} suffix={suffix} />
                  </p>
                  <p
                    className="about-stat-label"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--fg-mute)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Profile photo with parallax ── */}
          <div ref={imgRef} style={{ position: 'sticky', top: '100px', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', width: '100%', maxWidth: '380px' }}
            >
              {/* Floating aqua glow card behind photo */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', width: '100%', height: '470px' }}
              >
                {/* Gradient border */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 50%, transparent 100%)',
                    zIndex: 0,
                    opacity: 0.9,
                  }}
                />

                {/* Photo with scroll parallax */}
                <motion.div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    y: smoothPhotoY,
                  }}
                >
                  <img
                    src={profilePic}
                    alt="Shreyansh Patel"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 10%',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                </motion.div>

                {/* Aqua corner accent dot */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    zIndex: 3,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 16px var(--accent)',
                  }}
                />
              </motion.div>

              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 4,
                  background: 'var(--bg-surface)',
                  border: '1px solid rgba(47,230,255,0.3)',
                  borderRadius: '999px',
                  padding: '7px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent)',
                    animation: 'blink 2s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--fg-mute)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Available for projects
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .about-stat-card:hover {
          background: rgba(47, 230, 255, 0.05) !important;
          border-color: rgba(47, 230, 255, 0.4) !important;
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 28px -6px rgba(47, 230, 255, 0.15) !important;
        }
        .about-stat-card:hover .about-stat-number {
          transform: scale(1.12);
        }
        .about-stat-card:hover .about-stat-label {
          color: var(--fg-white) !important;
        }
        .about-fact-chip:hover {
          background: rgba(47, 230, 255, 0.06) !important;
          border-color: rgba(47, 230, 255, 0.35) !important;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px -4px rgba(47, 230, 255, 0.12);
        }
        .about-fact-chip:hover .about-fact-value {
          color: var(--accent) !important;
        }
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          .about-stats {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .about-stats {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
