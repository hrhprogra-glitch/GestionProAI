import { useState, useEffect, useRef } from 'react';

// Ajusta los nombres si tienen espacios o extensiones distintas
import video1 from '../../../assets/video1.mp4';
import video2 from '../../../assets/video2.mp4';
import video3 from '../../../assets/video3.mp4';

const VIDEO_CLIPS = [video1, video2, video3];

export default function LiquidBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Referencias mutables para mantener el estado dentro de los listeners globales sin cierres obsoletos
  const dragStartX = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Ignora el arrastre si se hace clic explícito en un botón, enlace o input de tu Dashboard
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, [role="button"]')) return;

      dragStartX.current = e.clientX;
      document.body.style.userSelect = 'none'; // Bloquea temporalmente la selección de texto
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (dragStartX.current === null) return;
      offsetRef.current = e.clientX - dragStartX.current;
      setDragOffset(offsetRef.current); // Actualiza la UI para el movimiento kinestésico
    };

    const handlePointerUp = () => {
      if (dragStartX.current === null) return;
      
      const swipeThreshold = window.innerWidth * 0.15;
      const offset = offsetRef.current;

      // Lógica de cálculo del carrusel infinito
      if (offset < -swipeThreshold) {
        setCurrentIndex((prev) => (prev === VIDEO_CLIPS.length - 1 ? 0 : prev + 1));
      } else if (offset > swipeThreshold) {
        setCurrentIndex((prev) => (prev === 0 ? VIDEO_CLIPS.length - 1 : prev - 1));
      }
      
      // Restauración y limpieza de variables para la siguiente interacción
      dragStartX.current = null;
      offsetRef.current = 0;
      setDragOffset(0);
      document.body.style.userSelect = ''; // Libera nuevamente la selección de texto
    };

    // Anclaje de eventos a nivel de ventana para evadir los bloqueos del DOM
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950">
      {/* Capa de opacidad corporativa */}
      <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-950/80 z-10 pointer-events-none transition-colors duration-700" />
      
      {/* Pista renderizada de videos espaciales */}
      <div 
        className={`flex h-full w-full ${dragStartX.current === null ? 'transition-transform duration-700 ease-out' : ''}`}
        style={{ transform: `translateX(calc(-${currentIndex * 100}vw + ${dragOffset}px))` }}
      >
        {VIDEO_CLIPS.map((video, index) => (
          <div key={index} className="relative w-screen h-full flex-shrink-0">
            <video
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-90 pointer-events-none"
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}