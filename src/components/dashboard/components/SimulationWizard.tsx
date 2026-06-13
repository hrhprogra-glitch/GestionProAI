import { useState } from 'react';

interface SimulationWizardProps {
  selectedSim: { role: string; type: string; diff: string };
  onClose: () => void;
  onStartSimulation: (simType: string) => void;
}

export default function SimulationWizard({ selectedSim, onClose, onStartSimulation }: SimulationWizardProps) {
  // El estado de los pasos vive de manera independiente aquí adentro
  const [step, setStep] = useState<number>(1); // 1: Selección, 2: Verificación, 3: Éxito
  const [simType, setSimType] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#16171d] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Inicializando Sala</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedSim.role}</h3>
        </div>

        {/* Paso 1 del DOP */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
              Paso 1: Seleccionar simulación aptitudinal, técnica o mixta.
            </p>
            <div className="space-y-3">
              {['Aptitudinal', 'Técnica', 'Mixta'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => {
                    setSimType(tipo);
                    setStep(2);
                    // Simulación automática de la inspección de intentos (Paso 2)
                    setTimeout(() => setStep(3), 2000);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center group"
                >
                  Simulación {tipo}
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2 del DOP */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-teal-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">
              Paso 2: Verificar plan activo o intentos disponibles...
            </p>
          </div>
        )}

        {/* Paso 3 del DOP (Resultado) */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white text-center mb-1">
              ¡Verificación Exitosa!
            </p>
            <p className="text-sm text-slate-500 text-center mb-6">
              Tienes intentos disponibles. El caso {simType?.toLowerCase()} está listo.
            </p>
            <button 
              onClick={() => {
                onStartSimulation(simType || 'Mixta');
              }}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white font-black rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              Cargar Caso y Rúbrica
            </button>
          </div>
        )}

      </div>
    </div>
  );
}