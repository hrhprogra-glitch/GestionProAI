import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabase';
import MediaRecorderUI from './MediaRecorderUI';
import DocumentUploader from './DocumentUploader';

interface SimData { role: string; type: string; diff: string; simType?: string; difficulty?: string; }
interface Message { role: 'system' | 'user' | 'assistant'; content: string; }

interface SimulationRoomProps {
  simData: SimData;
  onExit: (transcriptData?: any, audioBlob?: Blob, documentFiles?: File[]) => void;
}

export default function SimulationRoom({ simData, onExit }: SimulationRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  const [isFinishing, setIsFinishing] = useState(false); 
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);

  const actualDifficulty = simData.difficulty || simData.diff;
  const isMultimodal = actualDifficulty === 'Intermedio' || actualDifficulty === 'Avanzado';
  const isAdvanced = actualDifficulty === 'Avanzado';

  const handleMediaReady = (stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishSimulation = (messagesToEvaluate: Message[] = messages) => {
    if (isFinishing) return;
    setIsFinishing(true);
    
    const filesToSend = documentFiles.length > 0 ? documentFiles : undefined;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        onExit(messagesToEvaluate, audioBlob, filesToSend);
      };
      mediaRecorderRef.current.stop();
    } else {
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onExit(messagesToEvaluate, audioBlob, filesToSend);
      } else {
        onExit(messagesToEvaluate, undefined, filesToSend);
      }
    }
  };

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initSimulation = async () => {
      const advancedRule = isAdvanced 
        ? "REGLA OBLIGATORIA: Eres libre de pedirle al candidato que suba documentos PDF (ej: diagramas, análisis) en diferentes preguntas. Dile explícitamente: 'Adjunta tu resolución en PDF a la plataforma y explícamela por voz'." 
        : "";

      const systemPrompt: Message = {
        role: 'system',
        content: `Actúa como reclutador Senior para el rol de '${simData.role}'. Nivel: ${actualDifficulty}. 
        Reglas: 
        1) Haz exactamente 3 preguntas técnicas en total, UNA por mensaje. 
        2) Numera las preguntas al inicio ("[Pregunta 1 de 3]"). 
        ${advancedRule}
        3) Si el usuario responde con el texto "[Respuesta de voz registrada]", significa que ya habló por su micrófono, evalúa eso internamente y hazle la siguiente pregunta. 
        4) SOLO después de leer su respuesta a tu tercera pregunta, despídete y escribe EXACTAMENTE: ENTREVISTA_FINALIZADA.`
      };

      setMessages([systemPrompt]);
      await fetchAIResponse([systemPrompt]);
    };
    initSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simData]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAIResponse = async (currentMessages: Message[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', { body: { messages: currentMessages } });
      if (error || data.error) throw new Error('Error IA');
      
      const aiContent = data.choices[0].message.content;
      const updatedMessages = [...currentMessages, { role: 'assistant', content: aiContent }];
      setMessages(updatedMessages as Message[]);

      if (aiContent.toUpperCase().includes('ENTREVISTA_FINALIZADA')) {
        setTimeout(() => handleFinishSimulation(updatedMessages as Message[]), 3500); 
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error de conexión.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const updatedMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(updatedMessages as Message[]);
    setInput('');
    await fetchAIResponse(updatedMessages as Message[]);
  };

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mediaRecorderRef.current) return;

    if (isRecording) {
      mediaRecorderRef.current.pause();
      setIsRecording(false);
      setHasRecordedAudio(true);
    } else {
      if (mediaRecorderRef.current.state === 'inactive') mediaRecorderRef.current.start(1000);
      else if (mediaRecorderRef.current.state === 'paused') mediaRecorderRef.current.resume();
      setIsRecording(true);
    }
  };

  const handleSendAudioAnswer = () => {
    if (isLoading || timeLeft === 0 || isFinishing) return;
    setHasRecordedAudio(false);
    const updatedMessages = [...messages, { role: 'user', content: '[Respuesta de voz registrada]' }];
    setMessages(updatedMessages as Message[]);
    fetchAIResponse(updatedMessages as Message[]);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="pt-2 animate-in zoom-in-95 fade-in duration-500 fill-mode-forwards relative h-[85vh] flex flex-col lg:flex-row gap-6">
      
      <div className="flex-1 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-teal-500/30 flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black">Simulación: {simData.role}</h3>
            <p className="text-xs font-bold text-slate-500 mt-1">Nivel: {actualDifficulty}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
            <button onClick={() => handleFinishSimulation()} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors">
              Finalizar Sesión
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-teal-500 animate-pulse text-sm font-bold">La IA está analizando tu respuesta...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          {isMultimodal ? (
            <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
              <div className="flex gap-4">
                <button onClick={toggleRecording} disabled={isLoading} className={`px-6 py-2 rounded-xl text-white font-bold transition-all shadow-md ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  {isRecording ? '⏹ Detener Grabación' : '🎤 Grabar Respuesta'}
                </button>
                
                {hasRecordedAudio && !isRecording && (
                  <button onClick={handleSendAudioAnswer} className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 text-white font-black rounded-xl animate-in zoom-in shadow-lg">
                    Enviar Respuesta a la IA →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} className="w-full p-4 rounded-2xl border text-sm pr-20" placeholder="Escribe tu respuesta aquí..." />
              <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 bottom-2 bg-teal-500 px-4 rounded-xl text-white font-bold hover:bg-teal-600 disabled:opacity-50">
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* PANEL DERECHO (SCROLLABLE EN PANTALLAS PEQUEÑAS) */}
      {isMultimodal && (
        <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto pb-2 scrollbar-none">
          <div className="bg-white/90 p-6 rounded-3xl border shadow-xl shrink-0">
            <h4 className="font-black mb-4">Cámara Activa</h4>
            <MediaRecorderUI isRecording={isRecording} onMediaReady={handleMediaReady} onError={(e) => alert(e)} />
          </div>
          
          {isAdvanced && (
            <div className="bg-white/90 p-6 rounded-3xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col shrink-0 min-h-[300px]">
              <h4 className="font-black mb-2 text-purple-600">Documentos de Respaldo</h4>
              <p className="text-[10px] text-slate-500 font-semibold mb-4 leading-relaxed">
                Añade todos los PDFs que requieras para justificar tus respuestas.
              </p>
              <div className="flex-1 w-full">
                <DocumentUploader onFilesUpdated={setDocumentFiles} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}