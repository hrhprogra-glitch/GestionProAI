interface HistoryWindowProps {
  onBack: () => void;
  onViewReport: (simRole: string) => void;
}

export default function HistoryWindow({ onBack, onViewReport }: HistoryWindowProps) {
  // Datos simulados de trazabilidad basados en tu volumen operativo
  const historyData = [
    { role: 'Análisis de Operaciones y Procesos', specialty: 'Ingeniería / Trainee', mode: 'Técnica', date: '12/06/2026', score: 86 },
    { role: 'Gestión Estratégica y Finanzas', specialty: 'Negocios / Prácticas', mode: 'Aptitudinal', date: '05/06/2026', score: 79 },
    { role: 'Logística y Cadena de Suministros', specialty: 'Operaciones / Remoto', mode: 'Mixta', date: '28/05/2026', score: 91 }
  ];

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-8 overflow-hidden">
      
      {/* Botones de control decorativos */}
      <div className="absolute top-4 left-6 flex items-center gap-1.5 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-rose-500/70 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/70 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
      </div>

      <div className="flex justify-start pt-2">
        <button onClick={onBack} className="flex items-center text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Volver al Panel
        </button>
      </div>

      {/* MÉTRICAS SAAS CONECTADAS CON TU PROYECTO (DAP Y CAPACIDAD) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Entrenamientos Realizados</span>
          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-500 mt-1">3 Sesiones Activas</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Promedio Acumulado</span>
          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 mt-1">85.3% de Competencia</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tiempo de Conectividad</span>
          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-amber-500 mt-1">75.6 Minutos de V.A.</p>
        </div>
      </div>

      {/* TABLA DE TRAZABILIDAD (Paso 21 del DAP del Cursograma Analítico) */}
      <div className="relative z-10 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-950/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-900/60 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Simulación / Rol</th>
              <th className="p-4">Especialidad</th>
              <th className="p-4">Modalidad</th>
              <th className="p-4">Fecha de Ejecución</th>
              <th className="p-4 text-center">Score IA</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            {historyData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <td className="p-4 font-black text-slate-900 dark:text-white">{row.role}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{row.specialty}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                    row.mode === 'Técnica' ? 'bg-pink-500/10 text-pink-600 border border-pink-500/20' :
                    row.mode === 'Aptitudinal' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/20'
                  }`}>
                    {row.mode}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{row.date}</td>
                <td className="p-4 text-center font-black text-slate-900 dark:text-white text-sm">{row.score}%</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onViewReport(row.role)}
                    className="px-3 py-1.5 font-black text-white bg-slate-900 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-amber-400 hover:via-pink-500 hover:to-cyan-500 rounded-xl transition-all shadow-sm"
                  >
                    Ver Reporte
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}