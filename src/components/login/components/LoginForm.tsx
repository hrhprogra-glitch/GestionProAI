import type { FormEvent } from 'react';
import logo from '../../../assets/Logo-GestiónProIA.png';

interface LoginFormProps {
  email: string; setEmail: (val: string) => void;
  password: string; setPassword: (val: string) => void;
  rememberMe: boolean; setRememberMe: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void; onSwitchToRegister: () => void;
}

export function LoginForm({ email, setEmail, password, setPassword, rememberMe, setRememberMe, onSubmit, onSwitchToRegister }: LoginFormProps) {
  // Inputs con efecto de cristal suave (glassmorphism) en lugar de blanco/negro sólido
  const inputStyle = "w-full px-3.5 py-2.5 bg-white/40 dark:bg-[#16171d]/40 backdrop-blur-md border border-slate-300/60 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all text-slate-900 dark:text-white shadow-sm font-medium text-sm";

  return (
    <div className="w-full h-full flex items-center justify-center p-6 sm:p-12 relative z-10 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Eliminamos el cuadro (bg-white, shadow-2xl, border) para que fluya con el fondo general */}
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <img src={logo} alt="GestiónProIA Logo" className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow-[0_10px_20px_rgba(147,51,234,0.2)]" />
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-500 tracking-tight">
            GestiónProIA
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium text-base">Potencia tu futuro profesional hoy</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 ml-1" htmlFor="email">Correo Electrónico</label>
            <input
              id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              placeholder="profesional@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 ml-1" htmlFor="password">Contraseña</label>
            <input
              id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center pl-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-pink-500 focus:ring-pink-400 accent-pink-500"
              />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recuérdame</span>
            </label>
          </div>

          <button type="submit" className="w-full py-3 mt-3 bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-500 hover:from-amber-500 hover:via-pink-600 hover:to-cyan-600 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(244,114,182,0.25)] transition-all transform hover:-translate-y-1 text-base">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm flex flex-col space-y-3">
          <a href="#" className="text-purple-700 dark:text-purple-400 hover:underline font-bold">¿Olvidaste tu contraseña?</a>
          <div className="pt-6 border-t border-slate-300/40 dark:border-slate-700/40">
            <span className="text-slate-600 dark:text-slate-400 font-medium text-base">¿No tienes cuenta? </span>
            <button onClick={onSwitchToRegister} className="text-teal-700 dark:text-teal-400 hover:underline font-black text-base ml-1">
              Regístrate aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}