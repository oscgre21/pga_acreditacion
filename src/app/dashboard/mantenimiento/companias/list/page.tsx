
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Pencil, Trash2, ChevronDown, User, Phone, Mail, MapPin, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { CompaniaEntity } from "@/lib/repositories/compania.repository";



const InfoRow = ({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
        <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <div className="text-sm text-muted-foreground">{children}</div>
        </div>
    </div>
);


export default function CompaniasListPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = React.useState<CompaniaEntity[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companias?includeInactive=true');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error cargando compañías:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las compañías.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCompanies();
  }, []);

  const handleDelete = async (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    try {
      const companyName = companies.find((c) => c.id === companyId)?.nombre || '';
      const response = await fetch(`/api/companias/${companyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete company');
      }
      setCompanies(companies.filter((c) => c.id !== companyId));
      toast({
        title: "Compañía Eliminada",
        description: `La compañía "${companyName}" ha sido eliminada exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando compañía:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la compañía.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Compañías</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar las compañías registradas.
            </CardDescription>
          </div>
          <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/dashboard/mantenimiento">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Link>
             </Button>
             <Button asChild>
                <Link href="/dashboard/mantenimiento/companias">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nueva
                </Link>
             </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando compañías...</p>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No hay compañías registradas.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Abreviatura</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RNC</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {companies.map((company) => (
              <Collapsible asChild key={company.id}>
                 <tbody className="group">
                    <CollapsibleTrigger asChild>
                        <TableRow className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                            <TableCell className="font-medium">{company.abreviatura}</TableCell>
                            <TableCell className="min-w-[250px]">{company.nombre}</TableCell>
                            <TableCell>{company.rnc}</TableCell>
                            <TableCell>{company.telefono}</TableCell>
                            <TableCell>
                                <Badge
                                variant={company.estado === "ACTIVO" ? "default" : "destructive"}
                                className={cn(company.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                                >
                                {company.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild onClick={(e) => e.stopPropagation()}>
                                <Link href={`/dashboard/mantenimiento/companias?id=${company.id}`}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Link>
                                </Button>
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la compañía <span className="font-semibold">{company.nombre}</span> de nuestros servidores.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={(e) => handleDelete(e, company.id)}
                                    >
                                        Sí, eliminar compañía
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                                <ChevronDown className="h-5 w-5 ml-2 text-muted-foreground inline-block transition-transform duration-300 group-data-[state=open]:rotate-180" />
                            </TableCell>
                        </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                       <tr className="bg-muted/20 dark:bg-muted/10">
                            <TableCell colSpan={6} className="p-0">
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
                                    {/* Column 1 & 2: Main Info */}
                                    <div className="md:col-span-2 pr-6 border-r-0 md:border-r border-border/50">
                                        <h4 className="font-bold text-lg mb-4 text-primary">Detalles de la Compañía</h4>
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4">
                                            <InfoRow icon={User} label="Representante">{company.representante}</InfoRow>
                                            <InfoRow icon={Mail} label="Correo Electrónico"><a href={`mailto:${company.correo}`} className="text-blue-600 hover:underline">{company.correo}</a></InfoRow>
                                            <InfoRow icon={Phone} label="Teléfono / WhatsApp">
                                                <p>{company.telefono} {company.isWhatsapp && <Badge variant="secondary" className="ml-2 bg-green-200 text-green-800">WhatsApp</Badge>}</p>
                                                {!company.isWhatsapp && company.whatsapp && <p className="text-xs">WhatsApp: {company.whatsapp}</p>}
                                            </InfoRow>
                                            <InfoRow icon={MapPin} label="Dirección">{company.direccion}</InfoRow>
                                            <div className="xl:col-span-2">
                                                <InfoRow icon={FileText} label="Notas">{company.notas || 'Sin notas.'}</InfoRow>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Column 3: Stats */}
                                    <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-background shadow-inner space-y-2">
                                        <Activity className="h-10 w-10 text-cyan-500"/>
                                        <p className="text-sm font-medium text-muted-foreground">Estado</p>
                                        <p className="text-2xl font-extrabold text-cyan-600">{company.estado === "ACTIVO" ? "Activo" : "Inactivo"}</p>
                                        <p className="text-xs text-muted-foreground">Creado: {new Date(company.createdAt).toLocaleDateString()}</p>
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
        )}
      </CardContent>
    </Card>
  );
}
