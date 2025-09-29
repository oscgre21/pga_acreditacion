

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Eye, Pencil, PlusCircle, Copy, Trash2, User as UserIcon, Lock, Mail, Phone, Building, Briefcase, Calendar as CalendarIcon, Gauge, AppWindow, ArrowRight, Save, Loader2, Info, EyeOff, FileText, Shield, KeyRound, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { initialApps } from "../../perfiles-pga/data";
import { FlightProgress } from "@/components/ui/flight-progress";
import { usersData as initialUsersData, dependencies, employeeOptions, roleOptions } from "./data";
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


const PasswordStrengthMeter = ({ password }: { password?: string }) => {
    const getStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return (score / 5) * 100;
    };

    const strength = getStrength();
    const color = strength < 40 ? 'bg-red-500' : strength < 80 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="flex items-center gap-2">
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className={cn("h-2.5 rounded-full transition-all duration-300", color)} style={{ width: `${strength}%` }}></div>
            </div>
            <span className="text-xs font-semibold w-20 text-right">{strength < 40 ? 'Débil' : strength < 80 ? 'Media' : 'Fuerte'}</span>
        </div>
    );
};

const CreateUserDialog = ({ isOpen, onOpenChange, onUserCreated }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onUserCreated: (user: any) => void }) => {
    const [password, setPassword] = React.useState('');
    const [selectedApp, setSelectedApp] = React.useState<typeof initialApps[0] | null>(null);
    const [assignedApps, setAssignedApps] = React.useState<(typeof initialApps[0])[]>([]);
    const [isCreating, setIsCreating] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isExpirationEnabled, setIsExpirationEnabled] = React.useState(false);
    const [expirationDate, setExpirationDate] = React.useState<Date | undefined>();

    const handleAddApp = () => {
        if (selectedApp && !assignedApps.some(app => app.id === selectedApp.id)) {
            setAssignedApps(prev => [...prev, selectedApp]);
            setSelectedApp(null);
        }
    };

    const handleRemoveApp = (appId: string) => {
        setAssignedApps(prev => prev.filter(app => app.id !== appId));
    };

    const handleSave = () => {
        setIsCreating(true);
    };

    const handleCreationComplete = () => {
        onOpenChange(false);
        setIsCreating(false);
        const newUser = {
            id: Date.now(),
            nombre: "Nuevo Usuario Creado",
            usuario: "nuevousuario",
            correo: "nuevo@cesac.mil.do",
            telefono: "(809)-123-4567",
            activo: true,
            rango: 'N/A',
            departamento: 'N/A',
            nivelPerfil: 'Estándar',
            appsConcedidas: [],
            ultimosAccesos: [],
        };
        onUserCreated(newUser);
    };

    if (isCreating) {
        return (
            <AlertDialog open={isCreating} onOpenChange={setIsCreating}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold text-primary">
                            Creando Usuario...
                        </AlertDialogTitle>
                         <AlertDialogDescription asChild>
                            <div className="flex flex-col items-center gap-6 py-6 text-center text-base text-muted-foreground">
                                <FlightProgress duration={10000} onComplete={handleCreationComplete} />
                                <p>
                                    El sistema está configurando el perfil y asignando los permisos. Por favor, espere un momento.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-7xl p-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-black">
                <DialogHeader className="p-6 pb-4 bg-muted/30">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2"><PlusCircle className="h-7 w-7 text-primary"/>Crear y Configurar Usuario</DialogTitle>
                </DialogHeader>
                 <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-x-8 gap-y-6 px-6 pb-6">
                    {/* ===== LEFT COLUMN: USER INFO ===== */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-lg text-primary">Detalles de Usuario</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombres">Nombre y Apellido*</Label>
                                    <Input id="nombres" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rango">Rango (Opcional)</Label>
                                    <Input id="rango" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nombre-usuario">Nombre Usuario*</Label>
                                    <Input id="nombre-usuario" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="correo">Correo</Label>
                                    <Input id="correo" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono*</Label>
                                    <Input id="telefono" type="tel" />
                                </div>
                                <div className="space-y-2 relative">
                                    <Label htmlFor="contrasena">Contraseña</Label>
                                    <Input id="contrasena" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-6 h-8 w-8 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </Button>
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <Label>Nivel de seguridad</Label>
                                    <PasswordStrengthMeter password={password} />
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Dirección / Dpto.</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar..."/></SelectTrigger>
                                        <SelectContent>
                                            {dependencies.map(dep => <SelectItem key={dep.id} value={dep.nombre}>{dep.nombre}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Nivel del perfil</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar..."/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="estandar">Estándar</SelectItem>
                                            <SelectItem value="avanzado">Avanzado</SelectItem>
                                            <SelectItem value="administrativo">Administrativo</SelectItem>
                                            <SelectItem value="master-key">Master Key</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="exp-enabled" checked={isExpirationEnabled} onCheckedChange={(checked) => setIsExpirationEnabled(Boolean(checked))} />
                                        <Label htmlFor="exp-enabled" className="font-normal cursor-pointer">Habilitar fecha de caducidad</Label>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={!isExpirationEnabled}>
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {expirationDate ? format(expirationDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent><Calendar mode="single" selected={expirationDate} onSelect={setExpirationDate} /></PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT COLUMN: APP ASSIGNMENTS ===== */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-lg text-primary">Asignación de Aplicaciones</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="flex flex-col space-y-2 h-[400px]">
                                <h4 className="font-medium text-center">Aplicaciones Disponibles</h4>
                                <ScrollArea className="h-full border rounded-md bg-background">
                                    <div className="p-2 space-y-1">
                                        {initialApps.map(app => (
                                        <button key={app.id} onClick={() => setSelectedApp(app)} className={cn("w-full text-left p-2 rounded-md text-sm transition-colors", selectedApp?.id === app.id ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted")}>
                                            {app.nombre}
                                        </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="flex flex-col items-center justify-between space-y-4 h-[400px]">
                                <Card className="w-full flex-grow flex flex-col items-center justify-center text-center p-4 bg-background shadow-inner">
                                    {selectedApp ? (
                                        <div className="space-y-3 animate-in fade-in-50">
                                            <div className="flex justify-center"><selectedApp.logo className="h-12 w-12 text-primary"/></div>
                                            <h4 className="font-bold">{selectedApp.nombre}</h4>
                                            <p className="text-xs text-muted-foreground">{selectedApp.descripcion}</p>
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground space-y-2">
                                            <Info className="h-10 w-10 mx-auto"/>
                                            <p className="text-sm">Seleccione una aplicación para ver su descripción y agregarla.</p>
                                        </div>
                                    )}
                                </Card>
                                <Button onClick={handleAddApp} disabled={!selectedApp} className="w-full bg-cyan-500 hover:bg-cyan-600 shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all">
                                    <ArrowRight className="mr-2 h-4 w-4"/>Agregar
                                </Button>
                            </div>
                            <div className="flex flex-col space-y-2 h-[400px]">
                                <h4 className="font-medium text-center">Accesos Concedidos</h4>
                                <ScrollArea className="h-full border rounded-md bg-background">
                                    <div className="p-2 space-y-2">
                                        {assignedApps.length > 0 ? assignedApps.map(app => (
                                            <div key={app.id} className="flex items-center justify-between p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-sm animate-in fade-in-0">
                                                <span className="font-medium text-green-800 dark:text-green-200">{app.nombre}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-500 hover:bg-red-100" onClick={() => handleRemoveApp(app.id)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        )) : (
                                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
                                            No se han concedido accesos.
                                        </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-6 border-t bg-muted/20 flex justify-end">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-600/40 font-bold transform hover:-translate-y-0.5 transition-transform">
                        <Save className="mr-2 h-4 w-4"/>
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{value || 'No disponible'}</p>
        </div>
    </div>
);

export default function GestionUsuariosPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState(initialUsersData);
  const [isCreateUserOpen, setIsCreateUserOpen] = React.useState(false);
  const [openUserId, setOpenUserId] = React.useState<number | null>(null);
  
  const handleDelete = (userId: number) => {
      const user = users.find(u => u.id === userId);
      setUsers(users.filter(u => u.id !== userId));
      toast({
          title: "Usuario Eliminado",
          description: `El usuario "${user?.nombre}" ha sido eliminado.`,
          variant: "destructive",
      });
  };
  
  const handleUserCreated = (newUser: any) => {
      setUsers(prev => [newUser, ...prev]);
      toast({
          title: "Usuario Creado",
          description: `El usuario "${newUser.nombre}" ha sido creado y agregado a la lista.`,
          className: "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
      });
  };
  
  const handleRowClick = (userId: number) => {
    setOpenUserId(prevId => (prevId === userId ? null : userId));
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-2xl transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Busque, filtre y gestione todos los usuarios del sistema.</CardDescription>
            </div>
             <Button onClick={() => setIsCreateUserOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform">
                <PlusCircle className="mr-2 h-5 w-5" />
                Nuevo Usuario
            </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-blue-800 text-white">
                <TableRow className="hover:bg-blue-800">
                  <TableHead className="text-white">Nombre</TableHead>
                  <TableHead className="text-white">Usuario</TableHead>
                  <TableHead className="text-white">Correo</TableHead>
                  <TableHead className="text-white">Teléfono</TableHead>
                  <TableHead className="text-white">Activo</TableHead>
                  <TableHead className="text-white text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {users.map((user) => (
                  <Collapsible asChild key={user.id} open={openUserId === user.id} onOpenChange={() => handleRowClick(user.id)}>
                    <tbody className="group">
                        <CollapsibleTrigger asChild>
                            <TableRow className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:bg-muted/50">
                                <TableCell className="font-medium">{user.nombre}</TableCell>
                                <TableCell>{user.usuario}</TableCell>
                                <TableCell>{user.correo}</TableCell>
                                <TableCell>{user.telefono}</TableCell>
                                <TableCell>
                                {user.activo && <Check className="h-5 w-5 text-green-600" />}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Copy className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Pencil className="h-4 w-4"/></Button>
                                    <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Está seguro de eliminar este usuario?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Se eliminará permanentemente el usuario de <span className="font-bold">{user.nombre}</span>.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive hover:bg-destructive/90">Sí, eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        </CollapsibleTrigger>
                         <CollapsibleContent asChild>
                            <tr className="bg-muted/20 dark:bg-muted/10">
                                <TableCell colSpan={6} className="p-0">
                                    <div className="p-6 space-y-6 animate-in fade-in-50 duration-500">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-primary">Detalles del Usuario</h4>
                                                <div className="space-y-3">
                                                    <InfoItem icon={UserIcon} label="Usuario" value={user.usuario} />
                                                    <InfoItem icon={Mail} label="Correo" value={user.correo} />
                                                    <InfoItem icon={Phone} label="Teléfono" value={user.telefono} />
                                                    <InfoItem icon={Briefcase} label="Rango" value={user.rango} />
                                                    <InfoItem icon={Building} label="Dirección / Dpto." value={user.departamento} />
                                                    <InfoItem icon={KeyRound} label="Nivel de Perfil" value={user.nivelPerfil} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-primary">Accesos Concedidos</h4>
                                                <div className="space-y-2">
                                                    {user.appsConcedidas.map(app => (
                                                        <div key={app.id} className="flex items-center gap-2 p-2 rounded-md bg-background border">
                                                            <app.logo className="h-5 w-5 text-muted-foreground" />
                                                            <span className="text-sm font-medium">{app.nombre}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-primary">Últimos 3 Accesos</h4>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="h-8">Fecha y Hora</TableHead>
                                                                <TableHead className="h-8">App</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {user.ultimosAccesos.map((access, index) => (
                                                                <TableRow key={index} className="text-xs">
                                                                    <TableCell className="p-2 whitespace-nowrap">{access.fecha} <br/> {access.hora}</TableCell>
                                                                    <TableCell className="p-2">{access.app}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                            </div>
                                        </div>
                                        <Separator className="my-6" />
                                        <div className="flex justify-end">
                                            <Button asChild>
                                                <Link href={`/dashboard/perfiles-pga/usuarios/report/${user.id}`} target="_blank">
                                                    <FileText className="mr-2 h-4 w-4"/>
                                                    Imprimir Informe
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                            </tr>
                        </CollapsibleContent>
                    </tbody>
                </Collapsible>
              ))}
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">Página 1 de 8 (71 items)</span>
             <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">{"<"}</Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">2</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">3</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">4</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">...</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">8</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">{">"}</Button>
            </div>
        </CardFooter>
      </Card>

      <CreateUserDialog 
        isOpen={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
