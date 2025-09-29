
'use client';

import React from 'react';

const CesacLogo = () => (
    <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-20 w-auto" data-ai-hint="logo" />
);

const reportData = [
    { id: 1, personal: { nombre: 'JUAN PEREZ', id: '001-1111111-1' }, company: 'SWISSPORT', license: 'SUPERVISOR AVSEC', issueDate: '2022-08-15', expiryDate: '2024-08-14', daysLeft: 5 },
    { id: 2, personal: { nombre: 'ANA TORRES', id: '006-1231231-2' }, company: 'LONGPORT AVIATION SECURITY', license: 'DG-11223 (Mercancías Peligrosas)', issueDate: '2022-07-25', expiryDate: '2024-07-25', daysLeft: -10 },
    { id: 3, personal: { nombre: 'KENDY A. QUALEY', id: '001-1234567-8' }, company: 'TrackAviation Security S.R.L', license: 'INSPECTOR AVSEC 1RA CAT', issueDate: '2022-08-10', expiryDate: '2024-08-09', daysLeft: 0 },
    { id: 4, personal: { nombre: 'DAVID LUNA', id: '009-0101010-1' }, company: 'SWISSPORT', license: 'PASE VEHICULAR (VEH-9988)', issueDate: '2023-08-22', expiryDate: '2024-08-21', daysLeft: 12 },
];

export default function VencimientosReportPage() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return (
        <div className="bg-white text-black p-8 font-times max-w-4xl mx-auto">
            <header className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <CesacLogo />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-lg">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL</p>
                    <p className="font-semibold text-md mt-2">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN AVSEC</p>
                    <p className="font-bold text-xl mt-4">REPORTE DE VENCIMIENTO DE LICENCIAS</p>
                </div>
            </header>

            <section className="mb-8">
                <p className="font-semibold">Semana del {today.toLocaleDateString('es-ES')} al {nextWeek.toLocaleDateString('es-ES')}</p>
            </section>

            <section>
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-black p-2 font-bold">Personal</th>
                            <th className="border border-black p-2 font-bold">Compañía</th>
                            <th className="border border-black p-2 font-bold">Tipo de Licencia/Certificado</th>
                            <th className="border border-black p-2 font-bold">Fecha Emisión</th>
                            <th className="border border-black p-2 font-bold">Fecha Vencimiento</th>
                            <th className="border border-black p-2 font-bold">Días Restantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row) => (
                            <tr key={row.id}>
                                <td className="border border-black p-2 align-middle">
                                    <p className="font-semibold">{row.personal.nombre}</p>
                                    <p>ID: {row.personal.id}</p>
                                </td>
                                <td className="border border-black p-2 align-middle">{row.company}</td>
                                <td className="border border-black p-2 align-middle">{row.license}</td>
                                <td className="border border-black p-2 text-center align-middle">{row.issueDate}</td>
                                <td className="border border-black p-2 text-center align-middle font-bold text-red-600">{row.expiryDate}</td>
                                <td className="border border-black p-2 text-center align-middle font-bold">{row.daysLeft}</td>
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
