import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Smooth ring position (lagged behind the dot)
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'text' | 'click'>('default');
  const stateRef = useRef(cursorState);
  stateRef.current = cursorState;

  const updateState = (next: 'default' | 'hover' | 'text' | 'click') => {
    if (stateRef.current !== next) {
      stateRef.current = next;
      setCursorState(next);
    }
  };

  useEffect(() => {
    // Hide system cursor
    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onDown = () => updateState('click');
    const onUp = () => updateState('default');

    // Delegates for interactive + text elements
    const onOverDelegate = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;
      if (
        el.closest('a, button, [role="button"], label, select') ||
        el.matches('[data-cursor="hover"]')
      ) {
        updateState('hover');
      } else if (
        el.matches('p, h1, h2, h3, h4, span, li, pre, code') ||
        el.closest('p, pre, code')
      ) {
        updateState('text');
      } else {
        updateState('default');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOverDelegate, { passive: true });

    // Lerp animation loop for the ring
    const loop = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOverDelegate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Derived styles per cursor state
  const ringSize = cursorState === 'hover' ? 44 : cursorState === 'click' ? 20 : cursorState === 'text' ? 3 : 32;
  const ringOpacity = cursorState === 'text' ? 0 : 1;
  const dotSize = cursorState === 'hover' ? 6 : cursorState === 'click' ? 10 : cursorState === 'text' ? 2 : 6;
  const dotColor = cursorState === 'hover' ? '#2FE6FF' : cursorState === 'click' ? '#8FF3FF' : '#2FE6FF';
  const ringBorderColor = cursorState === 'hover' ? 'var(--accent)' : 'rgba(47,230,255,0.5)';
  const ringBg = cursorState === 'hover' ? 'rgba(47,230,255,0.08)' : 'transparent';

  return (
    <>
      {/* Trailing ring (follows with lag) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform',
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          marginLeft: `-${ringSize / 2}px`,
          marginTop: `-${ringSize / 2}px`,
          borderRadius: '50%',
          border: `1.5px solid ${ringBorderColor}`,
          background: ringBg,
          opacity: ringOpacity,
          transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.2s, background 0.2s, opacity 0.2s, margin 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Inner aqua shimmer */}
        {cursorState === 'hover' && (
          <div
            style={{
              position: 'absolute',
              inset: '4px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(47,230,255,0.15) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Dot (instant, no lag) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100000,
          pointerEvents: 'none',
          willChange: 'transform',
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          marginLeft: `-${dotSize / 2}px`,
          marginTop: `-${dotSize / 2}px`,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: cursorState !== 'default'
            ? `0 0 10px ${dotColor}, 0 0 20px ${dotColor}40`
            : '0 0 6px rgba(47,230,255,0.8)',
          transition: 'width 0.2s cubic-bezier(0.16,1,0.3,1), height 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s, background 0.2s, margin 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </>
  );
}
