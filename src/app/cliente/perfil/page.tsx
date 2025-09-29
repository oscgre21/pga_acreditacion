"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaneTakeoff, Building2, User, Phone, Mail, FileText, MapPin, Pencil } from 'lucide-react';
import Link from 'next/link';

const TravelGoLogo = () => (
    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-1">
        <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/20">
            <PlaneTakeoff className="h-7 w-7 text-white" />
        </div>
    </div>
);

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    <div className="flex items-start gap-4 py-3">
        <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">{value || 'No especificado'}</p>
        </div>
    </div>
);


export default function PerfilCompaniaPage() {

    const companyData = {
        nombre: "TrackAviation Security S.R.L",
        rnc: "130-12345-6",
        telefono: "(809) 555-1234",
        representante: "Kendy A. Qualey",
        correo: "security@trackaviation.com",
        direccion: "Av. Charles de Gaulle #10, Santo Domingo Este, República Dominicana",
        notas: "Compañía líder en servicios de seguridad aeroportuaria, comprometida con los más altos estándares de la aviación civil. Partner estratégico del CESAC desde 2015."
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-400 p-6 text-white relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                            <TravelGoLogo />
                            <div>
                                <p className="text-sm font-light">Identificación: <span className="font-semibold">130677195</span></p>
                                <p className="text-lg font-bold">{companyData.nombre}</p>
                                <div className="flex items-center gap-x-6 mt-1">
                                    <p className="text-sm font-light">RNC: <span className="font-semibold">{companyData.rnc}</span></p>
                                    <p className="text-sm font-light">Teléfono: <span className="font-semibold">{companyData.telefono}</span></p>
                                </div>
                            </div>
                        </div>
                        <Button asChild className="bg-white/90 text-orange-600 hover:bg-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200">
                            <Link href="/cliente/perfil/editar">
                                Editar Perfil <Pencil className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Building2 className="h-7 w-7 text-primary" />
                        Detalles de la Compañía
                    </CardTitle>
                    <CardDescription>Información de contacto y registro de la empresa.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                       <InfoRow icon={User} label="Representante Legal" value={companyData.representante} />
                       <InfoRow icon={Mail} label="Correo Electrónico de Contacto" value={companyData.correo} />
                       <InfoRow icon={Phone} label="Teléfono Principal" value={companyData.telefono} />
                       <InfoRow icon={FileText} label="RNC" value={companyData.rnc} />
                       <div className="md:col-span-2">
                           <InfoRow icon={MapPin} label="Dirección Fiscal" value={companyData.direccion} />
                       </div>
                       <div className="md:col-span-2">
                            <InfoRow icon={FileText} label="Notas Adicionales" value={companyData.notas} />
                       </div>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
