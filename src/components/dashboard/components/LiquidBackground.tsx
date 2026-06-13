import { useEffect, useRef } from 'react';

export default function LiquidBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        bgRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        bgRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-pink-50/20 to-cyan-50/40 dark:from-slate-950 dark:via-slate-900/80 dark:to-cyan-950/20" />
      <div 
        className="absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          background: `
            radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(236,72,153,0.12), transparent 40%),
            radial-gradient(600px circle at calc(var(--mouse-x, 50%) + 150px) calc(var(--mouse-y, 50%) + 100px), rgba(6,182,212,0.12), transparent 40%),
            radial-gradient(700px circle at calc(var(--mouse-x, 50%) - 150px) calc(var(--mouse-y, 50%) - 100px), rgba(245,158,11,0.1), transparent 40%)
          `
        }}
      />
    </div>
  );
}