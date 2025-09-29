
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase,
  ChevronRight,
  ClipboardCheck,
  MessageSquare,
  Plane,
  PlaneTakeoff,
  Printer,
  Upload,
  User,
  Users,
  XCircle,
  ShieldCheck,
  ClipboardList,
  Paperclip,
  Save,
  UserSearch,
  Loader2,
  CheckCircle,
  Check,
  PlusCircle,
  Cake,
  Ruler,
  Globe2,
  PhoneCall,
  Droplets,
  HeartPulse,
  Pill,
  Building,
  ShieldAlert,
  FileText,
  Download,
  Building2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FlightProgress } from "@/components/ui/flight-progress";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TravelGoLogo = () => (
    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-1">
        <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/20">
            <PlaneTakeoff className="h-7 w-7 text-white" />
        </div>
    </div>
);

const airports = [
    { id: "MDSD", name: "Las Américas, Sto. Dgo." },
    { id: "MDST", name: "Cibao, Santiago" },
    { id: "MDPC", name: "Punta Cana" },
    { id: "MDBH", name: "María Montez, Barahona" },
    { id: "MDCY", name: "El Catey, Samaná" },
    { id: "MDJB", name: "El Higüero, Sto. Dgo." },
    { id: "MDLR", name: "La Romana" },
    { id: "MDAB", name: "Arroyo Barril, Samaná" },
    { id: "MDPP", name: "Gregorio Luperón, Pto. Plata" },
];

const personalCategories = [
    "SUPERVISOR AVSEC",
    "INSTRUCTOR AVSEC",
    "GERENTE AVSEC",
    "MANEJADOR K-9",
    "INSPECTOR NACIONAL AVSEC",
    "INSPECTOR AVSEC 1RA CAT",
    "INSPECTOR DE SEGURIDAD PROVADA",
];

const ciaCategories = [
    "CESAC",
    "EXPLOTADORES DE AERONAVE",
    "PROVEDORES DE SERV. PRIVADO",
    "APROVICIONAMIENTO DE AERONAVE (CATERIN)",
];

const empresaRequirements = [
    { id: 'req1', text: 'a) Comunicación formal a la Dirección General del CESAC, solicitando el inicio del proceso de Acreditación como Proveedor de Servicios Privados de Seguridad de la Aviación Civil, adjuntando a la misma el formulario de solicitud.*' },
    { id: 'req2', text: 'b-1) Copia de los Estatutos Sociales a favor de la sociedad que solicite la acreditación, sellados por la Cámara Civil y Comercial.*' },
    { id: 'req3', text: 'b-2) Copia del Acta de la Asamblea General de Socios, correspondiente al último periodo social concluido, debidamente sellada por la Cámara Civil y Comercial, donde se enuncie que dicha sociedad dispone de un capital suscrito y pagado de por lo menos un millón de pesos dominicanos (RD$ 1,000,000.00) o su equivalente en dólares de los Estados Unidos de América.*' },
    { id: 'req4', text: 'b-3) Copia de la Certificación de Registro Nacional de Contribuyente (RNC), de la sociedad.*' },
    { id: 'req5', text: 'b-4) Copia del Certificado de Registro Mercantil vigente.*' },
    { id: 'req6', text: 'b-5) Copia de los estados financieros de la empresa, correspondiente al último periodo fiscal, auditados por un Contador Público Autorizado (CPA).*' },
    { id: 'req7', text: 'b-6) Declaración Jurada de No Litis con el Estado Dominicano, notariada y legalizada por la Procuraduría General de la República.*' },
    { id: 'req8', text: 'b-7) Copia de la Certificación de la Tesorería de la Seguridad Social (TSS).*' },
    { id: 'req9', text: 'c) Depositar un listado de los Servicios Privados de Seguridad de la Aviación Civil, cuya aprobación se solicite, tomando como referencia el apéndice 2, del presente reglamento.*' },
    { id: 'req10', text: 'd) Depositar un listado del personal de la empresa, detallando el cargo o puesto que ocupe dentro de la misma, con su número de cédula de identidad o pasaporte en caso de ser extranjero.*' },
    { id: 'req11', text: 'e) Depositar un listado de los Radios de Comunicación y números de frecuencias, que serán utilizados por la empresa en las diferentes terminales aeroportuarias, para la prestación de los servicios de seguridad; en caso de no tener los radios de comunicación y la frecuencia en mención, deberá enviar un listado de los números de teléfonos celulares que se utilizarán en la prestación de los servicios.*' },
    { id: 'req12', text: 'f) Depositar un listado de los Equipos de Seguridad con sus respectivas características. Si al momento de la acreditación no cuentan con dichos equipos, el Proveedor de Servicios, deberá presentar el listado ante el CESAC, al momento de adquirir los mismos.*' },
    { id: 'req13', text: 'g) Someter un Programa de Seguridad ante el CESAC, escrito en idioma español, elaborado de acuerdo al modelo figurado en el Apéndice 6 (Modelo del Programa de Seguridad de Proveedores de Servicio Privados de Seguridad de la Aviación Civil), de este documento, para su revisión y aprobación. El mismo será aprobado mediante Directiva de Seguridad, la cual tendrá una vigencia de veinticuatro (24) meses, esta deberá presentar como parte de su contenido, el total de las operaciones y procedimientos realizados por el Proveedor, en los distintos aeropuertos que le serán aprobados. El Programa de Seguridad será aprobado conjuntamente con el Certificado de Acreditación.*' },
    { id: 'req14', text: 'h) Presentar la certificación del personal en materia de seguridad, emitida por el CESAC, del personal que realizará funciones de seguridad, en la cual por lo menos cinco (5) personas deben estar certificadas, para poder optar por la Acreditación.*' },
    { id: 'req15', text: 'i) Depositar copia de la Directiva de Seguridad que aprueba el Programa de Instrucción actualizado, donde se describen los entrenamientos en materia de seguridad, de acuerdo a los servicios a brindar, el cual tendrá una vigencia de veinticuatro (24) meses; si la compañía opta por no elaborar dicho programa, la misma deberá solicitar al Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil, la aprobación de un acuerdo en materia de instrucción inicial y periódica, acorde a lo establecido en el PNSAC, según su categoría, el cual deberá presentar a esta Dirección.*' },
    { id: 'req16', text: 'j) Depositar copia de los contratos de arrendamiento u otra documentación, que demuestre que la empresa dispone de instalaciones para dirigir sus operaciones, en las diferentes terminales aeroportuarias solicitadas.*' },
    { id: 'req17', text: 'Pago de acreditación o renovación de certificado de proveedor de servicios privados' },
];

