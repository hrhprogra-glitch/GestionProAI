import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

interface HistoryWindowProps {
  onBack: () => void;
  onViewReport: (simRole: string) => void;
}

export default function HistoryWindow({ onBack, onViewReport }: HistoryWindowProps) {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Consultar Supabase al cargar el componente
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const formattedData = data.map((item: any) => ({
            id: item.id,
            role: item.role,
            specialty: 'Rol Profesional', // Se puede adaptar si tienes este dato
            mode: item.difficulty,
            date: new Date(item.created_at).toLocaleDateString(),
            score: item.score
          }));
          setHistoryData(formattedData);
        }
      } catch (err) {
        console.error('Error cargando historial:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-8 overflow-hidden">
      
      {/* Botones de control decorativos */}
      <div className="absolute top-4 left-6 flex items-center gap-1.5 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-rose-500/70" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
      </div>

      <div className="flex justify-start pt-2">
        <button onClick={onBack} className="flex items-center text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Volver al Panel
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">Cargando tu historial de simulaciones...</div>
      ) : historyData.length === 0 ? (
        <div className="text-center py-10 text-slate-500">Aún no tienes simulaciones completadas. ¡Inicia una nueva!</div>
      ) : (
        <div className="relative z-10 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-950/30">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900/60 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Simulación / Rol</th>
                <th className="p-4">Modalidad</th>
                <th className="p-4">Fecha</th>
                <th className="p-4 text-center">Score IA</th>
                <th className="p-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              {historyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-black text-slate-900 dark:text-white">{row.role}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                      {row.mode}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{row.date}</td>
                  <td className="p-4 text-center font-black text-slate-900 dark:text-white text-sm">{row.score}%</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onViewReport(row.role)}
                      className="px-3 py-1.5 font-black text-white bg-slate-900 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-amber-400 hover:via-pink-500 hover:to-cyan-500 rounded-xl transition-all shadow-sm"
                    >
                      Ver Reporte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}