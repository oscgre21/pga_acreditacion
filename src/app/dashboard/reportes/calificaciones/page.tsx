
'use client';

import React from 'react';

const CesacLogo = () => (
    <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-20 w-auto" data-ai-hint="logo"/>
);

const reportData = [
    { no: 1, nombres: 'Clara E. Santos Ramirez', cedula: '40233346663', asigServ: 'MDSD', compania: 'LAS AMÉRICAS CARGO, S.R.L.', exTcoR: '82', exPcaR: '88', proceso: 'Certificación del personal de seguridad privada de la aviación civil', evMed: 'Apto', verfAntec: 'Apto', pDop: 'Apto', evSic: 'Apto', fechaCert: '11-07-2025', fechaVenc: '11-07-2027', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL', condicion: 'Aprobó' },
    { no: 2, nombres: 'Yessica Vargas Santos', cedula: '42028255630', asigServ: 'MDSD', compania: 'LAS AMÉRICAS CARGO, S.R.L.', exTcoR: '78', exPcaR: '94', proceso: 'Certificación del personal de seguridad privada de la aviación civil', evMed: 'Apto', verfAntec: 'Apto', pDop: 'Apto', evSic: 'Apto', fechaCert: '04-07-2025', fechaVenc: '04-07-2027', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL', condicion: 'Aprobó' },
];

export default function CalificacionesReportPage() {

    const currentUserName = "Kendy Qualey"; // This would typically come from a session or context

    return (
        <div className="bg-white text-black p-8 font-times max-w-7xl mx-auto print:shadow-none">
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
                   <p className="font-bold">Emitido por: {currentUserName}</p>
               </div>
               <div>
                   <p className="font-bold">Pág. 1 de 2</p>
               </div>
           </footer>
        </div>
    );
};
