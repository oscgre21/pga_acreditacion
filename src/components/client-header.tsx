
"use client";

import { Bell, BookOpen, Check } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";
import { useClientPortal } from "@/contexts/client-portal-context";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export function ClientHeader() {
  const { notificaciones, unreadCount, markAllAsRead } = useClientPortal();

  return (
    <div className="sticky top-0 z-30">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-black px-4 text-white sm:px-8">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <p className="hidden md:block text-sm font-semibold text-white/90">
                Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil - CESAC
            </p>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
                    <Bell />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 text-white text-[10px] items-center justify-center">{unreadCount}</span>
                      </span>
                    )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex justify-between items-center p-2">
                    <DropdownMenuLabel className="p-0">Notificaciones</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
                            <Check className="mr-1 h-3 w-3" />
                            Marcar como leídas
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                {notificaciones.length > 0 ? (
                    notificaciones.map(n => (
                      <DropdownMenuItem key={n.id} asChild className={cn("flex items-start gap-3 cursor-pointer", !n.leida && "font-bold")}>
                         <Link href={n.href || "#"}>
                            <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", n.leida ? "bg-transparent" : "bg-primary")}></div>
                            <div className="flex-1 space-y-1">
                                <p className="leading-tight">{n.titulo}</p>
                                <p className={cn("text-xs leading-tight whitespace-normal", !n.leida ? "text-foreground/80" : "text-muted-foreground")}>{n.descripcion}</p>
                                <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                         </Link>
                      </DropdownMenuItem>
                    ))
                ) : (
                  <DropdownMenuItem disabled>No hay notificaciones</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
                variant="ghost"
                className="hidden sm:inline-flex hover:bg-white/10"
                asChild
            >
                <Link href="/manual" target="_blank">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Manual de Usuario
                </Link>
            </Button>
        </div>
      </header>
       {/* Light mode border */}
      <div className="h-px w-full bg-border dark:hidden" />
      {/* Dark mode gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-[#7ed957] to-transparent hidden dark:block" />
    </div>
  );
}
