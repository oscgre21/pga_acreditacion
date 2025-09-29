
'use client';

import React, { useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, User as UserIcon, Mail, Phone, Briefcase, Building, KeyRound, Clock, Shield } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PgaReportLogo } from '@/components/pga-report-logo';

const InfoCard = ({ title, icon: Icon, children, className }: { title: string; icon?: React.ElementType, children: React.ReactNode; className?: string }) => (
  <Card className={`shadow-lg border-t-2 border-transparent bg-white print:shadow-none print:border-gray-200 ${className} flex flex-col`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-bold text-primary flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      {children}
    </CardContent>
  </Card>
);

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <div className="text-sm text-gray-800 font-medium">{value || 'N/A'}</div>
    </div>
  </div>
);


export default function UserReportPageContent({ user }: { user: any }) {
    const reportRef = React.useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;

        const buttonContainer = document.querySelector('.download-button-container');
        if (buttonContainer) (buttonContainer as HTMLElement).style.visibility = 'hidden';

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        if (buttonContainer) (buttonContainer as HTMLElement).style.visibility = 'visible';
        
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
        pdf.save(`informe-usuario-${user?.usuario}.pdf`);
    };

    if (!user) {
        return notFound();
    }

    return (
        <div className="bg-gray-200 p-4 font-body">
            <div id="pdf-content" ref={reportRef} className="max-w-4xl mx-auto bg-white">
                <div className="p-8">
                    <header className="flex justify-between items-start pb-4">
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-gray-800 tracking-wider">INFORME DE USUARIO</h1>
                             <p className="text-sm text-gray-500">Generado el: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <PgaReportLogo />
                    </header>
                    <div className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-center font-semibold text-lg mb-8">
                        Portal de Gestión Administrativa (PGA)
                    </div>

                    <main className="mt-8 space-y-6">
                        <InfoCard title="Detalles del Usuario" icon={UserIcon}>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoItem icon={UserIcon} label="Nombre Completo" value={user.nombre} />
                                <InfoItem icon={UserIcon} label="Usuario" value={user.usuario} />
                                <InfoItem icon={Mail} label="Correo" value={user.correo} />
                                <InfoItem icon={Phone} label="Teléfono" value={user.telefono} />
                                <InfoItem icon={Briefcase} label="Rango" value={user.rango} />
                                <InfoItem icon={Building} label="Departamento" value={user.departamento} />
                                <div className="lg:col-span-3">
                                    <InfoItem icon={KeyRound} label="Nivel de Perfil" value={user.nivelPerfil} />
                                </div>
                            </div>
                        </InfoCard>

                         <div className="grid md:grid-cols-2 gap-6">
                             <InfoCard title="Accesos Concedidos" icon={Shield}>
                                <ul className="space-y-2">
                                    {user.appsConcedidas.map((app: any) => (
                                        <li key={app.id} className="flex items-center gap-3 text-sm">
                                            <app.logo className="h-5 w-5 text-gray-500" />
                                            <span>{app.nombre}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                             <InfoCard title="Últimos Accesos" icon={Clock}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="h-8">Fecha y Hora</TableHead>
                                            <TableHead className="h-8">App</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {user.ultimosAccesos.map((access: any, index: number) => (
                                            <TableRow key={index} className="text-xs">
                                                <TableCell className="p-2 whitespace-nowrap">{access.fecha} {access.hora}</TableCell>
                                                <TableCell className="p-2">{access.app}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </InfoCard>
                         </div>
                    </main>
                     <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
                        Confidencial - Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (CESAC)
                    </footer>
                </div>
            </div>
             <div className="download-button-container fixed bottom-8 right-8 no-print">
                <Button onClick={handleDownloadPdf} size="lg" className="rounded-full shadow-2xl bg-primary hover:bg-primary/90">
                    <Download className="mr-2 h-5 w-5" /> Descargar
                </Button>
            </div>
        </div>
    );
}
