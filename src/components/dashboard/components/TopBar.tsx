import { useState, useEffect, useRef } from 'react';
import logo from '../../../assets/Logo-GestiónProIA.png';

interface TopBarProps {
  userName: string;
  email: string;
  planName?: string;
  userMetadata?: {
    university?: string;
    career?: string;
    role?: string;
  };
  onLogout: () => void;
}

export default function TopBar({ 
  userName, 
  email, 
  planName = "Gestión Pro", 
  userMetadata = { university: "UPC", career: "Ingeniería de Sistemas", role: "Estudiante" }, 
  onLogout 
}: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Referencia al contenedor del dropdown para detectar clics fuera de él
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook para manejar el cierre al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    // Agregamos el event listener al documento
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpieza del event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // Se utiliza z-[100] para garantizar que el menú flote en el nivel máximo del DOM
    <div className="relative z-[100] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 group">
      
      {/* Aura de energía pulsante integrada en el top bar */}
      <div className="absolute -left-4 top-0 w-72 h-12 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 blur-2xl rounded-full animate-pulse pointer-events-none" />
      
      <div className="flex items-center gap-5 relative z-10">
        <img src={logo} alt="GestiónProIA Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-500 tracking-tight drop-shadow-[0_2px_10px_rgba(236,72,153,0.15)]">
            GestiónProIA
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            Optimización de Competencias Laborales mediante Inteligencia Artificial
          </p>
        </div>
      </div>
      
      {/* Panel de usuario con ref asignada para detectar el click outside */}
      <div 
        ref={dropdownRef}
        className="relative flex items-center gap-4 bg-white/70 backdrop-blur-md dark:bg-slate-900/60 py-2 px-4 rounded-2xl border border-pink-500/30 dark:border-cyan-500/30 shadow-[0_0_25px_rgba(236,72,153,0.15)] dark:shadow-[0_0_25px_rgba(6,182,212,0.15)] ml-auto lg:ml-0 w-full lg:w-auto justify-between lg:justify-start overflow-visible"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-500 opacity-80 animate-pulse" />
        
        {/* Trigger interactivo que envuelve el avatar y los textos originales */}
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-all cursor-pointer group/btn"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover/btn:scale-105 transition-transform">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">¡Hola, {userName}!</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">{email}</p>
          </div>
        </button>
        
        {/* Elementos fijos de la derecha manteniendo la estructura original */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            {planName}
          </span>
          <button onClick={onLogout} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all text-xs shadow-sm">
            Salir
          </button>
        </div>

        {/* Desplegable hacia abajo absoluto con los datos extendidos del login */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg rounded-xl border border-pink-500/30 dark:border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-500 dark:text-cyan-400">Sesión Activa</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{userName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{email}</p>
            </div>
            
            <div className="space-y-2.5">
              {userMetadata.university && (
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Universidad</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{userMetadata.university}</span>
                </div>
              )}
              {userMetadata.career && (
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Carrera Profesional</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{userMetadata.career}</span>
                </div>
              )}
              {userMetadata.role && (
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Rol del Sistema</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{userMetadata.role}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}