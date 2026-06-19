interface SimData { role: string; type: string; diff: string; }

interface CatalogWindowProps {
  onBack: () => void;
  onSelectSim: (sim: SimData) => void;
}

export default function CatalogWindow({ onBack, onSelectSim }: CatalogWindowProps) {
  // Asignamos una identidad visual permanente de marca a cada simulación y marcamos todos los niveles
  const sims = [
    { 
      role: 'Análisis de Operaciones y Procesos', 
      type: 'Ingeniería / Trainee', 
      diff: 'Básico, Intermedio, Avanzado',
      borderClass: 'border-pink-500/30 dark:border-pink-500/20 shadow-[0_4px_20px_rgba(236,72,153,0.05)] hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] hover:border-pink-500/50',
      badgeClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600',
      btnClass: 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/20 hover:shadow-pink-500/40'
    },
    { 
      role: 'Gestión Estratégica y Finanzas', 
      type: 'Negocios / Prácticas', 
      diff: 'Básico, Intermedio, Avanzado',
      borderClass: 'border-cyan-500/30 dark:border-cyan-500/20 shadow-[0_4px_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-cyan-500/50',
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600',
      btnClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:shadow-cyan-500/40'
    },
    { 
      role: 'Dirección Comercial y Administración', 
      type: 'Negocios / Trainee', 
      diff: 'Básico, Intermedio, Avanzado',
      borderClass: 'border-amber-500/30 dark:border-amber-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-amber-500/50',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600',
      btnClass: 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-amber-500/20 hover:shadow-amber-500/40'
    },
    { 
      role: 'Evaluación de Proyectos de Inversión', 
      type: 'Ingeniería y Negocios', 
      diff: 'Básico, Intermedio, Avanzado',
      borderClass: 'border-pink-500/30 dark:border-cyan-500/20 shadow-[0_4px_20px_rgba(236,72,153,0.05)] hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] hover:border-purple-500/50',
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500',
      btnClass: 'bg-gradient-to-r from-purple-500 to-cyan-500 shadow-purple-500/20 hover:shadow-purple-500/40'
    },
    { 
      role: 'Logística y Cadena de Suministros', 
      type: 'Operaciones / Remoto', 
      diff: 'Básico, Intermedio, Avanzado',
      borderClass: 'border-amber-500/30 dark:border-cyan-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-orange-500/50',
      badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      titleClass: 'bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-cyan-500',
      btnClass: 'bg-gradient-to-r from-amber-400 to-cyan-500 shadow-orange-500/20 hover:shadow-cyan-500/40'
    }
  ];

  return (
    <div className="pt-2 relative">
      {/* Consola flotante principal con aura perimetral completa */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 border border-pink-500/30 dark:border-cyan-500/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] dark:shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-8 overflow-hidden">
        
        {/* Controles estéticos decorativos estilo ventana Mac/Linux */}
        <div className="absolute top-4 left-6 flex items-center gap-1.5 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-rose-500/70 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Botón Volver con hover dinámico de marca */}
        <div className="flex justify-start pt-2">
          <button 
            onClick={onBack} 
            className="flex items-center text-xs font-bold text-slate-500 hover:text-pink-500 dark:hover:text-cyan-400 transition-colors gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Cerrar Módulo
          </button>
        </div>

        {/* Título y subtítulos centralizados de la consola */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-[10px] font-bold bg-gradient-to-r from-pink-500/10 to-cyan-500/10 text-pink-600 dark:text-cyan-400 px-3 py-1.5 rounded-lg border border-pink-500/30 dark:border-cyan-500/30 tracking-wide uppercase shadow-[0_0_15px_rgba(236,72,153,0.1)]">
            Paso 3 del Flujo DAP: Ejecución Operativa
          </span>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Módulo de Simulación Aptitudinal y Técnica
          </h3>
          
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wide bg-slate-100/50 dark:bg-slate-950/40 py-2 px-4 rounded-xl w-fit mx-auto border border-slate-200/50 dark:border-slate-800/60 shadow-inner">
            Modalidades del Sistema:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-500 font-black mx-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">Aptitudinal</span> • 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 font-black mx-1 drop-shadow-[0_0_8px_rgba(236,72,153,0.2)]">Técnica</span> • 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-amber-500 font-black mx-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.2)]">Mixta</span>
          </p>
        </div>

        {/* Catálogo de simulaciones con auras y botones permanentes a color */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {sims.map((sim, i) => (
            <div 
              key={i} 
              className={`p-5 rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border text-left shadow-sm hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between ${sim.borderClass}`}
            >
              <div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-md border inline-block mb-3 ${sim.badgeClass}`}>
                  {sim.type}
                </span>
                
                {/* Título de la simulación a color permanente */}
                <h4 className={`text-base font-black mb-2 leading-snug ${sim.titleClass}`}>
                  {sim.role}
                </h4>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                    Niveles Disponibles:
                  </span>
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold mt-0.5">
                    {sim.diff}
                  </span>
                </div>
                
                {/* Botón a color permanente con sombra energética */}
                <button 
                  onClick={() => onSelectSim({ role: sim.role, type: sim.type, diff: sim.diff })} 
                  className={`text-xs font-black text-white px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 ${sim.btnClass}`}
                >
                  Iniciar Sala
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}