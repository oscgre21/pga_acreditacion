
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, FileCheck, Shield, UserCheck, FileSymlink, Download, Search, File as FileIcon } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";


const reportOptions = [
  {
    id: 'programacion',
    title: "Programación de evaluaciones para el personal de seguridad de la aviación civil",
    icon: Calendar,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: 'calificaciones',
    title: "Informe final de los resultados de las evaluaciones del proceso",
    icon: FileCheck,
    gradient: "from-green-500 to-emerald-400",
  },
  {
    id: 'licencia-cesac',
    title: "Liberación de licencia CESAC",
    icon: Shield,
    gradient: "from-indigo-500 to-purple-400",
  },
  {
    id: 'licencia-instructor',
    title: "Liberación de licencia CESAC para instructores",
    icon: UserCheck,
    gradient: "from-pink-500 to-rose-400",
  },
  {
    id: 'licencia-privada',
    title: "Liberación de licencia para personal de seguridad privada",
    icon: FileSymlink,
    gradient: "from-orange-500 to-amber-400",
  },
];

const ReportCard = ({ title, icon: Icon, gradient, onGenerateClick }: { title: string, icon: React.ElementType, gradient: string, onGenerateClick: () => void }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 20;
    const y = (clientY - top - height / 2) / 20;
    currentTarget.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.05, 1.05, 1.05)`;
    currentTarget.style.boxShadow = `${-x * 2}px ${-y * 2}px 30px rgba(0,0,0,0.3)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onGenerateClick}
      className={cn("relative rounded-2xl text-white overflow-hidden p-6 flex flex-col justify-between items-start bg-gradient-to-br transition-all duration-300 ease-out cursor-pointer", gradient)}
      style={{
        transformStyle: "preserve-3d",
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
        <div className="absolute inset-0 bg-black/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
            <div className="mb-8 p-3 bg-white/20 rounded-full w-fit">
                <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold leading-tight">{title}</h3>
        </div>
        <div className="relative z-10 mt-6 self-end text-black font-bold flex items-center">
            Generar <ArrowRight className="ml-2 h-4 w-4" />
        </div>
    </motion.div>
  );
};

