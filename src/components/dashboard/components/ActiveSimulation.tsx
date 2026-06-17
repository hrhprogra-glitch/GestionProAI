import { useState } from 'react';
import SimulationRoom from './SimulationRoom';
import SimulationProcessing from './SimulationProcessing';
import SimulationResults from './SimulationResults';
import { supabase } from '../../../supabase';

interface ActiveSimulationProps {
  simData: { role: string; type: string; diff: string; simType: string; difficulty?: string };
  onComplete: () => void;
}

export default function ActiveSimulation({ simData, onComplete }: ActiveSimulationProps) {
  const [currentStep, setCurrentStep] = useState<'room' | 'processing' | 'results' | 'error'>('room');
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // SOLUCIÓN: Ahora recibe documentFiles como Array de Archivos (File[])
  const handleRoomExit = async (transcriptData?: any, audioBlob?: Blob, documentFiles?: File[]) => {
    if (!transcriptData || transcriptData.length === 0) {
      onComplete();
      return;
    }
    setCurrentStep('processing');

    if (audioBlob) {
      setAudioUrl(URL.createObjectURL(audioBlob));
    }

    try {
      let aiResult;
      let aiError;
      
      const hasDocuments = documentFiles && documentFiles.length > 0;

      if (audioBlob || hasDocuments) {
        const formData = new FormData();
        formData.append('action', 'evaluate');
        formData.append('simData', JSON.stringify(simData));
        formData.append('transcript', JSON.stringify(transcriptData));
        
        if (audioBlob) {
          formData.append('audio', audioBlob, 'audio.webm');
        }
        
        // Iteramos sobre la lista de PDFs para subirlos todos
        if (hasDocuments) {
          documentFiles.forEach((file) => {
            formData.append('documents', file);
          });
        }

        const res = await supabase.functions.invoke('openai-chat', { body: formData });
        aiResult = res.data;
        aiError = res.error;
      } else {
        const res = await supabase.functions.invoke('openai-chat', {
          body: { action: 'evaluate', simData, transcript: transcriptData }
        });
        aiResult = res.data;
        aiError = res.error;
      }

      if (aiError) throw new Error(`Fallo en Edge Function: ${aiError.message}`);
      if (aiResult?.error) throw new Error(`Fallo en IA: ${JSON.stringify(aiResult.error)}`);

      const { error: dbError } = await supabase.from('history').insert([{
        role: simData.role,
        difficulty: simData.difficulty || simData.diff,
        score: aiResult.score || 0,
        feedback: aiResult
      }]);
      if (dbError) throw new Error(`DB Error: ${dbError.message}`);

      setEvaluationData(aiResult);
    } catch (error: any) {
      setErrorMessage(error.message);
      setCurrentStep('error');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center animate-in fade-in duration-500 max-w-5xl mx-auto mt-2">
      {currentStep === 'room' && <SimulationRoom simData={simData} onExit={handleRoomExit} />}
      {currentStep === 'processing' && <SimulationProcessing onFinish={() => setCurrentStep('results')} />}
      {currentStep === 'results' && (
        <SimulationResults evaluation={evaluationData} audioUrl={audioUrl} onReturnHome={onComplete} />
      )}
      {currentStep === 'error' && (
        <div className="p-8 bg-red-50 text-center space-y-4">
          <p className="text-red-600 font-bold">{errorMessage}</p>
          <button onClick={onComplete} className="px-6 py-2 bg-slate-900 text-white rounded-xl">Volver</button>
        </div>
      )}
    </div>
  );
}