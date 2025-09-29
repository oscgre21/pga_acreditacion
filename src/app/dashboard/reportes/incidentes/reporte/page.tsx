
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, FileText, User, Calendar, AlertTriangle, Monitor, ClipboardList, Type, MessageSquare, Paperclip } from 'lucide-react';
import { PgaLogo } from '@/components/gateway-pga-logo'; // Assuming a generic PGA logo component exists

const InfoCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType, children: React.ReactNode; className?: string }) => (
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

const PgaReportLogo = () => (
    <div className="flex flex-col items-center text-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-slate-400 dark:stroke-slate-500">
          <path d="M32 34 L52 12" />
          <path d="M32 34 L12 24" />
          <path d="M32 34 L22 50" />
          <path d="M32 34 L42 50" />
        </g>
        <g>
          <rect x="5" y="17" width="14" height="14" rx="3" className="fill-cyan-400 dark:fill-cyan-500"/>
          <rect x="15" y="43" width="14" height="14" rx="3" className="fill-cyan-400 dark:fill-cyan-500"/>
          <rect x="35" y="43" width="14" height="14" rx="3" className="fill-cyan-400 dark:fill-cyan-500"/>
          <rect x="25" y="27" width="14" height="14" rx="3" className="fill-slate-400 dark:fill-slate-500"/>
          <rect x="45" y="5" width="14" height="14" rx="3" className="fill-slate-400 dark:fill-slate-500"/>
          <g className="fill-black/70 dark:fill-black/80">
              <rect x="10" y="22" width="4" height="4" rx="1" />
              <rect x="20" y="48" width="4" height="4" rx="1" />
              <rect x="40" y="48" width="4" height="4" rx="1" />
              <rect x="30" y="32" width="4" height="4" rx="1" />
              <rect x="50" y="10" width="4" height="4" rx="1" />
          </g>
        </g>
      </svg>
    </div>
);


export default function IncidentReportPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('incidentReportData');
      if (storedData) {
        setData(JSON.parse(storedData));
        // sessionStorage.removeItem('incidentReportData'); // Optional: clear data after use
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Failed to parse incident data", error);
      notFound();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (data && !isGenerating) {
      const generatePdf = async () => {
        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

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
        
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        window.location.replace(blobUrl);
      };
      // Timeout to ensure the DOM is fully painted
      const timer = setTimeout(generatePdf, 500);
      return () => clearTimeout(timer);
    }
  }, [data, isGenerating]);
  
  // A small effect to switch from generating state to rendered state
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsGenerating(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="text-lg font-semibold text-gray-700">Cargando datos del informe...</p>
      </div>
    );
  }
  
  if (isGenerating) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="text-lg font-semibold text-gray-700">Generando PDF, por favor espere...</p>
      </div>
    );
  }


  return (
    <div className="bg-gray-200 p-4 font-body">
      <div id="pdf-content" ref={reportRef} className="max-w-4xl mx-auto bg-white">
        <div className="p-8">
            <header className="flex justify-between items-start pb-4">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800 tracking-wider">REPORTE DE INCIDENCIA</h1>
                <p className="text-sm text-gray-500">Fecha de Reporte: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <PgaReportLogo />
            </header>
            <div className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-center font-semibold text-lg mb-8">
                Portal de Gestión Administrativa (PGA)
            </div>

            <main className="mt-8 space-y-6">
              <InfoCard title="Detalles del Reporte" icon={FileText}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem icon={User} label="Reportado Por" value={data.userName} />
                    <InfoItem icon={Calendar} label="Fecha y Hora del Fallo" value={new Date(data.incidentDateTime).toLocaleString('es-ES')} />
                    <InfoItem icon={ClipboardList} label="Dependencia" value={data.reportingDepartment} />
                </div>
              </InfoCard>

              <InfoCard title="Detalles de la Incidencia" icon={AlertTriangle}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem icon={FileText} label="Aplicación" value={data.appName} />
                    <InfoItem icon={AlertTriangle} label="Nivel" value={data.incidentLevel} />
                    <InfoItem icon={Monitor} label="Sistema Operativo" value={data.os === 'otro' ? data.osOther : data.os} />
                    <div className="lg:col-span-3">
                        <InfoItem icon={Type} label="Tipo de Incidencia" value={data.incidentType === 'otro' ? data.incidentTypeOther : data.incidentType} />
                    </div>
                </div>
              </InfoCard>

              <InfoCard title="Descripción del Problema" icon={MessageSquare}>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{data.description}</p>
              </InfoCard>

              {data.attachment && (
                <InfoCard title="Evidencia Adjunta" icon={Paperclip}>
                    <p className="text-sm text-gray-500">Se ha adjuntado un archivo de evidencia (no visible en este PDF).</p>
                </InfoCard>
              )}
            </main>

            <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
              Confidencial - Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (CESAC)
            </footer>
        </div>
      </div>
    </div>
  );
}
