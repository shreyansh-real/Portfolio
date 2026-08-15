import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<'show' | 'exit' | 'done'>('show');

  useEffect(() => {
    // Super fast sequence:
    // 0ms - 450ms: Quick brand mark pulse & line sweep
    // 450ms - 900ms: Rapid curtain slide up reveal
    const t1 = setTimeout(() => setPhase('exit'), 450);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Fast Sliding Overlay Curtain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-void)',
          transform: phase === 'exit' ? 'translateY(-100%)' : 'translateY(0%)',
          transition: phase === 'exit' ? 'transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(47,230,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(47,230,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.8,
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: phase === 'exit' ? 0 : 1,
            transform: phase === 'exit' ? 'translateY(-20px)' : 'translateY(0)',
            transition: phase === 'exit' ? 'opacity 0.25s ease, transform 0.25s ease' : 'none',
            position: 'relative',
            zIndex: 3,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 54px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--fg-white)',
                lineHeight: 1,
              }}
            >
              Shreyansh
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 54px)',
                fontWeight: 800,
                color: 'var(--accent)',
                lineHeight: 1,
                marginLeft: '1px',
                textShadow: '0 0 24px rgba(47,230,255,0.8)',
              }}
            >
              .
            </span>
          </div>

          {/* Fast loading indicator line */}
          <div
            style={{
              width: '140px',
              height: '2px',
              background: 'rgba(165,165,172,0.15)',
              borderRadius: '999px',
              position: 'relative',
              overflow: 'hidden',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
                borderRadius: '999px',
                animation: 'fast-sweep 0.4s ease-out forwards',
              }}
            />
          </div>
        </div>

        {/* Bottom accent glow line attached to curtain edge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            boxShadow: '0 0 16px var(--accent)',
          }}
        />
      </div>

      <style>{`
        @keyframes fast-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
