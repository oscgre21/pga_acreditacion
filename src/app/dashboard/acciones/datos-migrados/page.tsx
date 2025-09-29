
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Trash2, Calendar, Shield, Info, Edit, Trash } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const initialData = [
    { id: 8972, codigo: 'AC-2189', cedula: '07100557104', nombre: 'ROSA M.', apellido: 'CASTRO BATISTA', entidad: 'Air Century S.A.', aeropuerto: 'MDJB', habilitacion: 'GERENTE AVSEC', fechaCertificacion: '01/10/2018', fechaVencimiento: '30/09/2020', fechaCancelacion: '' },
    { id: 11829, codigo: 'AC-1456', cedula: '40220808049', nombre: 'ALTAGRACIA', apellido: 'LEVEL SANCHEZ', entidad: 'Air Century S.A.', aeropuerto: 'MDJB', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '02/07/2019', fechaVencimiento: '01/07/2021', fechaCancelacion: '' },
    { id: 8973, codigo: 'AC-INST-018', cedula: '07100557104', nombre: 'ROSA M.', apellido: 'CASTRO BATISTA', entidad: 'Air Century S.A.', aeropuerto: 'MDJB', habilitacion: 'INSTRUCTOR AVSEC', fechaCertificacion: '05/10/2018', fechaVencimiento: '04/10/2020', fechaCancelacion: '' },
    { id: 11368, codigo: 'ASD-2404', cedula: '09700030343', nombre: 'EDILIO', apellido: 'BREA BEARD', entidad: 'AIR SANTO DOMINGO', aeropuerto: 'MDPP', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '18/02/2019', fechaVencimiento: '17/02/2021', fechaCancelacion: '04/10/2022' },
    { id: 11831, codigo: 'AA-1912', cedula: '40225119474', nombre: 'STANLEY I.', apellido: 'MONTILLA CESDEÑO', entidad: 'American Airlines, Inc', aeropuerto: 'MDPC', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '28/06/2018', fechaVencimiento: '27/06/2020', fechaCancelacion: '' },
    { id: 11830, codigo: 'AA-1914', cedula: '40225196576', nombre: 'JUAVYI L.', apellido: 'REGALADO APONTE', entidad: 'American Airlines, Inc', aeropuerto: 'MDPC', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '28/06/2018', fechaVencimiento: '27/06/2020', fechaCancelacion: '' },
    { id: 11848, codigo: 'AA-2168', cedula: '02305453265', nombre: 'YADJAIRYS', apellido: 'DIAZ MERCEDES', entidad: 'American Airlines, Inc', aeropuerto: 'MDPC', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '28/06/2018', fechaVencimiento: '27/06/2020', fechaCancelacion: '' },
    { id: 11148, codigo: 'AA-1604', cedula: '02600842076', nombre: 'BENITO', apellido: 'BAEZ PEREZ', entidad: 'American Airlines, Inc', aeropuerto: 'MDPC', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '28/06/2018', fechaVencimiento: '27/06/2020', fechaCancelacion: '' },
    { id: 8997, codigo: 'AA-1912', cedula: '40225119474', nombre: 'STANLEY I.', apellido: 'MONTILLA CESDEÑO', entidad: 'American Airlines, Inc', aeropuerto: 'MDPC', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '01/08/2018', fechaVencimiento: '31/07/2020', fechaCancelacion: '' },
    { id: 8904, codigo: 'AA-1914', cedula: '40225196576', nombre: 'JUAVYI L.', apellido: 'REGALADO APONTE', entidad: 'American Airlines, Inc', aeropuerto: 'MDPC', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACION CIVIL', fechaCertificacion: '28/06/2018', fechaVencimiento: '27/06/2020', fechaCancelacion: '' },
];

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
        <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <div className="text-sm text-muted-foreground">{value || <span className="italic">No disponible</span>}</div>
        </div>
    </div>
);

