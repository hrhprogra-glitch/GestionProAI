interface HomeModulesProps {
  setView: (view: 'catalog' | 'feedback' | 'history') => void;
}

export default function HomeModules({ setView }: HomeModulesProps) {
  const modules = [
    { 
      title: 'Simulador de Entrevistas y Casos', 
      desc: 'Entrenamientos adaptados a roles reales bajo presión. Carga de rúbricas automáticas según el estándar del mercado.', 
      badge: 'Core del DAP',
      auraColor: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.35)] group-hover:border-pink-500/40',
      iconClass: 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600',
      action: () => setView('catalog') 
    },
    { 
      title: 'Feedback IA Inmediato', 
      desc: 'Visualización analítica de tu score final, mapa de brechas críticas identificadas y acciones correctivas.', 
      badge: 'Módulo de Valor',
      auraColor: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] group-hover:border-cyan-500/40',
      iconClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600',
      action: () => setView('feedback')
    },
    { 
      title: 'Historial y Trazabilidad', 
      desc: 'Almacenamiento continuo de tu evolución funcional para medir el incremento de tus competencias.', 
      badge: 'SaaS Analytics',
      auraColor: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] group-hover:border-amber-500/40',
      iconClass: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600',
      action: () => setView('history')
    }
  ];

  return (
    <div className="pt-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
        Módulos Estratégicos de la Plataforma
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((modulo, i) => (
          <div key={i} onClick={modulo.action} className={`group relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border border-white dark:border-slate-800/80 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1 ${modulo.auraColor}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${modulo.iconClass}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                {modulo.badge}
              </span>
            </div>
            <h4 className={`text-xl font-black mb-2 ${modulo.titleClass}`}>{modulo.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{modulo.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}