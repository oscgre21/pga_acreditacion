
"use server";

import { analizarIncidentes } from "@/ai/flows/incident-analysis-flow";
import type { Incidente } from "@/ai/flows/incident-analysis-flow";

export async function generarAnalisisDeIncidentes(incidentes: Incidente[]) {
  const result = await analizarIncidentes(incidentes);
  return result;
}
