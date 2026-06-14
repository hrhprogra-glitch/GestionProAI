import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabase';

interface SimData {
  role: string;
  type: string;
  diff: string;
  simType?: string;
}

interface SimulationRoomProps {
  simData: SimData;
  onExit: (transcriptData?: any) => void;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function SimulationRoom({ simData, onExit }: SimulationRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const initRef = useRef(false);

  // La sala de simulación ya no evalúa, solo recopila el historial (transcripción) y se lo pasa al padre
  const handleFinishSimulation = (messagesToEvaluate: Message[] = messages) => {
    onExit(messagesToEvaluate); 
  };

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initSimulation = async () => {
      const systemPrompt: Message = {
        role: 'system',
        content: `Actúa como reclutador Senior para '${simData.role}' (Nivel: '${simData.type}'). Reglas: 1) Haz exactamente 3 preguntas en total, UNA por mensaje. 2) Antes de cada pregunta, escribe explícitamente el número de pregunta (ej: "[Pregunta 1 de 3]"). 3) Espera la respuesta del candidato entre cada pregunta. 4) PROHIBIDO despedirte antes de la pregunta 3. 5) SOLO después de leer la respuesta a tu tercera pregunta, despídete y escribe EXACTAMENTE la palabra clave: ENTREVISTA_FINALIZADA.`
      };
      setMessages([systemPrompt]);
      await fetchAIResponse([systemPrompt]);
    };
    initSimulation();
  }, [simData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAIResponse = async (currentMessages: Message[]) => {
    setIsLoading(true);
    try {
      // Modo conversación: NO pasamos action: 'evaluate'
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { messages: currentMessages }
      });

      if (error) throw new Error('Error al conectar con la Edge Function');
      if (data.error) throw new Error(JSON.stringify(data.error));
      
      const aiContent = data.choices[0].message.content;
      const aiReply: Message = { role: 'assistant', content: aiContent };
      
      const updatedMessages = [...currentMessages, aiReply];
      setMessages(updatedMessages);

      const contentUpper = aiContent.toUpperCase();
      if (contentUpper.includes('ENTREVISTA_FINALIZADA')) {
        setTimeout(() => {
          handleFinishSimulation(updatedMessages);
        }, 3500); 
      }

    } catch (error) {
      console.error('Error fetching AI:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, ha ocurrido un error de conexión con el servidor. Por favor, intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMsg: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, newUserMsg];
    
    setMessages(updatedMessages);
    setInput('');
    await fetchAIResponse(updatedMessages);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="pt-2 animate-in zoom-in-95 fade-in duration-500 fill-mode-forwards relative h-[85vh] flex flex-col">
      <div className="flex-1 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] flex flex-col overflow-hidden relative">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Simulación Activa: {simData.role}
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Modalidad: {simData.simType || 'Aptitudinal'} | Nivel: {simData.diff}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-300">
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={() => handleFinishSimulation()}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-red-600 px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              Finalizar Sesión
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none shadow-lg shadow-pink-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
              }`}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu respuesta profesional aquí..."
              disabled={isLoading || timeLeft === 0}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || timeLeft === 0}
              className="absolute right-3 p-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
            La IA evalúa estructura lógica, vocabulario técnico y asertividad.
          </p>
        </div>

      </div>
    </div>
  );
}