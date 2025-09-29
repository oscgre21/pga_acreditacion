
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader, User } from 'lucide-react';
import { format } from 'date-fns';

// This is the component that will be rendered and converted to PDF
const LicensePreviewForPDF = ({ data }: { data: any }) => {
    const issueDate = new Date();
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 2);

    return (
        <div className="font-sans bg-white p-4 rounded-lg shadow-xl aspect-[86/54] w-[339px] h-[213px] flex flex-col text-xs text-black border border-gray-300">
            <div className="bg-[#002f6c] text-white flex items-center p-2 rounded-t-md">
                <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-10 w-10 mr-2" data-ai-hint="logo"/>
                <div className="text-center flex-grow">
                    <p className="font-bold text-[10px] tracking-wider">CESAC</p>
                    <p className="font-extrabold text-[12px]">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL, CESAC</p>
                </div>
            </div>
            <div className="flex-grow bg-white p-2 flex gap-2">
                <div className="w-1/3 flex flex-col items-center space-y-1">
                    <div className="w-20 h-24 bg-gray-200 border-2 border-[#002f6c] flex items-center justify-center">
                        {data.fotoUrl ? (
                            <img src={data.fotoUrl} alt="Foto de licencia" className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-10 w-10 text-gray-400" />
                        )}
                    </div>
                    <p className="font-bold text-[10px] text-center">{data.nombre}</p>
                    <p className="font-mono text-[9px]">ID: {data.cedula}</p>
                </div>
                <div className="w-2/3 flex flex-col justify-between">
                    <div>
                        <p className="font-bold text-[#002f6c] text-center text-sm">{data.categoria || "CATEGORÍA A EMITIR"}</p>
                        <div className="grid grid-cols-2 gap-x-2 mt-2 text-[9px]">
                            <div><p className="font-bold">FECHA DE EMISIÓN:</p><p>{format(issueDate, "dd-MM-yyyy")}</p></div>
                            <div><p className="font-bold">FECHA DE EXPIRACIÓN:</p><p>{format(expiryDate, "dd-MM-yyyy")}</p></div>
                            <div><p className="font-bold">FECHA DE NACIMIENTO:</p><p>{data.fechaNacimiento ? format(new Date(data.fechaNacimiento), 'dd-MM-yyyy') : 'N/A'}</p></div>
                            <div><p className="font-bold">NACIONALIDAD:</p><p>{data.nacionalidad || 'Dominicano'}</p></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="border-t-2 border-black w-3/4 mx-auto pt-1 text-[9px] font-bold">DIRECTOR GENERAL DEL CESAC</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 text-white text-[8px] text-center p-1 rounded-b-md">
                Este carnet es propiedad del Estado Dominicano, si lo encuentra favor devolverlo al CESAC.
            </div>
        </div>
    );
};

export default function LicenseClientPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pdfRef = useRef(null);

    useEffect(() => {
        try {
            const storedData = sessionStorage.getItem('licenseDataForPDF');
            if (storedData) {
                setData(JSON.parse(storedData));
            } else {
                notFound();
            }
        } catch (error) {
            console.error("Failed to parse license data", error);
            notFound();
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (data && pdfRef.current) {
            const generatePdf = async () => {
                const element = pdfRef.current;
                if (!element) return;

                const canvas = await html2canvas(element, { scale: 3, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                
                // standard credit card size in mm is 85.6 x 53.98
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: [85.6, 53.98]
                });
                
                pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
                
                const blob = pdf.output('blob');
                const blobUrl = URL.createObjectURL(blob);
                window.location.replace(blobUrl);
            };

            const timer = setTimeout(generatePdf, 500); // Wait for render
            return () => clearTimeout(timer);
        }
    }, [data]);

    if (isLoading || !data) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200">
                <Loader className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg font-semibold text-gray-700">Preparando licencia...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-200">
            {/* This div is used for html2canvas to capture */}
            <div className="absolute -left-full">
                <div ref={pdfRef}>
                    <LicensePreviewForPDF data={data} />
                </div>
            </div>
            
             <Loader className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold text-gray-700">Generando PDF. Si la descarga no comienza, revise la configuración de su navegador.</p>
        </div>
    );
}
