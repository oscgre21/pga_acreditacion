
'use server';
/**
 * @fileOverview Un agente de IA para analizar incidentes de aplicaciones.
 *
 * - analizarIncidentes - Una función que maneja el análisis de incidentes.
 * - Incidente - El tipo de datos para un solo incidente.
 * - AnalisisIncidente - El tipo de retorno para la función de análisis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const IncidenteSchema = z.object({
  appName: z.string().describe('El nombre de la aplicación donde ocurrió el incidente.'),
  incidentType: z.string().describe('La clasificación del incidente (ej. Crítico, Advertencia, Menor).'),
  description: z.string().describe('Una breve descripción del incidente reportado.'),
});
export type Incidente = z.infer<typeof IncidenteSchema>;

const AnalisisIncidenteSchema = z.object({
  executiveSummary: z.string().describe('Un resumen ejecutivo de 2-3 frases sobre los hallazgos clave.'),
  rootCauseAnalysis: z.array(z.string()).describe('Una lista de las posibles causas raíz que conectan los incidentes.'),
  shortTermFixes: z.array(z.string()).describe('Una lista de acciones inmediatas y a corto plazo para mitigar los problemas.'),
  longTermRecommendations: z.array(z.string()).describe('Una lista de recomendaciones estratégicas a largo plazo para mejorar la estabilidad y prevenir futuros incidentes.'),
});
export type AnalisisIncidente = z.infer<typeof AnalisisIncidenteSchema>;

const analizadorIncidentesPrompt = ai.definePrompt({
    name: 'analizadorIncidentesPrompt',
    input: { schema: z.array(IncidenteSchema) },
    output: { schema: AnalisisIncidenteSchema },
    prompt: `
        Eres un Ingeniero de Confiabilidad de Sitios (SRE) y un consultor DevOps con más de 10 años de experiencia.
        Tu tarea es analizar la siguiente lista de incidentes de aplicaciones y proporcionar un análisis de causa raíz y recomendaciones accionables.

        IMPORTANTE: Tu respuesta y todo el contenido del análisis DEBEN estar completamente en español.

        Incidentes a analizar:
        {{#each input}}
        - Aplicación: {{appName}}
          Tipo: {{incidentType}}
          Descripción: {{description}}
        {{/each}}

        Por favor, analiza estos incidentes y proporciona:
        1.  **Resumen Ejecutivo**: Un resumen conciso de los problemas principales.
        2.  **Análisis de Causa Raíz**: Identifica los temas comunes y las causas subyacentes probables. ¿Son problemas de código, infraestructura, base de datos, o de procesos?
        3.  **Soluciones a Corto Plazo**: Pasos inmediatos que el equipo puede tomar para solucionar o mitigar estos problemas.
        4.  **Recomendaciones a Largo Plazo**: Cambios estratégicos en la arquitectura, procesos de desarrollo, o monitoreo para prevenir que estos problemas ocurran de nuevo.

        Presenta tu análisis en el formato JSON estructurado solicitado. Sé claro, conciso y profesional.
    `,
});

const flujoAnalisisIncidentes = ai.defineFlow(
    {
        name: 'flujoAnalisisIncidentes',
        inputSchema: z.array(IncidenteSchema),
        outputSchema: AnalisisIncidenteSchema,
    },
    async (incidentes) => {
        const { output } = await analizadorIncidentesPrompt(incidentes);
        if (!output) {
            throw new Error('El análisis de IA no pudo generar una respuesta.');
        }
        return output;
    }
);

export async function analizarIncidentes(incidentes: Incidente[]): Promise<AnalisisIncidente> {
    return await flujoAnalisisIncidentes(incidentes);
}
