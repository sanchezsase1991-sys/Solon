
import { GoogleGenAI } from "@google/genai";
import { UserProfile, JobOpportunity, InvestmentStrategy } from "./types";

export const getSolonResponse = async (profile: UserProfile, currentTime: Date) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Gemini 2.5 series model is mandatory for Google Maps grounding tools.
  const modelName = 'gemini-2.5-flash';
  
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const currentDayName = dayNames[currentTime.getDay()];
  const currentHour = currentTime.getHours();
  const dateStr = currentTime.toISOString().split('T')[0];

  const systemInstruction = `
    ROL: Eres SÓLON, un arquitecto de destinos y analista estratégico especializado en reclutamiento y geolocalización.
    
    SYSTEM DAY: Hoy es ${currentDayName}, ${dateStr}. Hora: ${currentHour}:00.
    IDIOMA DE RESPUESTA: ${profile.language}. Todo el JSON y textos deben estar estrictamente en ${profile.language}.

    PROTOCOLO DE INICIO (VERIFICACIÓN CRONOLÓGICA):
    - REGLA DE ORO: NO muestres ninguna información cuya fecha de publicación supere los 7 días de antigüedad respecto a hoy (${dateStr}).
    - Descarta automáticamente vacantes si la fecha es ambigua o superior a 7 días.

    PROTOCOLO DE FILTRADO - SECCIÓN "Para tu Perfil" (profileJobs):
    1. Objetivo: Aplicación inmediata, perfiles operativos.
    2. Prioridad: 1º Presencial (Absoluta), 2º Online (Solo si no hay presencial).
    3. Experiencia: Aceptar "Sin experiencia" o "Entrenamiento". RECHAZAR perfiles técnicos avanzados.
    4. Acción: Priorizar vacantes con "Contratación inmediata".

    PROTOCOLO DE FILTRADO - SECCIÓN "Mapa Global" (nearbyJobs):
    1. Validación System Day: Diferencia > 7 días = Descarte inmediato.
    2. Geolocalización Obligatoria: Toda vacante presencial debe tener ubicación clara y geolocalizable. Si no tiene, descarta.
    3. Orden de Visualización: 
       - 1. Presencial cercano.
       - 2. Presencial medio.
       - 3. Presencial lejano.
       - 4. En línea.

    ESTRUCTURA DE RESPUESTA REQUERIDA (JSON):
    {
      "profileJobs": [
        {
          "companyName": "Nombre",
          "address": "Dirección",
          "contactInfo": "Tel/Email",
          "applicationMethod": "Presencial" | "Oficial",
          "urgency": "Nivel",
          "requirements": ["Req"],
          "dailyInsight": "Por qué ir hoy ${currentDayName} es ideal."
        }
      ],
      "nearbyJobs": [
        {
          "companyName": "Nombre",
          "coords": {"lat": 0, "lng": 0},
          "address": "Dirección",
          "urgency": "Nivel",
          "jobType": "Sector",
          "dailyInsight": "Razón activa hoy"
        }
      ],
      "investment": { ... }
    }

    RESTRICCIONES:
    - Tono objetivo y directo.
    - NO utilices criterios de edad o sexo para discriminar.
    - NO incluyas texto fuera del JSON.
  `;

  const prompt = `
    Analiza el mercado para la ubicación: ${profile.location}, ${profile.country}.
    Usuario configurado en idioma: ${profile.language}. Edad: ${profile.age}. Sexo: ${profile.sex}.
    Busca empleos operativos y aplica el protocolo de 7 días para vacantes de perfil y para el mapa global sin filtros.
  `;

  try {
    const config: any = {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
      temperature: 0.1, 
    };

    if (profile.coordinates) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: profile.coordinates.latitude,
            longitude: profile.coordinates.longitude
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: config,
    });

    const text = response.text || '';
    let parsed: any = {};
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Error al parsear:", e);
      throw new Error("Sincronización interrumpida.");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      profileJobs: parsed.profileJobs || [],
      nearbyJobs: parsed.nearbyJobs || [],
      investment: parsed.investment || null,
      text: profile.language === 'Español' ? "Sincronía establecida." : "Synchrony established.",
      sources: groundingChunks.map((chunk: any) => chunk.web?.uri || chunk.maps?.uri).filter(Boolean)
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
