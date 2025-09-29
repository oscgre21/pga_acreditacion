
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  ChevronDown,
  LayoutGrid,
  ClipboardList,
  Bell,
  Settings,
  List,
  Activity,
  Menu,
  DatabaseZap,
  GitFork,
  UserCheck,
  Plus,
  Shield,
  Send,
  BookCopy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/app-logo";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCertificacionOpen, setIsCertificacionOpen] = React.useState(
    pathname.startsWith("/dashboard/acreditaciones") || pathname.startsWith("/dashboard/mantenimiento") || pathname.startsWith("/dashboard/documentacion-proceso")
  );
  const [isAsignacionesOpen, setIsAsignacionesOpen] = React.useState(
    pathname.startsWith("/dashboard/asignaciones")
  );
  const [isAccionesOpen, setIsAccionesOpen] = React.useState(
    pathname.startsWith("/dashboard/acciones")
  );


  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <AppLogo title="Acreditaciones" subtitle="Módulo de Gestión" />
      </SidebarHeader>
      <Separator className="bg-sidebar-border/50" />
      <SidebarContent className="p-2">
        <SidebarMenu>

          {/* Certificación y Re-certificación */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsCertificacionOpen((prev) => !prev)}
              isActive={isCertificacionOpen}
              tooltip="Certificación y Re-certificación"
              data-state={isCertificacionOpen ? "open" : "closed"}
            >
              <LayoutGrid className="text-cyan-400" />
              <span>Certificación y Re-certificación</span>
            </SidebarMenuButton>
            <SidebarMenuAction
              onClick={() => setIsCertificacionOpen((prev) => !prev)}
              aria-label="Toggle Certificación"
              className="group-data-[collapsible=icon]:hidden"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-in-out",
                  isCertificacionOpen ? "rotate-180" : ""
                )}
              />
            </SidebarMenuAction>
          </SidebarMenuItem>
          {isCertificacionOpen && (
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/dashboard/acreditaciones"}
                  >
                    <Link href="/dashboard/acreditaciones">
                      <LayoutGrid />
                      <span>Gestión de Acreditaciones</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/dashboard/documentacion-proceso"}
                  >
                    <Link href="/dashboard/documentacion-proceso">
                      <BookCopy />
                      <span>Documentación del proceso</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname.startsWith("/dashboard/mantenimiento")}
                  >
                    <Link href="/dashboard/mantenimiento">
                      <Settings />
                      <span>Data Maestro</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </div>
          )}

          {/* Asignaciones */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsAsignacionesOpen((prev) => !prev)}
              isActive={isAsignacionesOpen}
              tooltip="Asignaciones"
              data-state={isAsignacionesOpen ? "open" : "closed"}
            >
              <ClipboardList className="text-lime-400" />
              <span>Asignaciones</span>
            </SidebarMenuButton>
            <SidebarMenuAction
              onClick={() => setIsAsignacionesOpen((prev) => !prev)}
              aria-label="Toggle Asignaciones"
              className="group-data-[collapsible=icon]:hidden"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-in-out",
                  isAsignacionesOpen ? "rotate-180" : ""
                )}
              />
            </SidebarMenuAction>
          </SidebarMenuItem>
          {isAsignacionesOpen && (
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/dashboard/asignaciones"}
                  >
                    <Link href="/dashboard/asignaciones">
                      <List />
                      <span>Listado de Trámites</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/dashboard/asignaciones/actividades"}
                  >
                    <Link href="/dashboard/asignaciones/actividades">
                      <Activity />
                      <span>Actividades</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/dashboard/asignaciones/notificaciones"}
                  >
                    <Link href="/dashboard/asignaciones/notificaciones">
                      <Bell />
                      <span>Notificaciones</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </div>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/liberaciones")}
              tooltip="Liberaciones"
            >
              <Link href="/dashboard/liberaciones">
                <Send className="text-teal-400" />
                <span>Liberaciones</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Acciones */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsAccionesOpen((prev) => !prev)}
              isActive={isAccionesOpen}
              tooltip="Acciones"
              data-state={isAccionesOpen ? "open" : "closed"}
            >
              <Menu className="text-purple-400" />
              <span>Acciones</span>
            </SidebarMenuButton>
            <SidebarMenuAction
              onClick={() => setIsAccionesOpen((prev) => !prev)}
              aria-label="Toggle Acciones"
              className="group-data-[collapsible=icon]:hidden"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-in-out",
                  isAccionesOpen ? "rotate-180" : ""
                )}
              />
            </SidebarMenuAction>
          </SidebarMenuItem>
          {isAccionesOpen && (
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/acciones/datos-migrados"} tooltip="Administración de datos migrados">
                    <Link href="/dashboard/acciones/datos-migrados">
                      <DatabaseZap />
                      <span>Administración de datos migrados</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/acciones/procesos"} tooltip="Administración de procesos">
                    <Link href="/dashboard/acciones/procesos">
                      <GitFork />
                      <span>Administración de procesos</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={false} tooltip="Certificación y Re-certificación del Personal">
                    <Link href="#">
                      <UserCheck />
                      <span>Certificación y Re-certificación del Personal</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={false} tooltip="Temas">
                    <Link href="#">
                      <Plus />
                      <span>Temas</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={false} tooltip="Programas de seguridad de compañías">
                    <Link href="#">
                      <Shield />
                      <span>Programas de seguridad de compañías</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4 flex-col items-center gap-2 group-data-[collapsible=icon]:p-2">
         <div className="text-center text-[10px] text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
            <p className="font-['Dancing_Script']">Created / Designed by. Kendy Qualey</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
