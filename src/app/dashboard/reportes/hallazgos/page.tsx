
'use client';

import React from 'react';

const CesacLogo = () => (
    <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-20 w-auto" data-ai-hint="logo" />
);

const reportData = [
    { id: 'H-001', company: 'LONGPORT AVIATION SECURITY', personal: 'WILKENIA EDOUARD FILMONOR', date: '2024-07-08', finding: 'Falta documento de Audiometría.', status: 'Abierto' },
    { id: 'H-002', company: 'LONGPORT AVIATION SECURITY', personal: 'WILKENIA EDOUARD FILMONOR', date: '2024-07-08', finding: 'Falta documento de Oftalmología.', status: 'Abierto' },
    { id: 'H-003', company: 'TrackAviation Security S.R.L', personal: 'Carlos Sanchez', date: '2024-06-15', finding: 'El pago de la tasa de revisión no ha sido registrado en el sistema.', status: 'Abierto' },
    { id: 'H-004', company: 'SWISSPORT', personal: 'ANA GOMEZ', date: '2024-05-20', finding: 'Certificado de curso AVSEC vencido.', status: 'Cerrado' },
    { id: 'H-005', company: 'AERODOM', personal: 'N/A', date: '2024-04-10', finding: 'El Programa de Seguridad de la empresa no ha sido actualizado a la última normativa.', status: 'Cerrado' },
];

export default function HallazgosReportPage() {
    return (
        <div className="bg-white text-black p-8 font-times max-w-4xl mx-auto">
            <header className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <CesacLogo />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-lg">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL</p>
                    <p className="font-semibold text-md mt-2">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN AVSEC</p>
                    <p className="font-bold text-xl mt-4">REPORTE DE HALLAZGOS SIN RESOLVER</p>
                </div>
            </header>

            <section className="mb-8">
                <p className="font-semibold">Fecha del reporte: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                <p className="font-semibold">Total de Hallazgos Abiertos: {reportData.filter(d => d.status === 'Abierto').length}</p>
            </section>

            <section>
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-black p-2 font-bold">ID Hallazgo</th>
                            <th className="border border-black p-2 font-bold">Compañía / Solicitante</th>
                            <th className="border border-black p-2 font-bold">Personal Implicado</th>
                            <th className="border border-black p-2 font-bold">Fecha de Reporte</th>
                            <th className="border border-black p-2 font-bold">Descripción del Hallazgo</th>
                            <th className="border border-black p-2 font-bold">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.filter(d => d.status === 'Abierto').map((row) => (
                            <tr key={row.id}>
                                <td className="border border-black p-2 text-center align-top">{row.id}</td>
                                <td className="border border-black p-2 align-top">{row.company}</td>
                                <td className="border border-black p-2 align-top">{row.personal}</td>
                                <td className="border border-black p-2 text-center align-top">{row.date}</td>
                                <td className="border border-black p-2 align-top">{row.finding}</td>
                                <td className="border border-black p-2 text-center align-top font-bold text-red-600">{row.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
             <footer className="mt-20 flex justify-between items-center text-sm">
                <div className="w-1/3 text-center">
                    <hr className="border-black mb-1"/>
                    <p className="font-bold">PREPARADO POR</p>
                </div>
                 <div className="w-1/3 text-center">
                    <hr className="border-black mb-1"/>
                    <p className="font-bold">REVISADO POR</p>
                </div>
                <div className="w-1/3 text-center">
                    <hr className="border-black mb-1"/>
                    <p className="font-bold">APROBADO POR</p>
                </div>
            </footer>
        </div>
    );
};
