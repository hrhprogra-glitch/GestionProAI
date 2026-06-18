interface HomeModulesProps {
  setView: (view: 'catalog' | 'performance') => void;
}

export default function HomeModules({ setView }: HomeModulesProps) {
  const modules = [
    { 
      title: 'Simulador de Entrevistas y Casos', 
      desc: 'Entrenamientos inmersivos de alto rendimiento. Adaptación dinámica a roles bajo estrés con rúbricas de evaluación en tiempo real.', 
      badge: 'Módulo Principal',
      auraColor: 'group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] group-hover:border-pink-500/50',
      bgGradient: 'from-pink-500/10 to-purple-600/10 dark:from-pink-500/5 dark:to-purple-600/5',
      iconClass: 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500',
      iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      action: () => setView('catalog') 
    },
    { 
      title: 'Centro de Rendimiento e IA', 
      desc: 'Análisis predictivo de brechas competenciales. Obtén feedback milimétrico y traza rutas de optimización con nuestro motor neuronal.', 
      badge: 'Analítica Avanzada',
      auraColor: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] group-hover:border-cyan-500/50',
      bgGradient: 'from-cyan-500/10 to-blue-600/10 dark:from-cyan-500/5 dark:to-blue-600/5',
      iconClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      action: () => setView('performance')
    }
  ];

  return (
    <div className="pt-4 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Arquitectura de Módulos
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-700 ml-6"></div>
      </div>
      
      {/* Patrón Bento Box con Grid Moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {modules.map((modulo, i) => (
          <div 
            key={i} 
            onClick={modulo.action} 
            className={`group relative p-8 rounded-3xl bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 cursor-pointer transition-all duration-500 hover:-translate-y-2 overflow-hidden ${modulo.auraColor}`}
          >
            {/* Fondo de gradiente reactivo al hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${modulo.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              {/* Iconografía con rotación espacial */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${modulo.iconClass}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={modulo.iconPath} />
                </svg>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-slate-200/50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-full border border-slate-300/50 dark:border-slate-700/50 shadow-inner">
                {modulo.badge}
              </span>
            </div>
            
            <div className="relative z-10">
              <h4 className={`text-2xl font-black mb-3 tracking-tight ${modulo.titleClass}`}>
                {modulo.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {modulo.desc}
              </p>
            </div>

            {/* Flecha indicadora de acción (Aparece al interactuar) */}
            <div className="absolute bottom-8 right-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}