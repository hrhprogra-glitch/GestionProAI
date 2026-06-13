import { useEffect, useState } from 'react';

// Esta interfaz define la estructura del JSON que la IA nos devolverá en el paso de evaluación
export interface EvaluationData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string;
}

interface SimulationResultsProps {
  evaluation: EvaluationData | null;
  onReturnHome: () => void;
}

export default function SimulationResults({ evaluation, onReturnHome }: SimulationResultsProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  // Si aún no hay evaluación (ej. está cargando o hubo un error), mostramos un fallback
  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-slate-500">Cargando resultados...</p>
      </div>
    );
  }

  // Lógica para el color del score
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 65) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className={`pt-4 animate-in duration-700 fade-in slide-in-from-bottom-8 ${show ? 'opacity-100' : 'opacity-0'} w-full max-w-4xl mx-auto`}>
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Cabecera del Reporte */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-black tracking-widest uppercase mb-4">
            Reporte de Desempeño
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Análisis de la Simulación
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Columna Izquierda: Score Global */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-inner">
            <div className="relative flex items-center justify-center w-40 h-40">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" 
                  className={`fill-none ${evaluation.score >= 85 ? 'stroke-green-500' : evaluation.score >= 65 ? 'stroke-amber-500' : 'stroke-red-500'} transition-all duration-1000`} 
                  strokeWidth="8" 
                  strokeDasharray={`${(evaluation.score / 100) * 283} 283`} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="text-center">
                <span className={`text-4xl font-black ${getScoreColor(evaluation.score)}`}>{evaluation.score}</span>
                <span className="text-slate-400 text-xl font-bold">/100</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400">
              Score de Competencia
            </p>
          </div>

          {/* Columna Derecha: Detalles */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Fortalezas */}
            <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10">
              <h4 className="text-sm font-black text-green-700 dark:text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Fortalezas Demostradas
              </h4>
              <ul className="space-y-2">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span> {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Brechas */}
            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
              <h4 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Brechas Detectadas
              </h4>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((wk, idx) => (
                  <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span> {wk}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Plan de Acción */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-indigo-500/20 relative z-10">
          <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Plan de Acción Sugerido
          </h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {evaluation.actionPlan}
          </p>
        </div>

        {/* Botón de salida */}
        <div className="mt-10 flex justify-center relative z-10">
          <button 
            onClick={onReturnHome}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-slate-900/20 dark:shadow-white/20"
          >
            Volver al Panel Principal
          </button>
        </div>

      </div>
    </div>
  );
}