import { useState } from 'react';

interface SimulationWizardProps {
  selectedSim: { role: string; type: string; diff: string };
  userPlan: string; // NUEVO: Recibimos el plan actual del usuario
  onClose: () => void;
  onStartSimulation: (simType: string, difficulty: string) => void;
}

export default function SimulationWizard({ selectedSim, userPlan, onClose, onStartSimulation }: SimulationWizardProps) {
  const [step, setStep] = useState<number>(1); 
  const [simType, setSimType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  // LÓGICA DE RESTRICCIÓN SEGÚN EL PLAN
  const isLocked = (nivel: string) => {
    if (userPlan === 'Plan Élite') return false; // Élite tiene acceso a todo
    if (userPlan === 'Plan Profesional') {
      return nivel === 'Avanzado'; // Profesional solo bloquea Avanzado
    }
    // Si no es Élite ni Profesional (Gestión Gratis), bloquea Intermedio y Avanzado
    return nivel === 'Intermedio' || nivel === 'Avanzado'; 
  };

  const getRequiredPlan = (nivel: string) => {
    if (nivel === 'Avanzado') return 'Plan Élite';
    if (nivel === 'Intermedio') return 'Plan Profesional';
    return '';
  };

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

        {/* Paso 1: Selección de Tipo */}
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

        {/* Paso 2: Selección de Dificultad (CON RESTRICCIONES) */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
              Paso 2: Seleccionar el nivel de exigencia y formato.
            </p>
            <div className="space-y-3">
              {[
                { nivel: 'Básico', desc: 'Evaluación por texto escrito.' },
                { nivel: 'Intermedio', desc: 'Cámara y micrófono requeridos.' },
                { nivel: 'Avanzado', desc: 'Audio, cámara y subida de documentos.' }
              ].map((item) => {
                const locked = isLocked(item.nivel);
                const requiredPlan = getRequiredPlan(item.nivel);

                return (
                  <button
                    key={item.nivel}
                    onClick={() => {
                      if (locked) {
                        alert(`Debes mejorar tu cuenta al ${requiredPlan} para acceder al nivel ${item.nivel}. Ve a "Mejorar Plan" en el menú superior.`);
                        return; // Bloquea el avance
                      }
                      setDifficulty(item.nivel);
                      setStep(3); 
                      setTimeout(() => setStep(4), 2000); 
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex flex-col relative overflow-hidden group ${
                      locked 
                        ? 'border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 cursor-not-allowed opacity-80' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`font-bold ${locked ? 'text-slate-500 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                        Nivel {item.nivel}
                      </span>
                      
                      {/* Icono de Candado o Flecha */}
                      {locked ? (
                         <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                         </svg>
                      ) : (
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs font-medium mt-1 pr-16 ${locked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.desc}
                    </span>
                    
                    {/* Etiqueta visual de plan requerido */}
                    {locked && (
                      <div className="absolute top-3 right-10 flex items-center">
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 py-0.5 px-2 rounded-md border border-amber-500/20">
                          {requiredPlan.replace('Plan ', '')}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Paso 3 y 4 se mantienen igual */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-teal-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">
              Paso 3: Verificando plan activo y preparando el entorno...
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white text-center mb-1">
              ¡Sala Preparada!
            </p>
            <p className="text-sm text-slate-500 text-center mb-6 px-2">
              Modalidad <strong className="text-purple-500">{simType}</strong> en Nivel <strong className="text-teal-500">{difficulty}</strong> lista para iniciar.
            </p>
            <button 
              onClick={() => {
                onStartSimulation(simType || 'Mixta', difficulty || 'Básico');
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