const personalRequirements = [
    { id: 'preq1', text: 'a) Formulario de solicitud debidamente completado y firmado.*' },
    { id: 'preq2', text: 'b) Copia de la Cédula de Identidad y Electoral, o pasaporte si es extranjero.*' },
    { id: 'preq3', text: 'c) Certificado de No Antecedentes Penales, con una vigencia no mayor a 30 días.*' },
    { id: 'preq4', text: 'd) Carta de la empresa solicitante, indicando el puesto para el cual se solicita la certificación.*' },
    { id: 'preq5', text: 'e) Certificado de aprobación del curso AVSEC inicial o de actualización correspondiente.*' },
    { id: 'preq6', text: 'f) Resultados de los exámenes médicos (vista, oído, análisis generales) no mayor a 60 días.*' },
    { id: 'preq7', text: 'g) Comprobante de resultado negativo de la prueba de dopaje realizada en el CESAC.*' },
    { id: 'preq8', text: 'h) Dos (2) fotos 2x2 con fondo blanco, sin accesorios.' },
    { id: 'preq9', text: 'i) Pago de la tasa correspondiente por derecho a examen y certificación.*' },
];

const tramitesData = [
    { id: '1', proceso: 'Acreditación y Renovación de Certificado', producto: 'PROVEEDORES DE SERVICIOS PRIVADOS DE SEGURIDAD CON EJEMPLARES CANINOS DE DETECCIÓN DE EXPLOSIVOS', tipo: 'Empresa' as const },
    { id: '2', proceso: 'Acreditación y Renovación de Certificado', producto: 'PROVEEDORES DE SERVICIOS PRIVADOS DE SEGURIDAD DE LA AVIACIÓN CIVIL', tipo: 'Empresa' as const },
    { id: '3', proceso: 'Certificación y Recertificación del Personal AVSEC de Empresas Privadas', producto: 'Manejador Canino (K-9) en Detección de Explosivos', tipo: 'Personal' as const },
    { id: '4', proceso: 'Certificación y Recertificación del Personal AVSEC de Empresas Privadas', producto: 'Inspector de Seguridad Privada de la Aviación Civil', tipo: 'Personal' as const },
    { id: '5', proceso: 'Certificación y Recertificación del Personal AVSEC de Empresas Privadas', producto: 'Gerente AVSEC', tipo: 'Personal' as const },
    { id: '6', proceso: 'Certificación y Recertificación del Personal AVSEC de Empresas Privadas', producto: 'Supervisor AVSEC', tipo: 'Personal' as const },
    { id: '7', proceso: 'Certificación y Recertificación del Personal AVSEC de Empresas Privadas', producto: 'Instructor AVSEC', tipo: 'Personal' as const },
    { id: '8', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'Gerente AVSEC', tipo: 'Personal' as const },
    { id: '9', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'SUPERVISOR AVSEC', tipo: 'Personal' as const },
    { id: '10', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'Inspector Nacional AVSEC', tipo: 'Personal' as const },
    { id: '11', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'Instructor AVSEC', tipo: 'Personal' as const },
    { id: '12', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'Manejador Canino (K-9)', tipo: 'Personal' as const },
    { id: '13', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'Supervisor AVSEC', tipo: 'Personal' as const },
    { id: '14', proceso: 'Certificación y Recertificación del Personal AVSEC del CESAC', producto: 'Inspector AVSEC de Primera Categoría', tipo: 'Personal' as const },
    { id: '15', proceso: 'Demostración de tramite', producto: 'Demostración 1', tipo: 'Empresa' as const },
    { id: '16', proceso: 'Revisión y Aprobación de Programas y Procedimientos de Seguridad', producto: 'EXPLOTADORES DE AERONAVES EXTRANJEROS', tipo: 'Empresa' as const },
    { id: '17', proceso: 'Revisión y Aprobación de Programas y Procedimientos de Seguridad', producto: 'PROVEEDORES DE SERVICIOS EN AEROPUERTOS', tipo: 'Empresa' as const },
    { id: '18', proceso: 'Revisión y Aprobación de Programas y Procedimientos de Seguridad', producto: 'PROVEEDORES DE SERVICIOS DE CARGA AÉREA', tipo: 'Empresa' as const },
    { id: '19', proceso: 'Revisión y Aprobación de Programas y Procedimientos de Seguridad', producto: 'EMPRESAS MANEJADORAS DE CORREO, ENCOMIENDAS DE MENSAJERÍA Y PAQUETES', tipo: 'Empresa' as const },
    { id: '20', proceso: 'Revisión y Aprobación de Programas y Procedimientos de Seguridad', producto: 'EMPRESAS DE SUMINISTROS Y APROVISIONAMIENTO', tipo: 'Empresa' as const },
    { id: '21', proceso: 'Revisión y Aprobación de Programas y Procedimientos de Seguridad', producto: 'ARRENDATARIOS EN AEROPUERTOS', tipo: 'Empresa' as const },
];

const categoriasEmpresa = [
    "EMPRESAS DE APROVISIONAMIENTO Y SUMINISTRO",
    "ARRENDATARIOS EN AEROPUERTO",
    "EMPRESA MANEJADORAS DE CORREO",
    "PROVEEDORES DE SERVICIOS DE CARGA AÉREA",
    "PROVEEDORES DE SERVICIOS EN AEROPUERTO",
    "PROVEEDORES DE SERVICIOS PRIVADOS DE SEGURIDAD",
    "PROGRAMA DE SEGURIDAD DE EXPLOTADORES DE AERONAVES",
    "PROGRAMA DE SEGURIDAD DE CONSIGNATARIOS DE AERONAVES",
];

const equiposSeguridad = [
    "CAMARAS",
    "ESCANER",
    "MAQUINA DE RAYOS X",
    "DETECTOR METAL PORTATIL",
    "ARCO DETECTOR METAL",
    "MMTD",
];

const serviciosSeguridad = [
    "Seguridad de la carga",
    "Escolta de los pasajeros",
    "Control de seguridad en la zona de presentación",
    "Seguridad de la aeronave",
    "Control de seguridad de equipaje de bodega",
    "Inspección de la carga en sus instalaciones",
    "Inspección de suministros en sus instalaciones",
];

const uniqueProcesos = [...new Set(tramitesData.map((t) => t.proceso))];