const CalificacionesReportView = ({ onBack, userName }: { onBack: () => void; userName: string; }) => {
    const reportRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    
    const reportData = [
        { no: 1, nombres: 'Clara E. Santos Ramirez', cedula: '40233346663', asigServ: 'MDSD', compania: 'LAS AMÉRICAS CARGO, S.R.L.', exTcoR: '82', exPcaR: '88', proceso: 'Certificación del personal de seguridad privada de la aviación civil', evMed: 'Apto', verfAntec: 'Apto', pDop: 'Apto', evSic: 'Apto', fechaCert: '11-07-2025', fechaVenc: '11-07-2027', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL', condicion: 'Aprobó' },
        { no: 2, nombres: 'Yessica Vargas Santos', cedula: '42028255630', asigServ: 'MDSD', compania: 'LAS AMÉRICAS CARGO, S.R.L.', exTcoR: '78', exPcaR: '94', proceso: 'Certificación del personal de seguridad privada de la aviación civil', evMed: 'Apto', verfAntec: 'Apto', pDop: 'Apto', evSic: 'Apto', fechaCert: '04-07-2025', fechaVenc: '04-07-2027', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL', condicion: 'Aprobó' },
    ];
    
    const CesacLogo = () => (
        <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-20 w-auto" data-ai-hint="logo"/>
    );

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;
        toast({ title: "Generando PDF...", description: "Por favor espere." });
        
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / ratio;
        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * ratio;
        }
        const x = (pdfWidth - finalWidth) / 2;
        const y = 0;
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('reporte-calificaciones.pdf');
        toast({ title: "PDF Descargado", description: "El reporte ha sido guardado." });
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Volver a buscar</Button>
                <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Descargar PDF</Button>
            </div>
            <div className="bg-white p-4 print:p-0">
                 <div ref={reportRef} className="bg-white text-black p-8 font-times max-w-7xl mx-auto print:shadow-none">
                    <header className="text-center mb-10">
                        <div className="flex justify-center mb-4"><CesacLogo /></div>
                        <div className="space-y-1">
                            <p className="font-bold text-lg">REPÚBLICA DOMINICANA</p>
                            <p className="font-bold text-lg">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL</p>
                            <p className="font-semibold text-md mt-2">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN AVSEC</p>
                            <p className="font-semibold text-md">DIVISIÓN DE CERTIFICACIÓN AVSEC</p>
                            <p className="font-bold text-xl mt-4">INFORME FINAL DE LOS RESULTADOS DE LAS EVALUACIONES DEL PROCESO</p>
                        </div>
                    </header>

                    <section>
                        <table className="w-full border-collapse border border-black text-[8px]">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">NO.</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">NOMBRES Y APELLIDOS</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">CÉDULA</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">ASIG. SERV.</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">COMPAÑÍA</th>
                                    <th colSpan={2} className="border border-black p-1 font-bold">EX. TCO.</th>
                                    <th colSpan={2} className="border border-black p-1 font-bold">EV. PCA.</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">PROCESO</th>
                                    <th colSpan={4} className="border border-black p-1 font-bold">EVALUACIÓN</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">FECHA CERT.</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">FECHA VENC.</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">HABILITACIÓN</th>
                                    <th rowSpan={2} className="border border-black p-1 font-bold align-middle">CONDICIÓN</th>
                                </tr>
                                <tr className="bg-gray-200">
                                    <th className="border border-black p-1 font-bold">R</th>
                                    <th className="border border-black p-1 font-bold">PCA</th>
                                    <th className="border border-black p-1 font-bold">R</th>
                                    <th className="border border-black p-1 font-bold">PCA</th>
                                    <th className="border border-black p-1 font-bold">EV. MED.</th>
                                    <th className="border border-black p-1 font-bold">VERF. ANTEC.</th>
                                    <th className="border border-black p-1 font-bold">P. DOP.</th>
                                    <th className="border border-black p-1 font-bold">EV. SIC.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row) => (
                                    <tr key={row.no}>
                                        <td className="border border-black p-1 text-center align-top">{row.no}.</td>
                                        <td className="border border-black p-1 align-top">{row.nombres}</td>
                                        <td className="border border-black p-1 align-top">{row.cedula}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.asigServ}</td>
                                        <td className="border border-black p-1 align-top">{row.compania}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.exTcoR}</td>
                                        <td className="border border-black p-1 text-center align-top">-</td>
                                        <td className="border border-black p-1 text-center align-top">{row.exPcaR}</td>
                                        <td className="border border-black p-1 text-center align-top">-</td>
                                        <td className="border border-black p-1 align-top">{row.proceso}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.evMed}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.verfAntec}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.pDop}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.evSic}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.fechaCert}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.fechaVenc}</td>
                                        <td className="border border-black p-1 align-top">{row.habilitacion}</td>
                                        <td className="border border-black p-1 text-center align-top">{row.condicion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                     <footer className="mt-20 flex justify-between items-center text-sm">
                        <div>
                            <p className="font-bold">Emitido por: {userName}</p>
                        </div>
                        <div>
                            <p className="font-bold">Pág. 1 de 2</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

const InstructoresReportView = ({ onBack, userName }: { onBack: () => void; userName: string; }) => {
    const reportRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    
    const reportData = [
        { no: 1, nombre: 'Ana M. Martinez Vasquez', cedula: '402-2838286-3', licenciaAnterior: 'Si', fechaCertInspector: '14-07-2025', fechaCertInstructor: '', codigoLicInspector: 'IPC-2140', codigoLicInstructor: '' },
        { no: 2, nombre: 'Anderson Santos De La C.', cedula: '402-2929978-5', licenciaAnterior: 'Si', fechaCertInspector: '14-07-2025', fechaCertInstructor: '', codigoLicInspector: 'IPC-2884', codigoLicInstructor: '' },
    ];
    
    const CesacLogo = () => (
        <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-20 w-auto" data-ai-hint="logo"/>
    );

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;
        toast({ title: "Generando PDF...", description: "Por favor espere." });
        
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / ratio;
        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * ratio;
        }
        const x = (pdfWidth - finalWidth) / 2;
        const y = 0;
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('reporte-instructores.pdf');
        toast({ title: "PDF Descargado", description: "El reporte ha sido guardado." });
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Volver a buscar</Button>
                <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Descargar PDF</Button>
            </div>
            <div className="bg-white p-4 print:p-0">
                 <div ref={reportRef} className="bg-white text-black p-8 font-times max-w-7xl mx-auto text-xs">
                    <header className="text-center mb-6">
                        <div className="flex justify-center mb-2"><CesacLogo /></div>
                        <div className="space-y-0">
                            <p className="font-bold">REPÚBLICA DOMINICANA</p>
                            <p className="font-bold">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL</p>
                            <p className="font-semibold">(CESAC)</p>
                            <p className="font-semibold mt-1">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN</p>
                            <p className="font-bold text-sm mt-2">FORMULARIO DE LIBERACION DE LICENCIAS</p>
                        </div>
                    </header>
                    <div className="text-right mb-4">
                        <span className="font-bold">Fecha:</span>
                        <span className="inline-block border-b border-black w-24 ml-2">{new Date().toLocaleDateString('es-ES')}</span>
                    </div>

                    <div className="border-2 border-black">
                        <div className="text-center font-bold bg-gray-200 border-b-2 border-black py-1">
                            PERSONAL AVSEC DEL CESAC
                        </div>
                        <div className="p-2 text-center font-bold bg-gray-200 border-b-2 border-black py-1">
                             CATEGORÍAS: INSPECTOR AVSEC DE PRIMERA CATEGORÍA - INSTRUCTOR AVSEC
                        </div>
                    </div>

                    <section className="mt-2">
                        <table className="w-full border-collapse border-2 border-black text-[9px]">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th rowSpan={2} className="border-2 border-black p-1 font-bold">No.</th>
                                    <th rowSpan={2} className="border-2 border-black p-1 font-bold">Nombres y Apellidos</th>
                                    <th rowSpan={2} className="border-2 border-black p-1 font-bold">Cédula</th>
                                    <th rowSpan={2} className="border-2 border-black p-1 font-bold">Licencia Anterior</th>
                                    <th colSpan={2} className="border-2 border-black p-1 font-bold">Fecha de Certificación</th>
                                    <th colSpan={2} className="border-2 border-black p-1 font-bold">Código de la Licencia</th>
                                    <th rowSpan={2} className="border-2 border-black p-1 font-bold">Teléfono</th>
                                    <th rowSpan={2} className="border-2 border-black p-1 font-bold">Firma</th>
                                </tr>
                                 <tr className="bg-gray-200">
                                    <th className="border-2 border-black p-1 font-bold">Inspector</th>
                                    <th className="border-2 border-black p-1 font-bold">Instructor</th>
                                    <th className="border-2 border-black p-1 font-bold">Inspector</th>
                                    <th className="border-2 border-black p-1 font-bold">Instructor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row) => (
                                    <tr key={row.no}>
                                        <td className="border-2 border-black p-1 text-center">{row.no}</td>
                                        <td className="border-2 border-black p-1">{row.nombre}</td>
                                        <td className="border-2 border-black p-1 text-center">{row.cedula}</td>
                                        <td className="border-2 border-black p-1 text-center">{row.licenciaAnterior}</td>
                                        <td className="border-2 border-black p-1 text-center">{row.fechaCertInspector}</td>
                                        <td className="border-2 border-black p-1 text-center">{row.fechaCertInstructor}</td>
                                        <td className="border-2 border-black p-1 text-center">{row.codigoLicInspector}</td>
                                        <td className="border-2 border-black p-1 text-center">{row.codigoLicInstructor}</td>
                                        <td className="border-2 border-black p-1 text-center"></td>
                                        <td className="border-2 border-black p-1 text-center"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    <footer className="mt-20 flex justify-between items-center text-sm">
                        <div className="w-2/5 text-center">
                            <hr className="border-black mb-1"/>
                            <p className="font-bold">Supervisado por</p>
                        </div>
                        <div className="w-2/5 text-center">
                            <hr className="border-black mb-1"/>
                            <p className="font-bold">Liberado por</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

const PrivadaReportView = ({ onBack, userName, companyName }: { onBack: () => void; userName: string; companyName: string }) => {
    const reportRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const reportData = [
        { no: 1, nombres: 'Antonio Contrera Vidal', cedula: '001-0946569-0', licenciaAnterior: 'SÍ', fechaCertificacion: '30-05-2025', codigoLicencia: 'AD-5921' },
    ];
    
    const CesacLogo = () => (
        <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-20 w-auto" data-ai-hint="logo" />
    );

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
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
        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / ratio;
        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * ratio;
        }
        const x = (pdfWidth - finalWidth) / 2;
        const y = 0;
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('reporte-licencia-privada.pdf');
        toast({ title: "PDF Descargado", description: "El reporte ha sido guardado." });
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Volver a buscar</Button>
                <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Descargar PDF</Button>
            </div>
            <div className="bg-white p-4 print:p-0">
                 <div ref={reportRef} className="bg-white text-black p-8 font-times max-w-4xl mx-auto text-[10px] leading-tight">
                    <header className="text-center mb-4">
                        <div className="flex justify-center mb-2"><CesacLogo /></div>
                        <div className="space-y-0.5">
                            <p className="font-bold text-sm">REPÚBLICA DOMINICANA</p>
                            <p className="font-bold text-sm">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL</p>
                            <p className="font-semibold">(CESAC)</p>
                            <p className="font-semibold mt-1">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN</p>
                            <p className="font-bold text-sm mt-1">FORMULARIO DE LIBERACION DE LICENCIAS</p>
                        </div>
                    </header>
                     <div className="text-right mb-2">
                        <span className="font-bold">Fecha:</span>
                        <span className="inline-block border-b border-black w-24 ml-2">{new Date().toLocaleDateString('es-ES')}</span>
                    </div>

                    <div className="border-2 border-black text-center font-bold bg-gray-200 py-1">PERSONAL DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL</div>
                    <div className="border-x-2 border-b-2 border-black p-2">
                        <div className="text-center font-bold bg-gray-200 py-1 mb-2">DATOS DE LA PERSONA QUE RECIBE</div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            <div><span className="font-bold">Nombres:</span><span className="inline-block w-full border-b border-black"></span></div>
                            <div><span className="font-bold">Apellidos:</span><span className="inline-block w-full border-b border-black"></span></div>
                            <div><span className="font-bold">Cédula:</span><span className="inline-block w-full border-b border-black"></span></div>
                            <div><span className="font-bold">Compañía:</span><span className="pl-2">{companyName}</span></div>
                            <div><span className="font-bold">Cargo en la Compañía:</span><span className="inline-block w-full border-b border-black"></span></div>
                            <div><span className="font-bold">Teléfono:</span><span className="inline-block w-full border-b border-black"></span></div>
                        </div>
                    </div>

                    <p className="my-3">Por medio de la presente certifico haber recibido de manos, del Encargado de la Sección de Licencia de Certificación de Seguridad de la Aviación Civil, las licencias del personal detalladas más abajo:</p>

                    <div className="border-2 border-black text-center font-bold bg-gray-200 py-1">CERTIFICACIÓN DEL PERSONAL DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL</div>

                    <section>
                        <table className="w-full border-collapse border-x-2 border-black text-[10px]">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border-2 border-black p-1 font-bold">No.</th>
                                    <th className="border-2 border-black p-1 font-bold">Nombres y Apellidos</th>
                                    <th className="border-2 border-black p-1 font-bold">Cédula</th>
                                    <th className="border-2 border-black p-1 font-bold">Licencia Anterior</th>
                                    <th className="border-2 border-black p-1 font-bold">Fecha de Certificación</th>
                                    <th className="border-2 border-black p-1 font-bold">Código de la Licencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row) => (
                                    <tr key={row.no}>
                                        <td className="border-x-2 border-black p-1 text-center">{row.no}</td>
                                        <td className="border-x-2 border-black p-1">{row.nombres}</td>
                                        <td className="border-x-2 border-black p-1 text-center">{row.cedula}</td>
                                        <td className="border-x-2 border-black p-1 text-center">{row.licenciaAnterior}</td>
                                        <td className="border-x-2 border-black p-1 text-center">{row.fechaCertificacion}</td>
                                        <td className="border-x-2 border-black p-1 text-center">{row.codigoLicencia}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold">
                                    <td colSpan={6} className="border-2 border-black p-1">Cantidad: {reportData.length}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>
                    
                    <div className="mt-8 text-center">
                        <div className="inline-block w-2/5 border-b-2 border-black"></div>
                        <p className="font-bold">Firma y sello</p>
                    </div>

                    <p className="mt-4"><span className="font-bold">NOTA:</span> La entidad a la que pertenece el titular de la Licencia, al momento de que prescinda de sus servicios, deberá de notificar al CESAC, de que el mismo ya no labora en dicha entidad, debiendo esta retirarle la licencia y enviarla a este organismo.</p>

                    <footer className="mt-20 flex justify-between items-center text-sm">
                        <div className="w-2/5 text-center">
                            <hr className="border-black mb-1"/>
                            <p className="font-bold">Supervisado por</p>
                        </div>
                        <div className="w-2/5 text-center">
                            <hr className="border-black mb-1"/>
                            <p className="font-bold">Liberado por</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};


