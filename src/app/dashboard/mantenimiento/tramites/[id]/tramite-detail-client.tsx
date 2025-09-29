
"use client";

import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
    aeropuertos,
    categoriasEmpresa,
    departamentos,
    equiposSeguridad,
    serviciosSeguridad,
    categoriaPersonal,
    categoriaCia,
} from "../../data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const getLabelsFromIds = (source: { id: string; label: string }[], ids: string[] = []) => {
    if (!ids || ids.length === 0) return [{ id: 'none', label: 'Ninguno' }];
    return ids
        .map(id => source.find(item => item.id === id))
        .filter(Boolean) as { id: string; label: string }[];
};


export default function TramiteDetailClient({ tramite }: { tramite: any }) {
  const params = useParams();
  const tramiteId = params.id as string;

  if (!tramite) {
    notFound();
  }

  const getDepartmentLabels = (ids: string[] = []) => {
      return ids.map(id => departamentos.find(d => d.id === id)?.label).filter(Boolean).join(', ');
  }

  const getCategoryLabel = (id: string | undefined) => {
      if (!id) return 'N/A';
      return categoriasEmpresa.find(c => c.id === id)?.nombre || 'Desconocido';
  }
  
  const equipos = getLabelsFromIds(equiposSeguridad, tramite.equiposSeguridad);
  const aeropuertosList = getLabelsFromIds(aeropuertos, tramite.aeropuertos);
  const servicios = getLabelsFromIds(serviciosSeguridad, tramite.serviciosSeguridad);
  const personalCategorias = getLabelsFromIds(categoriaPersonal, tramite.categoriaPersonal);
  const ciaCategorias = getLabelsFromIds(categoriaCia, tramite.categoriaCia);


  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Detalle del Trámite</CardTitle>
            <CardDescription className="font-mono">{tramite.id}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/mantenimiento/tramites/list">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Listado
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/mantenimiento/tramites?id=${tramiteId}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm border p-4 rounded-md">
                <div className="font-medium">Proceso:</div>
                <div>{tramite.nombreProceso}</div>

                <div className="font-medium">Producto:</div>
                <div>{tramite.producto}</div>

                <div className="font-medium">Tipo de Trámite:</div>
                <div><Badge variant="secondary">{tramite.tipoTramite}</Badge></div>
                
                {tramite.tipoTramite === 'EMPRESA' && (
                    <>
                        <div className="font-medium">Categoría de Compañía:</div>
                        <div>{getCategoryLabel(tramite.categoriaEmpresaId)}</div>
                    </>
                )}
            </div>
        </div>

        {tramite.tipoTramite === 'EMPRESA' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Certificación</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm border p-4 rounded-md">
                <div className="font-medium">Requiere No. de Certificación:</div>
                <div className="flex items-center gap-2">
                    {tramite.requeridoCertificacion ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                    <span>{tramite.requeridoCertificacion ? 'Sí' : 'No'}</span>
                </div>
                
                <div className="font-medium">Requiere Modificación de Programa:</div>
                <div className="flex items-center gap-2">
                    {tramite.requeridoModificacionPrograma ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                    <span>{tramite.requeridoModificacionPrograma ? 'Sí' : 'No'}</span>
                </div>

                {tramite.requeridoModificacionPrograma && (
                    <>
                        <div className="font-medium self-start">Descripción de Modificación:</div>
                        <p className="text-muted-foreground">{tramite.descripcionModificacion}</p>
                    </>
                )}
            </div>
          </div>
        )}

        {tramite.tipoTramite === 'PERSONA' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Detalles de Persona</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm border p-4 rounded-md">
                <div className="font-medium">Posee Programa de Instrucción:</div>
                <div className="flex items-center gap-2">
                    {tramite.poseePrograma === 'si' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                    <span>{tramite.poseePrograma === 'si' ? 'Sí' : 'No'}</span>
                </div>
             </div>
          </div>
        )}
        
        <Separator />

        <Tabs defaultValue="requisitos" className="w-full">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
            {tramite.tipoTramite === 'EMPRESA' && <TabsTrigger value="equipos">Equipos de Seguridad</TabsTrigger>}
            <TabsTrigger value="aeropuertos">Aeropuertos</TabsTrigger>
             {tramite.tipoTramite === 'EMPRESA' && <TabsTrigger value="servicios">Servicios de Seguridad</TabsTrigger>}
             {tramite.tipoTramite === 'PERSONA' && <TabsTrigger value="cat-personal">Categoría Personal</TabsTrigger>}
             {tramite.tipoTramite === 'PERSONA' && <TabsTrigger value="cat-cia">Categoría CIA</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="requisitos">
            <Card>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Departamento</TableHead>
                                <TableHead className="w-[120px]">Obligatorio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tramite.documentosRequeridos && tramite.documentosRequeridos.length > 0 ? (
                                tramite.documentosRequeridos.map((doc: any, index: number) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <p>{doc.descripcion}</p>
                                            {doc.nota && <p className="text-xs text-destructive">Nota: {doc.nota}</p>}
                                        </TableCell>
                                        <TableCell>{getDepartmentLabels(doc.departamentos)}</TableCell>
                                        <TableCell>
                                            <Badge variant={doc.obligatorio ? "default" : "outline"}>
                                                {doc.obligatorio ? 'Sí' : 'No'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No hay documentos requeridos.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {tramite.tipoTramite === 'EMPRESA' && (
            <TabsContent value="equipos">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                        {equipos.map(item => (
                            <Badge key={item.id} variant="secondary">{item.label}</Badge>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          )}

          <TabsContent value="aeropuertos">
             <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                    {aeropuertosList.map(item => (
                        <Badge key={item.id} variant="secondary">{item.label}</Badge>
                    ))}
                    </div>
                </CardContent>
             </Card>
          </TabsContent>

          {tramite.tipoTramite === 'EMPRESA' && (
            <TabsContent value="servicios">
               <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                        {servicios.map(item => (
                            <Badge key={item.id} variant="secondary">{item.label}</Badge>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          )}

           {tramite.tipoTramite === 'PERSONA' && (
            <TabsContent value="cat-personal">
               <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                        {personalCategorias.map(item => (
                            <Badge key={item.id} variant="secondary">{item.label}</Badge>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          )}

            {tramite.tipoTramite === 'PERSONA' && (
            <TabsContent value="cat-cia">
               <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                        {ciaCategorias.map(item => (
                            <Badge key={item.id} variant="secondary">{item.label}</Badge>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          )}

        </Tabs>

      </CardContent>
    </Card>
  );
}
