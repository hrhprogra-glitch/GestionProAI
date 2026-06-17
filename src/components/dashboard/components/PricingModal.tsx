import { useState } from 'react';

interface PricingModalProps {
  onClose: () => void;
  onSelectPlan: (plan: string) => void; // NUEVO PROP
}

export default function PricingModal({ onClose, onSelectPlan }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSimulatePurchase = (plan: string) => {
    setSelectedPlan(plan);
    // Simulamos un retraso de pasarela de pago y luego llamamos a actualizar DB
    setTimeout(() => {
      onSelectPlan(plan);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#16171d] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-amber-400/20 via-pink-500/10 to-transparent pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors z-20 bg-slate-100 dark:bg-slate-800 p-2 rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="p-6 sm:p-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Potencia tu Perfil Profesional
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Elige el plan que mejor se adapte a tus metas. Desbloquea simulaciones multimodales y destaca en el mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* PLAN PROFESIONAL */}
            <div className="relative flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 py-1 px-2.5 rounded-lg border border-cyan-500/20">Plan Profesional</span>
                <div className="mt-3 flex items-baseline text-slate-900 dark:text-white">
                  <span className="text-3xl font-black tracking-tight">$9.99</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">/mes</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Ideal para preparar la estructura de tus entrevistas.</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  'Acceso al Nivel Básico (Chat de texto)',
                  'Acceso al Nivel Intermedio (Cámara y Audio)',
                  'Evaluaciones IA inmediatas',
                  'Métricas de desempeño y Rúbricas',
                  'Análisis de fortalezas y brechas'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSimulatePurchase('Plan Profesional')}
                disabled={selectedPlan !== null}
                className="w-full py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-black rounded-xl transition-all"
              >
                {selectedPlan === 'Plan Profesional' ? 'Procesando...' : 'Seleccionar Profesional'}
              </button>
            </div>

            {/* PLAN ÉLITE */}
            <div className="relative flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-500 shadow-[0_10px_40px_rgba(236,72,153,0.15)] hover:shadow-[0_10px_50px_rgba(236,72,153,0.25)] transition-all duration-300 transform md:-translate-y-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                Recomendado
              </div>

              <div className="mb-4 mt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-500/10 py-1 px-2.5 rounded-lg border border-pink-500/20">Plan Élite</span>
                <div className="mt-3 flex items-baseline text-slate-900 dark:text-white">
                  <span className="text-3xl font-black tracking-tight">$19.99</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">/mes</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">La simulación técnica más realista del mercado.</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                <li className="flex items-start gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  Todo lo del Plan Profesional, más:
                </li>
                {[
                  'Desbloquea el Nivel Avanzado 🚀',
                  'Análisis multimodal (Voz + Video + PDFs)',
                  'IA lee y evalúa tus documentos',
                  'Simulación de Casos Prácticos',
                  'Soporte Prioritario VIP'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSimulatePurchase('Plan Élite')}
                disabled={selectedPlan !== null}
                className="w-full py-2.5 text-sm bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-500 hover:via-pink-600 hover:to-purple-700 text-white font-black rounded-xl shadow-[0_10px_20px_rgba(236,72,153,0.3)] transition-all transform hover:scale-105"
              >
                {selectedPlan === 'Plan Élite' ? 'Procesando...' : 'Obtener Plan Élite'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}