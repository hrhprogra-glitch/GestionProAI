import { useState, useEffect } from 'react';

interface SimulationProcessingProps {
  onFinish: () => void;
}

export default function SimulationProcessing({ onFinish }: SimulationProcessingProps) {
  // Manejamos los pasos del 8 al 12 del DOP
  const [currentStep, setCurrentStep] = useState<number>(8);

  useEffect(() => {
    // Simulamos los tiempos de procesamiento para el flujo de UX (en la vida real esperarías la respuesta del backend)
    const timers = [
      setTimeout(() => setCurrentStep(9), 1500),  // Paso 8 a 9
      setTimeout(() => setCurrentStep(10), 4000), // Paso 9 a 10
      setTimeout(() => setCurrentStep(11), 7000), // Paso 10 a 11
      setTimeout(() => setCurrentStep(12), 9000), // Paso 11 a 12
      setTimeout(() => onFinish(), 11000)         // Paso 12 al 13 (Resultados)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onFinish]);

  const stepsList = [
    { num: 8, text: "Verificando entrega y cierre de temporizador" },
    { num: 9, text: "Transcribiendo, limpiando y normalizando audio/texto" },
    { num: 10, text: "Evaluando con IA según rúbrica (estructura, claridad, lógica...)" },
    { num: 11, text: "Validando consistencia del feedback y reporte" },
    { num: 12, text: "Generando informe de mejora, score y acciones" }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 w-full max-w-3xl mx-auto mt-10">
      <div className="bg-white/60 dark:bg-[#16171d]/60 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Efecto de fondo animado */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="text-center relative z-10 mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 border-r-amber-400 rounded-full animate-spin"></div>
            <svg className="absolute inset-0 m-auto w-10 h-10 text-cyan-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </div>
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-500 tracking-tight mb-2">
            Procesando Simulación
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            La Inteligencia Artificial está analizando tus respuestas...
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {stepsList.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num} 
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  isCurrent ? 'bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900/30 shadow-md transform scale-[1.02]' : 
                  isCompleted ? 'opacity-60' : 'opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                  isCompleted ? 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400' :
                  isCurrent ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-lg' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  ) : (
                    <span className="text-xs font-bold">{step.num}</span>
                  )}
                </div>
                <p className={`text-sm font-bold ${
                  isCompleted ? 'text-slate-600 dark:text-slate-400' :
                  isCurrent ? 'text-slate-900 dark:text-white' :
                  'text-slate-500 dark:text-slate-500'
                }`}>
                  {step.text}
                </p>
                {isCurrent && (
                  <div className="ml-auto flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}