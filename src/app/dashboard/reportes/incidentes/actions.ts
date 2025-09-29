
"use server";

// AI Analysis removed - Firebase/Genkit integration disabled
export interface Incidente {
  tipo: string;
  descripcion: string;
  count: number;
  resuelto: boolean;
  fechaReporte: Date;
}

export async function generarAnalisisDeIncidentes(incidentes: Incidente[]) {
  // Retornar análisis básico sin AI
  return {
    resumen: `Se encontraron ${incidentes.length} incidentes para análisis.`,
    incidentesCriticos: incidentes.filter(i => i.tipo === "CRITICO").length,
    incidentesPendientes: incidentes.filter(i => !i.resuelto).length,
  };
}
