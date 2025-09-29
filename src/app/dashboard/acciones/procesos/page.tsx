
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Settings2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";


const initialData = [
    {
        id: 1,
        proceso: "Re-certificación de Personal AVSEC del CESAC",
        tarea: "Re-certificación de Personal AVSEC del CESAC",
        item: null,
    },
    {
        id: 2,
        proceso: "Reimpresión de licencias por cambio de compañía",
        tarea: "Reimpresión de licencia por cambio de compañía del Personal de Seguridad Privada de la aviación Civil",
        item: null,
    },
    {
        id: 3,
        proceso: "Certificación del personal de seguridad privada de la aviación civil",
        tarea: "Certificación y Re-certificación del Personal de Seguridad Privada de la Aviación Civil",
        item: [
            "Requisitos para el inicio del proceso de 'CERTIFICACIÓN' para el personal que presta Servicios de Seguridad Privada de la Aviación Civil:",
            "1- La Certificación del personal que presta Servicios de Seguridad Privada de la Aviación Civil, deberá ser solicitada al Director de Acreditación y Certificación del CESAC, por las entidades que brindan servicios de seguridad privada de la aviación civil, adjuntando un listado del personal que ha culminado y aprobado la Instrucción Periódica, impartida por instructores certificados por el CESAC, de la Escuela de Seguridad de la Aviación Civil (ESAC).",
            "2- La Compañía depositará a la Dirección de Acreditación y Certificación, los documentos siguientes, para ser evaluados antes de iniciar dicho Proceso:",
            "a) Copia de Cédula de Identidad.",
            "b) Evaluación Médica (oftalmología y audiometría) y analíticas Médicas (Hemograma, Glicemia, Urea, Creatinina, Orina, VDRL, HBSAG y HVC) por un médico competente en las diferentes áreas.",
            "c) Presentar comprobante de realización de la Prueba de Dopaje, por el CESAC.",
            "NOTA: El Proceso de Certificación tiene un costo de ochenta y dos con treinta y nueve centavos dólares estadounidenses (US$ 82.39) por persona, o su equivalente a la tasa actual en pesos dominicanos; debiendo la parte interesada realizar el pago veinticuatro (24) horas antes de iniciar el vencimiento.",
            "El Proceso de Certificación incluye lo siguiente:",
            "1- Evaluación Psicológica.",
            "2- Evaluación Teórica; será impartido un examen teórico adaptado al entrenamiento recibido.",
            "3- Evaluación Práctica.",
            "4- Verificación de Antecedentes.",
            "5- Emisión de la Licencia de Certificación del Personal de Seguridad de la Aviación Civil."
        ],
    },
    {
        id: 4,
        proceso: "Re-Certificación del personal de seguridad privada de la aviación civil",
        tarea: "Certificación y Re-certificación del Personal de Seguridad Privada de la Aviación Civil",
        item: [
            "Requisitos para el inicio del proceso de 'RE-CERTIFICACIÓN', para el personal que presta Servicios de Seguridad Privada de la Aviación Civil:",
            "1- La Certificación del personal que presta Servicios de Seguridad Privada de la Aviación Civil, deberá ser solicitada al Director de Acreditación y Certificación del CESAC, por las entidades que brindan servicios de seguridad privada de la aviación civil, adjuntando un listado del personal que ha culminado y aprobado la Instrucción Periódica, impartida por instructores certificados por el CESAC.",
            "2- La Compañía depositará a la Dirección de Acreditación y Certificación, los documentos siguientes, para ser evaluados antes de iniciar dicho Proceso:",
            "a) Copia de Cédula de Identidad.",
            "b) Copia del Carnet de identificación y acceso vigente, del aeropuerto donde presta servicio.",
            "c) Copia del Reporte de las Calificaciones de la instrucción recibida (Teórica y Práctica), impartida por la Empresa, Firmado por un instructor debidamente certificado por el CESAC.",
            "d) Evaluación Médica (oftalmología y audiometría) y Analíticas Médicas (Hemograma, Glicemia, Urea, Creatinina, Orina, VDRL, HBSAC y HVC) por un médico competente en las diferentes áreas.",
            "e) Presentar comprobante de realización de la Prueba de Dopaje, por el CESAC.",
            "NOTA: El Proceso de Re-certificación tiene un costo de ochenta y dos con treinta y nueve centavos dólares estadounidenses (US$ 82.39) por persona, o su equivalente a la tasa actual en pesos dominicanos; debiendo la parte interesada realizar el pago 24 horas antes de iniciar el vencimiento.",
            "El Proceso de Re-certificación incluye lo siguiente:",
            "1- Evaluación Psicológica.",
            "2- Evaluación Teórica; será impartido un examen teórico adaptado al entrenamiento recibido.",
            "3- Evaluación Práctica.",
            "4- Verificación de Antecedentes.",
            "5- Emisión de la Licencia de Certificación del Personal de Seguridad de la Aviación Civil."
        ],
    },
    {
        id: 5,
        proceso: "Certificación del personal AVSEC del CESAC",
        tarea: "Certificación de Personal AVSEC del CESAC",
        item: null,
    },
];

export default function AdministracionProcesosPage() {
  const [filters, setFilters] = React.useState({
    proceso: "",
    tarea: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = React.useMemo(() => {
    return initialData.filter((item) => {
      return (
        item.proceso.toLowerCase().includes(filters.proceso.toLowerCase()) &&
        item.tarea.toLowerCase().includes(filters.tarea.toLowerCase())
      );
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Administración de Procesos</CardTitle>
          <CardDescription>
            Gestione los procesos y tareas del sistema de acreditación.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-primary/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="p-2 min-w-[300px]">
                    <div className="pl-2">Proceso</div>
                    <Input name="proceso" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.proceso} />
                  </TableHead>
                  <TableHead className="p-2 min-w-[300px]">
                    <div className="pl-2">Tarea</div>
                    <Input name="tarea" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.tarea} />
                  </TableHead>
                  <TableHead className="p-2 w-[150px] text-right">
                    <div className="pr-2">Acciones</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              {filteredData.map((item) => (
                <Collapsible asChild key={item.id}>
                  <tbody className="group">
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                        <TableCell className="font-medium align-top py-4">{item.proceso}</TableCell>
                        <TableCell className="align-top py-4">{item.tarea}</TableCell>
                        <TableCell className="text-right align-top py-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
                                <Settings2 className="h-4 w-4" />
                            </Button>
                            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 inline-block ml-2" />
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <tr className="bg-muted/20 dark:bg-muted/10">
                        <TableCell colSpan={3} className="p-0">
                          <div className="p-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">
                            {item.item ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground prose-li:my-1">
                                <h4 className="text-sm font-semibold text-primary mb-2">Requisitos y Detalles del Proceso</h4>
                                <ul className="list-decimal space-y-2 pl-5">
                                    {item.item.map((detail, index) => (
                                        <li key={index}>{detail}</li>
                                    ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-center py-4 italic">No hay detalles adicionales para este proceso.</p>
                            )}
                          </div>
                        </TableCell>
                      </tr>
                    </CollapsibleContent>
                  </tbody>
                </Collapsible>
              ))}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
