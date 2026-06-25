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

  // 1. SOLUCIÓN: Leemos el plan exactamente de donde lo guarda tu Dashboard actual
  let userPlan = 'Gestión Gratis';
  try {
    const savedUser = localStorage.getItem('remembered_user');
    if (savedUser) {
      userPlan = JSON.parse(savedUser).plan || 'Gestión Gratis';
    }
  } catch (e) {
    console.error("Error leyendo el plan:", e);
  }

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

    // BASE DE DATOS DE PREGUNTAS (Extraídas de tu Excel)
    const QUESTIONS_DB: Record<string, Record<string, string[]>> = {
      'Análisis de Operaciones y Procesos': {
        'Básico': [
          "¿Qué es un proceso de negocio y cuál es la diferencia entre un proceso y un procedimiento?",
          "¿Has usado alguna herramienta de mapeo de procesos como Bizagi o Visio? ¿Qué diagramas conoces?",
          "¿Qué indicadores usarías para medir la eficiencia de un proceso operativo?"
        ],
        'Intermedio': [
          "Explica qué es el análisis de causa raíz. ¿Cómo aplicarías un diagrama de Ishikawa a un problema de calidad?",
          "¿Qué es la metodología PDCA y en qué contexto la utilizarías?"
        ],
        'Avanzado': [
          "Si detectas un cuello de botella en la atención al cliente, ¿cómo diseñarías una propuesta de mejora? ¿Qué datos necesitarías?"
        ]
      },
      'Gestión Estratégica y Finanzas': {
        'Básico': [
          "¿Qué es un Estado de Resultados (EERR) y qué diferencia tiene con un Flujo de Caja?",
          "¿Qué entiendes por punto de equilibrio (break-even)? ¿Cómo se calcula?"
        ],
        'Intermedio': [
          "¿Qué es el VAN y la TIR? ¿Cuándo un proyecto es financieramente viable según estos indicadores?",
          "Explica qué es el WACC o COK y para qué se usa en la evaluación de proyectos."
        ],
        'Avanzado': [
          "Si recibes los estados financieros de una empresa, ¿qué ratios calcularías primero para un diagnóstico rápido?",
          "¿Cómo construirías un modelo de proyección financiera a 5 años para una startup SaaS? ¿Qué supuestos serían críticos?"
        ]
      },
      'Dirección Comercial y Administración': {
        'Básico': [
          "¿Qué diferencia hay entre ventas y marketing? ¿Cómo trabajan juntos en una empresa?",
          "¿Qué es un CRM y para qué lo usaría un equipo comercial?"
        ],
        'Intermedio': [
          "Describe cómo diseñarías un plan de ventas para un producto SaaS dirigido a empresas medianas en Perú.",
          "¿Cómo manejarías una situación en la que un cliente importante amenaza con cancelar el contrato?"
        ],
        'Avanzado': [
          "¿Cómo estructurarías los KPIs de un equipo comercial de 5 personas? ¿Qué métricas serían no negociables?",
          "Si la tasa de churn sube al 15% mensual, ¿qué análisis harías y qué acciones tomarías de inmediato?"
        ]
      },
      'Evaluación de Proyectos de Inversión': {
        'Básico': [
          "¿Qué es el VAN (Valor Actual Neto) y cuál es la regla de decisión para aceptar un proyecto?",
          "¿Cuál es la diferencia entre flujo de caja económico y flujo de caja financiero?"
        ],
        'Intermedio': [
          "¿Cómo calcularías la tasa de descuento (COK o WACC) para un proyecto en el sector tecnológico?",
          "Explica qué es el análisis de sensibilidad y cómo lo usarías para evaluar el riesgo de un proyecto."
        ],
        'Avanzado': [
          "Dos proyectos mutuamente excluyentes: A tiene mayor VAN pero menor TIR que B. ¿Cuál elegirías y por qué?",
          "¿Cómo estructurarías un flujo de caja para una startup SaaS con horizonte de 5 años? ¿Qué supuestos son críticos?"
        ]
      },
      'Logística y Cadena de Suministros': {
        'Básico': [
          "¿Qué es la cadena de suministro (supply chain) y cuáles son sus eslabones principales?",
          "¿Qué diferencia hay entre gestión de inventarios y gestión de almacenes?"
        ],
        'Intermedio': [
          "¿Qué es el efecto bullwhip? ¿Cómo afecta los inventarios a lo largo de la cadena?",
          "Explica los métodos ABC de clasificación de inventarios y cuándo usarías cada categoría."
        ],
        'Avanzado': [
          "Si una empresa tiene altos niveles de sobrestock, ¿qué políticas de revisión de inventarios implementarías y con qué criterios?",
          "¿Cómo evaluarías el desempeño de un proveedor clave? ¿Qué KPIs son los más relevantes?"
        ]
      }
    };

    const initSimulation = async () => {
      const advancedRule = isAdvanced 
         ? "REGLA OBLIGATORIA: Eres libre de pedirle al candidato que suba documentos en diferentes preguntas. Dile explícitamente: 'Adjunta tu resolución a la plataforma y explícamela por voz'." 
         : "";

      // Extraemos las preguntas correspondientes o usamos un default si no hay
      const roleQuestions = QUESTIONS_DB[simData.role]?.[actualDifficulty] || [
        "Cuéntame sobre tu experiencia previa relacionada a este rol.",
        "¿Cómo resolverías un problema crítico de tiempo en un proyecto?",
        "¿Por qué deberíamos seleccionarte a ti?"
      ];
      
      const preguntasTexto = roleQuestions.map((q, i) => `Pregunta ${i + 1}: "${q}"`).join('\n');

      const systemPrompt: Message = {
        role: 'system',
        content: `Actúa como reclutador Senior para el rol de '${simData.role}'. Nivel: ${actualDifficulty}.
         Reglas ESTRICTAS:
         1) Haz exactamente ${roleQuestions.length} preguntas técnicas en total, UNA por mensaje.
         2) Numera las preguntas al inicio ("[Pregunta X de ${roleQuestions.length}]").
         3) OBLIGATORIO: Debes usar EXACTAMENTE estas preguntas definidas para este rol y nivel:
         ${preguntasTexto}
         ${advancedRule}
         4) Si el usuario responde con el texto "[Respuesta de voz registrada]", significa que ya habló por su micrófono, evalúa eso internamente y hazle la siguiente pregunta.
         5) SOLO después de leer su respuesta a tu última pregunta, despídete y escribe EXACTAMENTE: ENTREVISTA_FINALIZADA.`
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
    if (timeLeft === 0 && !isFinishing) {
      handleFinishSimulation();
    }
  }, [timeLeft, isFinishing]);

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
      
      <div className="flex-1 p-6 sm:p-8 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-2xl border border-teal-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
          <div>
            <h3 className="text-xl font-black text-white">Simulación: {simData.role}</h3>
            <p className="text-xs font-bold text-teal-400 mt-1 tracking-widest uppercase">Nivel: {actualDifficulty}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-lg border font-mono font-bold shadow-inner transition-colors ${timeLeft <= 60 ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' : 'bg-slate-800/80 border-slate-700/50 text-teal-300'}`}>
              {formatTime(timeLeft)}
            </div>
            <button onClick={() => handleFinishSimulation()} className="px-4 py-2 bg-slate-800/80 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold hover:bg-red-500/90 hover:text-white hover:border-red-500 transition-all duration-300">
              Finalizar Sesión
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-600">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl backdrop-blur-md border shadow-lg ${msg.role === 'user' ? 'bg-teal-600/90 text-white border-teal-500/50' : 'bg-slate-800/80 text-slate-200 border-slate-700/50'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-teal-400 animate-pulse text-sm font-bold tracking-wider">La IA está procesando la telemetría...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          {isMultimodal ? (
            <div className="flex flex-col items-center gap-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
              <div className="flex gap-4">
                <button onClick={toggleRecording} disabled={isLoading || timeLeft === 0} className={`px-6 py-2 rounded-xl text-white font-bold transition-all shadow-md backdrop-blur-md border ${isRecording ? 'bg-red-500/90 animate-pulse border-red-400' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}`}>
                  {isRecording ? '⏹ Detener Grabación' : '🎤 Grabar Respuesta'}
                </button>
                
                {hasRecordedAudio && !isRecording && (
                  <button onClick={handleSendAudioAnswer} className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 text-white font-black rounded-xl animate-in zoom-in shadow-[0_0_15px_rgba(20,184,166,0.5)] border border-teal-400/50">
                    Enviar Respuesta a la IA →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex relative">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                disabled={isLoading || timeLeft === 0} 
                className="w-full p-4 rounded-2xl border border-slate-700/50 bg-slate-800/60 text-white text-sm pr-20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all backdrop-blur-md shadow-inner disabled:opacity-50" 
                placeholder={timeLeft === 0 ? "Tiempo agotado" : "Escribe tu respuesta aquí..."} 
              />
              <button type="submit" disabled={!input.trim() || isLoading || timeLeft === 0} className="absolute right-2 top-2 bottom-2 bg-teal-600/90 px-4 rounded-xl text-white font-bold hover:bg-teal-500 disabled:opacity-50 transition-colors backdrop-blur-md border border-teal-500/50">
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>

      {isMultimodal && (
        <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto pb-2 scrollbar-none">
          <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] shrink-0">
            <h4 className="font-black mb-4 text-white">Cámara Activa</h4>
            <MediaRecorderUI isRecording={isRecording} onMediaReady={handleMediaReady} onError={(e) => alert(e)} />
          </div>
          
          {isAdvanced && (
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col shrink-0 min-h-[300px]">
              <h4 className="font-black mb-2 text-purple-400">Documentos de Respaldo</h4>
              <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                Añade todos los archivos (PDF, Excel, Word, PowerBI) que requieras.
              </p>
              <div className="flex-1 w-full filter drop-shadow-md">
                {/* 2. SOLUCIÓN: Enviamos el plan correctamente extraído */}
                <DocumentUploader onFilesUpdated={setDocumentFiles} activePlan={userPlan} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}