const PersonalForm = ({ value, onChange }: { value: any, onChange: (value: any) => void }) => {
    
    const handleCheckboxChange = (group: string, item: string, checked: boolean) => {
        const currentSet = new Set(value[group]);
        if (checked) {
            currentSet.add(item);
        } else {
            currentSet.delete(item);
        }
        onChange({ ...value, [group]: currentSet });
    };

    const handlePoseeProgramaChange = (poseePrograma: string) => {
        onChange({ ...value, poseePrograma });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, programaFile: e.target.files?.[0] || null });
    };

    return (
    <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
        <CardHeader>
            <CardTitle>Detalles del Trámite de Personal</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-sky-600 dark:text-sky-400 mb-4 flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        <span>AEROPUERTOS</span>
                    </h3>
                    <div className="space-y-2">
                        {airports.map(airport => (
                            <div key={airport.id} className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-sky-100/50 dark:hover:bg-sky-900/20">
                                <Checkbox 
                                    id={`personal-${airport.id}`} 
                                    checked={value.aeropuertos.has(airport.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange('aeropuertos', airport.id, Boolean(checked))}
                                />
                                <Label htmlFor={`personal-${airport.id}`} className="flex items-baseline gap-2 cursor-pointer">
                                  <span className="font-semibold text-foreground">{airport.id}</span>
                                  <span className="text-xs text-muted-foreground font-normal">{airport.name}</span>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-bold text-violet-600 dark:text-violet-400 mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span>CATEGORIA DE PERSONAL</span>
                    </h3>
                    <div className="space-y-3">
                        {personalCategories.map(cat => (
                            <div key={cat} className="flex items-center">
                                <Checkbox 
                                    id={cat} 
                                    checked={value.personalCategorias.has(cat)}
                                    onCheckedChange={(checked) => handleCheckboxChange('personalCategorias', cat, Boolean(checked))}
                                />
                                <Label htmlFor={cat} className="ml-2 font-normal text-gray-600">{cat}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        <span>CATEGORIA DE CIA CON PERSONAL CERTIFICADO</span>
                    </h3>
                    <div className="space-y-3">
                        {ciaCategories.map(cat => (
                            <div key={cat} className="flex items-center">
                                <Checkbox 
                                    id={`cia-${cat}`} 
                                    checked={value.ciaCategorias.has(cat)}
                                    onCheckedChange={(checked) => handleCheckboxChange('ciaCategorias', cat, Boolean(checked))}
                                />
                                <Label htmlFor={`cia-${cat}`} className="ml-2 font-normal text-gray-600">{cat}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        <span>POSEE PROGRAMA DE INSTRUCCION</span>
                    </h3>
                    <RadioGroup onValueChange={handlePoseeProgramaChange} value={value.poseePrograma} className="space-y-3">
                        <div className="flex items-center">
                            <RadioGroupItem value="si" id="si" />
                            <Label htmlFor="si" className="ml-2 font-normal text-gray-600">SI</Label>
                        </div>
                        <div className="flex items-center">
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no" className="ml-2 font-normal text-gray-600">NO</Label>
                        </div>
                    </RadioGroup>
                    {value.poseePrograma === 'si' && (
                        <div className="mt-4 space-y-2 animate-in fade-in-50 duration-500">
                            <Label htmlFor="programa-file" className="text-sm font-medium text-gray-700">Cargar Programa</Label>
                            <Input id="programa-file" type="file" onChange={handleFileChange}/>
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
    );
};

const EmpresaDetailsForm = ({ value, onChange }: { value: any, onChange: (value: any) => void }) => {
    
    const handleCheckboxChange = (group: string, item: string, checked: boolean) => {
        const currentSet = new Set(value[group]);
        if(checked) {
            currentSet.add(item);
        } else {
            currentSet.delete(item);
        }
        onChange({ ...value, [group]: currentSet });
    };

    return (
        <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
            <CardHeader>
                <CardTitle>Detalles Adicionales del Trámite de Empresa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Equipos de Seguridad */}
                    <div>
                        <h3 className="font-bold text-sky-600 dark:text-sky-400 mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            <span>EQUIPOS DE SEGURIDAD</span>
                        </h3>
                        <div className="space-y-3">
                            {equiposSeguridad.map(equipo => (
                                <div key={equipo} className="flex items-center">
                                    <Checkbox 
                                        id={`equipo-${equipo.replace(/\s+/g, '-')}`} 
                                        checked={value.equipos.has(equipo)}
                                        onCheckedChange={(checked) => handleCheckboxChange('equipos', equipo, Boolean(checked))}
                                    />
                                    <Label htmlFor={`equipo-${equipo.replace(/\s+/g, '-')}`} className="ml-2 font-normal text-gray-600">{equipo}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aeropuertos */}
                    <div>
                        <h3 className="font-bold text-violet-600 dark:text-violet-400 mb-4 flex items-center gap-2">
                            <Plane className="h-5 w-5" />
                            <span>AEROPUERTOS</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {airports.map(airport => (
                                <div key={`details-${airport.id}`} className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-sky-100/50 dark:hover:bg-sky-900/20">
                                    <Checkbox 
                                        id={`empresa-details-${airport.id}`} 
                                        checked={value.aeropuertos.has(airport.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange('aeropuertos', airport.id, Boolean(checked))}
                                    />
                                    <Label htmlFor={`empresa-details-${airport.id}`} className="font-semibold text-foreground cursor-pointer">{airport.id}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Servicios de Seguridad */}
                    <div>
                        <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            <span>SERVICIOS DE SEGURIDAD</span>
                        </h3>
                        <div className="space-y-3">
                            {serviciosSeguridad.map(servicio => (
                                <div key={servicio} className="flex items-center">
                                    <Checkbox 
                                        id={`servicio-${servicio.replace(/\s+/g, '-')}`} 
                                        checked={value.servicios.has(servicio)}
                                        onCheckedChange={(checked) => handleCheckboxChange('servicios', servicio, Boolean(checked))}
                                    />
                                    <Label htmlFor={`servicio-${servicio.replace(/\s+/g, '-')}`} className="ml-2 font-normal text-gray-600">{servicio}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Requeridos */}
                    <div>
                        <h3 className="font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                            <Paperclip className="h-5 w-5" />
                            <span>REQUERIDOS</span>
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <Checkbox 
                                    id="cert-req" 
                                    checked={value.certificacionRequired} 
                                    onCheckedChange={(checked) => onChange({ ...value, certificacionRequired: Boolean(checked) })} 
                                />
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="cert-req" className="cursor-pointer">Datos de la Solicitud Certificación No.*</Label>
                                    {value.certificacionRequired && 
                                        <Input 
                                            placeholder="No. Certificación" 
                                            className="mt-2 animate-in fade-in-50" 
                                            value={value.certificacionNumero}
                                            onChange={(e) => onChange({ ...value, certificacionNumero: e.target.value })}
                                        />}
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Checkbox 
                                    id="mod-req" 
                                    checked={value.modificacionRequired} 
                                    onCheckedChange={(checked) => onChange({ ...value, modificacionRequired: Boolean(checked) })}
                                />
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="mod-req" className="cursor-pointer">Describa las partes del Programa de Seguridad que se desea modificar*</Label>
                                    {value.modificacionRequired && 
                                        <Textarea 
                                            placeholder="Descripción..." 
                                            className="mt-2 animate-in fade-in-50" 
                                            rows={4} 
                                            value={value.modificacionDesc}
                                            onChange={(e) => onChange({ ...value, modificacionDesc: e.target.value })}
                                        />}
                                </div>
                            </div>
                        </div>
                        <Plane className="h-20 w-20 mx-auto mt-8 text-muted-foreground/20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const RequirementRow = ({
    req,
    file,
    isConfirmed,
    isUploaded,
    onFileSelect,
    onConfirmChange,
    onUpload,
    onClear,
}: {
    req: { id: string; text: string };
    file: File | null;
    isConfirmed: boolean;
    isUploaded: boolean;
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmChange: (checked: boolean) => void;
    onUpload: () => void;
    onClear: () => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        if (!isUploaded) {
            fileInputRef.current?.click();
        }
    };

    const handleClearClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClear();
    };

    return (
        <TableRow className={cn(isUploaded && "bg-green-100 dark:bg-green-900/30 text-muted-foreground transition-colors duration-500")}>
            <TableCell className="text-sm">{req.text}</TableCell>
            <TableCell>
                <Input
                    placeholder="Ningún archivo seleccionado"
                    readOnly
                    value={file?.name || ''}
                    className={cn("cursor-pointer w-[350px]", isUploaded && "cursor-not-allowed")}
                    onClick={handleUploadClick}
                    disabled={isUploaded}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileSelect}
                    className="hidden"
                    disabled={isUploaded}
                />
            </TableCell>
            <TableCell className="flex items-center justify-center gap-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent/50">
                    <Checkbox
                        id={`req-checkbox-${req.id}`}
                        checked={isConfirmed}
                        onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
                        disabled={!file || isUploaded}
                    />
                </div>
                <Button size="icon" variant="outline" className="text-blue-600 hover:bg-blue-100 hover:text-blue-700" onClick={handleUploadClick} disabled={isUploaded}>
                    <Upload className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="destructive" onClick={handleClearClick} disabled={isUploaded}>
                    <XCircle className="h-5 w-5" />
                </Button>
                {isConfirmed && !isUploaded && (
                    <Button onClick={onUpload} className="ml-2 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <Upload className="mr-2 h-4 w-4"/>
                        Cargar
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
};


const EmpresaForm = ({ rowStates, setRowStates, onDepositarClick }: { rowStates: any, setRowStates: any, onDepositarClick: () => void }) => {
    
    const handleFileSelect = (reqId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { ...prev[reqId], file, isConfirmed: false, isUploaded: prev[reqId].isUploaded }
        }));
    };

    const handleConfirmChange = (reqId: string, checked: boolean) => {
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { ...prev[reqId], isConfirmed: checked }
        }));
    };

    const handleUpload = (reqId: string) => {
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { ...prev[reqId], isUploaded: true }
        }));
    };

    const handleClear = (reqId: string) => {
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { file: null, isConfirmed: false, isUploaded: false }
        }));
    };

    const uploadedCount = Object.values(rowStates).filter((s: any) => s.isUploaded).length;

    return (
        <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <CardTitle>Requisitos a consignar</CardTitle>
                        <p className="text-sm text-red-600 font-medium mt-1">Todos los documentos marcados con * son obligatorios</p>
                    </div>
                    {uploadedCount > 0 && (
                        <Button onClick={onDepositarClick} className="bg-blue-600 hover:bg-blue-700 animate-in fade-in-50">
                            Depositar Documentos ({uploadedCount})
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Requisito</TableHead>
                                <TableHead>Nombre del Documento</TableHead>
                                <TableHead className="min-w-[250px] text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {empresaRequirements.map(req => (
                               <RequirementRow 
                                   key={req.id} 
                                   req={req}
                                   file={rowStates[req.id]?.file}
                                   isConfirmed={rowStates[req.id]?.isConfirmed}
                                   isUploaded={rowStates[req.id]?.isUploaded}
                                   onFileSelect={(e) => handleFileSelect(req.id, e)}
                                   onConfirmChange={(c) => handleConfirmChange(req.id, c)}
                                   onUpload={() => handleUpload(req.id)}
                                   onClear={() => handleClear(req.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

const PersonalRequirements = ({ rowStates, setRowStates, onDepositarClick }: { rowStates: any, setRowStates: any, onDepositarClick: () => void }) => {

    const handleFileSelect = (reqId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { ...prev[reqId], file, isConfirmed: false, isUploaded: prev[reqId].isUploaded }
        }));
    };

    const handleConfirmChange = (reqId: string, checked: boolean) => {
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { ...prev[reqId], isConfirmed: checked }
        }));
    };

    const handleUpload = (reqId: string) => {
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { ...prev[reqId], isUploaded: true }
        }));
    };

    const handleClear = (reqId: string) => {
        setRowStates((prev: any) => ({
            ...prev,
            [reqId]: { file: null, isConfirmed: false, isUploaded: false }
        }));
    };
    
    const uploadedCount = Object.values(rowStates).filter((s: any) => s.isUploaded).length;

    return (
        <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                     <div>
                        <CardTitle>Requisitos Documentales del Personal</CardTitle>
                        <p className="text-sm text-red-600 font-medium mt-1">Todos los documentos marcados con * son obligatorios</p>
                    </div>
                    {uploadedCount > 0 && (
                        <Button onClick={onDepositarClick} className="bg-blue-600 hover:bg-blue-700 animate-in fade-in-50">
                            Depositar Documentos ({uploadedCount})
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Requisito</TableHead>
                                <TableHead>Nombre del Documento</TableHead>
                                <TableHead className="min-w-[250px] text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {personalRequirements.map(req => (
                                <RequirementRow 
                                   key={req.id} 
                                   req={req}
                                   file={rowStates[req.id]?.file}
                                   isConfirmed={rowStates[req.id]?.isConfirmed}
                                   isUploaded={rowStates[req.id]?.isUploaded}
                                   onFileSelect={(e) => handleFileSelect(req.id, e)}
                                   onConfirmChange={(c) => handleConfirmChange(req.id, c)}
                                   onUpload={() => handleUpload(req.id)}
                                   onClear={() => handleClear(req.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

const SubmissionSummaryDialog = ({ isOpen, onClose, summaryData, onConfirm }: { isOpen: boolean, onClose: () => void, summaryData: any, onConfirm: () => void }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setIsConfirmed(false);
        }
    }, [isOpen]);

    if (!summaryData) return null;

    const {
        tramite,
        producto,
        tipo,
        categoria,
        details,
        uploadedCount,
    } = summaryData;

    const renderDetailSection = (title: string, items: string[] | Set<string>, emptyText = 'Ninguno seleccionado') => (
        items && items.size > 0 && (
            <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {Array.from(items).map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
                </div>
            </div>
        )
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Resumen de la Solicitud</DialogTitle>
                    <DialogDescription>
                        Usted está solicitando el trámite de: <span className="font-semibold text-foreground">{tramite}</span>. 
                        Por favor, revise y confirme los detalles a continuación.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1 pr-4 space-y-4">
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="font-bold text-primary">Detalles Generales</h3>
                        <p><span className="font-semibold">Producto:</span> {producto}</p>
                        <div className="flex items-center gap-2"><span className="font-semibold">Tipo:</span> <Badge variant="outline">{tipo}</Badge></div>
                        {categoria && <p><span className="font-semibold">Categoría:</span> {categoria}</p>}
                    </div>
                    
                    {tipo === 'Empresa' && details && (
                         <div className="space-y-4 rounded-lg border p-4">
                            <h3 className="font-bold text-primary">Detalles Adicionales</h3>
                            {renderDetailSection("Equipos de Seguridad", details.equipos)}
                            {renderDetailSection("Aeropuertos", details.aeropuertos)}
                            {renderDetailSection("Servicios de Seguridad", details.servicios)}
                            {details.certificacionNumero && <p><span className="font-semibold">No. Certificación:</span> {details.certificacionNumero}</p>}
                            {details.modificacionDesc && <p><span className="font-semibold">Modificación:</span> {details.modificacionDesc}</p>}
                        </div>
                    )}
                     {tipo === 'Personal' && details && (
                         <div className="space-y-4 rounded-lg border p-4">
                            <h3 className="font-bold text-primary">Detalles Adicionales</h3>
                            {renderDetailSection("Aeropuertos", details.aeropuertos)}
                            {renderDetailSection("Categorías de Personal", details.personalCategorias)}
                            {renderDetailSection("Categorías de CIA", details.ciaCategorias)}
                            {details.poseePrograma && <p><span className="font-semibold">Posee programa de instrucción:</span> {details.poseePrograma.toUpperCase()}</p>}
                        </div>
                    )}

                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="font-bold text-primary">Documentos</h3>
                        <div className="flex items-center gap-2"><span className="font-semibold">Total de documentos a depositar:</span> <Badge>{uploadedCount}</Badge></div>
                    </div>
                </div>
                <Separator />
                <DialogFooter className="flex-col items-start gap-4 !justify-start sm:!justify-start">
                    <div className="flex items-start space-x-3">
                        <Checkbox id="confirm-submission" checked={isConfirmed} onCheckedChange={(checked) => setIsConfirmed(Boolean(checked))} />
                        <label htmlFor="confirm-submission" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Confirmo que he leído cuidadosamente toda la información que estoy enviando y es 100% legal y legítima.
                        </label>
                    </div>
                    {isConfirmed && (
                        <Button onClick={onConfirm} className="w-full sm:w-auto animate-in fade-in-50">
                            <Save className="mr-2 h-4 w-4" />
                            Enviar Solicitud
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ProcessingDialog = ({ onComplete }: { onComplete: () => void }) => (
    <AlertDialog open={true}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-2xl font-bold text-primary">Procesando Solicitud</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div className="flex flex-col items-center gap-6 py-6 text-center text-base text-muted-foreground">
                        <FlightProgress duration={10000} onComplete={onComplete} />
                        <p>
                            Su solicitud está siendo procesada y registrada en nuestro sistema. Por favor, espere un momento.
                        </p>
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>
);

const CesacLetterLogo = () => (
    <div className="flex flex-col items-center text-center">
        <Image src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" width={100} height={100} data-ai-hint="logo" />
    </div>
);

const ConfirmationLetterDialog = ({ isOpen, onClose, summaryData }: { isOpen: boolean, onClose: () => void, summaryData: any }) => {
    const letterRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const handleDownload = async () => {
        const element = letterRef.current;
        if (!element) return;
        toast({ title: "Generando PDF...", description: "Por favor espere." });

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        let finalWidth = pdfWidth - 20; // with margin
        let finalHeight = finalWidth / ratio;

        const x = 10;
        const y = 10;
        
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save(`confirmacion-solicitud-${summaryData.tramiteId || '11857'}.pdf`);
    };

    const registroId = `DAC-03-${Math.floor(10000 + Math.random() * 90000)}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl font-times">
                <DialogHeader>
                    <DialogTitle>Confirmación de Solicitud</DialogTitle>
                     <DialogDescription>
                        Su solicitud ha sido recibida. Puede descargar una copia de esta confirmación.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 bg-gray-100">
                    <div ref={letterRef} className="p-8 bg-white text-black">
                        <header className="flex flex-col items-center text-center mb-8 space-y-2">
                            <CesacLetterLogo />
                            <h2 className="font-bold text-lg">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL (CESAC)</h2>
                            <h3 className="font-bold">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN</h3>
                        </header>
                         <div className="flex justify-between items-start mb-8 text-sm">
                            <p className="font-bold underline">{registroId}</p>
                            <div className="text-right">
                                <p>Santo Domingo Este, R.D.</p>
                                <p>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="mb-8 text-sm">
                            <p className="font-bold">SEÑORES</p>
                            <p className="font-bold">{summaryData?.identifiedCompany?.nombre || 'TRACKAVIATION SECURITY S.R.L.'}</p>
                            <p>Sus Manos.-</p>
                        </div>

                        <div className="space-y-4 text-justify text-sm leading-relaxed">
                            <p>
                                Después de un cordial saludo, le informamos que su solicitud de <span className="font-bold">{summaryData?.producto || 'Certificación'}</span>,
                                a nombre de <span className="font-bold">{summaryData?.identifiedPerson?.nombre || 'nuestro personal'}</span> con
                                fecha <span className="font-bold">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>,
                                fue atendida bajo el número de registro <span className="font-bold">{registroId.split('-')[2]}</span>, con el cual podrá darle
                                seguimiento a través de nuestra página web servicios.cesac.mil.do/aomVentanilla/TrackTramites.jsf,
                                mediante la clave <span className="font-bold">{`${Math.floor(10000 + Math.random() * 90000)}-${registroId.split('-')[2]}`}</span>.
                            </p>
                        </div>
                        
                         <div className="mt-12 text-sm">
                            <p>Atentamente,</p>
                        </div>

                        <div className="mt-20 text-center text-sm font-bold">
                            <p>Dirección de Acreditación y Certificación del CESAC</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                    <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Descargar PDF</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

type Personal = {
    id: string;
    foto: string;
    aiHint: string;
    nombre: string;
    cedula: string;
    habilitacion: string;
    estado: string;
    posicion: string;
    aeropuerto: string;
    tipoSangre: string;
    condicionFisica: string;
    medicamentoControlado: string;
    edad: number;
    estatura: string;
    contactoEmergencia: string;
    fechaNacimiento: string;
    nacionalidad: string;
};

type Company = {
    id: string;
    rnc: string;
    nombre: string;
};

const personalData: Personal[] = [
  { id: '12345', foto: 'https://placehold.co/100x100.png', aiHint: 'man portrait', nombre: 'Kendy A. Qualey', cedula: '001-1234567-8', habilitacion: 'INSPECTOR AVSEC 1RA CAT', estado: 'Activo', posicion: 'Inspector AVSEC 1ra Categoría', aeropuerto: 'Las Américas (SDQ)', tipoSangre: 'O+', condicionFisica: 'Ninguna reportada', medicamentoControlado: 'No', edad: 35, estatura: "5'11\"", contactoEmergencia: '(809) 123-4567 (Esposa)', fechaNacimiento: '1989-05-15', nacionalidad: 'Dominicana' },
];
const companyData: Company[] = [
    { id: '1', rnc: '130123456', nombre: 'TrackAviation Security S.R.L' },
    { id: '2', rnc: '130654321', nombre: 'SWISSPORT' },
];

const getPersonalByCedula = (cedula: string): Personal | undefined => {
    return personalData.find(p => p.cedula.replace(/-/g, '') === cedula.replace(/-/g, ''));
}
const getCompanyByRnc = (rnc: string): Company | undefined => {
    return companyData.find(c => c.rnc.replace(/-/g, '') === rnc.replace(/-/g, ''));
}

const IdentificarPersonalModal = ({ isOpen, onOpenChange, onApply }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onApply: (person: Personal) => void; }) => {
    const router = useRouter();
    const [cedula, setCedula] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedUser, setVerifiedUser] = useState<Personal | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, "");
        let formattedValue = numericValue;
    
        if (numericValue.length > 3) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 10)}`;
        }
        if (numericValue.length > 10) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 10)}-${numericValue.slice(10, 11)}`;
        }
        
        setCedula(formattedValue.slice(0, 13));
    };

    const isCedulaComplete = cedula.replace(/[^0-9]/g, "").length === 11;

    const handleVerify = async () => {
        if (!isCedulaComplete) return;
        setIsVerifying(true);
        setError(null);
        setVerifiedUser(null);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const person = getPersonalByCedula(cedula);
        if (person) {
            setVerifiedUser(person);
        } else {
            setError("No se encontró ningún personal con esa cédula.");
        }
        setIsVerifying(false);
    };

    const handleApply = () => {
        if (verifiedUser) {
            onApply(verifiedUser);
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setCedula("");
                setIsVerifying(false);
                setVerifiedUser(null);
                setError(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden shadow-2xl border-none bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800">
            <div className="p-8 space-y-6">
              <DialogHeader className="text-center space-y-4">
                <UserSearch className="mx-auto h-12 w-12 text-primary" />
                <DialogTitle className="text-2xl font-bold">Identificar Personal</DialogTitle>
                <DialogDescription>
                  Ingrese el número de cédula del personal para iniciar el trámite.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cedula">Número de Cédula</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cedula"
                      placeholder="000-0000000-0"
                      value={cedula}
                      onChange={handleCedulaChange}
                      disabled={isVerifying || !!verifiedUser}
                      maxLength={13}
                    />
                    <Button onClick={handleVerify} disabled={!isCedulaComplete || isVerifying || !!verifiedUser} className="w-32">
                      {isVerifying ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Verificar"
                      )}
                    </Button>
                  </div>
                </div>

                {error && !verifiedUser && (
                    <div className="flex items-center gap-2 text-sm text-destructive animate-in fade-in-50">
                        <XCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                )}

                {verifiedUser && (
                    <div className="border bg-background/50 p-4 rounded-lg flex items-center gap-4 animate-in fade-in-50 zoom-in-95">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={verifiedUser.foto} data-ai-hint={verifiedUser.aiHint} />
                            <AvatarFallback>{verifiedUser.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">Personal Verificado</p>
                            <p className="text-lg font-semibold text-foreground">{verifiedUser.nombre}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500 ml-auto" />
                    </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="p-6 bg-muted/30 dark:bg-muted/20 flex justify-end">
                {error && !verifiedUser ? (
                    <Button 
                        asChild 
                        className="w-full bg-orange-500 hover:bg-orange-600 font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform"
                        onClick={() => onOpenChange(false)}
                    >
                        <Link href="/cliente/mi-personal/registro">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar Personal
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={handleApply}
                        disabled={!verifiedUser}
                        className="w-full bg-green-600 hover:bg-green-700 font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform"
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Aplicar y Continuar
                    </Button>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
};

const IdentificarEmpresaModal = ({ isOpen, onOpenChange, onApply }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onApply: (company: Company) => void; }) => {
    const [rnc, setRnc] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedCompany, setVerifiedCompany] = useState<Company | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRncChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setRnc(value.slice(0, 9));
    };

    const isRncComplete = rnc.length === 9;

    const handleVerify = async () => {
        if (!isRncComplete) return;
        setIsVerifying(true);
        setError(null);
        setVerifiedCompany(null);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const company = getCompanyByRnc(rnc);
        if (company) {
            setVerifiedCompany(company);
        } else {
            setError("No se encontró ninguna empresa con ese RNC.");
        }
        setIsVerifying(false);
    };

    const handleApply = () => {
        if (verifiedCompany) {
            onApply(verifiedCompany);
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setRnc("");
                setIsVerifying(false);
                setVerifiedCompany(null);
                setError(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden shadow-2xl border-none bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800">
            <div className="p-8 space-y-6">
              <DialogHeader className="text-center space-y-4">
                <Building2 className="mx-auto h-12 w-12 text-primary" />
                <DialogTitle className="text-2xl font-bold">Identificar Empresa</DialogTitle>
                <DialogDescription>
                  Ingrese el número de RNC de la empresa para iniciar el trámite.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rnc">Número de RNC</Label>
                  <div className="flex gap-2">
                    <Input
                      id="rnc"
                      placeholder="000000000"
                      value={rnc}
                      onChange={handleRncChange}
                      disabled={isVerifying || !!verifiedCompany}
                      maxLength={9}
                    />
                    <Button onClick={handleVerify} disabled={!isRncComplete || isVerifying || !!verifiedCompany} className="w-32">
                      {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verificar"}
                    </Button>
                  </div>
                </div>

                {error && !verifiedCompany && (
                    <div className="flex items-center gap-2 text-sm text-destructive animate-in fade-in-50">
                        <XCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                )}

                {verifiedCompany && (
                    <div className="border bg-background/50 p-4 rounded-lg flex items-center gap-4 animate-in fade-in-50 zoom-in-95">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback>{verifiedCompany.nombre.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">Empresa Verificada</p>
                            <p className="text-lg font-semibold text-foreground">{verifiedCompany.nombre}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500 ml-auto" />
                    </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="p-6 bg-muted/30 dark:bg-muted/20 flex justify-end">
                <Button
                    onClick={handleApply}
                    disabled={!verifiedCompany}
                    className="w-full bg-green-600 hover:bg-green-700 font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform"
                >
                    <Check className="mr-2 h-4 w-4" />
                    Aplicar y Continuar
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
};


const InfoDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    </div>
);


export default function ClientSolicitudesPage() {
  const router = useRouter();
  const [selectedProceso, setSelectedProceso] = useState<string | undefined>();
  const [selectedProductoId, setSelectedProductoId] = useState<string | undefined>();
  const [selectedCategoria, setSelectedCategoria] = useState<string | undefined>();
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
  const [identifiedPerson, setIdentifiedPerson] = useState<Personal | null>(null);
  const [identifiedCompany, setIdentifiedCompany] = useState<Company | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  // State lifted from child components
  const [empresaRowStates, setEmpresaRowStates] = React.useState<Record<string, { file: File | null; isConfirmed: boolean; isUploaded: boolean }>>(() =>
    empresaRequirements.reduce((acc, req) => ({ ...acc, [req.id]: { file: null, isConfirmed: false, isUploaded: false } }), {})
  );

  const [personalRowStates, setPersonalRowStates] = React.useState<Record<string, { file: File | null; isConfirmed: boolean; isUploaded: boolean }>>(() =>
    personalRequirements.reduce((acc, req) => ({ ...acc, [req.id]: { file: null, isConfirmed: false, isUploaded: false } }), {})
  );

  const [empresaDetails, setEmpresaDetails] = React.useState({
    equipos: new Set<string>(),
    aeropuertos: new Set<string>(),
    servicios: new Set<string>(),
    certificacionNumero: '',
    modificacionDesc: '',
    certificacionRequired: false,
    modificacionRequired: false,
  });

  const [personalDetails, setPersonalDetails] = React.useState({
    aeropuertos: new Set<string>(),
    personalCategorias: new Set<string>(),
    ciaCategorias: new Set<string>(),
    poseePrograma: undefined as string | undefined,
    programaFile: null as File | null,
  });

  // State for summary modal
  const [summaryData, setSummaryData] = React.useState<any>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = React.useState(false);

  const availableProductos = selectedProceso
    ? tramitesData.filter((t) => t.proceso === selectedProceso)
    : [];

  const selectedTramite = tramitesData.find(t => t.id === selectedProductoId);

  useEffect(() => {
    if (selectedTramite?.tipo === 'Personal' && !identifiedPerson) {
        setIsPersonaModalOpen(true);
    }
    if (selectedTramite?.tipo === 'Empresa' && !identifiedCompany) {
        setIsEmpresaModalOpen(true);
    }
  }, [selectedTramite, identifiedPerson, identifiedCompany]);

  const handleProcesoChange = (value: string) => {
    setSelectedProceso(value);
    setSelectedProductoId(undefined); 
    setSelectedCategoria(undefined);
    setIdentifiedPerson(null);
    setIdentifiedCompany(null);
  };
  
  const handleOpenSummary = () => {
    const data = {
        tramite: selectedTramite?.proceso,
        producto: selectedTramite?.producto,
        tipo: selectedTramite?.tipo,
        categoria: selectedTramite?.tipo === 'Empresa' ? selectedCategoria : undefined,
        identifiedPerson: identifiedPerson,
        identifiedCompany: identifiedCompany,
        details: selectedTramite?.tipo === 'Empresa' ? {
            ...empresaDetails,
            equipos: Array.from(empresaDetails.equipos),
            aeropuertos: Array.from(empresaDetails.aeropuertos),
            servicios: Array.from(empresaDetails.servicios),
        } : {
            ...personalDetails,
            aeropuertos: Array.from(personalDetails.aeropuertos),
            personalCategorias: Array.from(personalDetails.personalCategorias),
            ciaCategorias: Array.from(personalDetails.ciaCategorias),
        },
        uploadedCount: selectedTramite?.tipo === 'Empresa' 
            ? Object.values(empresaRowStates).filter((s: any) => s.isUploaded).length
            : Object.values(personalRowStates).filter((s: any) => s.isUploaded).length,
    };
    setSummaryData(data);
    setIsSummaryModalOpen(true);
  };
  
  const handleConfirmSubmission = () => {
    setIsSummaryModalOpen(false);
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setIsConfirmationVisible(true);
  };

  const isFormStarted = !!selectedProceso;

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 lg:p-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Nueva Solicitud</h1>
            <p className="mt-1 text-muted-foreground">Inicie un nuevo trámite seleccionando el proceso y producto requerido.</p>
        </div>
        
        <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-400 p-6 text-white relative">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <TravelGoLogo />
                        <div>
                            <p className="text-sm font-light">Identificación: <span className="font-semibold">130677195</span></p>
                            <p className="text-lg font-bold">TrackAviation Security S.R.L</p>
                            <div className="flex items-center gap-x-6 mt-1">
                                <p className="text-sm font-light">RNC: <span className="font-semibold">130-12345-6</span></p>
                                <p className="text-sm font-light">Teléfono: <span className="font-semibold">(809) 555-1234</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Nueva Solicitud de Trámite</CardTitle>
                <CardDescription>Identifique el trámite y producto a requerir para iniciar.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-8 bg-white dark:bg-card text-gray-800 dark:text-card-foreground">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Select onValueChange={handleProcesoChange} value={selectedProceso}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione un proceso..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueProcesos.map((proceso) => (
                                            <SelectItem key={proceso} value={proceso}>
                                                {proceso}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedTramite && (
                                <div className="flex items-center gap-2 animate-in fade-in-50">
                                    <span className="text-sm font-medium text-gray-500">Tipo de Trámite:</span>
                                    <Badge
                                    className={cn(
                                        "text-sm font-bold transition-all",
                                        selectedTramite.tipo === 'Empresa'
                                        ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700'
                                        : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
                                    )}
                                    variant="outline"
                                    >
                                    {selectedTramite.tipo}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className={cn("flex items-center gap-2 transition-opacity duration-300", selectedProceso ? "opacity-100" : "opacity-50 pointer-events-none")}>
                                <Select onValueChange={(value) => { setSelectedProductoId(value); setIdentifiedPerson(null); setIdentifiedCompany(null); }} value={selectedProductoId} disabled={!selectedProceso}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione un producto..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableProductos.map((tramite) => (
                                            <SelectItem key={tramite.id} value={tramite.id}>
                                                {tramite.producto}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedTramite?.tipo === 'Empresa' && (
                                <div className="animate-in fade-in-50 duration-500">
                                    <Label htmlFor="categoria-empresa" className="text-sm font-medium text-gray-700 mb-1 block">Categoría</Label>
                                    <Select onValueChange={setSelectedCategoria} value={selectedCategoria}>
                                        <SelectTrigger id="categoria-empresa" className="w-full">
                                            <SelectValue placeholder="Seleccione una categoría..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriasEmpresa.map((categoria) => (
                                                <SelectItem key={categoria} value={categoria}>
                                                    {categoria}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        {identifiedPerson && (
             <Card className="animate-in fade-in-50 duration-500">
                <div className="grid md:grid-cols-[auto_1fr] gap-6 p-6 items-start">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                        <AvatarImage src={identifiedPerson.foto} alt={identifiedPerson.nombre} data-ai-hint={identifiedPerson.aiHint} />
                        <AvatarFallback className="text-4xl">{identifiedPerson.nombre.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <CardTitle className="text-2xl">{identifiedPerson.nombre}</CardTitle>
                                <CardDescription>{identifiedPerson.posicion}</CardDescription>
                            </div>
                            <Badge variant={identifiedPerson.estado === 'Activo' ? 'secondary' : 'destructive'} className={cn(
                                identifiedPerson.estado === 'Activo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            )}>
                                {identifiedPerson.estado}
                            </Badge>
                        </div>
                        
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList>
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="medica">Médica</TabsTrigger>
                                <TabsTrigger value="laboral">Laboral</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal" className="pt-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <InfoDetail icon={Cake} label="Fecha de Nacimiento" value={`${identifiedPerson.fechaNacimiento} (${identifiedPerson.edad} años)`} />
                                    <InfoDetail icon={Ruler} label="Estatura" value={identifiedPerson.estatura} />
                                    <InfoDetail icon={Globe2} label="Nacionalidad" value={identifiedPerson.nacionalidad} />
                                    <InfoDetail icon={PhoneCall} label="Contacto de Emergencia" value={identifiedPerson.contactoEmergencia} />
                                </div>
                            </TabsContent>
                             <TabsContent value="medica" className="pt-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <InfoDetail icon={Droplets} label="Tipo de Sangre" value={identifiedPerson.tipoSangre} />
                                    <InfoDetail icon={HeartPulse} label="Condición Física" value={identifiedPerson.condicionFisica} />
                                    <InfoDetail icon={Pill} label="Medicamento Controlado" value={identifiedPerson.medicamentoControlado} />
                                </div>
                            </TabsContent>
                             <TabsContent value="laboral" className="pt-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <InfoDetail icon={Building} label="Aeropuerto" value={identifiedPerson.aeropuerto} />
                                    <InfoDetail icon={Briefcase} label="Habilitación" value={identifiedPerson.habilitacion} />
                                    <InfoDetail icon={ShieldAlert} label="Condición Actual" value={identifiedPerson.estado} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </Card>
        )}

        {identifiedCompany && (
             <Card className="animate-in fade-in-50 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Building2 className="h-7 w-7 text-primary" />
                        {identifiedCompany.nombre}
                    </CardTitle>
                    <CardDescription>RNC: {identifiedCompany.rnc}</CardDescription>
                </CardHeader>
            </Card>
        )}

        {isFormStarted && (
            <div className="animate-in fade-in-50 duration-500 space-y-8">
                {selectedTramite?.tipo === 'Empresa' && identifiedCompany && (
                    <>
                        <EmpresaDetailsForm value={empresaDetails} onChange={setEmpresaDetails} />
                        <EmpresaForm rowStates={empresaRowStates} setRowStates={setEmpresaRowStates} onDepositarClick={handleOpenSummary} />
                    </>
                )}
                {selectedTramite?.tipo === 'Personal' && identifiedPerson && (
                    <>
                        <PersonalForm value={personalDetails} onChange={setPersonalDetails} />
                        <PersonalRequirements rowStates={personalRowStates} setRowStates={setPersonalRowStates} onDepositarClick={handleOpenSummary} />
                    </>
                )}
            </div>
        )}

        <IdentificarPersonalModal
            isOpen={isPersonaModalOpen}
            onOpenChange={(open) => {
                if (!open && !identifiedPerson) {
                    setSelectedProductoId(undefined);
                }
                setIsPersonaModalOpen(open);
            }}
            onApply={(person) => {
                setIdentifiedPerson(person);
                setIsPersonaModalOpen(false);
            }}
        />

        <IdentificarEmpresaModal
            isOpen={isEmpresaModalOpen}
            onOpenChange={(open) => {
                if (!open && !identifiedCompany) {
                    setSelectedProductoId(undefined);
                }
                setIsEmpresaModalOpen(open);
            }}
            onApply={(company) => {
                setIdentifiedCompany(company);
                setIsEmpresaModalOpen(false);
            }}
        />

        <SubmissionSummaryDialog 
            isOpen={isSummaryModalOpen} 
            onClose={() => setIsSummaryModalOpen(false)}
            summaryData={summaryData}
            onConfirm={handleConfirmSubmission}
        />
        
        {isProcessing && <ProcessingDialog onComplete={handleProcessingComplete} />}

        {isConfirmationVisible && (
            <ConfirmationLetterDialog
                isOpen={isConfirmationVisible}
                onClose={() => setIsConfirmationVisible(false)}
                summaryData={summaryData}
            />
        )}
    </div>
  );
}
