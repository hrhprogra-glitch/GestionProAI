import { useState, useEffect } from 'react';
import MainLayout from '../../layout';
import WelcomeSplash from './components/WelcomeSplash';
import SimulationWizard from './components/SimulationWizard';
import LiquidBackground from './components/LiquidBackground';
import TopBar from './components/TopBar';
import HomeModules from './components/HomeModules';
import CatalogWindow from './components/CatalogWindow';
import ActiveSimulation from './components/ActiveSimulation';
import PerformanceCenter from './components/PerformanceCenter';
import PricingModal from './components/PricingModal'; 
import { supabase } from '../../supabase'; 

interface DashboardProps {
  userName: string;
  email: string;
  // NUEVO: Añadido "plan" a la metadata
  userMetadata?: { university?: string; career?: string; semester?: string; role?: string; plan?: string; }; 
  onLogout: () => void;
}

export default function Dashboard({ userName, email, userMetadata: initialMetadata, onLogout }: DashboardProps) {
  const [showSplash, setShowSplash] = useState(true);
  
  const [view, setView] = useState<'home' | 'catalog' | 'simulation' | 'performance'>('home');
  const [selectedSim, setSelectedSim] = useState<{role: string, type: string, diff: string} | null>(null);
  const [activeRoomData, setActiveRoomData] = useState<{role: string, type: string, diff: string, simType: string, difficulty?: string} | null>(null);
  const [initialPerfTab, setInitialPerfTab] = useState<'history' | 'feedback'>('history');
  const [showPricing, setShowPricing] = useState(false);

  const [localMetadata, setLocalMetadata] = useState(initialMetadata || {});

  useEffect(() => {
    if (initialMetadata) setLocalMetadata(initialMetadata);
  }, [initialMetadata]);

  const handleUpdateProfile = async (newMeta: any) => {
    try {
      const { error } = await supabase
        .from('usuarios_simulados')
        .update({ 
          universidad: newMeta.university, 
          carrera: newMeta.career, 
          ciclo: newMeta.semester, 
          objetivo: newMeta.role 
        })
        .eq('correo', email);

      if (error) throw error;

      setLocalMetadata((prev: any) => ({ ...prev, ...newMeta }));
      
      const savedUser = localStorage.getItem('remembered_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        localStorage.setItem('remembered_user', JSON.stringify({ 
          ...parsed,
          universidad: newMeta.university,
          carrera: newMeta.career,
          ciclo: newMeta.semester, 
          objetivo: newMeta.role
        }));
      }
      
      alert("¡Perfil actualizado correctamente!");
    } catch (error: any) {
      alert("Error al actualizar: " + error.message);
    }
  };

  // NUEVO: Función exclusiva para actualizar o cancelar el plan
  const handleUpdatePlan = async (newPlan: string) => {
    try {
      const { error } = await supabase
        .from('usuarios_simulados')
        .update({ plan: newPlan })
        .eq('correo', email);

      if (error) throw error;

      // Actualizar vista local
      setLocalMetadata((prev: any) => ({ ...prev, plan: newPlan }));
      
      // Actualizar localStorage
      const savedUser = localStorage.getItem('remembered_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        localStorage.setItem('remembered_user', JSON.stringify({ ...parsed, plan: newPlan }));
      }
      
      if (newPlan !== 'Gestión Gratis') {
         alert(`¡Felicidades! Ahora tienes el ${newPlan}`);
         setShowPricing(false);
      } else {
         alert(`Tu plan ha sido cancelado. Has vuelto a la versión gratuita.`);
      }
    } catch (error: any) {
      alert("Error al actualizar el plan: " + error.message);
    }
  };

  if (showSplash) {
    return <WelcomeSplash onComplete={() => setShowSplash(false)} />;
  }

  // Definimos qué plan tiene el usuario actualmente
  const currentPlan = localMetadata.plan || "Gestión Gratis";

  return (
    <MainLayout>
      <LiquidBackground />

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
        
        {view === 'home' && (
          <div key="topbar" className="relative z-[999] anim-topbar pb-4">
            <TopBar 
              userName={userName} 
              email={email} 
              planName={currentPlan} // NUEVO: Pasamos el plan dinámico
              userMetadata={localMetadata} 
              onUpdateProfile={handleUpdateProfile} 
              onLogout={onLogout} 
              onOpenPricing={() => setShowPricing(true)} 
              // NUEVO: Función para el botón "Cancelar"
              onCancelPlan={() => {
                if(window.confirm('¿Estás seguro de que deseas cancelar tu suscripción? Perderás los beneficios premium inmediatamente.')) {
                  handleUpdatePlan('Gestión Gratis');
                }
              }}
            />
          </div>
        )}

        <div key={view} className="relative z-10 anim-cinematic">
          {view === 'home' && (
             <HomeModules setView={(targetView) => {
               if (targetView === 'performance') setInitialPerfTab('feedback');
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
            <PerformanceCenter onBack={() => setView('home')} initialTab={initialPerfTab} />
          )}
        </div>

        {selectedSim && (
          <div className="relative z-[9999]">
            <SimulationWizard 
              selectedSim={selectedSim} 
              userPlan={currentPlan}
              onClose={() => setSelectedSim(null)} 
              onStartSimulation={(simType, difficulty) => {
                setActiveRoomData({ ...selectedSim, simType, difficulty });
                setSelectedSim(null);
                setView('simulation');
              }}
            />
          </div>
        )}

        {showPricing && (
          <PricingModal 
            onClose={() => setShowPricing(false)} 
            onSelectPlan={handleUpdatePlan} // NUEVO: Pasamos la función al modal
          />
        )}
      </div>
    </MainLayout>
  );
}