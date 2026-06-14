const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // @ts-ignore
    const apiKey = Deno.env.get('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error("Falta la API Key en las variables de entorno de Supabase.");
    }

    // ==========================================
    // MODO EVALUACIÓN: Genera la Rúbrica y el JSON
    // ==========================================
    if (body.action === 'evaluate') {
      const { simData, transcript } = body;
      
      const evaluationPrompt = {
        role: 'system',
        content: `Eres un evaluador experto de entrevistas técnicas y de RRHH.
        Evalúa esta transcripción para el rol de ${simData.role} (Nivel: ${simData.diff}).
        
        Devuelve ÚNICAMENTE un objeto JSON estrictamente formateado con esta estructura:
        {
          "score": 85,
          "rubric": { "estructura": 90, "claridad": 85, "logica": 80, "tiempo": 95, "precision": 80 },
          "strengths": ["Fortaleza 1", "Fortaleza 2"],
          "weaknesses": ["Brecha 1", "Brecha 2"],
          "actionPlan": "Plan de mejora detallado."
        }`
      };

      const evaluateMessages = [
        evaluationPrompt,
        { role: 'user', content: `Transcripción de la entrevista:\n${JSON.stringify(transcript)}` }
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${apiKey}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: evaluateMessages,
          temperature: 0.1,
          response_format: { type: "json_object" }
        }),
      });

      const data = await response.json();
      
      // Capturar errores directos de Groq
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      // Limpiar Markdown residual
      let aiContent = data.choices[0].message.content;
      aiContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();

      return new Response(aiContent, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ==========================================
    // MODO CONVERSACIÓN: Realiza las 3 preguntas
    // ==========================================
    const { messages } = body;
    
    // Validar que el frontend sí envió mensajes
    if (!messages || !Array.isArray(messages)) {
      throw new Error(JSON.stringify({ message: "No se encontró el arreglo de 'messages'." }));
    }

    const systemPrompt = {
      role: 'system',
      content: `Eres un reclutador técnico experto. Reglas: 1) Envía mensajes cortos. 2) Haz exactamente 3 preguntas técnicas en total, una por mensaje. 3) Al finalizar la tercera pregunta, despídete y escribe exactamente ENTREVISTA_FINALIZADA.`
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${apiKey}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [systemPrompt, ...messages],
        temperature: 0.5,
        max_tokens: 600
      }),
    });

    const data = await response.json();
    
    // Capturar errores directos de Groq
    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});