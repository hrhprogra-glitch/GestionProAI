import { useState, useEffect, useRef } from 'react';
import logo from '../../../assets/Logo-GestiónProIA.png';

interface TopBarProps {
  userName: string;
  email: string;
  planName: string; // NUEVO: Obligatorio
  userMetadata?: {
    university?: string;
    career?: string;
    semester?: string;
    role?: string;
  };
  onLogout: () => void;
  onOpenPricing: () => void; 
  onUpdateProfile: (newMeta: any) => void;
  onCancelPlan: () => void; // NUEVO PROP
}

export default function TopBar({ 
  userName, 
  email, 
  planName, 
  userMetadata = {}, 
  onLogout,
  onOpenPricing,
  onUpdateProfile,
  onCancelPlan // NUEVO
}: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    university: userMetadata.university || '',
    career: userMetadata.career || '',
    semester: userMetadata.semester || '', 
    role: userMetadata.role || ''
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = () => {
    setEditData({
      university: userMetadata.university || '',
      career: userMetadata.career || '',
      semester: userMetadata.semester || '', 
      role: userMetadata.role || ''
    });
    setIsEditing(true);
  };

  const saveChanges = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const inputStyle = "w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium";

  return (
    <div className="relative z-[100] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 group">
      
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
      
      <div 
        ref={dropdownRef}
        className="relative flex items-center gap-4 bg-white/70 backdrop-blur-md dark:bg-slate-900/60 py-2 px-4 rounded-2xl border border-pink-500/30 dark:border-cyan-500/30 shadow-[0_0_25px_rgba(236,72,153,0.15)] dark:shadow-[0_0_25px_rgba(6,182,212,0.15)] ml-auto lg:ml-0 w-full lg:w-auto justify-between lg:justify-start overflow-visible"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-500 opacity-80 animate-pulse" />
        
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="flex items-center gap-3 focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 -ml-1.5 rounded-xl transition-all cursor-pointer group/btn"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover/btn:scale-105 transition-transform">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">¡Hola, {userName}!</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">{email}</p>
          </div>
          
          <svg 
            className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div className="flex items-center gap-3 relative z-10 pl-3 border-l border-slate-200 dark:border-slate-700">
          
          <button 
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Mejorar Plan
          </button>

          {/* NUEVO: Contenedor del Plan con botón de cancelar */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase transition-colors ${
              planName === 'Plan Élite' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' : 
              planName === 'Plan Profesional' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' :
              'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              {planName}
            </span>
            {planName !== 'Gestión Gratis' && (
              <button 
                onClick={onCancelPlan} 
                className="text-[9px] text-red-500 hover:text-red-600 underline font-bold tracking-wide transition-colors"
              >
                Cancelar Plan
              </button>
            )}
          </div>

          <button onClick={onLogout} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all text-xs shadow-sm ml-1">
            Salir
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg rounded-xl border border-pink-500/30 dark:border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            
            {isEditing ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 dark:text-cyan-400 mb-1 block">Universidad</label>
                  <input className={inputStyle} value={editData.university} onChange={(e) => setEditData({...editData, university: e.target.value})} placeholder="Ej: Universidad de Lima" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 dark:text-cyan-400 mb-1 block">Carrera</label>
                  <input className={inputStyle} value={editData.career} onChange={(e) => setEditData({...editData, career: e.target.value})} placeholder="Ej: Ingeniería Industrial" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-pink-500 dark:text-cyan-400 mb-1 block">Ciclo</label>
                    <input type="text" className={inputStyle} value={editData.semester} onChange={(e) => setEditData({...editData, semester: e.target.value})} placeholder="Ej: 8" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-pink-500 dark:text-cyan-400 mb-1 block">Objetivo</label>
                    <input className={inputStyle} value={editData.role} onChange={(e) => setEditData({...editData, role: e.target.value})} placeholder="Ej: Prácticas" />
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button onClick={() => setIsEditing(false)} className="w-1/2 py-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button onClick={saveChanges} className="w-1/2 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg shadow-md transition-all">
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-500 dark:text-cyan-400">Sesión Activa</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{userName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{email}</p>
                </div>
                
                <div className="space-y-2.5 mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">Universidad</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {userMetadata.university || 'No especificada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">Carrera Profesional</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {userMetadata.career || 'No especificada'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">Ciclo</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {userMetadata.semester ? `${userMetadata.semester}º` : 'No det.'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">Objetivo</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {userMetadata.role || 'No det.'}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleEditClick} 
                  className="w-full mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-black text-pink-600 dark:text-cyan-400 hover:underline flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  Modificar Perfil
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}