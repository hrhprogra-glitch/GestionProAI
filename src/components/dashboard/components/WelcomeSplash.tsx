import { useEffect, useState } from 'react';
import logo from '../../../assets/Logo-GestiónProAI.png';

interface WelcomeSplashProps {
  onComplete: () => void;
}

export default function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Inicia el desvanecimiento un poco antes de terminar
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0b0f19] transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
        {/* Logo con efecto de pulso expansivo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-teal-500/20 dark:bg-teal-400/20 animate-ping duration-1000" />
          <img 
            src={logo} 
            alt="GestiónProAI Logo" 
            className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(147,51,234,0.25)]"
          />
        </div>
        
        {/* Título animado */}
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-teal-600 to-indigo-600 dark:from-purple-400 dark:via-teal-400 dark:to-indigo-400 tracking-tight animate-pulse">
          GestiónProAI
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm tracking-widest uppercase">
          Cargando entorno inteligente...
        </p>
      </div>
    </div>
  );
}