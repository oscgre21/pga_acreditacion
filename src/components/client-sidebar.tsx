
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  FolderOpen,
  FileText,
  Search,
  LogOut,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  PlusCircle,
  List,
  Users,
  Shield,
  BookOpen,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { ClientSettingsSheet } from "./client-settings-sheet";

const navItems = [
  { href: "/cliente/calendario", icon: CalendarDays, label: "Calendario", color: "text-rose-400" },
];

const bottomItems: any[] = [];

function ClientSidebarProfile() {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-2 hover:bg-sidebar-accent"
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://placehold.co/100x100.png"
                  alt="Avatar de TrackAviation"
                  data-ai-hint="company logo"
                />
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sidebar-foreground leading-tight">
                  TrackAviation
                </span>
                <span className="text-xs text-sidebar-foreground/80 leading-tight">
                  Cliente
                </span>
              </div>
              <ChevronDown className="ml-auto h-5 w-5 text-sidebar-foreground/80 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={10}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                TrackAviation Security S.R.L.
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                security@trackaviation.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/cliente/perfil">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil de Compañía</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsSettingsOpen(true); }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
           <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Acceso Administrativo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/gateway">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ClientSettingsSheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}

export function ClientSidebar() {
  const pathname = usePathname();
  const [isSolicitudesOpen, setIsSolicitudesOpen] = React.useState(
    pathname.startsWith("/cliente/solicitudes") || pathname.startsWith("/cliente/mis-tramites") || pathname.startsWith("/cliente/mi-personal")
  );

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <AppLogo title="Portal Cliente" subtitle="Autoservicio" />
      </SidebarHeader>
      <Separator className="bg-sidebar-border/50" />
      <SidebarContent className="p-2">
        <div className="p-2">
          <ClientSidebarProfile />
        </div>
        <Separator className="my-2 bg-sidebar-border/50" />
        <SidebarMenu>
          <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/cliente"}
                tooltip="Dashboard"
              >
                <Link href="/cliente">
                  <LayoutDashboard className="text-blue-400" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          {/* Solicitudes Submenu */}
          <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsSolicitudesOpen((prev) => !prev)}
                isActive={isSolicitudesOpen}
                tooltip="Solicitudes"
                data-state={isSolicitudesOpen ? "open" : "closed"}
              >
                <FolderOpen className="text-amber-400" />
                <span>Solicitudes</span>
              </SidebarMenuButton>
              <SidebarMenuAction
                onClick={() => setIsSolicitudesOpen((prev) => !prev)}
                aria-label="Toggle Solicitudes"
                className="group-data-[collapsible=icon]:hidden"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 ease-in-out",
                    isSolicitudesOpen ? "rotate-180" : ""
                  )}
                />
              </SidebarMenuAction>
            </SidebarMenuItem>

            {isSolicitudesOpen && (
              <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/cliente/solicitudes"}
                    >
                      <Link href="/cliente/solicitudes">
                        <PlusCircle />
                        <span>Nueva Solicitud</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/cliente/mis-tramites"}
                    >
                      <Link href="/cliente/mis-tramites">
                        <List />
                        <span>Mis Trámites</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/cliente/mi-personal"}
                    >
                      <Link href="/cliente/mi-personal">
                        <Users />
                        <span>Mi Personal</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </div>
            )}
            
            {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className={item.color} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4 flex-col items-center gap-2 group-data-[collapsible=icon]:p-2">
         <SidebarMenu>
            {bottomItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                        <Link href={item.href} target={item.target}>
                            <item.icon className={item.color} />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
