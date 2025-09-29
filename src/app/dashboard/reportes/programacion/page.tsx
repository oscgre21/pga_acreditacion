
'use client';

import React from 'react';

const CesacLogo = () => (
    <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-16 w-auto" data-ai-hint="logo" />
);

const reportData = [
    { no: 1, nombre: 'Ana M. Martinez Verguez', cedula: '402-2844898-3', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3100', telefono: '', firma: '' },
    { no: 2, nombre: 'Anderson Santos De La C.', cedula: '402-2609701-3', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3101', telefono: '', firma: '' },
    { no: 3, nombre: 'Caribel L. Fernandez R.', cedula: '402-1811812-1', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3110', telefono: '', firma: '' },
    { no: 4, nombre: 'Lester L. Alfonseca J.', cedula: '402-1393661-2', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3111', telefono: '', firma: '' },
    { no: 5, nombre: 'Cristopher Jimenez R.', cedula: '402-1402268-3', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3112', telefono: '', firma: '' },
    { no: 6, nombre: 'Frandy M. Reyes Perez', cedula: '026-0131473-9', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3113', telefono: '', firma: '' },
    { no: 7, nombre: 'Cristopher Sanchez R.', cedula: '402-1279883-9', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3114', telefono: '', firma: '' },
    { no: 8, nombre: 'Hipolito Rosario Maldonado', cedula: '026-0062489-0', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3115', telefono: '', firma: '' },
    { no: 9, nombre: 'Jose Fernandez Rojas', cedula: '402-2894128-8', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3116', telefono: '', firma: '' },
    { no: 10, nombre: 'Jose H. De Oleo Bido', cedula: '402-1087190-2', licenciaAnterior: 'SI', fechaCertificacion: '16-02-2021', codigoLicencia: 'SPC-3117', telefono: '', firma: '' },
];

export default function ProgramacionReportPage() {
    return (
        <div className="bg-white text-black p-8 font-times max-w-4xl mx-auto text-xs">
           <header className="text-center mb-6">
               <div className="flex justify-center mb-2"><CesacLogo /></div>
               <div className="space-y-0">
                   <p className="font-bold">REPÚBLICA DOMINICANA</p>
                   <p className="font-bold">CUERPO ESPECIALIZADO EN SEGURIDAD AEROPORTUARIA Y DE LA AVIACIÓN CIVIL</p>
                   <p className="font-semibold">(CESAC)</p>
                   <p className="font-semibold mt-1">DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN</p>
                   <p className="font-bold text-sm mt-2">FORMULARIO DE LIBERACIÓN DE LICENCIAS</p>
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
               <div className="p-2">
                    <p className="text-center font-bold mb-2">CATEGORÍAS</p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
                       <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-black"></div>
                           <span>Insp. AVSEC 1ra. Categoría</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-black"></div>
                           <span>Supervisor AVSEC</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-black"></div>
                           <span>Inspector Nacional AVSEC</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-black"></div>
                           <span>Insp. AVSEC 2da. Categoría</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-black"></div>
                           <span>Manejador Canino K-9</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-black"></div>
                           <span>Instructor AVSEC</span>
                       </div>
                    </div>
               </div>
           </div>

           <section className="mt-2">
               <table className="w-full border-collapse border-2 border-black text-[10px]">
                   <thead>
                       <tr className="bg-gray-200">
                           <th className="border-2 border-black p-1 font-bold">No.</th>
                           <th className="border-2 border-black p-1 font-bold">Nombres y Apellidos</th>
                           <th className="border-2 border-black p-1 font-bold">Cédula</th>
                           <th className="border-2 border-black p-1 font-bold">Licencia Anterior</th>
                           <th className="border-2 border-black p-1 font-bold">Fecha de Certificación</th>
                           <th className="border-2 border-black p-1 font-bold">Código de la Licencia</th>
                           <th className="border-2 border-black p-1 font-bold">Teléfono</th>
                           <th className="border-2 border-black p-1 font-bold">Firma</th>
                       </tr>
                   </thead>
                   <tbody>
                       {reportData.map((row) => (
                           <tr key={row.no}>
                               <td className="border-2 border-black p-1 text-center">{row.no}</td>
                               <td className="border-2 border-black p-1">{row.nombre}</td>
                               <td className="border-2 border-black p-1 text-center">{row.cedula}</td>
                               <td className="border-2 border-black p-1 text-center">{row.licenciaAnterior}</td>
                               <td className="border-2 border-black p-1 text-center">{row.fechaCertificacion}</td>
                               <td className="border-2 border-black p-1 text-center">{row.codigoLicencia}</td>
                               <td className="border-2 border-black p-1 text-center">{row.telefono}</td>
                               <td className="border-2 border-black p-1 text-center">{row.firma}</td>
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
    );
};
