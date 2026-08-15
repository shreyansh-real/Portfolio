import { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 33;
const FPS = 12;

export default function HeroFramesBg() {
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const interval = 1000 / FPS;

    const tick = (time: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (time - lastTimeRef.current < interval) return;
      lastTimeRef.current = time;

      frameRef.current = (frameRef.current + 1) % TOTAL_FRAMES;
      const num = String(frameRef.current + 1).padStart(3, '0');
      if (imgRef.current) {
        imgRef.current.src = `/frames/frame_${num}.jpg`;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Animated frames */}
      <img
        ref={imgRef}
        src="/frames/frame_001.jpg"
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.38,
          filter: 'brightness(0.7) saturate(0.8)',
          display: 'block',
          pointerEvents: 'none',
        }}
        loading="eager"
      />

      {/* Gradient overlay — ensures text legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              rgba(10,10,11,0.30) 0%,
              rgba(10,10,11,0.50) 50%,
              rgba(10,10,11,0.92) 100%
            )
          `,
        }}
      />

      {/* Subtle aqua vignette at bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle at 0% 100%, rgba(47,230,255,0.06), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
