import { useState } from 'react';
import SimulationRoom from './SimulationRoom';
import SimulationProcessing from './SimulationProcessing';
import SimulationResults from './SimulationResults';
import { supabase } from '../../../supabase';

interface ActiveSimulationProps {
  simData: { role: string; type: string; diff: string; simType: string };
  onComplete: () => void;
}

export default function ActiveSimulation({ simData, onComplete }: ActiveSimulationProps) {
  const [currentStep, setCurrentStep] = useState<'room' | 'processing' | 'results' | 'error'>('room');
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoomExit = async (transcriptData?: any) => {
    // Si no hay datos, retornamos al inicio
    if (!transcriptData || transcriptData.length === 0) {
      onComplete();
      return;
    }

    setCurrentStep('processing');

    try {
      console.log('1. Enviando transcripción a evaluar...');
      
      // Llamada a la IA
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('openai-chat', {
        body: { action: 'evaluate', simData, transcript: transcriptData }
      });

      if (aiError) throw new Error(`Fallo en Edge Function: ${aiError.message}`);
      if (aiResult?.error) throw new Error(`Fallo en IA: ${JSON.stringify(aiResult.error)}`);

      console.log('2. IA respondió con éxito:', aiResult);

      // Guardado en Base de Datos
      const { error: dbError } = await supabase
        .from('history')
        .insert([{
          role: simData.role,
          difficulty: simData.diff,
          score: aiResult.score || 0,
          feedback: aiResult
        }]);

      if (dbError) throw new Error(`Fallo en Base de Datos: ${dbError.message}`);

      console.log('3. Guardado en historial exitoso');
      setEvaluationData(aiResult);

    } catch (error: any) {
      console.error('Error crítico procesando la simulación:', error);
      setErrorMessage(error.message || 'Ocurrió un error desconocido durante la evaluación.');
      setCurrentStep('error'); // Ahora mostramos el error en pantalla en lugar de ocultarlo
    }
  };

  const handleProcessingFinish = () => {
    if (evaluationData) setCurrentStep('results');
  };

  return (
    <div className="w-full h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto mt-2">
      {currentStep === 'room' && <SimulationRoom simData={simData} onExit={handleRoomExit} />}
      
      {currentStep === 'processing' && <SimulationProcessing onFinish={handleProcessingFinish} />}
      
      {currentStep === 'results' && <SimulationResults evaluation={evaluationData} onReturnHome={onComplete} />}

      {/* NUEVA PANTALLA DE ERROR: Te dirá exactamente qué backend falló */}
      {currentStep === 'error' && (
        <div className="p-8 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl text-center space-y-4">
          <h3 className="text-xl font-black text-red-600 dark:text-red-400">Error de Procesamiento</h3>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-xl border border-red-100 dark:border-red-900">
            {errorMessage}
          </p>
          <p className="text-xs text-slate-500">
            Presiona <strong>F12</strong> en tu teclado, ve a la pestaña "Console" y revisa los detalles. Revisa también tu tabla 'history' en Supabase.
          </p>
          <button onClick={onComplete} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
            Volver al Inicio
          </button>
        </div>
      )}
    </div>
  );
}