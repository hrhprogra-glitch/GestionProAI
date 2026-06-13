import { useState } from 'react';
import SimulationRoom from './SimulationRoom';
import SimulationProcessing from './SimulationProcessing';
import SimulationResults from './SimulationResults';

interface ActiveSimulationProps {
  simData: { role: string; type: string; diff: string; simType: string };
  onComplete: () => void;
}

export default function ActiveSimulation({ simData, onComplete }: ActiveSimulationProps) {
  // Estados para controlar el flujo post-entrevista
  const [currentStep, setCurrentStep] = useState<'room' | 'processing' | 'results'>('room');
  const [evaluationData, setEvaluationData] = useState<any>(null);

  // Se ejecuta cuando SimulationRoom termina de evaluar
  const handleRoomExit = (data?: any) => {
    if (data) {
      setEvaluationData(data);
      setCurrentStep('processing'); // Pasamos a la animación de carga
    } else {
      onComplete(); // Si salió sin datos o hubo error, cerramos y volvemos al dashboard
    }
  };

  // Se ejecuta cuando SimulationProcessing termina sus animaciones
  const handleProcessingFinish = () => {
    setCurrentStep('results'); // Pasamos al reporte final
  };

  return (
    <div className="w-full h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto mt-2">
      {currentStep === 'room' && (
        <SimulationRoom 
          simData={simData} 
          onExit={handleRoomExit} 
        />
      )}

      {currentStep === 'processing' && (
        <SimulationProcessing 
          onFinish={handleProcessingFinish} 
        />
      )}

      {currentStep === 'results' && (
        <SimulationResults 
          evaluation={evaluationData} 
          onReturnHome={onComplete} 
        />
      )}
    </div>
  );
}