export default function DatosMigradosPage() {
  const { toast } = useToast();
  const [personnel, setPersonnel] = React.useState(initialData);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  
  const [filters, setFilters] = React.useState({
    codigo: "",
    cedula: "",
    nombre: "",
    apellido: "",
    entidad: "",
    aeropuerto: "",
    habilitacion: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPersonnel = React.useMemo(() => {
    return personnel.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = (item as any)[key];
        return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [personnel, filters]);

  const handleDelete = (id: number) => {
    const person = personnel.find((p) => p.id === id);
    setPersonnel((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Registro Eliminado",
      description: `Se ha eliminado el registro de ${person?.nombre} ${person?.apellido}.`,
      variant: "destructive",
    });
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
            <CardTitle>Administración de datos migrados</CardTitle>
            <CardDescription>
                Visualice, filtre y gestione los registros de personal migrados al sistema.
            </CardDescription>
          </CardHeader>
      </Card>
      
      <Card className="shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-primary/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="p-2 w-[120px]"><div className="pl-2">Código</div><Input name="codigo" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.codigo}/></TableHead>
                  <TableHead className="p-2 w-[150px]"><div className="pl-2">Cédula</div><Input name="cedula" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.cedula}/></TableHead>
                  <TableHead className="p-2 min-w-[150px]"><div className="pl-2">Nombre</div><Input name="nombre" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.nombre}/></TableHead>
                  <TableHead className="p-2 min-w-[150px]"><div className="pl-2">Apellido</div><Input name="apellido" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.apellido}/></TableHead>
                  <TableHead className="p-2 min-w-[200px]"><div className="pl-2">Entidad</div><Input name="entidad" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.entidad}/></TableHead>
                  <TableHead className="p-2 w-[120px]"><div className="pl-2">Aeropuerto</div><Input name="aeropuerto" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.aeropuerto}/></TableHead>
                  <TableHead className="p-2 min-w-[300px]"><div className="pl-2">Habilitación</div><Input name="habilitacion" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.habilitacion}/></TableHead>
                  <TableHead className="p-2 w-12"></TableHead>
                </TableRow>
              </TableHeader>
                {filteredPersonnel.map((person) => (
                    <Collapsible asChild key={person.id}>
                        <tbody className="group">
                           <CollapsibleTrigger asChild>
                                <TableRow className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-1">
                                    <TableCell className="font-mono">{person.codigo}</TableCell>
                                    <TableCell className="font-mono">{person.cedula}</TableCell>
                                    <TableCell>{person.nombre}</TableCell>
                                    <TableCell>{person.apellido}</TableCell>
                                    <TableCell>{person.entidad}</TableCell>
                                    <TableCell>{person.aeropuerto}</TableCell>
                                    <TableCell>{person.habilitacion}</TableCell>
                                    <TableCell className="text-center"><ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" /></TableCell>
                                </TableRow>
                           </CollapsibleTrigger>
                           <CollapsibleContent asChild>
                                <tr className="bg-muted/20 dark:bg-muted/10">
                                    <TableCell colSpan={8} className="p-0">
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">
                                            <InfoRow icon={Calendar} label="Fecha de Certificación" value={person.fechaCertificacion} />
                                            <InfoRow icon={Shield} label="Fecha de Vencimiento" value={person.fechaVencimiento} />
                                            <InfoRow icon={Info} label="Fecha de Cancelación" value={person.fechaCancelacion} />
                                            <div className="lg:col-span-3 flex justify-end items-center gap-2 pt-2">
                                                <Button variant="ghost" size="sm"><Edit className="mr-2 h-4 w-4"/>Editar</Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm"><Trash className="mr-2 h-4 w-4"/>Eliminar</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Está seguro de eliminar este registro?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Se eliminará permanentemente el registro de <span className="font-bold">{person.nombre} {person.apellido}</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(person.id)}>Sí, eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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
      </Card>
    </div>
  );
}
