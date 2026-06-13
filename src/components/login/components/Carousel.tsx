import { useState, useEffect } from 'react';
import img1 from '../../../assets/imagen1.png';
import img2 from '../../../assets/imagen2.png';
import img3 from '../../../assets/imagen3.png';

const carouselData = [
  { img: img1, title: 'Simulación IA', desc: 'Practica entrevistas con retroalimentación en tiempo real.' },
  { img: img2, title: 'Análisis de Competencias', desc: 'Descubre tus fortalezas y brechas profesionales.' },
  { img: img3, title: 'Ruta Profesional', desc: 'Recomendaciones personalizadas para el mercado actual.' }
];

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-full h-full relative items-center justify-center p-12">
      
      <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center">
        
        {carouselData.map((item, index) => (
          <div
            key={index}
            // Añadimos un pb-12 aquí para empujar el contenido ligeramente hacia arriba y evitar choques
            className={`absolute inset-0 flex flex-col items-center justify-center pb-12 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
            }`}
          >
            {/* Reducimos ligeramente el max-h y el mb para compactar mejor el bloque */}
            <img 
              src={item.img} 
              alt={item.title} 
              className="w-3/4 max-h-[45vh] object-contain drop-shadow-[0_20px_40px_rgba(20,184,166,0.25)] mb-6" 
            />
            
            <div className="text-center px-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg font-medium max-w-md mx-auto leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Movimos los controles mucho más abajo (de bottom-12 a bottom-2) */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-3 z-20">
          {carouselData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-500 rounded-full h-2 shadow-sm ${
                idx === currentIndex ? 'w-10 bg-teal-500' : 'w-3 bg-slate-300 dark:bg-slate-700 hover:bg-teal-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}