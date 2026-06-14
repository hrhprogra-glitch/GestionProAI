import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

interface FeedbackWindowProps {
  onBack: () => void;
  initialSim?: string;
}

export default function FeedbackWindow({ onBack, initialSim }: FeedbackWindowProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedReports = data.map((item: any) => {
            // Extraemos el JSON guardado por la IA
            const fb = item.feedback || {};
            const rubric = fb.rubric || {};
            
            return {
              id: item.id.toString(),
              role: item.role,
              type: item.difficulty,
              date: new Date(item.created_at).toLocaleDateString(),
              score: item.score || 0,
              // Mapeamos la rúbrica de la IA a las barras de progreso
              metrics: [
                { name: 'Estructura Lógica y Fluidez', score: rubric.logica || rubric.estructura || 0, color: 'bg-pink-500' },
                { name: 'Propuesta Técnica y Precisión', score: rubric.precision || 0, color: 'bg-cyan-500' },
                { name: 'Comunicación y Claridad', score: rubric.claridad || rubric.tiempo || 0, color: 'bg-amber-500' }
              ],
              gaps: fb.weaknesses || ['No se detectaron brechas.'],
              strengths: fb.strengths || ['No hay fortalezas registradas.'],
              actionPlan: fb.actionPlan || 'Sigue practicando.'
            };
          });

          setReports(formattedReports);

          // Si el usuario llega desde el botón "Ver Reporte" del Historial
          if (initialSim) {
            const found = formattedReports.findIndex((r: any) => r.role === initialSim);
            if (found !== -1) setActiveIdx(found);
          }
        }
      } catch (err) {
        console.error('Error cargando reportes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [initialSim]);

  // Pantalla de carga mientras se lee la base de datos
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-cyan-500/30">
        <p className="text-slate-500 font-bold animate-pulse">Cargando tus reportes de IA...</p>
      </div>
    );
  }

  // Qué mostrar si el usuario entra pero aún no ha hecho simulaciones
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-cyan-500/30 p-8 text-center space-y-4">
        <p className="text-slate-500 font-bold">Aún no tienes simulaciones completadas para analizar.</p>
        <button onClick={onBack} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
          Volver al Panel
        </button>
      </div>
    );
  }

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
            {currentReport.metrics.map((m: any, idx: number) => (
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
              {currentReport.strengths.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/20 space-y-2">
            <h5 className="text-sm font-black text-pink-700 dark:text-pink-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Brechas Críticas Detectadas
            </h5>
            <ul className="list-disc list-inside space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentReport.gaps.map((g: string, idx: number) => <li key={idx}>{g}</li>)}
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