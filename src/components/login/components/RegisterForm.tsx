import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../../supabase';
import logo from '../../../assets/Logo-GestiónProAI.png';

interface RegisterFormProps { onSwitchToLogin: () => void; }

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '', email: '', university: '', career: '', semester: '', goal: '', password: ''
  });

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('usuarios_simulados').insert([
      { nombre: formData.name, correo: formData.email, contrasena: formData.password, universidad: formData.university, carrera: formData.career, ciclo: formData.semester, objetivo: formData.goal }
    ]);
    if (error) return alert(`Error al registrar: ${error.message}`);
    alert("¡Registro guardado exitosamente!");
    onSwitchToLogin();
  };

  const inputStyle = "w-full px-3 py-2 bg-white/40 dark:bg-[#16171d]/40 backdrop-blur-md border border-slate-300/60 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-slate-900 dark:text-white shadow-sm text-sm font-medium";

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Eliminado el cuadro contenedor estricto */}
      <div className="w-full max-w-[420px]">
        
        <div className="text-center mb-4">
          <img src={logo} alt="GestiónProAI Logo" className="w-14 h-14 mx-auto mb-2 object-contain drop-shadow-[0_10px_20px_rgba(20,184,166,0.2)]" />
          <h2 className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-400 tracking-tight">
            Crea tu cuenta
          </h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <input type="text" placeholder="Nombres y Apellidos" className={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Correo Electrónico" className={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="text" placeholder="Universidad" className={inputStyle} onChange={(e) => setFormData({...formData, university: e.target.value})} required />
          
          <select className={`${inputStyle} appearance-none`} onChange={(e) => setFormData({...formData, career: e.target.value})} required>
            <option value="" className="text-slate-500 dark:text-slate-400">Selecciona tu Carrera</option>
            <option>Ingeniería de Gestión Empresarial</option>
            <option>Administración de Empresas</option>
            <option>Negocios Internacionales</option>
            <option>Economía y Finanzas</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Ciclo" className={inputStyle} onChange={(e) => setFormData({...formData, semester: e.target.value})} required />
            <select className={`${inputStyle} appearance-none`} onChange={(e) => setFormData({...formData, goal: e.target.value})} required>
              <option value="" className="text-slate-500 dark:text-slate-400">Objetivo</option>
              <option>Prácticas</option>
              <option>Trainee</option>
              <option>Área de interés</option>
              <option>Modalidad</option>
            </select>
          </div>

          <input type="password" placeholder="Contraseña" className={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />

          <button type="submit" className="w-full py-2.5 mt-3 bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-400 hover:from-cyan-600 hover:via-pink-600 hover:to-amber-500 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-1 text-sm">
            Comenzar Ahora
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-300/40 dark:border-slate-700/40 text-center">
          <span className="text-slate-600 dark:text-slate-400 font-medium">¿Ya tienes cuenta? </span>
          <button onClick={onSwitchToLogin} className="text-purple-700 dark:text-purple-400 hover:underline font-black transition-colors ml-1">
            Inicia Sesión
          </button>
        </div>
      </div>
    </div>
  );
}