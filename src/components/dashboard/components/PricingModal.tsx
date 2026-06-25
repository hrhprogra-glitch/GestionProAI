import { useState } from 'react';

interface PricingModalProps {
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export default function PricingModal({ onClose, onSelectPlan }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [showCulqiCheckout, setShowCulqiCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados controlados para captura exacta de datos
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');

  // 1. Análisis: Lógica de presentación de texto (Siempre se muestra)
  const handleInitiatePurchase = (plan: string) => {
    setSelectedPlan(plan);
    
    // Reiniciamos las vistas para que siempre empiece con la presentación
    setShowCulqiCheckout(false);
    setShowSplash(true);
    
    // Tiempo para leer el texto antes de pasar al formulario (4 segundos)
    setTimeout(() => {
      setShowSplash(false);
      setShowCulqiCheckout(true);
    }, 4000);
  };

  // 2. Modificación: Validación estricta con sanitización de espacios
  const handleCulqiPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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

        <div className="p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* VISTA 1: SELECCIÓN DE PLANES */}
          {!showCulqiCheckout && !showSplash && (
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
                      <span className="text-cyan-500 font-bold">✓</span> Nivel Básico e Intermedio
                    </li>
                    <li className="flex items-start gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="text-cyan-500 font-bold">✓</span> Límite: 1 vez por semana
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
                      <span className="text-blue-500 font-bold">✓</span> Nivel Básico e Intermedio
                    </li>
                    <li className="flex items-start gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="text-blue-500 font-bold">✓</span> Límite: 4 veces por semana
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="text-blue-500 font-bold">✓</span> Métricas de desempeño
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
                      <span className="text-pink-500 font-bold">✓</span> Simulaciones Ilimitadas
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="text-pink-500 font-bold">✓</span> Nivel Avanzado Desbloqueado
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="text-pink-500 font-bold">✓</span> Análisis de Archivos (Excel, Word, PowerBI)
                    </li>
                  </ul>
                  <button onClick={() => handleInitiatePurchase('Plan Pro')} className="w-full py-2.5 text-sm bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-500 hover:via-pink-600 hover:to-purple-700 text-white font-black rounded-xl shadow-md transition-all transform hover:scale-105">
                    Obtener Plan Pro
                  </button>
                </div>

              </div>
            </>
          )}

          {/* VISTA 2: RECORDATORIO VISUAL (SOLO TEXTO) */}
          {showSplash && (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500 min-h-[400px]">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Preparando Entorno Seguro</h3>
              
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 max-w-md shadow-sm mb-10 text-center">
                <svg className="w-10 h-10 text-teal-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tokenización Avanzada Culqi</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Tus datos están protegidos. Toda la información bancaria es procesada de forma encriptada directamente por Culqi para asegurar tu <strong>{selectedPlan}</strong>. Tu tarjeta no tocará nuestros servidores.
                </p>
              </div>

              <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* VISTA 3: FORMULARIO CULQI LIMPIO */}
          {showCulqiCheckout && !showSplash && (
            <div className="max-w-md mx-auto animate-in slide-in-from-right-8 duration-300">
              <button onClick={() => setShowCulqiCheckout(false)} className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white mb-6 flex items-center transition-colors">
                ← Volver a los planes
              </button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Checkout de Pagos</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Estás adquiriendo el <strong>{selectedPlan}</strong>. Ingresa tu correo para enlazar tu progreso.
                </p>
              </div>

              <form onSubmit={handleCulqiPayment} className="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                <div className="mb-4">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:border-pink-500 dark:text-white transition-colors"
                    placeholder="tu.correo@ejemplo.com" 
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Número de Tarjeta</label>
                  <div className="relative mb-3">
                    <input 
                      type="text" 
                      required 
                      maxLength={19}
                      value={card}
                      onChange={(e) => setCard(e.target.value)}
                      className="w-full p-3 pl-10 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:border-pink-500 dark:text-white transition-colors"
                      placeholder="1234 1234 1234 1234" 
                    />
                    <span className="absolute left-3 top-3.5 text-slate-400 font-black">#</span>
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      required 
                      value={exp}
                      onChange={(e) => setExp(e.target.value)}
                      placeholder="MM/AA" 
                      className="w-1/2 p-3 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:border-pink-500 dark:text-white transition-colors" 
                    />
                    <input 
                      type="text" 
                      required 
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="CVC" 
                      className="w-1/2 p-3 text-sm bg-white dark:bg-[#16171d] border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:border-pink-500 dark:text-white transition-colors" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={isProcessing} className="w-full py-3.5 text-sm bg-[#FF4F4F] hover:bg-[#E63E3E] text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  {isProcessing ? 'Procesando pago...' : 'Pagar'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}