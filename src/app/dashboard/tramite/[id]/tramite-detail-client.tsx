
"use client";

import React, { Suspense, useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ChevronDown,
  ArrowLeft,
  HeartPulse,
  Landmark,
  FlaskConical,
  BrainCircuit,
  School,
  BookOpenCheck,
  Brain,
  Upload,
  XCircle,
  PlusCircle,
  File,
  CalendarIcon,
  Save,
  Minus,
  Activity,
  User,
  CheckCircle,
  RotateCw,
  KeyRound,
  Eye,
  Clock,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, notFound, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FlightProgress } from "@/components/ui/flight-progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTramitesData } from "../../mantenimiento/data";

// Mock data, can be moved later
const medicalEvaluationItems = {
    left: [
        'Oftalmología',
        'Audiometría',
        'Hemograma',
        'Glicemia',
        'Creatinina',
        'Urea',
        'VDRL',
    ],
    right: [
        'HVC',
        'Orina',
        'HBSAG',
    ]
};

const evaluationOptions = [
    { value: 'aprobada', label: 'Aprobada', color: 'text-green-600 dark:text-green-500' },
    { value: 'repetir', label: 'Repetir', color: 'text-red-600 dark:text-red-500' },
    { value: 'na', label: 'N/A', color: 'text-gray-500 dark:text-gray-400' },
];

const categoriesToIssue = [
    'GERENTE AVSEC',
    'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL',
    'INSTRUCTOR AVSEC',
    'MANEJADOR K-9',
    'SUPERVISOR AVSEC'
];

const mockPersonalList = [
    { cedula: "402-3659120-8", nombre: "WILKENIA EDOUARD FILMONOR", compania: "LONGPORT AVIATION", edad: 29, nacionalidad: "Dominicana" },
    { cedula: "001-1234567-1", nombre: "JUAN CARLOS PEREZ", compania: "LONGPORT AVIATION", edad: 35, nacionalidad: "Dominicana" },
    { cedula: "002-8765432-2", nombre: "MARIA GOMEZ", compania: "LONGPORT AVIATION", edad: 28, nacionalidad: "Venezolana" },
];


