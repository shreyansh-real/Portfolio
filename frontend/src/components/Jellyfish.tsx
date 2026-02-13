import { useEffect, useState } from 'react';
import '../styles/jellyfish.css';

function Jellyfish() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let vx = (Math.random() - 0.5) * 2;
    let vy = (Math.random() - 0.5) * 2;

    const animate = () => {
      // Update position
      x += vx;
      y += vy;

      // Bounce off walls
      if (x <= 0 || x >= window.innerWidth - 80) vx *= -1;
      if (y <= 0 || y >= window.innerHeight - 100) vy *= -1;

      // Add slight randomness
      vx += (Math.random() - 0.5) * 0.2;
      vy += (Math.random() - 0.5) * 0.2;

      // Limit speed
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 2) {
        vx = (vx / speed) * 2;
        vy = (vy / speed) * 2;
      }

      setPosition({ x: Math.max(0, Math.min(x, window.innerWidth - 80)), y: Math.max(0, Math.min(y, window.innerHeight - 100)) });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      x = Math.min(x, window.innerWidth - 80);
      y = Math.min(y, window.innerHeight - 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-20 hidden lg:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="jellyfish">
        {/* Head/Body */}
        <div className="jellyfish-head"></div>

        {/* Tentacles */}
        <div className="tentacle tentacle-1"></div>
        <div className="tentacle tentacle-2"></div>
        <div className="tentacle tentacle-3"></div>
        <div className="tentacle tentacle-4"></div>
        <div className="tentacle tentacle-5"></div>
      </div>
    </div>
  );
}

export default Jellyfish;
