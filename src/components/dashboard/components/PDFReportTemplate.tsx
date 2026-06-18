import type { EvaluationData, Rubric } from './SimulationResults';

interface PDFReportTemplateProps {
  evaluation: EvaluationData;
}

export default function PDFReportTemplate({ evaluation }: PDFReportTemplateProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 65) return 'text-amber-500';
    return 'text-red-600';
  };

  const rubricLabels: Record<keyof Rubric, string> = {
    estructura: 'Estructura',
    claridad: 'Claridad',
    logica: 'Lógica',
    tiempo: 'Tiempo',
    precision: 'Precisión'
  };

  return (
    // Forzamos un ancho estricto (800px) equivalente a las proporciones de una hoja A4
    <div className="w-[800px] bg-white text-slate-900 p-12 font-sans relative overflow-hidden">
      {/* Barra de acento superior corporativa */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500" />
      
      {/* Cabecera del Documento */}
      <div className="border-b border-slate-200 pb-6 mb-8 mt-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reporte de Desempeño IA</h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">
          GestiónProIA - Evaluación de Competencias
        </p>
      </div>

      <div className="flex gap-8 mb-8">
        {/* Score Principal */}
        <div className="w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-200" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" 
                className={`fill-none ${evaluation.score >= 85 ? 'stroke-emerald-500' : evaluation.score >= 65 ? 'stroke-amber-500' : 'stroke-red-500'}`} 
                strokeWidth="8" 
                strokeDasharray={`${(evaluation.score / 100) * 283} 283`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="text-center relative z-10">
              <span className={`text-3xl font-black ${getScoreColor(evaluation.score)}`}>{evaluation.score}</span>
              <span className="text-slate-400 font-bold text-lg">/100</span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Score Global</p>
        </div>

        {/* Desglose de Rúbrica */}
        <div className="w-2/3 flex flex-col justify-center gap-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Desglose de Rúbrica</h3>
          {evaluation.rubric && Object.entries(evaluation.rubric).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{rubricLabels[key as keyof Rubric]}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fortalezas y Brechas */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <h4 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-3">Fortalezas</h4>
          <ul className="space-y-2">
            {(evaluation.strengths || []).length > 0 ? (
              (evaluation.strengths || []).map((str, idx) => (
                <li key={idx} className="text-slate-700 text-sm flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 font-bold">•</span> {str}
                </li>
              ))
            ) : (<li className="text-slate-500 text-sm italic">Ninguna detectada.</li>)}
          </ul>
        </div>
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h4 className="text-sm font-black text-amber-800 uppercase tracking-wider mb-3">Brechas</h4>
          <ul className="space-y-2">
            {(evaluation.weaknesses || []).length > 0 ? (
              (evaluation.weaknesses || []).map((wk, idx) => (
                <li key={idx} className="text-slate-700 text-sm flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span> {wk}
                </li>
              ))
            ) : (<li className="text-slate-500 text-sm italic">Ninguna detectada.</li>)}
          </ul>
        </div>
      </div>

      {/* Plan de Acción */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h4 className="text-sm font-black text-indigo-800 uppercase tracking-wider mb-3">Plan de Acción Sugerido</h4>
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {evaluation.actionPlan || 'No se proporcionó un plan de acción.'}
        </p>
      </div>

      {/* Pie de página del PDF */}
      <div className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-6">
        Documento generado automáticamente por el motor neuronal de GestiónProIA
      </div>
    </div>
  );
}