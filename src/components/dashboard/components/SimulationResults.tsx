import { useEffect, useState } from 'react';

export interface Rubric {
  estructura: number;
  claridad: number;
  logica: number;
  tiempo: number;
  precision: number;
}

export interface EvaluationData {
  score: number;
  rubric: Rubric;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string;
}

interface SimulationResultsProps {
  evaluation: EvaluationData | null;
  audioUrl?: string | null; 
  onReturnHome: () => void;
}

export default function SimulationResults({ evaluation, audioUrl, onReturnHome }: SimulationResultsProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-slate-500 animate-pulse font-medium">Cargando resultados de la evaluación IA...</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 65) return 'text-amber-500';
    return 'text-red-500';
  };

  const handleDownloadPDF = () => {
    window.print(); 
  };

  const rubricLabels: Record<keyof Rubric, string> = {
    estructura: 'Estructura',
    claridad: 'Claridad',
    logica: 'Lógica',
    tiempo: 'Tiempo',
    precision: 'Precisión'
  };

  return (
    <div className={`pt-4 animate-in duration-700 fade-in slide-in-from-bottom-8 ${show ? 'opacity-100' : 'opacity-0'} w-full max-w-4xl mx-auto`}>
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl relative overflow-hidden print:shadow-none print:border-none print:p-0 print:bg-white">
        
        <div className="absolute top-8 right-8 flex gap-3 print:hidden z-20">
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:scale-105 transition-transform shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Descargar PDF
          </button>
        </div>

        <div className="text-center mb-10 relative z-10 print:mt-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-black tracking-widest uppercase mb-4 print:bg-slate-100 print:text-slate-800">
            Reporte de Desempeño IA
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight print:text-black">
            Análisis de la Simulación
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-inner print:border-slate-300">
            <div className="relative flex items-center justify-center w-40 h-40">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-200 dark:stroke-slate-800 print:stroke-slate-200" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" 
                  className={`fill-none ${evaluation.score >= 85 ? 'stroke-emerald-500' : evaluation.score >= 65 ? 'stroke-amber-500' : 'stroke-red-500'} transition-all duration-1000`} 
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
            <p className="mt-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400 print:text-slate-600">
              Score Global de Competencia
            </p>

            {audioUrl && (
              <div className="mt-8 w-full print:hidden animate-in fade-in zoom-in duration-500">
                <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 block text-center">Tu grabación de la entrevista:</span>
                <audio src={audioUrl} controls className="w-full h-10 rounded-xl" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 print:text-slate-800">
              Desglose de Evaluación (Rúbrica)
            </h4>
            {evaluation.rubric ? (
              Object.entries(evaluation.rubric).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 print:text-slate-600">
                    <span>{rubricLabels[key as keyof Rubric]}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden print:bg-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-1000 print:bg-slate-800 print:from-slate-800 print:to-slate-800" 
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No se recuperó el desglose de la rúbrica.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 print:bg-white print:border-emerald-300">
            <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2 print:text-emerald-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Fortalezas Demostradas
            </h4>
            <ul className="space-y-2">
              {/* SOLUCIÓN: Agregamos || [] por si la IA no devuelve strengths */}
              {(evaluation.strengths || []).length > 0 ? (
                (evaluation.strengths || []).map((str, idx) => (
                  <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2 print:text-slate-800">
                    <span className="text-emerald-500 font-bold">•</span> {str}
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-sm italic">Ninguna detectada.</li>
              )}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 print:bg-white print:border-amber-300">
            <h4 className="text-sm font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2 print:text-amber-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Brechas Detectadas
            </h4>
            <ul className="space-y-2">
              {/* SOLUCIÓN: Agregamos || [] por si la IA no devuelve weaknesses */}
              {(evaluation.weaknesses || []).length > 0 ? (
                (evaluation.weaknesses || []).map((wk, idx) => (
                  <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2 print:text-slate-800">
                    <span className="text-amber-500 font-bold">•</span> {wk}
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-sm italic">Ninguna detectada.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-indigo-500/20 relative z-10 print:bg-white print:border-indigo-300">
          <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2 print:text-indigo-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Plan de Acción Sugerido
          </h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap print:text-slate-800">
            {evaluation.actionPlan || 'No se proporcionó un plan de acción.'}
          </p>
        </div>

        <div className="mt-10 flex justify-center relative z-10 print:hidden">
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