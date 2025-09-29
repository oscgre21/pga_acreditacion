
"use client";

import React, { useState, useRef } from "react";
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
import { BookCopy, Eye, ChevronDown, FileUp, FileClock, GitBranch, FileDown, Download, Pencil, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProcessData {
  id: number;
  codigo: string;
  version: string;
  documentos: string;
  fechaVigencia: string;
}

const initialProcessData: ProcessData[] = [
  {
    id: 1,
    codigo: "ID: 809284031 Código: M-DPD-06-01",
    version: "Manual de la Calidad V. 23",
    documentos: "Manual de la Calidad V. 23",
    fechaVigencia: "30/05/2019",
  },
  {
    id: 2,
    codigo: "ID: 809278153 Código:",
    version: "5ta. Edición",
    documentos: "Norma ISO 9001:2015 - Sistema Gestión de Calidad – Requisitos",
    fechaVigencia: "25/09/2015",
  },
  {
    id: 3,
    codigo: "ID: 809277184 Código:",
    version: "Versión 5",
    documentos: "Organigramas, Manual y Perfiles de Cargos",
    fechaVigencia: "28/07/2018",
  },
  {
    id: 4,
    codigo: "ID: 809286743 Código:",
    version: "7ma. Edición, noviembre 2019",
    documentos: "Programa Nacional de Seguridad de la Aviación Civil (PNSAC)",
    fechaVigencia: "13/01/2020",
  },
];

const DocumentViewer = ({ doc }: { doc: ProcessData }) => {
    const renderContent = () => {
        switch(doc.id) {
            case 1: // Manual de la Calidad
                return (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h4>1. Introducción</h4>
                        <p>El presente Manual de la Calidad describe el Sistema de Gestión de la Calidad (SGC) del Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (CESAC), de acuerdo con los requisitos de la norma ISO 9001:2015.</p>
                        <h4>2. Política de Calidad</h4>
                        <p>El CESAC se compromete a garantizar la seguridad de la aviación civil mediante la implementación y mejora continua de procesos eficaces, cumpliendo con los requisitos legales y reglamentarios aplicables, y buscando siempre la satisfacción de las partes interesadas.</p>
                        <h4>3. Objetivos de Calidad</h4>
                        <ul>
                            <li>Mantener un nivel de cumplimiento normativo superior al 98%.</li>
                            <li>Aumentar la satisfacción del personal y de las entidades reguladas en un 5% anual.</li>
                            <li>Reducir los tiempos de respuesta en trámites de acreditación en un 10%.</li>
                        </ul>
                    </div>
                );
            case 2: // Norma ISO 9001:2015
                 return (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h4>Cláusulas Principales</h4>
                        <p>Este documento se adhiere a la estructura de la Norma ISO 9001:2015, incluyendo:</p>
                        <ul>
                            <li><strong>Cláusula 4:</strong> Contexto de la organización</li>
                            <li><strong>Cláusula 5:</strong> Liderazgo</li>
                            <li><strong>Cláusula 6:</strong> Planificación</li>
                            <li><strong>Cláusula 7:</strong> Soporte</li>
                            <li><strong>Cláusula 8:</strong> Operación</li>
                            <li><strong>Cláusula 9:</strong> Evaluación del desempeño</li>
                            <li><strong>Cláusula 10:</strong> Mejora</li>
                        </ul>
                    </div>
                );
            case 3: // Organigramas, Manual y Perfiles de Cargos
                return (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h4>Organigrama General</h4>
                        <div className="p-4 border rounded-md bg-muted/50">
                            <ul className="list-none p-0">
                                <li>Director General</li>
                                <li className="pl-4 border-l ml-2">Subdirector General</li>
                                <li className="pl-4 border-l ml-2">
                                    Direcciones
                                    <ul className="list-none p-0">
                                        <li className="pl-4 border-l ml-4">Dirección de Acreditación y Certificación</li>
                                        <li className="pl-4 border-l ml-4">Dirección de Tecnología y Comunicación</li>
                                        <li className="pl-4 border-l ml-4">...otras direcciones</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                         <h4 className="mt-4">Ejemplo de Perfil de Cargo: Analista de Acreditación</h4>
                        <p><strong>Objetivo del puesto:</strong> Evaluar y procesar las solicitudes de acreditación conforme a los procedimientos establecidos.</p>
                        <p><strong>Funciones principales:</strong> Revisión documental, seguimiento de trámites, elaboración de informes.</p>
                    </div>
                );
            case 4: // PNSAC
                return (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h4>Capítulos Destacados del PNSAC</h4>
                        <ol>
                            <li><strong>Capítulo 1:</strong> Introducción y Definiciones.</li>
                            <li><strong>Capítulo 2:</strong> Organización y Responsabilidades.</li>
                            <li><strong>Capítulo 3:</strong> Control de Acceso.</li>
                            <li><strong>Capítulo 4:</strong> Inspección de Pasajeros y Equipaje.</li>
                            <li><strong>Capítulo 5:</strong> Seguridad de la Carga Aérea.</li>
                            <li><strong>Capítulo 6:</strong> Medidas de Seguridad en la Aeronave.</li>
                            <li><strong>Capítulo 7:</strong> Respuesta a Actos de Interferencia Ilícita.</li>
                        </ol>
                    </div>
                );
            default:
                return <p>No hay vista previa disponible para este documento.</p>;
        }
    }

    return (
        <div id="pdf-content" className="p-4 bg-white text-black">
            <header className="text-center mb-6">
                 <h2 className="text-xl font-bold">{doc.documentos}</h2>
                <p className="text-sm text-gray-500">Versión: {doc.version}</p>
            </header>
            <main>{renderContent()}</main>
             <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
                Documento Confidencial - CESAC
            </footer>
        </div>
    );
};


export default function DocumentacionProcesoPage() {
    const [processList, setProcessList] = useState<ProcessData[]>(initialProcessData);
    const [viewingDoc, setViewingDoc] = useState<ProcessData | null>(null);
    const [editingDoc, setEditingDoc] = useState<ProcessData | null>(null);
    const { toast } = useToast();
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        const element = reportRef.current?.querySelector('#pdf-content');
        if (!element || !viewingDoc) return;
        
        toast({ title: "Generando PDF...", description: "Por favor espere." });

        const canvas = await html2canvas(element as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let height = imgHeight;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, height);
        heightLeft -= pdfHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - height;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, height);
            heightLeft -= pdfHeight;
        }

        pdf.save(`${viewingDoc.documentos.replace(/ /g, '_')}.pdf`);
        toast({ title: "PDF Descargado", description: "El reporte ha sido guardado." });
    };

    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingDoc) return;
        
        setProcessList(prevList => prevList.map(p => p.id === editingDoc.id ? editingDoc : p));
        toast({ title: "Proceso Actualizado", description: "Los cambios han sido guardados exitosamente." });
        setEditingDoc(null);
    };

    return (
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BookCopy className="h-6 w-6" />
                Documentación de Procesos de Acreditación
            </CardTitle>
            <CardDescription>
                Listado completo de todos los procesos de acreditación y certificación definidos en el sistema.
            </CardDescription>
            </CardHeader>
        </Card>

        <Card className="shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-primary/20">
            <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Versión</TableHead>
                    <TableHead>Documentos del proceso</TableHead>
                    <TableHead>Fecha de entrada en vigencia</TableHead>
                    <TableHead className="text-right w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                    {processList.map((item) => (
                        <Collapsible asChild key={item.id} className="group">
                            <tbody className="border-b">
                                <CollapsibleTrigger asChild>
                                    <TableRow className="cursor-pointer hover:bg-muted/30 transition-colors data-[state=open]:bg-muted/40">
                                        <TableCell className="font-mono max-w-xs">{item.codigo}</TableCell>
                                        <TableCell className="max-w-xs">{item.version}</TableCell>
                                        <TableCell className="max-w-md">{item.documentos}</TableCell>
                                        <TableCell className="font-mono">{item.fechaVigencia}</TableCell>
                                        <TableCell className="text-right">
                                            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                        </TableCell>
                                    </TableRow>
                            </CollapsibleTrigger>
                            <CollapsibleContent asChild>
                                    <tr className="bg-muted/20 dark:bg-muted/10">
                                        <TableCell colSpan={6} className="p-0">
                                            <div className="p-4 flex flex-wrap items-center justify-end gap-2 animate-in fade-in-0 slide-in-from-top-4 duration-500">
                                                <Button variant="outline" size="sm" onClick={() => setEditingDoc(item)}><Pencil className="mr-2 h-4 w-4" />Editar Proceso</Button>
                                                <Button variant="outline" size="sm" onClick={() => setEditingDoc(item)}><FileClock className="mr-2 h-4 w-4" />Estado</Button>
                                                <Button variant="outline" size="sm" onClick={() => setEditingDoc(item)}><GitBranch className="mr-2 h-4 w-4" />Versión</Button>
                                                <Button variant="outline" size="sm" onClick={() => setViewingDoc(item)}><Eye className="mr-2 h-4 w-4" />Consultar</Button>
                                                <Button variant="secondary" size="sm" onClick={() => { setViewingDoc(item); setTimeout(handleDownloadPdf, 100); }}><FileDown className="mr-2 h-4 w-4" />Generar PDF</Button>
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

        <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{viewingDoc?.documentos}</DialogTitle>
                     <DialogDescription>
                        Vista previa del documento. Puede descargarlo como PDF.
                    </DialogDescription>
                </DialogHeader>
                <div ref={reportRef} className="max-h-[70vh] overflow-y-auto border rounded-md">
                   {viewingDoc && <DocumentViewer doc={viewingDoc} />}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setViewingDoc(null)}>Cerrar</Button>
                    <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4"/>Descargar PDF</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
            <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleSaveEdit}>
                    <DialogHeader>
                        <DialogTitle>Editar Proceso</DialogTitle>
                        <DialogDescription>
                            Realice los cambios necesarios en los detalles del proceso.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-codigo">Código</Label>
                            <Input id="edit-codigo" value={editingDoc?.codigo || ''} onChange={(e) => setEditingDoc(prev => prev ? {...prev, codigo: e.target.value} : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-documentos">Documentos del proceso</Label>
                            <Input id="edit-documentos" value={editingDoc?.documentos || ''} onChange={(e) => setEditingDoc(prev => prev ? {...prev, documentos: e.target.value} : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-version">Versión</Label>
                            <Input id="edit-version" value={editingDoc?.version || ''} onChange={(e) => setEditingDoc(prev => prev ? {...prev, version: e.target.value} : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-fecha">Fecha de Vigencia</Label>
                            <Input id="edit-fecha" value={editingDoc?.fechaVigencia || ''} onChange={(e) => setEditingDoc(prev => prev ? {...prev, fechaVigencia: e.target.value} : null)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" type="button" onClick={() => setEditingDoc(null)}>Cancelar</Button>
                        <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </div>
    );
}

