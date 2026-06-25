// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1. DEFINICIÓN DE CORS CORREGIDA
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

Deno.serve(async (req: Request) => {
  // 2. RESPUESTA CORS INMEDIATA
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error("Falta la API Key en las variables de entorno.");

    // 3. CONEXIÓN A SUPABASE (Para leer los guiones y videos dinámicos)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const contentType = req.headers.get('content-type') || '';
    let body: any = {};
    let isFormData = contentType.includes('multipart/form-data');

    if (isFormData) {
      const formData = await req.formData();
      body.action = formData.get('action');
      body.simData = JSON.parse((formData.get('simData') as string) || '{}');
      body.transcript = JSON.parse((formData.get('transcript') as string) || '[]');
      body.audio = formData.get('audio');
      body.documents = formData.getAll('documents');
    } else {
      body = await req.json();
    }

    // ==========================================
    // MODO EVALUACIÓN Y LECTURA DE MÚLTIPLES PDF
    // ==========================================
    if (body.action === 'evaluate') {
      const { simData, transcript, audio, documents } = body;
      let multimodalContext = "";
      let transcriptionText = "No se proporcionó audio.";
      
      const hasDocuments = documents && documents.length > 0;

      // EXTRACCIÓN DE AUDIO
      if (audio) {
        console.log("Procesando audio...");
        const audioForm = new FormData();
        audioForm.append('file', audio);
        audioForm.append('model', 'whisper-large-v3'); 
        
        const audioRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}` },
          body: audioForm
        });
        const audioData = await audioRes.json();
        if (audioData.text) {
          transcriptionText = audioData.text;
          multimodalContext += `\n\n=== TRANSCRIPCIÓN EXACTA DEL AUDIO DEL CANDIDATO ===\n"${transcriptionText}"\n`;
        }
      }

      // EXTRACCIÓN DE MÚLTIPLES PDFs
      if (hasDocuments) {
        console.log(`Procesando ${documents.length} documento(s) PDF dinámicamente...`);
        
        let pdfParser;
        let BufferPolyfill;
        try {
          const pdfParsePkg = "npm:pdf-parse@1.1.1";
          const bufferPkg = "node:buffer";
          
          const module = await import(pdfParsePkg);
          const bufferModule = await import(bufferPkg);
          
          pdfParser = module.default;
          BufferPolyfill = bufferModule.Buffer;
        } catch (importErr) {
          console.error("Aviso: No se pudo cargar pdf-parse nativo.");
        }

        for (let i = 0; i < documents.length; i++) {
          const docFile = documents[i];
          try {
            if (pdfParser && BufferPolyfill) {
              const arrayBuffer = await docFile.arrayBuffer();
              const buffer = BufferPolyfill.from(arrayBuffer);
              const pdfData = await pdfParser(buffer);
              multimodalContext += `\n\n=== TEXTO EXTRAÍDO DEL DOCUMENTO PDF [${docFile.name}] ===\n"${pdfData.text}"\n`;
            } else {
              throw new Error("Librerías de PDF inactivas, forzando fallback crudo");
            }
          } catch (e) {
            console.error(`Fallo lectura avanzada de ${docFile.name}, intentando lectura cruda...`);
            try {
               const rawText = await docFile.text();
               const cleanText = rawText.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ.,;:()]/g, ' ').substring(0, 2000);
               multimodalContext += `\n\n=== TEXTO DEL DOCUMENTO [${docFile.name}] ===\n"${cleanText}"\n`;
            } catch(fallbackErr) {
               multimodalContext += `\n\n=== DOCUMENTO CORRUPTO [${docFile.name}] ===\nArchivo vacío o dañado.\n`;
            }
          }
        }
      } else {
        multimodalContext += `\n\n=== SIN DOCUMENTOS ===\nEl candidato NO subió ningún archivo PDF en toda la sesión.\n`;
      }

      const advancedPenalty = (simData.difficulty === 'Avanzado' && !hasDocuments) 
        ? "PENALIZACIÓN CRÍTICA: Tú pediste archivos PDF para algunas respuestas, y NO SUBIÓ NINGUNO. Debes restarle muchos puntos en 'precision' y mencionarlo agresivamente en 'weaknesses'."
        : "Verifica que el contenido de CADA PDF adjunto tenga sentido respecto a la pregunta para la que fue solicitado.";

      const evaluationPrompt = {
        role: 'system',
        content: `Eres un evaluador Senior IMPLACABLE Y ESTRICTO.
        Estás evaluando al candidato para el rol de ${simData.role} en Nivel ${simData.difficulty || simData.diff}.

        INFORMACIÓN A EVALUAR:
        ${multimodalContext}

        INSTRUCCIONES CRÍTICAS (DE CUMPLIMIENTO OBLIGATORIO):
        1. Compara las preguntas del chat con las respuestas transcritas del audio y los PDFs.
        2. PENALIZACIÓN EXTREMA: Si la transcripción del candidato tiene repeticiones (ej. "hola hola"), balbuceos, evasivas, o no responde con solvencia técnica, SU SCORE DEBE SER MENOR A 20. NO regales nota.
        3. ${advancedPenalty} Si el nivel es 'Avanzado' y envió documentos, cruza cada documento con su pregunta. Si el contenido de los PDFs es basura/irrelevante, destrózalo en la rúbrica.

        Devuelve ÚNICAMENTE un JSON estricto:
        {
          "score": 15,
          "rubric": { "estructura": 10, "claridad": 10, "logica": 20, "tiempo": 30, "precision": 5 },
          "strengths": ["Menciona fortalezas solo si realmente existen"],
          "weaknesses": ["Menciona si evadió la respuesta", "Menciona la calidad o ausencia de los documentos solicitados"],
          "actionPlan": "Plan de mejora severo y realista.",
          "transcription": "${transcriptionText}"
        }`
      };

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [evaluationPrompt, { role: 'user', content: JSON.stringify(transcript) }],
          temperature: 0.1,
          response_format: { type: "json_object" }
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data.error));

      let aiContent = data.choices[0].message.content;
      aiContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();

      return new Response(aiContent, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ==========================================
    // MODO CONVERSACIÓN EN VIVO (CON BASE DE DATOS Y LÍMITES CORTOS PARA DEMO)
    // ==========================================
    const { messages, simData } = body;
    if (!messages || !Array.isArray(messages)) throw new Error("Faltan mensajes.");

    // VALIDACIÓN DE SISTEMA: Si es el primer mensaje, inyectamos contexto y reglas
    if (simData && messages.length > 0 && messages[0].role === 'system') {
      
      const diff = simData.difficulty || simData.diff || 'Básico';
      let minPreguntas = 3; // Básico: 3 preguntas
      if (diff === 'Intermedio') minPreguntas = 4; // Intermedio: 4 preguntas
      if (diff === 'Avanzado') minPreguntas = 5; // Avanzado: 5 preguntas

      // 1. Calculamos el turno actual basándonos estrictamente en el historial del frontend
      const assistantTurns = messages.filter((m: any) => m.role === 'assistant').length;

      // CHIVATO PARA LA CONSOLA DE SUPABASE (Útil para depurar)
      console.log(`==== ESTADO DE LA ENTREVISTA ====`);
      console.log(`Mensajes recibidos desde el Frontend: ${messages.length}`);
      console.log(`Turnos previos de la IA: ${assistantTurns} de ${minPreguntas}`);

      // 2. Control de flujo ULTRA AGRESIVO inyectado dinámicamente
      let controlFlujo = "";
      if (assistantTurns === 0) {
        controlFlujo = `[SISTEMA INTERNO]: Inicio de entrevista nivel ${diff}. Meta: ${minPreguntas} preguntas en total.\nREGLA ESTRICTA: Haz SOLAMENTE la primera pregunta (1 de ${minPreguntas}). NO saludes excesivamente, NO hagas más de una pregunta en este turno, y ESTÁ TOTALMENTE PROHIBIDO despedirte o cerrar la entrevista. Espera a que el candidato responda.`;
      } else if (assistantTurns < minPreguntas) {
        controlFlujo = `[SISTEMA INTERNO]: Progreso: Vas a hacer la pregunta ${assistantTurns + 1} de ${minPreguntas}.\nREGLA ESTRICTA: Reacciona brevemente a la respuesta anterior y formula SOLAMENTE tu siguiente pregunta técnica. NO hagas múltiples preguntas a la vez. ESTÁ TOTALMENTE PROHIBIDO despedirte, agradecer por el tiempo o cerrar la entrevista, porque aún faltan preguntas.`;
      } else {
        controlFlujo = `[SISTEMA INTERNO]: Límite alcanzado (${minPreguntas} de ${minPreguntas} preguntas realizadas).\nREGLA ESTRICTA: EL CANDIDATO YA RESPONDIÓ TODO. DEBES FINALIZAR LA ENTREVISTA AHORA MISMO. No hagas más preguntas técnicas. Agradece al candidato por su participación, despídete cordialmente e indícale que los resultados serán evaluados, cerrando obligatoriamente con la palabra clave: ENTREVISTA_FINALIZADA`;
      }

      // Añadimos el estado como el ÚLTIMO mensaje del array (recency bias) para forzar al LLM a obedecer
      messages.push({
        role: 'system',
        content: controlFlujo
      });

      // LÓGICA DINÁMICA: Extraer guiones y contexto de la BD
      if (simData.role) {
        const { data: recursos, error } = await supabase
          .from('recursos_entrevista')
          .select('tipo_recurso, contenido_texto')
          .eq('rol', simData.role);

        if (!error && recursos && recursos.length > 0) {
          let contextoBD = "\n\n=== CONTEXTO APRENDIDO DESDE BASE DE DATOS (VIDEOS/GUIONES) ===\n";
          contextoBD += "IMPORTANTE: Analiza la siguiente información extraída de los guiones y ÚSALA para formular tus preguntas:\n";
          
          recursos.forEach((recurso: any) => {
            contextoBD += `\n[${recurso.tipo_recurso}]: ${recurso.contenido_texto}`;
          });
          
          // Esto se mantiene en el prompt general inicial
          messages[0].content += contextoBD;
        }
      }
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.5,
        max_tokens: 600
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("Error en la Edge Function:", error);
    // 4. CAPTURA DE ERRORES CON CORS INCLUIDO
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});