export default function LiberacionesPage() {
  const router = useRouter();
  const [modalType, setModalType] = React.useState<string | null>(null);
  
  // State for 'programacion' modal
  const [fechaDesdeProg, setFechaDesdeProg] = React.useState<Date | undefined>();
  const [fechaHastaProg, setFechaHastaProg] = React.useState<Date | undefined>();

  // State for 'calificaciones' modal
  const [fechaDesdeCal, setFechaDesdeCal] = React.useState<Date | undefined>();
  const [fechaHastaCal, setFechaHastaCal] = React.useState<Date | undefined>();
  const [searchedCal, setSearchedCal] = React.useState(false);
  const [organizationsCal, setOrganizationsCal] = React.useState<string[]>([]);
  const [selectedOrganizationCal, setSelectedOrganizationCal] = React.useState<string>("");
  const [isReportReadyCal, setIsReportReadyCal] = React.useState(false);
  
  // State for 'licencia-cesac' modal
  const [fechaDesdeLicCesac, setFechaDesdeLicCesac] = React.useState<Date | undefined>();
  const [fechaHastaLicCesac, setFechaHastaLicCesac] = React.useState<Date | undefined>();

  // State for 'licencia-instructor' modal
  const [fechaDesdeLicInstructor, setFechaDesdeLicInstructor] = React.useState<Date | undefined>();
  const [fechaHastaLicInstructor, setFechaHastaLicInstructor] = React.useState<Date | undefined>();
  const [isReportReadyInstructor, setIsReportReadyInstructor] = React.useState(false);

  // State for 'licencia-privada' modal
  const [fechaDesdeLicPrivada, setFechaDesdeLicPrivada] = React.useState<Date | undefined>();
  const [fechaHastaLicPrivada, setFechaHastaLicPrivada] = React.useState<Date | undefined>();
  const [searchedPrivada, setSearchedPrivada] = React.useState(false);
  const [organizationsPrivada, setOrganizationsPrivada] = React.useState<string[]>([]);
  const [selectedOrganizationPrivada, setSelectedOrganizationPrivada] = React.useState<string>("");
  const [isReportReadyPrivada, setIsReportReadyPrivada] = React.useState(false);

  const currentUserName = "Kendy Qualey"; 

  const handleCardClick = (id: string) => {
    setModalType(id);
  };

  const handleCloseModal = () => {
    setModalType(null);
    // Reset all states
    setFechaDesdeProg(undefined); setFechaHastaProg(undefined);
    setFechaDesdeCal(undefined); setFechaHastaCal(undefined);
    setSearchedCal(false); setOrganizationsCal([]);
    setSelectedOrganizationCal(""); setIsReportReadyCal(false);
    setFechaDesdeLicCesac(undefined); setFechaHastaLicCesac(undefined);
    setFechaDesdeLicInstructor(undefined); setFechaHastaLicInstructor(undefined);
    setIsReportReadyInstructor(false);
    setFechaDesdeLicPrivada(undefined); setFechaHastaLicPrivada(undefined);
    setSearchedPrivada(false); setOrganizationsPrivada([]); setSelectedOrganizationPrivada("");
    setIsReportReadyPrivada(false);
  };

  const handleSearch = (type: string) => {
    const mockOrgs = [
        'AERONAVES DOMINICANAS, S.A.',
        'LONGPORT AVIATION SECURITY, S.R.L',
        'SWISSPORT',
        'AERODOM',
    ];

    if (type === 'calificaciones') {
        setSearchedCal(true);
        setOrganizationsCal(mockOrgs);
    } else if (type === 'licencia-privada') {
        setSearchedPrivada(true);
        setOrganizationsPrivada(mockOrgs);
    }
  };
  
  const handleGenerateReport = (type: string) => {
    if (type === 'programacion' && fechaDesdeProg && fechaHastaProg) {
        const from = format(fechaDesdeProg, 'yyyy-MM-dd');
        const to = format(fechaHastaProg, 'yyyy-MM-dd');
        window.open(`/dashboard/reportes/programacion?dateinicio=${from}&datefin=${to}`, '_blank');
        handleCloseModal();
    } else if (type === 'calificaciones' && selectedOrganizationCal) {
      setIsReportReadyCal(true);
    } else if (type === 'licencia-cesac' && fechaDesdeLicCesac && fechaHastaLicCesac) {
        const from = format(fechaDesdeLicCesac, 'yyyy-MM-dd');
        const to = format(fechaHastaLicCesac, 'yyyy-MM-dd');
        window.open(`/dashboard/reportes/programacion?dateinicio=${from}&datefin=${to}`, '_blank'); // Reusing same report for demo
        handleCloseModal();
    } else if (type === 'licencia-instructor' && fechaDesdeLicInstructor && fechaHastaLicInstructor) {
        setIsReportReadyInstructor(true);
    } else if (type === 'licencia-privada' && selectedOrganizationPrivada) {
        setIsReportReadyPrivada(true);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Programas y Liberaciones</CardTitle>
          <CardDescription>
            Aquí podrá gestionar la programación de evaluaciones y los diferentes tipos de liberaciones.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {reportOptions.map((option) => (
           <motion.div key={option.id} variants={itemVariants}>
              <ReportCard {...option} onGenerateClick={() => handleCardClick(option.id)} />
           </motion.div>
        ))}
      </motion.div>
      
      {/* Programacion Modal */}
      <Dialog open={modalType === 'programacion'} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Generar Reporte: Programación de Evaluaciones</DialogTitle>
                <DialogDescription>
                    Seleccione un rango de fechas para generar el informe de programación.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
                <div className="grid gap-2 w-full">
                    <Label htmlFor="date-from-prog" className="text-sm font-medium">Desde</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date-from-prog" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaDesdeProg && "text-muted-foreground")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {fechaDesdeProg ? format(fechaDesdeProg, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker initialFocus mode="single" selected={fechaDesdeProg} onSelect={setFechaDesdeProg} locale={es} />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid gap-2 w-full">
                    <Label htmlFor="date-to-prog" className="text-sm font-medium">Hasta</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date-to-prog" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaHastaProg && "text-muted-foreground")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {fechaHastaProg ? format(fechaHastaProg, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker initialFocus mode="single" selected={fechaHastaProg} onSelect={setFechaHastaProg} locale={es} />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={() => handleGenerateReport('programacion')} disabled={!fechaDesdeProg || !fechaHastaProg} className="w-full">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Generar reporte
                </Button>
            </div>
        </DialogContent>
      </Dialog>
      
      {/* Calificaciones Modal */}
       <Dialog open={modalType === 'calificaciones'} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Generar Reporte: Informe final de los resultados</DialogTitle>
                 <DialogDescription>
                    {isReportReadyCal ? "Visualice y descargue el reporte generado." : "Seleccione un rango de fechas y una organización para buscar las evaluaciones."}
                </DialogDescription>
            </DialogHeader>
             {isReportReadyCal ? (
                <CalificacionesReportView onBack={() => setIsReportReadyCal(false)} userName={currentUserName} />
             ) : (
                <div className="space-y-6 pt-4">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="grid gap-2 flex-1 w-full md:w-auto">
                            <Label htmlFor="date-from-cal" className="text-sm font-medium">Fecha inicio</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="date-from-cal" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaDesdeCal && "text-muted-foreground")}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {fechaDesdeCal ? format(fechaDesdeCal, "dd/MM/yyyy", {locale: es}) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><CalendarPicker mode="single" selected={fechaDesdeCal} onSelect={setFechaDesdeCal} locale={es} /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2 flex-1 w-full md:w-auto">
                            <Label htmlFor="date-to-cal" className="text-sm font-medium">Fecha fin</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="date-to-cal" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaHastaCal && "text-muted-foreground")}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {fechaHastaCal ? format(fechaHastaCal, "dd/MM/yyyy", {locale: es}) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><CalendarPicker mode="single" selected={fechaHastaCal} onSelect={setFechaHastaCal} locale={es} /></PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={() => handleSearch('calificaciones')} disabled={!fechaDesdeCal || !fechaHastaCal} className="w-full md:w-auto">
                            <Search className="mr-2 h-4 w-4" />
                            Buscar organizaciones
                        </Button>
                    </div>

                    {searchedCal && (
                        <div className="flex flex-col md:flex-row items-end gap-4 animate-in fade-in-50">
                            <div className="grid gap-2 flex-1 w-full md:w-auto">
                                <Label htmlFor="organization-select-cal" className="text-sm font-medium">Organizaciones</Label>
                                <Select value={selectedOrganizationCal} onValueChange={setSelectedOrganizationCal}>
                                    <SelectTrigger id="organization-select-cal"><SelectValue placeholder="Seleccione una organización..." /></SelectTrigger>
                                    <SelectContent>
                                        {organizationsCal.map(org => <SelectItem key={org} value={org}>{org}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={() => handleGenerateReport('calificaciones')} disabled={!selectedOrganizationCal} className="w-full md:w-auto">
                                <FileCheck className="mr-2 h-4 w-4" />
                                Generar reporte
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </DialogContent>
      </Dialog>
      
      {/* Liberacion Licencia CESAC Modal */}
      <Dialog open={modalType === 'licencia-cesac'} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Generar Reporte: Liberación de Licencia CESAC</DialogTitle>
                <DialogDescription>
                    Seleccione un rango de fechas para generar el informe de evaluaciones.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
                <div className="grid gap-2 w-full">
                    <Label htmlFor="date-from-lic-cesac" className="text-sm font-medium">Desde</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date-from-lic-cesac" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaDesdeLicCesac && "text-muted-foreground")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {fechaDesdeLicCesac ? format(fechaDesdeLicCesac, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker initialFocus mode="single" selected={fechaDesdeLicCesac} onSelect={setFechaDesdeLicCesac} locale={es} />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid gap-2 w-full">
                    <Label htmlFor="date-to-lic-cesac" className="text-sm font-medium">Hasta</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date-to-lic-cesac" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaHastaLicCesac && "text-muted-foreground")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {fechaHastaLicCesac ? format(fechaHastaLicCesac, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker initialFocus mode="single" selected={fechaHastaLicCesac} onSelect={setFechaHastaLicCesac} locale={es} />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={() => handleGenerateReport('licencia-cesac')} disabled={!fechaDesdeLicCesac || !fechaHastaLicCesac} className="w-full">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Generar reporte
                </Button>
            </div>
        </DialogContent>
      </Dialog>
      
      {/* Liberacion Licencia Instructor Modal */}
      <Dialog open={modalType === 'licencia-instructor'} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Generar Reporte: Liberación de Licencia Instructor</DialogTitle>
                <DialogDescription>
                    {isReportReadyInstructor ? "Visualice y descargue el reporte generado." : "Seleccione un rango de fechas para generar el informe."}
                </DialogDescription>
            </DialogHeader>
            {isReportReadyInstructor ? (
                <InstructoresReportView onBack={() => setIsReportReadyInstructor(false)} userName={currentUserName} />
            ) : (
                <div className="space-y-6 pt-4">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="grid gap-2 flex-1 w-full md:w-auto">
                            <Label htmlFor="date-from-lic-instructor" className="text-sm font-medium">Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="date-from-lic-instructor" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaDesdeLicInstructor && "text-muted-foreground")}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {fechaDesdeLicInstructor ? format(fechaDesdeLicInstructor, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarPicker initialFocus mode="single" selected={fechaDesdeLicInstructor} onSelect={setFechaDesdeLicInstructor} locale={es} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2 flex-1 w-full md:w-auto">
                            <Label htmlFor="date-to-lic-instructor" className="text-sm font-medium">Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="date-to-lic-instructor" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaHastaLicInstructor && "text-muted-foreground")}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {fechaHastaLicInstructor ? format(fechaHastaLicInstructor, "dd/MM/yyyy", { locale: es }) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarPicker initialFocus mode="single" selected={fechaHastaLicInstructor} onSelect={setFechaHastaLicInstructor} locale={es} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Button onClick={() => handleGenerateReport('licencia-instructor')} disabled={!fechaDesdeLicInstructor || !fechaHastaLicInstructor} className="w-full mt-4">
                        <FileCheck className="mr-2 h-4 w-4" />
                        Generar reporte
                    </Button>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* Liberacion Licencia Privada Modal */}
      <Dialog open={modalType === 'licencia-privada'} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Generar reporte: Liberación de licencia para personal de seguridad privada</DialogTitle>
                <DialogDescription>
                    {isReportReadyPrivada ? "Visualice y descargue el reporte generado." : "Seleccione un rango de fechas y una organización para buscar."}
                </DialogDescription>
            </DialogHeader>
            {isReportReadyPrivada ? (
                <PrivadaReportView 
                    onBack={() => setIsReportReadyPrivada(false)} 
                    userName={currentUserName} 
                    companyName={selectedOrganizationPrivada}
                />
            ) : (
                <div className="space-y-6 pt-4">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                         <div className="grid gap-2 flex-1 w-full md:w-auto">
                            <Label htmlFor="date-from-lic-privada">Fecha inicio:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="date-from-lic-privada" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaDesdeLicPrivada && "text-muted-foreground")}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {fechaDesdeLicPrivada ? format(fechaDesdeLicPrivada, "dd/MM/yyyy", {locale: es}) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><CalendarPicker mode="single" selected={fechaDesdeLicPrivada} onSelect={setFechaDesdeLicPrivada} locale={es} /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2 flex-1 w-full md:w-auto">
                            <Label htmlFor="date-to-lic-privada">Fecha fin:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="date-to-lic-privada" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaHastaLicPrivada && "text-muted-foreground")}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {fechaHastaLicPrivada ? format(fechaHastaLicPrivada, "dd/MM/yyyy", {locale: es}) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><CalendarPicker mode="single" selected={fechaHastaLicPrivada} onSelect={setFechaHastaLicPrivada} locale={es} /></PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={() => handleSearch('licencia-privada')} disabled={!fechaDesdeLicPrivada || !fechaHastaLicPrivada} className="w-full md:w-auto">
                            <Search className="mr-2 h-4 w-4" />
                            Buscar organizaciones
                        </Button>
                    </div>
                    
                    {searchedPrivada && (
                        <div className="flex flex-col md:flex-row items-end gap-4 animate-in fade-in-50">
                             <div className="grid gap-2 flex-1 w-full md:w-auto">
                                <Label htmlFor="organization-select-privada">Organizaciones:</Label>
                                <Select value={selectedOrganizationPrivada} onValueChange={setSelectedOrganizationPrivada}>
                                    <SelectTrigger id="organization-select-privada"><SelectValue placeholder="Seleccione una organización" /></SelectTrigger>
                                    <SelectContent>
                                        {organizationsPrivada.map(org => <SelectItem key={org} value={org}>{org}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={() => handleGenerateReport('licencia-privada')} disabled={!selectedOrganizationPrivada} className="w-full md:w-auto">
                                <FileIcon className="mr-2 h-4 w-4" />
                                Generar reporte
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
