import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Code, Sparkles, ChevronDown, FileText, CheckCircle2 } from 'lucide-react';
import resumePdf from '../Shreyansh Patel - Full Stack Developer.pdf';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 33;

export default function HeroFrameSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Interpolation and animation refs
  const targetFrameRef = useRef(0);
  const currentRenderFrameRef = useRef(0);
  const rafRef = useRef<number>();

  // UI state
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal' | 'stats'>('editor');

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  // Frame rendering on high-DPI canvas with continuous sub-frame blending
  const drawFrame = useCallback((frameFloat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(frameFloat)));
    const nextIndex = Math.min(TOTAL_FRAMES - 1, baseIndex + 1);
    const blendFactor = frameFloat - baseIndex;

    const baseImg = imagesRef.current[baseIndex];
    if (!baseImg || !baseImg.complete || baseImg.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = baseImg.naturalWidth;
    const ih = baseImg.naturalHeight;

    // Aspect ratio cover calculation
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const cx = (cw - nw) / 2;
    const cy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);

    // Draw base frame
    ctx.globalAlpha = 1;
    ctx.drawImage(baseImg, cx, cy, nw, nh);

    // Smoothly blend next frame if interpolating
    if (blendFactor > 0.01 && nextIndex !== baseIndex) {
      const nextImg = imagesRef.current[nextIndex];
      if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
        ctx.globalAlpha = blendFactor;
        ctx.drawImage(nextImg, cx, cy, nw, nh);
      }
    }

    ctx.globalAlpha = 1;
  }, []);

  // Continuous animation loop for physics-based fluid interpolation
  useEffect(() => {
    const loop = () => {
      // Lerp current frame towards target frame for extreme fluidity
      const diff = targetFrameRef.current - currentRenderFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentRenderFrameRef.current += diff * 0.15; // Smooth spring dampening
        drawFrame(currentRenderFrameRef.current);
        const displayNum = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(currentRenderFrameRef.current) + 1));
        setCurrentFrameNum(displayNum);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  // Handle canvas sizing with high-DPI scaling
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    drawFrame(currentRenderFrameRef.current);
  }, [drawFrame]);

  // Preload all 33 frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/frames/frame_${num}.jpg`;

      img.onload = () => {
        if (i === 1) {
          drawFrame(0);
        }
      };
      imgs.push(img);
    }

    imagesRef.current = imgs;
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [drawFrame, updateCanvasSize]);

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Auto-play preview mode
  const toggleAutoPlay = () => {
    if (isPlayingAuto) {
      clearInterval(autoPlayIntervalRef.current);
      setIsPlayingAuto(false);
    } else {
      setIsPlayingAuto(true);
      autoPlayIntervalRef.current = setInterval(() => {
        targetFrameRef.current = (targetFrameRef.current + 1) % TOTAL_FRAMES;
      }, 90);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    
    // Smooth scroll to corresponding point if desired
    if (containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + progress * (containerRef.current.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const scrollToNext = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      id="hero-track"
      style={{
        position: 'relative',
        height: '280vh',
        background: 'var(--bg-void)',
      }}
    >
      {/* Sticky full-screen viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
        }}
      >
        {/* Canvas Frame Sequence Player */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: 'brightness(0.9) contrast(1.05)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Ambient Film Grain & Vignette Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(10,10,11,0.3) 0%, rgba(10,10,11,0.7) 65%, rgba(10,10,11,0.96) 100%),
              linear-gradient(to bottom, rgba(10,10,11,0.5) 0%, transparent 25%, transparent 70%, rgba(10,10,11,0.98) 100%)
            `,
            pointerEvents: 'none',
          }}
        />

        {/* Cyber-Aqua Light Beam from Laptop Screen */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '40%',
            left: '45%',
            transform: 'translate(-50%, -50%)',
            width: '65vw',
            height: '55vh',
            background: 'radial-gradient(circle, rgba(47,230,255,0.09) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Subtle Scan-line Grid Texture */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            opacity: 0.04,
            backgroundImage: `linear-gradient(rgba(47,230,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(47,230,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Top HUD Telemetry Bar */}
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            zIndex: 15,
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
          className="hero-hud-top"
        >
          {/* Status badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(22,22,26,0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(47,230,255,0.2)',
              pointerEvents: 'auto',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
                animation: 'blink 1.5s infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: 'var(--fg-white)',
                textTransform: 'uppercase',
              }}
            >
              SYSTEM ACTIVE · {currentTime || 'IST'}
            </span>
          </div>
        </div>

        {/* Main Foreground Layout */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1360px',
            padding: '0 40px',
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '48px',
            alignItems: 'center',
            pointerEvents: 'auto',
          }}
          className="hero-main-grid"
        >
          {/* Left Column: Branding, Title, Role, CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translateY(${-scrollProgress * 40}px)`,
              opacity: Math.max(0.1, 1 - scrollProgress * 1.3),
              transition: 'transform 0.08s linear, opacity 0.08s linear',
            }}
          >
            {/* Terminal Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(47,230,255,0.06)',
                border: '1px solid rgba(47,230,255,0.3)',
                marginBottom: '20px',
              }}
            >
              <Terminal size={14} style={{ color: 'var(--accent)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent)',
                  letterSpacing: '0.08em',
                }}
              >
                $ whoami --role="full-stack"
              </span>
            </div>

            {/* Giant Title */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(46px, 6.5vw, 84px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
                color: 'var(--fg-white)',
                marginBottom: '18px',
                textShadow: '0 0 40px rgba(0,0,0,0.9)',
              }}
            >
              Shreyansh<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #2FE6FF 60%, #8FF3FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Patel.
              </span>
            </h1>

            {/* Subtitle & Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
              <div
                style={{
                  width: '32px',
                  height: '2px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent)',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(15px, 1.8vw, 19px)',
                  color: 'var(--accent)',
                  letterSpacing: '0.05em',
                  fontWeight: 500,
                }}
              >
                Full Stack Web Developer
              </p>
            </div>

            {/* Value Proposition */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 1.6vw, 17px)',
                color: 'var(--fg-mute)',
                maxWidth: '520px',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}
            >
              Engineering fast, scalable web systems and immersive digital experiences with modern React architecture, robust APIs, and refined motion craft.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <a
                href="#work"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 28px',
                  borderRadius: '999px',
                  border: '1px solid rgba(47,230,255,0.4)',
                  background: 'rgba(22,22,26,0.7)',
                  backdropFilter: 'blur(16px)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  color: 'var(--fg-white)',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.background = 'rgba(47,230,255,0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(47,230,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(47,230,255,0.4)';
                  e.currentTarget.style.background = 'rgba(22,22,26,0.7)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Code size={15} style={{ color: 'var(--accent)' }} />
                View Selected Work
              </a>

              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 30px',
                  borderRadius: '999px',
                  background: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  color: '#0A0A0B',
                  textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(47,230,255,0.35)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-light)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(47,230,255,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(47,230,255,0.35)';
                }}
              >
                <Sparkles size={15} />
                Let's Connect
              </a>

              <a
                href={resumePdf}
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '13px 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(165,165,172,0.2)',
                  background: 'transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--fg-mute)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--fg-white)';
                  e.currentTarget.style.color = 'var(--fg-white)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(165,165,172,0.2)';
                  e.currentTarget.style.color = 'var(--fg-mute)';
                }}
              >
                <FileText size={14} />
                CV
              </a>
            </div>
          </motion.div>

          {/* Right Column: Floating Frosted Glass IDE / Telemetry Inspector */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translateY(${scrollProgress * 20}px)`,
              transition: 'transform 0.08s linear',
            }}
            className="hero-inspector-card"
          >
            <div
              style={{
                background: 'rgba(12,12,14,0.78)',
                backdropFilter: 'blur(28px)',
                borderRadius: '20px',
                border: '1px solid rgba(47,230,255,0.25)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(47,230,255,0.12)',
              }}
            >
              {/* Card Window Header */}
              <div
                style={{
                  padding: '14px 20px',
                  background: 'rgba(22,22,26,0.9)',
                  borderBottom: '1px solid rgba(165,165,172,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f' }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--fg-mute)',
                      marginLeft: '8px',
                    }}
                  >
                    workspace://shreyansh-patel
                  </span>
                </div>

                {/* Tab buttons */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['editor', 'terminal', 'stats'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: activeTab === tab ? 'rgba(47,230,255,0.15)' : 'transparent',
                        border: activeTab === tab ? '1px solid rgba(47,230,255,0.35)' : '1px solid transparent',
                        color: activeTab === tab ? 'var(--accent)' : 'var(--fg-mute)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div style={{ padding: '24px', minHeight: '260px' }}>
                {activeTab === 'editor' && (
                  <div>
                    <pre
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        lineHeight: 1.75,
                        color: 'var(--fg-white)',
                        margin: 0,
                        overflowX: 'auto',
                      }}
                    >
                      <span style={{ color: '#ff7b72' }}>import</span> &#123; <span style={{ color: '#79c0ff' }}>Architect</span>, <span style={{ color: '#79c0ff' }}>Craft</span> &#125; <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'@shreyansh/core'</span>;{'\n\n'}
                      <span style={{ color: '#ff7b72' }}>const</span> <span style={{ color: '#d2a8ff' }}>developer</span> = &#123;{'\n'}
                      {'  '}name: <span style={{ color: '#a5d6ff' }}>'Shreyansh Patel'</span>,{'\n'}
                      {'  '}focus: <span style={{ color: '#a5d6ff' }}>'Full Stack Architecture'</span>,{'\n'}
                      {'  '}proficiency: [<span style={{ color: '#79c0ff' }}>'React'</span>, <span style={{ color: '#79c0ff' }}>'Node'</span>, <span style={{ color: '#79c0ff' }}>'TypeScript'</span>, <span style={{ color: '#79c0ff' }}>'Vite'</span>],{'\n'}
                      {'  '}codeStatus: <span style={{ color: 'var(--accent)' }}>{scrollProgress > 0.5 ? "'Active Coding Stream'" : "'Workspace Ready'"}</span>,{'\n'}
                      {'  '}deployTarget: <span style={{ color: '#a5d6ff' }}>'Production / Scalable Cloud'</span>{'\n'}
                      &#125;;
                    </pre>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8, color: 'var(--fg-mute)' }}>
                      <p style={{ color: 'var(--accent)' }}>$ git status</p>
                      <p>On branch main. Working tree clean.</p>
                      <p style={{ color: 'var(--accent)', marginTop: '8px' }}>$ npm run build</p>
                      <p style={{ color: '#27c93f' }}>✔ TypeScript check: 0 errors</p>
                      <p style={{ color: '#27c93f' }}>✔ 33 Frame Animation: Preloaded & Cached</p>
                      <p style={{ color: '#27c93f' }}>✔ Smooth Scroll (Lenis): 60 FPS Locked</p>
                      <p style={{ color: 'var(--fg-white)', marginTop: '8px' }}>🚀 Ready for deployment & collaboration</p>
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { label: 'Degree', value: 'BSc Computer Science', sub: '2nd Year Student' },
                      { label: 'Stack Depth', value: 'Full Stack', sub: 'Frontend + APIs + DB' },
                      { label: 'Design Craft', value: '3D & Motion', sub: 'GSAP + Three.js' },
                      { label: 'Availability', value: 'Open for Hire', sub: 'Freelance & Roles' },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(165,165,172,0.15)',
                        }}
                      >
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase' }}>
                          {stat.label}
                        </p>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--fg-white)', marginTop: '2px' }}>
                          {stat.value}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--fg-mute)', marginTop: '2px' }}>
                          {stat.sub}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Status */}
              <div
                style={{
                  padding: '12px 20px',
                  background: 'rgba(16,16,20,0.85)',
                  borderTop: '1px solid rgba(165,165,172,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-mute)' }}>
                    Scroll active: {Math.round(scrollProgress * 100)}%
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent)',
                  }}
                >
                  ⚡ High-Performance
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Interactive Frame Scrubber & Navigation Cue */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 0,
            right: 0,
            zIndex: 20,
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
          className="hero-bottom-scrub-bar"
        >
          {/* Scroll Cue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
            onClick={scrollToNext}
          >
            <ChevronDown size={16} style={{ color: 'var(--accent)', animation: 'scroll-hint 1.5s infinite' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--fg-mute)',
              }}
            >
              SCROLL DOWN TO PROGRESS SEQUENCE
            </span>
          </div>

          {/* Interactive Scrub Timeline Track */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              pointerEvents: 'auto',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--fg-mute)' }}>
              SCRUBBER
            </span>
            <div
              onClick={handleTimelineClick}
              style={{
                width: '180px',
                height: '6px',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '3px',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              title="Click or scroll to scrub frames"
            >
              <div
                style={{
                  width: `${Math.max(4, (currentFrameNum / TOTAL_FRAMES) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-deep), var(--accent))',
                  borderRadius: '3px',
                  transition: 'width 0.04s linear',
                }}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
              {currentFrameNum}/33
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-main-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 0 24px !important;
          }
          .hero-inspector-card {
            display: none !important;
          }
          .hero-hud-top {
            padding: 0 20px !important;
            top: 64px !important;
          }
          .hero-bottom-scrub-bar {
            padding: 0 20px !important;
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}