const EvaluationItem = ({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) => {
    return (
        <div className="space-y-3 transition-all duration-300">
            <p className="font-semibold text-primary">{name}*</p>
            <RadioGroup 
                value={value} 
                onValueChange={onChange} 
                className="flex items-center gap-x-4 gap-y-2 flex-wrap"
            >
                {evaluationOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2 group">
                        <RadioGroupItem 
                            value={option.value} 
                            id={`${name.replace(/\s+/g, '-')}-${option.value}`}
                            className={cn(
                                'border-muted-foreground/50 transition-colors',
                                value === option.value && `border-2 ${option.color.replace('text-', 'border-')}`
                            )}
                        />
                        <Label 
                            htmlFor={`${name.replace(/\s+/g, '-')}-${option.value}`}
                            className={cn(
                                "font-normal cursor-pointer transition-colors text-muted-foreground group-hover:text-foreground",
                                value === option.value && `${option.color} font-medium`
                            )}
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};


const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 p-2 flex items-center gap-2 border-l-4 border-orange-500 rounded-r-md">
        <h3 className="font-bold text-sm uppercase">{title}</h3>
    </div>
);

const tabs = [
    { name: "Cuerpo Médico", value: "cuerpo-médico", icon: HeartPulse },
    { name: "Financiera", value: "financiera", icon: Landmark },
    { name: "Dopage", value: "dopage", icon: FlaskConical },
    { name: "Inteligencia", value: "inteligencia", icon: BrainCircuit },
    { name: "Escuela - ESAC", value: "escuela", icon: School },
    { name: "Practico Teórico", value: "practico-teorico", icon: BookOpenCheck },
    { name: "Psicología", value: "psicologia", icon: Brain },
];

const SchedulingModal = ({ isOpen, onOpenChange, onSchedule }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSchedule: (details: any) => void; }) => {
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState('09:16');
    const [femeninas, setFemeninas] = useState('25');
    const [masculino, setMasculino] = useState('52');
    const [aula, setAula] = useState('A-12');
    const [pruebas, setPruebas] = useState({ practico: true, psicologica: false });
    const [notificar, setNotificar] = useState({ empresa: false, personal: false, instructor: false });

    const handleSchedule = () => {
        if (!date || !time || !aula) {
            toast({
                variant: "destructive",
                title: "Campos incompletos",
                description: "Por favor, complete todos los campos requeridos.",
            });
            return;
        }
        const details = {
            date,
            time,
            femeninas: parseInt(femeninas) || 0,
            masculino: parseInt(masculino) || 0,
            aula,
            pruebas
        };

        toast({
            title: "Evaluación Programada",
            description: `Se ha programado la evaluación para el ${format(date, "PPP", { locale: es })} a las ${time}.`,
        });
        onSchedule(details);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-7xl p-0 shadow-2xl rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 text-foreground">
                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr_280px]">
                    {/* Left Column: Calendar */}
                    <div className="p-6 bg-blue-100/60 dark:bg-blue-950/30 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <CalendarIcon className="h-7 w-7 text-primary" />
                            <div>
                                <DialogTitle className="text-xl">Programar Personal Práctico Teórico</DialogTitle>
                                <DialogDescription>Seleccione una fecha y hora para las evaluaciones Psicológicas / Teóricas.</DialogDescription>
                            </div>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="p-0 border-none shadow-none"
                                locale={es}
                                disabled={(date) => date < new Date()}
                            />
                        </div>
                    </div>

                    {/* Middle Column: Details */}
                    <div className="p-8 space-y-8">
                        <div>
                            <Label className="text-sm font-semibold">Hora de la Evaluación*</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="text-lg"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm font-semibold">Cantidad Femeninas</Label>
                                <div className="flex items-center gap-3 mt-2">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                    <Input id="femeninas" type="number" min="0" value={femeninas} onChange={(e) => setFemeninas(e.target.value)} className="text-lg"/>
                                </div>
                            </div>
                             <div>
                                <Label className="text-sm font-semibold">Cantidad Masculino</Label>
                                <div className="flex items-center gap-3 mt-2">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                    <Input id="masculino" type="number" min="0" value={masculino} onChange={(e) => setMasculino(e.target.value)} className="text-lg"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold">Aula Asignada*</Label>
                             <Input id="aula" value={aula} onChange={(e) => setAula(e.target.value)} className="mt-2 text-lg"/>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold mb-2 block">Pruebas</Label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="practico-teorico-check" checked={pruebas.practico} onCheckedChange={(checked) => setPruebas(p => ({...p, practico: !!checked}))}/>
                                    <Label htmlFor="practico-teorico-check" className="font-normal text-base">Practico teórico</Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="psicologica-check" checked={pruebas.psicologica} onCheckedChange={(checked) => setPruebas(p => ({...p, psicologica: !!checked}))}/>
                                    <Label htmlFor="psicologica-check" className="font-normal text-base">Psicológica</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Notifications */}
                    <div className="p-8 bg-slate-200/50 dark:bg-slate-800/40 border-l border-border/50">
                        <h3 className="font-semibold mb-6">Notificar</h3>
                        <div className="space-y-6">
                             <div className="flex items-center gap-4">
                                <Checkbox id="notificar-empresa" checked={notificar.empresa} onCheckedChange={(checked) => setNotificar(p => ({...p, empresa: !!checked}))}/>
                                <div className="w-full">
                                    <Label htmlFor="select-empresa">Empresa</Label>
                                    <Select disabled={!notificar.empresa}><SelectTrigger id="select-empresa"><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent><SelectItem value="1">TrackAviation</SelectItem></SelectContent></Select>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <Checkbox id="notificar-personal" checked={notificar.personal} onCheckedChange={(checked) => setNotificar(p => ({...p, personal: !!checked}))}/>
                                <div className="w-full">
                                    <Label htmlFor="select-personal">Personal</Label>
                                    <Select disabled={!notificar.personal}><SelectTrigger id="select-personal"><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent><SelectItem value="1">WILKENIA EDOUARD FILMONOR</SelectItem></SelectContent></Select>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Checkbox id="notificar-instructor" checked={notificar.instructor} onCheckedChange={(checked) => setNotificar(p => ({...p, instructor: !!checked}))}/>
                                <div className="w-full">
                                    <Label htmlFor="select-instructor">Instructor</Label>
                                    <Select disabled={!notificar.instructor}><SelectTrigger id="select-instructor"><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent><SelectItem value="1">Kendy A. Qualey</SelectItem></SelectContent></Select>
                                </div>
                            </div>
                        </div>

                         <div className="flex justify-end items-center gap-2 mt-20">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button onClick={handleSchedule} className="shadow-lg">Programar Evaluación</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const AppointmentInfoCard = ({ details, onReprogram }: { details: any, onReprogram: () => void }) => {
    if (!details) return null;
    const totalAttendees = (details.femeninas || 0) + (details.masculino || 0);

    return (
        <Card className="animate-in fade-in-50 bg-card shadow-lg border">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-primary">
                    <CalendarIcon className="h-5 w-5" />
                    Cita Programada
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 pt-2">
                <div className="flex justify-between">
                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Fecha:</span> {format(details.date, "PPP", { locale: es })}</p>
                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Hora:</span> {details.time}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Aula:</span> {details.aula}</p>
                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Asistentes:</span> {totalAttendees} ({details.femeninas} F, {details.masculino} M)</p>
                </div>
                 {details.pruebas && (
                    <div>
                        <p className="font-semibold text-foreground">Pruebas:</p>
                        <div className="flex gap-2 pl-2 flex-wrap">
                            {details.pruebas.practico && <Badge variant="outline">Práctico Teórico</Badge>}
                            {details.pruebas.psicologica && <Badge variant="outline">Psicológica</Badge>}
                        </div>
                    </div>
                )}
                 <Button variant="destructive" onClick={onReprogram} className="w-full mt-2">
                    <Activity className="mr-2 h-4 w-4" />
                    Reprogramar Cita
                </Button>
            </CardContent>
        </Card>
    );
};


const MedicalForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const [evaluationStatus, setEvaluationStatus] = useState<{ [key: string]: string }>({
        'Oftalmología': 'aprobada',
        'Audiometría': 'aprobada',
    });

    const handleEvaluationChange = (name: string, value: string) => {
        setEvaluationStatus(prev => ({ ...prev, [name]: prev[name] === value ? "" : value }));
    };

    return (
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-6">
                <fieldset disabled={isLocked}>
                    <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                        <SectionHeader title="Evaluaciones" />
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                <Clock className="h-4 w-4" />
                                <span>Tiempo restante: 10 días</span>
                            </div>
                            {!isLocked && (
                                <div className="flex gap-2">
                                    <Button variant="outline">Crear hallazgo</Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button>Acciones <ChevronDown className="ml-2 h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onSelect={onSave}>Guardar</DropdownMenuItem>
                                            <DropdownMenuItem>Aprobar</DropdownMenuItem>
                                            <DropdownMenuItem>Rechazar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-8">
                            {medicalEvaluationItems.left.map(name => (
                                <EvaluationItem
                                    key={name}
                                    name={name}
                                    value={evaluationStatus[name]}
                                    onChange={(value) => handleEvaluationChange(name, value)}
                                />
                            ))}
                        </div>
                        <div className="space-y-8">
                            {medicalEvaluationItems.right.map(name => (
                                <EvaluationItem
                                    key={name}
                                    name={name}
                                    value={evaluationStatus[name]}
                                    onChange={(value) => handleEvaluationChange(name, value)}
                                />
                            ))}
                            <div className="space-y-2">
                                <Label htmlFor="recomendaciones">Recomendaciones</Label>
                                <Textarea id="recomendaciones" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>Condición médica*</Label>
                                <RadioGroup defaultValue="apto" className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="apto" id="apto" />
                                        <Label htmlFor="apto" className="font-normal">Apto</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no-apto" id="no-apto" />
                                        <Label htmlFor="no-apto" className="font-normal">No Apto</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="apto-lentes" id="apto-lentes" />
                                        <Label htmlFor="apto-lentes" className="font-normal">Apto con uso de lente correctivo</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medico-evaluador">Médico evaluador*</Label>
                                <Input id="medico-evaluador" defaultValue="Dr. Artiles" />
                            </div>
                        </div>
                    </div>
                </fieldset>
                {isLocked && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="destructive" onClick={onRehabilitate}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Rehabilitar Tarea
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const FinancialForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const [paymentMade, setPaymentMade] = useState<string | undefined>("si");
    const [paymentMethod, setPaymentMethod] = useState<string | undefined>("transferencia");
    const [paymentStatus, setPaymentStatus] = useState<string | undefined>("aprobado");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleCancelFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const createRadioHandler = (setter: React.Dispatch<React.SetStateAction<string | undefined>>, currentValue: string | undefined) => (newValue: string) => {
        setter(currentValue === newValue ? undefined : newValue);
    };

    return (
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-6">
                <fieldset disabled={isLocked}>
                    <div className="space-y-8">
                        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                            <SectionHeader title="Verificación de pago" />
                            <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                <Clock className="h-4 w-4" />
                                <span>Tiempo restante: 10 días</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <Label className="font-semibold text-primary">Pago realizado?*</Label>
                                <RadioGroup value={paymentMade} onValueChange={createRadioHandler(setPaymentMade, paymentMade)} className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="si" id="pago-si" /><Label htmlFor="pago-si" className="font-normal">Si</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="pago-no" /><Label htmlFor="pago-no" className="font-normal">No</Label></div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-semibold text-primary">Forma de pago*</Label>
                                <RadioGroup value={paymentMethod} onValueChange={createRadioHandler(setPaymentMethod, paymentMethod)} className="flex flex-col space-y-2">
                                    {['Cheque', 'Depósito', 'Efectivo', 'Transferencia'].map(method => (
                                         <div key={method} className="flex items-center space-x-2">
                                            <RadioGroupItem value={method.toLowerCase()} id={`pago-${method.toLowerCase()}`} />
                                            <Label htmlFor={`pago-${method.toLowerCase()}`} className="font-normal">{method}</Label>
                                         </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            <div className="space-y-3">
                                 <Label className="font-semibold text-primary">Estado del pago*</Label>
                                <RadioGroup value={paymentStatus} onValueChange={createRadioHandler(setPaymentStatus, paymentStatus)} className="flex flex-col space-y-2">
                                    {['Aprobado', 'Rechazado', 'Pendiente'].map(status => (
                                         <div key={status} className="flex items-center space-x-2">
                                            <RadioGroupItem value={status.toLowerCase()} id={`status-${status.toLowerCase()}`} />
                                            <Label htmlFor={`status-${status.toLowerCase()}`} className="font-normal">{status}</Label>
                                         </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <Label className="font-semibold text-primary">Certificación de pago*</Label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" onClick={() => fileInputRef.current?.click()}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Seleccionar documento
                                        </Button>
                                        <Input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                        />
                                        <Button type="button" variant="secondary" disabled={!selectedFile}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Cargar
                                        </Button>
                                         <Button type="button" variant="ghost" onClick={handleCancelFile} disabled={!selectedFile} className="text-destructive hover:text-destructive">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Cancelar
                                        </Button>
                                    </div>
                                    {selectedFile && (
                                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-sm animate-in fade-in-50">
                                            <File className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{selectedFile.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="observaciones-pago" className="font-semibold text-primary">Observaciones verificación de pago</Label>
                                <Textarea id="observaciones-pago" rows={4} />
                            </div>
                        </div>

                        {!isLocked && (
                             <div className="flex justify-end pt-4">
                                <Button onClick={onSave}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar
                                </Button>
                            </div>
                        )}
                    </div>
                </fieldset>
                 {isLocked && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="destructive" onClick={onRehabilitate}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Rehabilitar Tarea
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const DopageForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const [resultado, setResultado] = useState<string | undefined>();
    const [fecha, setFecha] = useState<Date | undefined>();
    const [condicion, setCondicion] = useState<string | undefined>();
    const [evidenciaFile, setEvidenciaFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setEvidenciaFile(event.target.files[0]);
        }
    };

    const handleCancelFile = () => {
        setEvidenciaFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const createRadioHandler = (setter: React.Dispatch<React.SetStateAction<string | undefined>>, currentValue: string | undefined) => (newValue: string) => {
        setter(currentValue === newValue ? undefined : newValue);
    };

    return (
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-6">
                <fieldset disabled={isLocked}>
                    <div className="space-y-8">
                        {/* Evaluaciones Section */}
                        <div className="space-y-4">
                            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                                <SectionHeader title="Evaluaciones" />
                                <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                    <Clock className="h-4 w-4" />
                                    <span>Tiempo restante: 10 días</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-primary">Resultado dopaje*</Label>
                                        <RadioGroup value={resultado} onValueChange={createRadioHandler(setResultado, resultado)} className="flex items-center space-x-4 pt-1">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="negativo" id="dopaje-negativo" /><Label htmlFor="dopaje-negativo" className="font-normal">Negativo</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-primary">Fecha del dopaje*</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fecha && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {fecha ? format(fecha, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={fecha} onSelect={setFecha} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-primary">Condición dopaje*</Label>
                                        <RadioGroup value={condicion} onValueChange={createRadioHandler(setCondicion, condicion)} className="flex items-center space-x-4 pt-1">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="apto" id="condicion-apto" /><Label htmlFor="condicion-apto" className="font-normal">Apto</Label></div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-semibold text-primary">Cargar Evidencias</Label>
                                    <div className="flex flex-col items-start gap-3 p-4 border rounded-md bg-muted/30">
                                         <div className="flex flex-wrap gap-2">
                                            <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Seleccionar...
                                            </Button>
                                            <Input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.png"
                                            />
                                             <Button type="button" size="sm" variant="secondary" disabled={!evidenciaFile}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Cargar
                                            </Button>
                                        </div>
                                        {evidenciaFile && (
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-background text-sm animate-in fade-in-50 w-full">
                                                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground truncate flex-1">{evidenciaFile.name}</span>
                                                <Button type="button" variant="ghost" size="icon" onClick={handleCancelFile} className="h-6 w-6 text-destructive hover:text-destructive">
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Observaciones Section */}
                        <div className="space-y-4">
                            <SectionHeader title="Observaciones" />
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="observaciones-dopaje">Observaciones dopaje</Label>
                                <Textarea id="observaciones-dopaje" rows={4} placeholder="Añada sus observaciones aquí..." />
                            </div>
                        </div>
                        {!isLocked && (
                            <div className="flex justify-end pt-4">
                                <Button onClick={onSave}><Save className="mr-2 h-4 w-4" />Guardar</Button>
                            </div>
                        )}
                    </div>
                </fieldset>
                {isLocked && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="destructive" onClick={onRehabilitate}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Rehabilitar Tarea
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const IntelligenceForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const [depuracion, setDepuracion] = useState<string | undefined>('negativo');
    const [condicion, setCondicion] = useState<string | undefined>('apto');
    const [evidenciaFile, setEvidenciaFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setEvidenciaFile(event.target.files[0]);
        }
    };

    const handleCancelFile = () => {
        setEvidenciaFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const createRadioHandler = (setter: React.Dispatch<React.SetStateAction<string | undefined>>, currentValue: string | undefined) => (newValue: string) => {
        setter(currentValue === newValue ? undefined : newValue);
    };

    return (
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-6">
                <fieldset disabled={isLocked}>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                                <SectionHeader title="Evaluaciones" />
                                <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                    <Clock className="h-4 w-4" />
                                    <span>Tiempo restante: 10 días</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-primary">Resultado depuración*</Label>
                                        <RadioGroup value={depuracion} onValueChange={createRadioHandler(setDepuracion, depuracion)} className="flex items-center space-x-4 pt-1">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="negativo" id="depuracion-negativo" /><Label htmlFor="depuracion-negativo" className="font-normal">Negativo</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-primary">Condición antecedentes*</Label>
                                        <RadioGroup value={condicion} onValueChange={createRadioHandler(setCondicion, condicion)} className="flex items-center space-x-4 pt-1">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="apto" id="antecedentes-apto" /><Label htmlFor="antecedentes-apto" className="font-normal">Apto</Label></div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-semibold text-primary">Cargar Evidencias</Label>
                                    <div className="flex flex-col items-start gap-3 p-4 border rounded-md bg-muted/30">
                                         <div className="flex flex-wrap gap-2">
                                            <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Seleccionar...
                                            </Button>
                                            <Input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.png"
                                            />
                                             <Button type="button" size="sm" variant="secondary" disabled={!evidenciaFile}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Cargar
                                            </Button>
                                        </div>
                                        {evidenciaFile && (
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-background text-sm animate-in fade-in-50 w-full">
                                                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground truncate flex-1">{evidenciaFile.name}</span>
                                                <Button type="button" variant="ghost" size="icon" onClick={handleCancelFile} className="h-6 w-6 text-destructive hover:text-destructive">
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="observaciones-inteligencia">Observaciones verificación antecedentes*</Label>
                                <Textarea id="observaciones-inteligencia" rows={4} placeholder="Añada sus observaciones aquí..." />
                            </div>
                        </div>

                         {!isLocked && (
                            <div className="flex justify-end pt-4">
                                <Button onClick={onSave}><Save className="mr-2 h-4 w-4" />Guardar</Button>
                            </div>
                        )}
                    </div>
                </fieldset>
                {isLocked && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="destructive" onClick={onRehabilitate}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Rehabilitar Tarea
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const AssignGradesModal = ({ isOpen, onOpenChange, onSave }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSave: () => void; }) => {
    const mockPersonnel = [
        { id: 1, name: "WILKENIA EDOUARD FILMONOR", cedula: "402-3659120-8" },
        { id: 2, name: "JUAN CARLOS MARTÍNEZ", cedula: "002-1234567-8" },
        { id: 3, name: "ANA SOFÍA GÓMEZ", cedula: "003-8765432-1" },
    ];
    const [grades, setGrades] = useState<{ [key: number]: { teorico: string, practico: string } }>({});

    const handleGradeChange = (id: number, type: 'teorico' | 'practico', value: string) => {
        setGrades(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [type]: value,
            }
        }));
    };
    
    const handleSaveGrades = () => {
        onSave();
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Asignar Calificaciones de Entrenamiento</DialogTitle>
                    <DialogDescription>
                        Ingrese las calificaciones para cada participante.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Personal</TableHead>
                                <TableHead className="w-[150px]">Teórico</TableHead>
                                <TableHead className="w-[150px]">Práctico</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPersonnel.map(person => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <p className="font-semibold">{person.name}</p>
                                        <p className="text-xs text-muted-foreground">{person.cedula}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" placeholder="Nota" value={grades[person.id]?.teorico || ''} onChange={(e) => handleGradeChange(person.id, 'teorico', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" placeholder="Nota" value={grades[person.id]?.practico || ''} onChange={(e) => handleGradeChange(person.id, 'practico', e.target.value)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSaveGrades}><Save className="mr-2 h-4 w-4" />Guardar Calificaciones</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SchoolForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const { toast } = useToast();
    const [fechaInicio, setFechaInicio] = useState<Date | undefined>();
    const [fechaFin, setFechaFin] = useState<Date | undefined>();
    const [resultado, setResultado] = useState<string | undefined>();
    const [reporteFile, setReporteFile] = useState<File | null>(null);
    const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setReporteFile(event.target.files[0]);
        }
    };

    const handleCancelFile = () => {
        setReporteFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const createRadioHandler = (setter: React.Dispatch<React.SetStateAction<string | undefined>>, currentValue: string | undefined) => (newValue: string) => {
        setter(currentValue === newValue ? undefined : newValue);
    };
    
    const handleSaveGrades = () => {
        toast({ title: "Calificaciones Guardadas", description: "Las notas han sido registradas exitosamente." });
    };

    return (
        <>
            <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
                <CardContent className="p-6">
                    <fieldset disabled={isLocked}>
                        <div className="space-y-8">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <SectionHeader title="Reporte entrenamiento" />
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                        <Clock className="h-4 w-4" />
                                        <span>Tiempo restante: 10 días</span>
                                    </div>
                                    {!isLocked && (
                                    <Button onClick={onSave}><Save className="mr-2 h-4 w-4" />Guardar</Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="font-semibold text-primary">Fecha inicio entrenamiento*</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaInicio && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={fechaInicio} onSelect={setFechaInicio} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-semibold text-primary">Fecha fin entrenamiento*</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaFin && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {fechaFin ? format(fechaFin, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={fechaFin} onSelect={setFechaFin} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-semibold text-primary">Resultado entrenamiento*</Label>
                                    <RadioGroup value={resultado} onValueChange={createRadioHandler(setResultado, resultado)} className="flex items-center space-x-4 pt-1">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="aprobado" id="res-aprobado" /><Label htmlFor="res-aprobado" className="font-normal">Aprobado</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="reprobado" id="res-reprobado" /><Label htmlFor="res-reprobado" className="font-normal">Reprobado</Label></div>
                                    </RadioGroup>
                                </div>
                                
                                <div className="flex items-end">
                                    <Button variant="outline" onClick={() => setIsGradesModalOpen(true)}>
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Asignar Calificaciones
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="font-semibold text-primary">Reporte de calificaciones ESAC*</Label>
                                    <div className="flex flex-col items-start gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="button" onClick={() => fileInputRef.current?.click()}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Seleccionar documento
                                            </Button>
                                            <Input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.png"
                                            />
                                            <Button type="button" variant="secondary" disabled={!reporteFile}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Cargar
                                            </Button>
                                            <Button type="button" variant="ghost" onClick={handleCancelFile} disabled={!reporteFile} className="text-destructive hover:text-destructive">
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Cancelar
                                            </Button>
                                        </div>
                                        {reporteFile && (
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-sm animate-in fade-in-50 w-full">
                                                <File className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground truncate">{reporteFile.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observaciones-entrenamiento" className="font-semibold text-primary">Observaciones entrenamiento</Label>
                                    <Textarea id="observaciones-entrenamiento" rows={4} />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    {isLocked && (
                        <div className="mt-6 flex justify-end">
                            <Button variant="destructive" onClick={onRehabilitate}>
                                <RotateCw className="mr-2 h-4 w-4" />
                                Rehabilitar Tarea
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <AssignGradesModal isOpen={isGradesModalOpen} onOpenChange={setIsGradesModalOpen} onSave={handleSaveGrades} />
        </>
    );
};


const PracticalTheoreticalForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const [evaluations, setEvaluations] = useState({
        inicialTeorico: '',
        recapTeorico: '',
        inicialPractico: '',
        recapPractico: '',
    });
    const [observaciones, setObservaciones] = useState('');
    const [evidenciaFile, setEvidenciaFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setEvidenciaFile(event.target.files[0]);
        }
    };

    const handleCancelFile = () => {
        setEvidenciaFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const evaluationFields = [
        { id: 'inicialTeorico', label: 'Evaluación inicial examen teórico*' },
        { id: 'recapTeorico', label: 'Evaluación re-capitulatorio examen teórico*' },
        { id: 'inicialPractico', label: 'Evaluación inicial examen práctico*' },
        { id: 'recapPractico', label: 'Evaluación re-capitulatorio examen práctico*' },
    ];

    return (
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-6">
                <fieldset disabled={isLocked}>
                    <div className="space-y-8">
                        <div className="space-y-4">
                             <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                                <SectionHeader title="Evaluaciones" />
                                <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                    <Clock className="h-4 w-4" />
                                    <span>Tiempo restante: 10 días</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-12 gap-y-6 pt-4">
                                <div className="space-y-6">
                                    {evaluationFields.map(field => (
                                        <div key={field.id} className="space-y-2">
                                            <Label htmlFor={field.id} className="font-semibold text-primary">{field.label}</Label>
                                            <Input
                                                id={field.id}
                                                value={evaluations[field.id as keyof typeof evaluations]}
                                                onChange={(e) => setEvaluations(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                placeholder="Ingrese calificación..."
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <Label className="font-semibold text-primary">Cargar Evidencias</Label>
                                    <div className="flex flex-col items-start gap-3 p-4 border rounded-md bg-muted/30">
                                         <div className="flex flex-wrap gap-2">
                                            <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Seleccionar...
                                            </Button>
                                            <Input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.png"
                                            />
                                             <Button type="button" size="sm" variant="secondary" disabled={!evidenciaFile}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Cargar
                                            </Button>
                                        </div>
                                        {evidenciaFile && (
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-background text-sm animate-in fade-in-50 w-full">
                                                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground truncate flex-1">{evidenciaFile.name}</span>
                                                <Button type="button" variant="ghost" size="icon" onClick={handleCancelFile} className="h-6 w-6 text-destructive hover:text-destructive">
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <SectionHeader title="Observaciones" />
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="observaciones-practico-teorico">Observaciones examen teórico y práctico</Label>
                                <Textarea
                                    id="observaciones-practico-teorico"
                                    rows={4}
                                    placeholder="Añada sus observaciones aquí..."
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                />
                            </div>
                        </div>
                        {!isLocked && (
                            <div className="flex justify-end pt-4">
                                <Button onClick={onSave}><Save className="mr-2 h-4 w-4" />Guardar</Button>
                            </div>
                        )}
                    </div>
                </fieldset>
                {isLocked && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="destructive" onClick={onRehabilitate}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Rehabilitar Tarea
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const PsychologyForm = ({ onSave, isLocked, onRehabilitate }: { onSave: () => void; isLocked: boolean; onRehabilitate: () => void; }) => {
    const [evaluations, setEvaluations] = React.useState({
        entrevista: "",
        sociabilidad: "",
        estabilidad: "",
        escalaZung: "",
        condicion: "",
    });
    const [psicologo, setPsicologo] = React.useState("");
    const [observaciones, setObservaciones] = React.useState("");
    const [evidenciaFile, setEvidenciaFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setEvidenciaFile(event.target.files[0]);
        }
    };
    const handleCancelFile = () => {
        setEvidenciaFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const createRadioHandler = (field: keyof typeof evaluations) => (newValue: string) => {
        setEvaluations(prev => ({
            ...prev,
            [field]: prev[field] === newValue ? "" : newValue,
        }));
    };

    const evaluationFields = [
        { id: "entrevista", label: "Entrevista*", options: ["Normal"] },
        { id: "sociabilidad", label: "Sociabilidad*", options: ["Alto", "Bajo", "Promedio"] },
        { id: "estabilidad", label: "Estabilidad psicológica emocional*", options: ["Alto", "Bajo", "Promedio"] },
        { id: "escalaZung", label: "Escala de Zung*", options: ["Mínima leve", "Moderada", "Normal"] },
        { id: "condicion", label: "Condición psicológica*", options: ["Apto"] },
    ];

    return (
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="p-6">
                <fieldset disabled={isLocked}>
                    <div className="space-y-8">
                         <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                            <SectionHeader title="Evaluaciones" />
                            <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                <Clock className="h-4 w-4" />
                                <span>Tiempo restante: 10 días</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-12 gap-y-8">
                            {/* Left Column for evaluation fields */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                                    {evaluationFields.map(field => (
                                        <div key={field.id} className="space-y-2">
                                            <Label className="font-semibold text-primary">{field.label}</Label>
                                            <RadioGroup value={evaluations[field.id as keyof typeof evaluations]} onValueChange={createRadioHandler(field.id as keyof typeof evaluations)} className="flex flex-col space-y-1 pt-1">
                                                {field.options.map(option => (
                                                    <div key={option} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={option.toLowerCase().replace(/\s+/g, '-')} id={`${field.id}-${option.toLowerCase().replace(/\s+/g, '-')}`} />
                                                        <Label htmlFor={`${field.id}-${option.toLowerCase().replace(/\s+/g, '-')}`} className="font-normal cursor-pointer">{option}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="psicologo" className="font-semibold text-primary">Psicólogo evaluador*</Label>
                                    <Input id="psicologo" value={psicologo} onChange={(e) => setPsicologo(e.target.value)} />
                                </div>
                            </div>

                            {/* Right Column for evidence upload */}
                            <div className="space-y-4">
                                <Label className="font-semibold text-primary">Cargar Evidencias</Label>
                                <div className="flex flex-col items-start gap-3 p-4 border rounded-md bg-muted/30">
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Seleccionar...
                                        </Button>
                                        <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />
                                        <Button type="button" size="sm" variant="secondary" disabled={!evidenciaFile}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Cargar
                                        </Button>
                                    </div>
                                    {evidenciaFile && (
                                        <div className="flex items-center gap-2 p-2 border rounded-md bg-background text-sm animate-in fade-in-50 w-full">
                                            <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-muted-foreground truncate flex-1">{evidenciaFile.name}</span>
                                            <Button type="button" variant="ghost" size="icon" onClick={handleCancelFile} className="h-6 w-6 text-destructive hover:text-destructive">
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <SectionHeader title="Observaciones" />
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="observaciones-psicologia">Observaciones evaluación psicológica</Label>
                                <Textarea id="observaciones-psicologia" rows={4} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Añada sus observaciones aquí..." />
                            </div>
                        </div>

                        {!isLocked && (
                            <div className="flex justify-end pt-4">
                                <Button onClick={onSave}><Save className="mr-2 h-4 w-4" />Guardar</Button>
                            </div>
                        )}
                    </div>
                </fieldset>
                {isLocked && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="destructive" onClick={onRehabilitate}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Rehabilitar Tarea
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const LicensePreview = ({ data, tramitanteData }: { data: any, tramitanteData?: any }) => {
    const issueDate = new Date();
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 2);

    return (
        <div className="font-sans bg-white p-4 rounded-lg shadow-xl aspect-[86/54] w-[339px] h-[213px] flex flex-col text-xs text-black border border-gray-300">
            <div className="bg-[#002f6c] text-white flex items-center p-2 rounded-t-md">
                <img src="https://i.imgur.com/vH5wB8j.png" alt="CESAC Logo" className="h-10 w-10 mr-2" data-ai-hint="logo"/>
                <div className="text-center flex-grow">
                    <p className="font-bold text-[10px] tracking-wider">REPÚBLICA DOMINICANA</p>
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

const LicenseForm = ({ tramitanteData, onCancel }: { tramitanteData: any; onCancel: () => void; }) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [codigoRegistro, setCodigoRegistro] = useState('');
    const [categoria, setCategoria] = useState('');
    const [fechaExamen, setFechaExamen] = useState<Date | undefined>();
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCancelPhoto = () => {
        setFoto(null);
        setFotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleGenerateId = () => {
        const licenseData = {
            codigoRegistro,
            categoria,
            fechaExamen: fechaExamen?.toISOString(),
            observaciones,
            fotoUrl: fotoPreview,
            nombre: tramitanteData.para,
            cedula: tramitanteData.referencia,
            fechaNacimiento: tramitanteData.infoTramite?.fechaNacimiento,
            nacionalidad: tramitanteData.infoTramite?.nacionalidad,
        };

        sessionStorage.setItem('licenseDataForPDF', JSON.stringify(licenseData));
        const reportWindow = window.open('/dashboard/licencia/generar', '_blank');
        if (!reportWindow) {
             toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo abrir la nueva pestaña. Por favor, revise la configuración de su navegador.",
            });
        }
    };

    const licenseDataForPreview = {
        fotoUrl: fotoPreview,
        categoria: categoria,
        nombre: tramitanteData.para,
        cedula: tramitanteData.referencia,
        fechaNacimiento: tramitanteData.infoTramite?.fechaNacimiento,
        nacionalidad: tramitanteData.infoTramite?.nacionalidad,
    };

    return (
        <Card className="mt-6 animate-in fade-in-50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generación de Licencia</CardTitle>
                <Button variant="outline" onClick={onCancel}>Cerrar</Button>
            </CardHeader>
            <CardContent>
                <div className={cn("grid transition-all duration-500", isPreviewVisible ? "grid-cols-1 md:grid-cols-[2fr_1fr] gap-6" : "grid-cols-1")}>
                    <div className={cn("p-6 space-y-6 border rounded-lg", isPreviewVisible ? "bg-card" : "bg-transparent border-transparent p-0")}>
                        <SectionHeader title="Datos de la licencia" />
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="codigo-registro">Código de registro*</Label>
                                <Input id="codigo-registro" value={codigoRegistro} onChange={(e) => setCodigoRegistro(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Categoría a emitir*</Label>
                                <RadioGroup value={categoria} onValueChange={setCategoria} className="flex flex-col space-y-2">
                                    {categoriesToIssue.map(cat => (
                                        <div key={cat} className="flex items-center space-x-2">
                                            <RadioGroupItem value={cat} id={cat.replace(/\s+/g, '-')} />
                                            <Label htmlFor={cat.replace(/\s+/g, '-')} className="font-normal">{cat}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                             <div className="space-y-2">
                                <Label>Fecha de examen*</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {fechaExamen ? format(fechaExamen, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent><Calendar mode="single" selected={fechaExamen} onSelect={setFechaExamen} /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Foto licencia*</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Button type="button" onClick={() => fileInputRef.current?.click()}><PlusCircle className="mr-2 h-4 w-4"/>Seleccionar documento</Button>
                                    <Input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoChange} accept="image/*" />
                                    <Button type="button" variant="secondary" disabled={!foto}><Upload className="mr-2 h-4 w-4"/>Cargar</Button>
                                    <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleCancelPhoto} disabled={!foto}><XCircle className="mr-2 h-4 w-4"/>Cancelar</Button>
                                </div>
                            </div>
                        </div>

                        <SectionHeader title="Resultado" />
                         <div className="space-y-2">
                            <Label htmlFor="observaciones-licencia">Observaciones</Label>
                            <Textarea id="observaciones-licencia" rows={4} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                        </div>
                        
                        <div className="flex justify-end">
                            <Button type="button" onClick={() => setIsPreviewVisible(true)} className="bg-cyan-500 hover:bg-cyan-600 shadow-lg">Vista Previa</Button>
                        </div>
                    </div>

                    {isPreviewVisible && (
                        <div className="p-6 bg-muted/30 rounded-lg animate-in fade-in-50 space-y-4 flex flex-col justify-center">
                            <LicensePreview data={licenseDataForPreview} />
                            <Button onClick={handleGenerateId} className="w-full">Generar ID</Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


export default function TramiteDetailClient({ tramiteId }: { tramiteId: string }) {
    const { toast } = useToast();
    const pathname = usePathname();
    const tramiteData = mockTramitesData[tramiteId as keyof typeof mockTramitesData];

    const [checkedState, setCheckedState] = React.useState<{ [key: string]: string }>({});
    const [notes, setNotes] = React.useState<{ [key: string]: string }>({});
    const [progress, setProgress] = useState(20);
    const [completedTasks, setCompletedTasks] = React.useState<Set<string>>(new Set());
    const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
    const [isProcessComplete, setIsProcessComplete] = useState(false);
    
    const [taskToRehabilitate, setTaskToRehabilitate] = useState<string | null>(null);
    const [rehabPassword, setRehabPassword] = useState('');
    const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);
    const [isLicenseFormVisible, setIsLicenseFormVisible] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = React.useState(false);

    const isActivitiesPage = pathname.includes('/actividades');

    if (!tramiteData) {
        notFound();
    }

    const totalTasks = 7;

    const handleTaskCompletion = (taskName: string) => {
        let newCompletedTasks: Set<string>;
        const wasAlreadyCompleted = completedTasks.has(taskName);

        if (!wasAlreadyCompleted) {
            newCompletedTasks = new Set(completedTasks).add(taskName);
             toast({
                title: `Tarea "${taskName}" guardada`,
                description: "El progreso ha sido actualizado.",
                className: "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
            });
        } else {
             newCompletedTasks = completedTasks;
             toast({
                 title: "Cambios guardados",
                 description: `La tarea "${taskName}" ya había sido completada.`,
             });
        }
        
        setCompletedTasks(newCompletedTasks);
        
        const firstPhaseTaskCount = 5;
        const completedCount = newCompletedTasks.size;
        // The first 20% is given, so the 7 tasks account for the remaining 80%
        const newProgress = 20 + (completedCount / totalTasks) * 80;
        
        setProgress(Math.min(100, newProgress));

        if (completedCount >= firstPhaseTaskCount && !isScheduled) {
            setIsSchedulingModalOpen(true);
        }

        if (completedCount === totalTasks) {
            setIsProcessComplete(true);
            toast({
                title: "¡Proceso completado!",
                description: "Todas las tareas han sido completadas. Puede proceder a generar la licencia.",
                className: "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
            });
        }
    };
    
    const handleScheduleAppointment = (details: any) => {
        setAppointmentDetails(details);
        setIsScheduled(true);
    };

    const handleRehabilitateClick = (taskName: string) => {
        setTaskToRehabilitate(taskName);
    };

    const handleConfirmRehabilitation = () => {
        if (rehabPassword === '1234') {
            const newCompletedTasks = new Set(completedTasks);
            if (taskToRehabilitate) {
                newCompletedTasks.delete(taskToRehabilitate);
            }
            setCompletedTasks(newCompletedTasks);
            
            const completedCount = newCompletedTasks.size;
            const newProgress = 20 + (completedCount / totalTasks) * 80;
            setProgress(Math.min(100, newProgress));

            setIsProcessComplete(false);
            setTaskToRehabilitate(null);
            setRehabPassword('');
            toast({
                title: "Tarea Rehabilitada",
                description: "Ahora puede realizar cambios en la tarea seleccionada.",
            });
        } else {
            setIsPasswordIncorrect(true);
            setTimeout(() => setIsPasswordIncorrect(false), 820);
            toast({
                variant: "destructive",
                title: "Clave Incorrecta",
                description: "La clave del responsable del proceso no es válida.",
            });
            setRehabPassword('');
        }
    };


    const handleCheckChange = (docId: string, value: string) => {
        setCheckedState(prev => ({ ...prev, [docId]: prev[docId] === value ? '' : value }));
    };
    
    const handleNoteChange = (docId: string, note: string) => {
        setNotes(prev => ({ ...prev, [docId]: note }));
    };

    // If it's the main tramite page, don't show the forms
    if (!isActivitiesPage) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Detalle del Trámite</CardTitle>
                    <CardDescription>ID: {tramiteId}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Esta es la página de detalle del trámite. Para ver las actividades, navegue a la pestaña correspondiente.</p>
                     <Button asChild className="mt-4">
                        <Link href={`/dashboard/tramite/${tramiteId}/actividades`}>
                            Ir a Actividades
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
             <div className="flex justify-end items-center gap-1 text-sm">
                <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link href={`/dashboard/asignaciones`}>
                        <ArrowLeft className="mr-1 h-4 w-4" />Volver a Trámites
                    </Link>
                </Button>
            </div>
            
             <Card className="bg-muted/30 border-border/60 shadow-inner">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-8 gap-y-4">
                       <div className="flex items-center gap-6 flex-1">
                            <div className="flex-shrink-0">
                                <Settings className="h-10 w-10 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-primary leading-tight">{tramiteData.proceso}</h2>
                                <p className="text-sm text-muted-foreground">{tramiteData.id}</p>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-2 text-sm">
                                    <div><span className="font-semibold text-foreground/80">Solicitante:</span><span className="ml-2 text-muted-foreground">{tramiteData.solicitante}</span></div>
                                    <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setIsListModalOpen(true)}>Ver listado de personal</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                 <div className="lg:col-span-2 rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-3" indicatorClassName="bg-green-500" />
                        <span className="text-base font-semibold text-primary whitespace-nowrap">
                            {Math.round(progress)}% de cumplimiento
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 items-stretch lg:col-span-1">
                    {isProcessComplete ? (
                        <div className="animate-in fade-in-50 flex items-center gap-2">
                             <Button size="lg" disabled className="w-full bg-green-600 hover:bg-green-600 cursor-not-allowed">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Proceso Completado
                            </Button>
                            <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg" onClick={() => setIsLicenseFormVisible(true)}>
                                Licencia
                            </Button>
                        </div>
                    ) : (
                        isScheduled && (
                            <div className="animate-in fade-in-50">
                                <AppointmentInfoCard details={appointmentDetails} onReprogram={() => setIsSchedulingModalOpen(true)} />
                            </div>
                        )
                    )}
                </div>
            </div>

             <Tabs defaultValue={tabs[0].value} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-7 gap-4 p-0 bg-transparent mb-6">
                    {tabs.map((tab) => {
                        const isDisabled = (tab.value === "practico-teorico" || tab.value === "psicologia") && !isScheduled;
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                disabled={isDisabled || isProcessComplete}
                                className={cn(
                                    "group relative flex flex-col justify-center items-center w-full h-28 p-2 rounded-xl border-2 border-transparent transition-all duration-300 ease-in-out bg-card text-card-foreground shadow-lg hover:-translate-y-2 hover:shadow-primary/20 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-105 data-[state=active]:border-primary-foreground/30",
                                    (isDisabled || isProcessComplete) && "opacity-60 cursor-not-allowed hover:transform-none hover:shadow-lg"
                                )}
                            >
                                <tab.icon className="h-8 w-8 mb-2 text-primary transition-all duration-300 group-hover:scale-110 group-data-[state=active]:text-primary-foreground" />
                                <span className="font-semibold text-center text-xs sm:text-sm">{tab.name}</span>
                                {completedTasks.has(tab.name) && <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-in zoom-in-50" />}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
                <TabsContent value="cuerpo-médico">
                   <MedicalForm onSave={() => handleTaskCompletion("Cuerpo Médico")} isLocked={completedTasks.has("Cuerpo Médico")} onRehabilitate={() => handleRehabilitateClick("Cuerpo Médico")} />
                </TabsContent>
                <TabsContent value="financiera">
                  <FinancialForm onSave={() => handleTaskCompletion("Financiera")} isLocked={completedTasks.has("Financiera")} onRehabilitate={() => handleRehabilitateClick("Financiera")} />
                </TabsContent>
                <TabsContent value="dopage">
                  <DopageForm onSave={() => handleTaskCompletion("Dopage")} isLocked={completedTasks.has("Dopage")} onRehabilitate={() => handleRehabilitateClick("Dopage")} />
                </TabsContent>
                <TabsContent value="inteligencia">
                  <IntelligenceForm onSave={() => handleTaskCompletion("Inteligencia")} isLocked={completedTasks.has("Inteligencia")} onRehabilitate={() => handleRehabilitateClick("Inteligencia")} />
                </TabsContent>
                <TabsContent value="escuela">
                    <SchoolForm onSave={() => handleTaskCompletion("Escuela - ESAC")} isLocked={completedTasks.has("Escuela - ESAC")} onRehabilitate={() => handleRehabilitateClick("Escuela - ESAC")} />
                </TabsContent>
                <TabsContent value="practico-teorico">
                    <PracticalTheoreticalForm onSave={() => handleTaskCompletion("Practico Teórico")} isLocked={completedTasks.has("Practico Teórico")} onRehabilitate={() => handleRehabilitateClick("Practico Teórico")} />
                </TabsContent>
                <TabsContent value="psicologia">
                    <PsychologyForm onSave={() => handleTaskCompletion("Psicología")} isLocked={completedTasks.has("Psicología")} onRehabilitate={() => handleRehabilitateClick("Psicología")} />
                </TabsContent>
            </Tabs>
            
            {isLicenseFormVisible && (
                <LicenseForm tramitanteData={tramiteData} onCancel={() => setIsLicenseFormVisible(false)} />
            )}

            <SchedulingModal isOpen={isSchedulingModalOpen} onOpenChange={setIsSchedulingModalOpen} onSchedule={handleScheduleAppointment} />

            <AlertDialog open={!!taskToRehabilitate} onOpenChange={(open) => !open && setTaskToRehabilitate(null)}>
                <AlertDialogContent className={cn(isPasswordIncorrect && "animate-shake")}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Rehabilitar Tarea Concluida</AlertDialogTitle>
                    <AlertDialogDescription>
                    Está a punto de reabrir una tarea que ya ha sido completada. Esta acción quedará registrada bajo su responsabilidad. Por favor, ingrese la clave del responsable del proceso.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="rehab-password">Clave del responsable del proceso</Label>
                    <Input
                    id="rehab-password"
                    type="password"
                    value={rehabPassword}
                    onChange={(e) => setRehabPassword(e.target.value)}
                    autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setRehabPassword('')}>No, Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmRehabilitation}>Sí, Confirmar</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Listado de Personal</DialogTitle>
                        <DialogDescription>Verifique los datos del personal incluido en el formulario.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cédula</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Edad</TableHead>
                                    <TableHead>Nacionalidad</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockPersonalList.map((person, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-mono">{person.cedula}</TableCell>
                                        <TableCell>{person.nombre}</TableCell>
                                        <TableCell>{person.compania}</TableCell>
                                        <TableCell>{person.edad}</TableCell>
                                        <TableCell>{person.nacionalidad}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsListModalOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
