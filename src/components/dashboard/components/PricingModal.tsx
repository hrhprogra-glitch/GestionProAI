import { useState } from 'react';

interface PricingModalProps {
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export default function PricingModal({ onClose, onSelectPlan }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCulqiCheckout, setShowCulqiCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados controlados para captura exacta de datos
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');

  // 1. Análisis: Preparamos la selección para la pasarela de pagos
  const handleInitiatePurchase = (plan: string) => {
    setSelectedPlan(plan);
    setShowCulqiCheckout(true);
  };

  // 2. Modificación: Validación estricta con sanitización de espacios
  const handleCulqiPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Eliminamos cualquier espacio en blanco en todos los campos
    const cleanCard = card.replace(/\s/g, '');
    const cleanExp = exp.replace(/\s/g, '');
    const cleanCvc = cvc.replace(/\s/g, '');

    if (cleanCard === '1234123412341234' && cleanExp === '12/12' && cleanCvc === '15') {
      setIsProcessing(true);
      
      setTimeout(() => {
        alert(`¡Pago exitoso! Datos ingresados correctamente. Se ha activado tu ${selectedPlan || 'Plan Pro'} asociado a ${email}.`);
        setIsProcessing(false);
        if (selectedPlan) onSelectPlan(selectedPlan);
      }, 1500);
    } else {
      alert(`Error en Culqi. \n\nEl sistema detectó:\nTarjeta: "${cleanCard}"\nVencimiento: "${cleanExp}"\nCVC: "${cleanCvc}"\n\nPor favor usa exactamente:\nTarjeta: 1234123412341234\nVencimiento: 12/12\nCVC: 15`);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#16171d] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-amber-400/20 via-pink-500/10 to-transparent pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors z-20 bg-slate-100 dark:bg-slate-800 p-2 rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto">
          
          {/* VISTA 1: SELECCIÓN DE PLANES */}
          {!showCulqiCheckout ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  Planes de Simulación IA
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  Elige tu modelo de entrenamiento. Analizamos tus datos para crear simulaciones ultra realistas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                
                {/* PLAN PACK EXPRESS */}
                <div className="relative flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 bg-cyan-500/10 py-1 px-2.5 rounded-lg border border-cyan-500/20">Pack Express</span>
                    <div className="mt-3 flex items-baseline text-slate-900 dark:text-white">
                      <span className="text-3xl font-black tracking-tight">S/ 25</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Ideal para una preparación rápida.</p>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      1 intento Nivel Intermedio (Cámara/Audio)
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Límite: 1 vez por semana
                    </li>
                  </ul>
                  <button onClick={() => handleInitiatePurchase('Pack Express')} className="w-full py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 font-black rounded-xl transition-all">
                    Seleccionar Express
                  </button>
                </div>

                {/* PLAN ESTUDIANTE */}
                <div className="relative flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300">
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-500/10 py-1 px-2.5 rounded-lg border border-blue-500/20">Plan Estudiante</span>
                    <div className="mt-3 flex items-baseline text-slate-900 dark:text-white">
                      <span className="text-3xl font-black tracking-tight">S/ 30</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">/mes</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Práctica constante para tus entrevistas.</p>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      4 intentos Nivel Intermedio
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Límite: 4 veces por semana
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Métricas de desempeño
                    </li>
                  </ul>
                  <button onClick={() => handleInitiatePurchase('Plan Estudiante')} className="w-full py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 font-black rounded-xl transition-all">
                    Seleccionar Estudiante
                  </button>
                </div>

                {/* PLAN PRO */}
                <div className="relative flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-500 shadow-[0_10px_40px_rgba(236,72,153,0.15)] transform md:-translate-y-2">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                    Gestión Pro
                  </div>
                  <div className="mb-4 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-500/10 py-1 px-2.5 rounded-lg border border-pink-500/20">Plan Pro</span>
                    <div className="mt-3 flex items-baseline text-slate-900 dark:text-white">
                      <span className="text-3xl font-black tracking-tight">S/ 55</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">/mes</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Entrenamiento avanzado impulsado por IA.</p>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    <li className="flex items-start gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Simulaciones Ilimitadas
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Envío de archivos Excel, PowerBI y Word
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      IA analiza videos y guiones de BD
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      Preguntas dinámicas sobre tus archivos
                    </li>
                  </ul>
                  <button onClick={() => handleInitiatePurchase('Plan Pro')} className="w-full py-2.5 text-sm bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-500 hover:via-pink-600 hover:to-purple-700 text-white font-black rounded-xl shadow-md transition-all transform hover:scale-105">
                    Obtener Plan Pro
                  </button>
                </div>

              </div>
            </>
          ) : (
            
            /* VISTA 2: EXPLICACIÓN Y MOCKUP DE CULQI */
            <div className="max-w-md mx-auto animate-in slide-in-from-right-8 duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Pago Seguro con Culqi</h3>
                <p className="text-xs text-slate-500">
                  Estás adquiriendo el <strong>{selectedPlan}</strong>. Por favor, ingresa tu correo personal; este se enlazará con tu base de datos para activar tus beneficios.
                </p>
              </div>

              <form onSubmit={handleCulqiPayment} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Personal (Base de Datos)</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-cyan-500 dark:text-white"
                    placeholder="tu.correo@ejemplo.com" 
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Datos de la Tarjeta</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      maxLength={19}
                      value={card}
                      onChange={(e) => setCard(e.target.value)}
                      className="w-full p-2.5 pl-10 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-cyan-500 dark:text-white"
                      placeholder="1234 1234 1234 1234" 
                    />
                    <svg className="absolute left-3 top-3 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <input 
                      type="text" 
                      required 
                      value={exp}
                      onChange={(e) => setExp(e.target.value)}
                      placeholder="MM/AA" 
                      className="w-1/2 p-2.5 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-cyan-500 dark:text-white" 
                    />
                    <input 
                      type="text" 
                      required 
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="CVC" 
                      className="w-1/2 p-2.5 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-cyan-500 dark:text-white" 
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowCulqiCheckout(false)} disabled={isProcessing} className="w-1/3 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isProcessing} className="w-2/3 py-2.5 text-sm bg-[#FF4F4F] hover:bg-[#E63E3E] text-white font-black rounded-lg shadow-md transition-all flex items-center justify-center gap-2">
                    {isProcessing ? 'Procesando en Culqi...' : 'Pagar de forma segura'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
