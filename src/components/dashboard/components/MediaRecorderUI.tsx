import { useEffect, useRef, useState } from 'react';

interface MediaRecorderUIProps {
  isRecording: boolean; // NUEVO: Saber si estamos grabando
  onMediaReady: (stream: MediaStream) => void;
  onError: (error: string) => void;
}

export default function MediaRecorderUI({ isRecording, onMediaReady, onError }: MediaRecorderUIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestedRef = useRef(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    let activeStream: MediaStream | null = null;

    const requestHardwareAccess = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640, max: 854 }, height: { ideal: 480, max: 480 } }, 
          audio: true 
        });
        
        activeStream = mediaStream;
        setStream(mediaStream);
        setHasPermissions(true);
        onMediaReady(mediaStream);
      } catch (err) {
        console.error("Error de hardware:", err);
        onError("No se pudo acceder a la cámara o micrófono. Por favor, otorga los permisos.");
      }
    };

    requestHardwareAccess();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SOLUCIÓN A LA CÁMARA NEGRA: Esto fuerza a que el video se conecte en cuanto aparezca
  useEffect(() => {
    if (videoRef.current && stream && hasPermissions && !isVideoOff) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, hasPermissions, isVideoOff]);

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <div className="relative w-full h-48 sm:h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner group">
      {!hasPermissions ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs font-bold">Optimizando hardware...</p>
        </div>
      ) : (
        <>
          {isVideoOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800">
              <svg className="w-12 h-12 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/><line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="text-xs font-bold text-slate-500">Cámara Apagada</span>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-90 transform scale-x-[-1]" 
            />
          )}

          <div className="absolute inset-0 pointer-events-none border-2 border-teal-500/20 rounded-2xl"></div>
          
          {/* INDICADOR INTELIGENTE DE GRABACIÓN */}
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
            <div className={`w-2 h-2 rounded-full ${isAudioMuted ? 'bg-slate-500' : (isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-400')}`}></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {isAudioMuted ? 'MUTE' : (isRecording ? 'REC' : 'LISTO')}
            </span>
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={toggleAudio}
              className={`p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110 ${isAudioMuted ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20'}`}
              title={isAudioMuted ? "Activar Micrófono" : "Silenciar Micrófono"}
            >
              {isAudioMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/><line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              )}
            </button>
            <button 
              onClick={toggleVideo}
              className={`p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20'}`}
              title={isVideoOff ? "Activar Cámara" : "Apagar Cámara"}
            >
              {isVideoOff ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/><line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}