import { useEffect, useState } from 'react';
import logo from '../../../assets/Logo-GestiónProIA.png';

interface WelcomeSplashProps {
  onComplete: () => void;
}

export default function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  // Lógica de carga simulada y transición de salida de alta velocidad
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => (p < 100 ? p + 2 : 100)), 40);
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 2500);
    const completeTimer = setTimeout(() => onComplete(), 3200);

    return () => { clearInterval(interval); clearTimeout(fadeTimer); clearTimeout(completeTimer); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0b0f19] transition-all duration-700 ease-in-out ${isFadingOut ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
      <div className="relative flex flex-col items-center">
        
        {/* Aura de fondo cinemática adaptativa */}
        <div className="absolute inset-0 -m-14 bg-gradient-to-r from-purple-600/20 to-teal-600/20 blur-[90px] opacity-40 animate-pulse" />
        
        {/* Logo con efecto de pulso expansivo y levitación */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-teal-500/20 dark:bg-teal-400/20 animate-ping duration-1000" />
          <img 
            src={logo} 
            alt="GestiónProIA Logo" 
            className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(147,51,234,0.25)] animate-[bounce_3s_infinite]"
          />
        </div>
        
        {/* Título original con gradiente e iluminación exacta */}
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-teal-600 to-indigo-600 dark:from-purple-400 dark:via-teal-400 dark:to-indigo-400 tracking-tight animate-pulse">
          GestiónProIA
        </h1>
        
        {/* Subtítulo original con feedback de carga en tiempo real */}
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm tracking-widest uppercase">
          Cargando entorno inteligente... {progress}%
        </p>

        {/* Barra de progreso técnica integrada al flujo cromático */}
        <div className="w-72 h-1 mt-6 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-teal-500 dark:from-teal-400 dark:to-purple-500 shadow-[0_0_12px_rgba(45,212,191,0.6)] transition-all duration-75 ease-linear" 
            style={{ width: `${progress}%` }} 
          />
        </div>

      </div>
    </div>
  );
}