
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  LayoutGrid,
  AppWindow,
  FileText,
  Bot,
  ChevronDown,
  Users,
  History,
  BarChart,
  ShieldQuestion,
  AreaChart,
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/app-logo";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export function PgaSidebar() {
  const pathname = usePathname();
  const [isReportesOpen, setIsReportesOpen] = React.useState(false);

  React.useEffect(() => {
    setIsReportesOpen(pathname.startsWith("/dashboard/reportes") || pathname.startsWith("/dashboard/incidencias"));
  }, [pathname]);

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <AppLogo title="Perfiles PGA" subtitle="Gestión de Aplicaciones" />
      </SidebarHeader>
      <Separator className="bg-sidebar-border/50" />
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/perfiles-pga"}
              tooltip="Dashboard"
            >
              <Link href="/dashboard/perfiles-pga">
                <LayoutGrid className="text-blue-400" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/perfiles-pga/list")}
              tooltip="Aplicaciones"
            >
              <Link href="/dashboard/perfiles-pga/list">
                <AppWindow className="text-green-400" />
                <span>Aplicaciones</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/perfiles-pga/usuarios")}
              tooltip="Usuarios"
            >
              <Link href="/dashboard/perfiles-pga/usuarios">
                <Users className="text-orange-400" />
                <span>Usuarios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Reportes Submenu */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsReportesOpen((prev) => !prev)}
              isActive={isReportesOpen}
              tooltip="Reportes"
              data-state={isReportesOpen ? "open" : "closed"}
            >
              <FileText className="text-purple-400" />
              <span>Reportes</span>
            </SidebarMenuButton>
            <SidebarMenuAction
              onClick={() => setIsReportesOpen((prev) => !prev)}
              aria-label="Toggle Reportes"
              className="group-data-[collapsible=icon]:hidden"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-in-out",
                  isReportesOpen ? "rotate-180" : ""
                )}
              />
            </SidebarMenuAction>
          </SidebarMenuItem>
          {isReportesOpen && (
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/reportes/rendimiento-uso"}>
                    <Link href="/dashboard/reportes/rendimiento-uso">
                      <AreaChart />
                      <span>Rendimiento y Uso</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/reportes/historial-auditorias")}>
                    <Link href="/dashboard/reportes/historial-auditorias">
                      <History />
                      <span>Historial de Auditorías</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/reportes/incidentes")}>
                    <Link href="/dashboard/reportes/incidentes">
                      <Bot />
                      <span>Análisis de Incidentes</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/reportes/vulnerabilidades")}>
                    <Link href="/dashboard/reportes/vulnerabilidades">
                      <ShieldQuestion />
                      <span>Vulnerabilidades</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/reportes/docker")}>
                    <Link href="/dashboard/reportes/docker">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.88 5.88a2.5 2.5 0 1 0 0 3.53h12.24a2.5 2.5 0 1 0 0-3.53H5.88Z"/><path d="M18 9.41V15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9.41l.24-.24a2.5 2.5 0 0 0 3.53 0l1.24-1.24a2.5 2.5 0 0 1 3.53 0l1.24 1.24a2.5 2.5 0 0 0 3.53 0Z"/><path d="M11 12H8"/><path d="M16 12h-2"/></svg>
                      <span>Docker</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/reportes/comparativa-versiones")}>
                    <Link href="/dashboard/reportes/comparativa-versiones">
                      <BarChart />
                      <span>Comparativa de Versiones</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4 flex-col items-center gap-2">
        <div className="text-center text-[10px] text-sidebar-foreground/70 opacity-90 group-data-[collapsible=icon]:hidden">
            <p className="font-['Dancing_Script']">Created / Designed by. Kendy Qualey</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
