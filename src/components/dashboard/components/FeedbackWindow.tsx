import { useState } from 'react';

interface FeedbackWindowProps {
  onBack: () => void;
  initialSim?: string;
}

export default function FeedbackWindow({ onBack, initialSim }: FeedbackWindowProps) {
  // Reportes reales con datos técnicos del proyecto
  const reports = [
    {
      id: 'sim-1',
      role: 'Análisis de Operaciones y Procesos',
      type: 'Ingeniería / Trainee',
      date: '12/06/2026',
      score: 86,
      metrics: [
        { name: 'Estructura Lógica y Fluidez', score: 90, color: 'bg-pink-500' },
        { name: 'Propuesta Técnica y Arquitectura', score: 82, color: 'bg-cyan-500' },
        { name: 'Comunicación y Lenguaje Profesional', score: 88, color: 'bg-amber-500' }
      ],
      gaps: [
        'Falta profundizar en el análisis del factor de pico (Estándar UIT-T) para mitigar latencia en horas punta durante las simulaciones.',
        'Se recomienda justificar con mayor rigor el margen de seguridad superior al 30% en la capacidad de balance de servidores AWS.'
      ],
      strengths: [
        'Excelente dominio conceptual del Diagrama de Análisis de Procesos (DAP) y los tiempos de ciclo totales del servicio (27.2 min).',
        'Sólida articulación de la propuesta de valor orientada a mitigar el subempleo profesional de egresados en Lima Metropolitana.'
      ],
      actionPlan: 'Revisar la documentación técnica del proyecto sobre AWS On-Demand y practicar la estructuración de respuestas bajo el método STAR para optimizar el bloque técnico de la entrevista.'
    },
    {
      id: 'sim-2',
      role: 'Gestión Estratégica y Finanzas',
      type: 'Negocios / Prácticas',
      date: '05/06/2026',
      score: 79,
      metrics: [
        { name: 'Viabilidad Financiera y Costos', score: 72, color: 'bg-pink-500' },
        { name: 'Segmentación y Conocimiento del Mercado', score: 86, color: 'bg-cyan-500' },
        { name: 'Resolución de Casos de Negocio', score: 79, color: 'bg-amber-500' }
      ],
      gaps: [
        'Se requiere mayor precisión al modelar el costo variable unitario (desglose exacto de comisiones fijas de CulqiLink y consumo de tokens de OpenAI).',
        'Se omitió detallar la alta estacionalidad de suscripciones universitarias detectada en los periodos Marzo-Mayo y Agosto-Octubre.'
      ],
      strengths: [
        'Impecable delimitación del mercado objetivo estimado (624k universitarios de pregrado en Lima, priorizando facultades afines desde ciclo 6to).',
        'Gran entendimiento de la elasticidad de precios validada en las encuestas del grupo (planes comerciales de S/25 a S/55 mensuales).'
      ],
      actionPlan: 'Repasar la matriz de costos fijos mensuales de mantenimiento digital y los presupuestos variables de pauta publicitaria (CAC por Meta/TikTok Ads).'
    }
  ];

  // Sincroniza el reporte inicial si viene desde el historial
  const [activeIdx, setActiveIdx] = useState(() => {
    if (initialSim) {
      const found = reports.findIndex(r => r.role === initialSim);
      if (found !== -1) return found;
    }
    return 0;
  });

  const currentReport = reports[activeIdx];

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-8 overflow-hidden">
      
      {/* Botones estéticos de control cibernético */}
      <div className="absolute top-4 left-6 flex items-center gap-1.5 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-rose-500/70 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/70 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <button onClick={onBack} className="flex items-center text-xs font-bold text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Volver al Panel
        </button>
        
        {/* Selector interactivo de reportes guardados */}
        <div className="flex items-center gap-2 w-full sm:w-auto relative z-10">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Historial de Reportes:</label>
          <select 
            value={activeIdx}
            onChange={(e) => setActiveIdx(Number(e.target.value))}
            className="w-full sm:w-auto text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {reports.map((r, idx) => (
              <option key={r.id} value={idx}>{r.role} ({r.date})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* COLUMNA DE MÉTRICAS */}
        <div className="space-y-6 bg-slate-50/60 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 uppercase tracking-wider border border-cyan-500/20">
              {currentReport.type}
            </span>
            <h4 className="text-base font-black text-slate-900 dark:text-white mt-2 leading-tight">
              {currentReport.role}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Analizado el {currentReport.date}</p>
          </div>

          {/* Anillo de Score IA */}
          <div className="flex justify-center items-center py-2">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-center">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 to-blue-600">
                  {currentReport.score}%
                </span>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">Score Global</p>
              </div>
            </div>
          </div>

          {/* Rúbricas analíticas */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rúbrica de Evaluación</h5>
            {currentReport.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{m.name}</span>
                  <span>{m.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DE DETALLES CONCEPTUALES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <h5 className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Fortalezas Clave de la Sesión
            </h5>
            <ul className="list-disc list-inside space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentReport.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/20 space-y-2">
            <h5 className="text-sm font-black text-pink-700 dark:text-pink-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Brechas Críticas Detectadas
            </h5>
            <ul className="list-disc list-inside space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentReport.gaps.map((g, idx) => <li key={idx}>{g}</li>)}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/5 to-pink-500/5 dark:from-amber-500/10 dark:to-pink-500/10 border border-amber-500/20 dark:border-pink-500/20 space-y-1">
            <h5 className="text-sm font-black text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Acciones Correctivas Recomendadas por la IA
            </h5>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
              {currentReport.actionPlan}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}