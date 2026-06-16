// src/components/dashboard/components/UserDropdown.tsx
import { useState } from 'react';

interface UserDropdownProps {
  userName: string;
  email: string;
  plan: string;
  onLogout: () => void;
}

export default function UserDropdown({ userName, email, plan, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 focus:outline-none w-full justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(236,72,153,0.5)]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden sm:block">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">¡Hola, {userName}!</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">{email}</p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <span className="inline-block mb-2 px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase rounded-lg border border-cyan-500/30">
              Plan: {plan}
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}