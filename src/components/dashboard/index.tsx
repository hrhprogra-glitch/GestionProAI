import { useState } from 'react';
import MainLayout from '../../layout';
import WelcomeSplash from './components/WelcomeSplash';
import SimulationWizard from './components/SimulationWizard';

// Componentes Modulares del Dashboard
import LiquidBackground from './components/LiquidBackground';
import TopBar from './components/TopBar';
import HomeModules from './components/HomeModules';
import CatalogWindow from './components/CatalogWindow';
import ActiveSimulation from './components/ActiveSimulation';
import PerformanceCenter from './components/PerformanceCenter';

interface DashboardProps {
  userName: string;
  email: string;
  onLogout: () => void;
}

export default function Dashboard({ userName, email, onLogout }: DashboardProps) {
  const [showSplash, setShowSplash] = useState(true);
  
  const [view, setView] = useState<'home' | 'catalog' | 'simulation' | 'performance'>('home');
  const [selectedSim, setSelectedSim] = useState<{role: string, type: string, diff: string} | null>(null);
  
  // 1. NUEVO: Añadimos 'difficulty' al tipado del estado para que la sala sepa qué permisos pedir
  const [activeRoomData, setActiveRoomData] = useState<{role: string, type: string, diff: string, simType: string, difficulty?: string} | null>(null);
  
  const [initialPerfTab, setInitialPerfTab] = useState<'history' | 'feedback'>('history');

  if (showSplash) {
    return <WelcomeSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <MainLayout>
      <LiquidBackground />

      {/* MOTOR DE ANIMACIONES CSS NATIVAS */}
      <style>{`
        @keyframes cinematicEnter {
          0% { opacity: 0; transform: scale(0.92) translateY(30px); filter: blur(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes topBarEnter {
          0% { opacity: 0; transform: translateY(-30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .anim-cinematic {
          animation: cinematicEnter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .anim-topbar {
          animation: topBarEnter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-6 px-4 sm:px-6 py-4 min-h-[90vh]">
        
        {/* TOP BAR MODAL */}
        {view === 'home' && (
          <div key="topbar" className="relative z-[999] anim-topbar pb-4">
            <TopBar userName={userName} email={email} onLogout={onLogout} />
          </div>
        )}

        {/* CONTENEDOR DE RENDIMIENTO ANIMADO */}
        <div key={view} className="relative z-10 anim-cinematic">
          
          {view === 'home' && (
             <HomeModules setView={(targetView) => {
               if (targetView === 'performance') {
                 setInitialPerfTab('feedback');
               }
               setView(targetView);
             }} />
          )}

          {view === 'catalog' && (
            <CatalogWindow onBack={() => setView('home')} onSelectSim={setSelectedSim} />
          )}

          {view === 'simulation' && activeRoomData && (
            <ActiveSimulation 
              simData={activeRoomData} 
              onComplete={() => { setView('catalog'); setActiveRoomData(null); }} 
            />
          )}

          {view === 'performance' && (
            <PerformanceCenter 
              onBack={() => setView('home')} 
              initialTab={initialPerfTab} 
            />
          )}

        </div>

        {/* CONTENEDOR DEL WIZARD DE SIMULACIÓN */}
        {selectedSim && (
          <div className="relative z-[9999]">
            <SimulationWizard 
              selectedSim={selectedSim} 
              onClose={() => setSelectedSim(null)} 
              // 2. NUEVO: Capturamos el parámetro difficulty y lo guardamos
              onStartSimulation={(simType, difficulty) => {
                setActiveRoomData({ ...selectedSim, simType, difficulty });
                setSelectedSim(null);
                setView('simulation');
              }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}