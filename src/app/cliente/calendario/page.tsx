
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Circle, Briefcase, Calendar as CalendarIcon, CalendarX, Repeat, ShieldAlert, User, Clock, FileText, PlaneTakeoff, Printer } from 'lucide-react';
import { es } from 'date-fns/locale';
import { addDays, startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type EventType = 'vencimiento' | 'renovacion' | 'licencia' | 'cancelado';

interface CalendarEvent {
  date: Date;
  type: EventType;
  title: string;
  description: string;
  person: {
    name: string;
    position: string;
    department: string;
    avatar: string;
    aiHint: string;
  };
  details: {
    label: string;
    value: string;
    icon: React.ElementType;
  }[];
}

const today = new Date();
const monthStart = startOfMonth(today);

const events: CalendarEvent[] = [
  { 
    date: addDays(monthStart, 2), 
    type: 'vencimiento', 
    title: 'Vence licencia de Kendy A. Qualey', 
    description: 'La licencia de Inspector AVSEC está a punto de expirar. Se requiere acción inmediata para iniciar el proceso de renovación.',
    person: { name: 'Kendy A. Qualey', position: 'Inspector AVSEC', department: 'Seguridad Rampa', avatar: 'https://placehold.co/100x100.png', aiHint: 'man portrait' },
    details: [
      { label: 'Licencia', value: 'AVSEC #12345', icon: FileText },
      { label: 'Antigüedad', value: '5 años', icon: Clock },
    ]
  },
  { 
    date: addDays(monthStart, 2), 
    type: 'renovacion', 
    title: 'Renovación de María Rodriguez', 
    description: 'Programada la renovación anual del certificado K-9. Asegurar que toda la documentación esté en orden.',
    person: { name: 'María Rodriguez', position: 'Manejador K-9', department: 'Unidad Canina', avatar: 'https://placehold.co/100x100.png', aiHint: 'woman portrait' },
    details: [
      { label: 'Certificado', value: 'K-9 #C-6789', icon: FileText },
      { label: 'Próxima Eval.', value: '15/08/2024', icon: CalendarIcon },
    ]
  },
  { 
    date: addDays(monthStart, 7), 
    type: 'licencia', 
    title: 'Inicio licencia médica Carlos Sanchez', 
    description: 'Licencia por 15 días hábiles. Coordinar reemplazo y seguimiento.',
    person: { name: 'Carlos Sanchez', position: 'Supervisor de Turno', department: 'Operaciones', avatar: 'https://placehold.co/100x100.png', aiHint: 'person face' },
    details: [
        { label: 'Tipo', value: 'Médica', icon: Briefcase },
        { label: 'Duración', value: '15 días', icon: Clock },
    ]
  },
  { 
    date: addDays(monthStart, 11), 
    type: 'vencimiento', 
    title: 'Vence carnet de aeropuerto de Luisa', 
    description: 'El carnet de acceso al aeropuerto MDPC está por vencer. Debe ser renovado para evitar interrupciones.',
    person: { name: 'Luisa Fernandez', position: 'Agente de Rampa', department: 'Servicios en Tierra', avatar: 'https://placehold.co/100x100.png', aiHint: 'woman face smiling' },
    details: [
        { label: 'Carnet', value: 'AERODOM #9876', icon: FileText },
        { label: 'Aeropuerto', value: 'MDPC', icon: CalendarIcon },
    ]
  },
  { 
    date: addDays(monthStart, 14), 
    type: 'cancelado', 
    title: 'Licencia cancelada de Pedro Gomez', 
    description: 'Cancelación por no completar el proceso de renovación a tiempo. Notificar a RRHH.',
    person: { name: 'Pedro Gomez', position: 'Inspector AVSEC', department: 'Seguridad Perimetral', avatar: 'https://placehold.co/100x100.png', aiHint: 'serious man' },
    details: [
        { label: 'Licencia', value: 'AVSEC #54321', icon: FileText },
        { label: 'Motivo', value: 'No renovación', icon: ShieldAlert },
    ]
  },
  {
    date: addDays(monthStart, 5),
    type: 'renovacion',
    title: 'Renovación Certificado Mercancías Peligrosas',
    description: 'Renovación del certificado de Ana Torres. Documentación pendiente de revisión.',
    person: { name: 'Ana Torres', position: 'Agente de Carga', department: 'Carga Aérea', avatar: 'https://placehold.co/100x100.png', aiHint: 'woman professional' },
    details: [
      { label: 'Certificado', value: 'DG-11223', icon: FileText },
      { label: 'Vence', value: '25/07/2024', icon: CalendarIcon },
    ]
  },
  {
    date: addDays(monthStart, 18),
    type: 'licencia',
    title: 'Licencia de Paternidad - Ricardo Solis',
    description: 'Ricardo Solis iniciará su licencia de paternidad por 10 días.',
    person: { name: 'Ricardo Solis', position: 'Técnico de Mantenimiento', department: 'Mantenimiento', avatar: 'https://placehold.co/100x100.png', aiHint: 'man smiling' },
    details: [
      { label: 'Tipo', value: 'Paternidad', icon: Briefcase },
      { label: 'Duración', value: '10 días', icon: Clock },
    ]
  },
  {
    date: addDays(monthStart, 22),
    type: 'vencimiento',
    title: 'Vencimiento de Tarjeta de Identificación',
    description: 'La TIDC de Sofía Castro está por vencer. Debe solicitar una nueva.',
    person: { name: 'Sofía Castro', position: 'Asistente Administrativa', department: 'Recursos Humanos', avatar: 'https://placehold.co/100x100.png', aiHint: 'professional woman' },
    details: [
      { label: 'TIDC', value: '#55443', icon: FileText },
      { label: 'Aeropuerto', value: 'MDSD', icon: CalendarIcon },
    ]
  },
  {
    date: addDays(monthStart, 22),
    type: 'vencimiento',
    title: 'Vencimiento de Pase de Vehículo',
    description: 'El pase vehicular de David Luna necesita ser renovado para acceder a zonas restringidas.',
    person: { name: 'David Luna', position: 'Logística', department: 'Operaciones', avatar: 'https://placehold.co/100x100.png', aiHint: 'man face professional' },
    details: [
      { label: 'Pase', value: 'VEH-9988', icon: FileText },
      { label: 'Zona', value: 'Rampa y Carga', icon: ShieldAlert },
    ]
  },
  {
    date: addDays(monthStart, 25),
    type: 'cancelado',
    title: 'Cancelación de Curso',
    description: 'Se cancela el curso de actualización AVSEC por falta de quórum. Notificar a los inscritos.',
    person: { name: 'Elena Rojas', position: 'Coordinadora de Capacitación', department: 'Recursos Humanos', avatar: 'https://placehold.co/100x100.png', aiHint: 'woman portrait professional' },
    details: [
      { label: 'Curso', value: 'AVSEC-UPDATE-Q3', icon: FileText },
      { label: 'Motivo', value: 'Baja inscripción', icon: ShieldAlert },
    ]
  }
];

const eventTypes = {
  vencimiento: { label: 'Vencimientos', color: 'bg-destructive', icon: CalendarX, borderColor: 'border-destructive' },
  renovacion: { label: 'Renovaciones', color: 'bg-primary', icon: Repeat, borderColor: 'border-primary' },
  licencia: { label: 'Licencias Médicas', color: 'bg-accent', icon: Briefcase, borderColor: 'border-accent' },
  cancelado: { label: 'Cancelados', color: 'bg-muted-foreground', icon: ShieldAlert, borderColor: 'border-muted-foreground' },
};

const TravelGoLogo = () => (
    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-1">
        <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/20">
            <PlaneTakeoff className="h-7 w-7 text-white" />
        </div>
    </div>
);

export default function CalendarioPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(Object.keys(eventTypes) as EventType[]));
  
  useEffect(() => {
    setDate(new Date());
  }, []);

  const handleFilterChange = (type: EventType, checked: boolean) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(type);
      } else {
        next.delete(type);
      }
      return next;
    });
  };

  const filteredEvents = useMemo(() => events.filter(event => activeFilters.has(event.type)), [activeFilters]);

  const modifiers = useMemo(() => {
    return Object.keys(eventTypes).reduce((acc, key) => {
      acc[key] = filteredEvents.filter(e => e.type === key).map(e => e.date);
      return acc;
    }, {} as Record<string, Date[]>);
  }, [filteredEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!date) return [];
    return filteredEvents.filter(event => event.date.toDateString() === date.toDateString());
  }, [date, filteredEvents]);
  
  const handlePrintSummary = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const summaryHtml = `
        <html>
          <head>
            <title>Resumen de Eventos</title>
            <style>
              body { font-family: 'Poppins', sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { text-align: center; color: #333; }
              @media print {
                @page { size: A4 landscape; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <h1>Resumen de Eventos del Calendario</h1>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Persona</th>
                  <th>Departamento</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                ${events.map(event => `
                  <tr>
                    <td>${event.date.toLocaleDateString('es-ES')}</td>
                    <td>${eventTypes[event.type].label}</td>
                    <td>${event.title}</td>
                    <td>${event.person.name}</td>
                    <td>${event.person.department}</td>
                    <td>${event.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `;
      printWindow.document.write(summaryHtml);
      printWindow.document.close();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Calendario de Eventos</h1>
          <p className="mt-1 text-muted-foreground">Visualice y gestione los vencimientos, renovaciones y licencias.</p>
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
                    <Button onClick={handlePrintSummary} className="bg-white/90 text-orange-600 hover:bg-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200">
                        Imprimir resumen <Printer className="ml-2 h-4 w-4" />
                    </Button>
              </div>
          </CardHeader>
      </Card>
      
      <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
          {/* Left Column: Calendar and Filters */}
          <div className="lg:col-span-1 border-r border-border flex flex-col bg-muted/20">
            <div className="p-4 flex flex-col items-stretch gap-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={es}
                    className="p-4 border rounded-2xl shadow-inner bg-background"
                    modifiers={modifiers}
                    modifiersClassNames={{
                        vencimiento: 'day-vencimiento',
                        renovacion: 'day-renovacion',
                        licencia: 'day-licencia',
                        cancelado: 'day-cancelado',
                    }}
                />
                 <Button variant="outline" onClick={() => setDate(new Date())}>Hoy</Button>
            </div>
            
            <Separator />

            <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold mb-4">Filtros de Eventos</h3>
                <div className="space-y-3">
                    {Object.entries(eventTypes).map(([key, { label, color, icon: Icon }]) => (
                        <div key={key} className="flex items-center space-x-3 transition-all hover:bg-muted p-2 rounded-lg">
                            <Checkbox 
                                id={key} 
                                checked={activeFilters.has(key as EventType)}
                                onCheckedChange={(checked) => handleFilterChange(key as EventType, Boolean(checked))}
                                className="data-[state=checked]:bg-primary"
                            />
                            <div className={cn("w-4 h-4 rounded-full", color)}></div>
                            <Label htmlFor={key} className="flex-1 cursor-pointer">{label}</Label>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            </div>
          </div>
          
          {/* Right Column: Event List */}
          <div className="lg:col-span-1 p-6">
            <h3 className="text-xl font-semibold mb-6">
                Eventos para: <span className="text-primary">{date ? es.localize?.day(date.getDay()) : ''} {date?.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}</span>
            </h3>
            <ScrollArea className="h-[600px] pr-4 -mr-4">
                {selectedDayEvents.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {selectedDayEvents.map((event, index) => {
                            const eventTypeInfo = eventTypes[event.type];
                            return (
                                <Card key={index} className={cn("shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out flex flex-col border-t-4", eventTypeInfo.borderColor)}>
                                    <CardHeader className="flex flex-row items-start gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-border">
                                            <AvatarImage src={event.person.avatar} alt={event.person.name} data-ai-hint={event.person.aiHint} />
                                            <AvatarFallback>{event.person.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">{event.person.name}</CardTitle>
                                                <Badge variant={event.type === 'vencimiento' ? 'destructive' : 'secondary'} className={cn(eventTypeInfo.color, "text-white")}>
                                                    <eventTypeInfo.icon className="h-3 w-3 mr-1.5" />
                                                    {eventTypeInfo.label}
                                                </Badge>
                                            </div>
                                            <CardDescription>{event.person.position} - {event.person.department}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-grow">
                                        <p className="font-semibold text-lg leading-tight">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                        <Separator />
                                        <div className="space-y-2 text-sm">
                                            {event.details.map(detail => (
                                                <div key={detail.label} className="flex items-center gap-2 text-muted-foreground">
                                                    <detail.icon className="h-4 w-4" />
                                                    <span className="font-medium text-foreground">{detail.label}:</span>
                                                    <span>{detail.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <div className="p-4 pt-2">
                                         <Button className="w-full">Gestionar <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-24">
                        <CalendarX className="h-16 w-16 mb-4 text-primary/30" />
                        <p className="font-semibold text-xl">Sin eventos programados</p>
                        <p className="text-sm">Seleccione otro día o ajuste los filtros.</p>
                    </div>
                )}
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  );
}
