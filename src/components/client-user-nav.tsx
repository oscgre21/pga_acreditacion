"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import * as React from "react";
import { ClientSettingsSheet } from "./client-settings-sheet";

export function ClientUserNav() {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-primary-foreground/10 h-auto rounded-lg">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar de TrackAviation" data-ai-hint="company logo" />
                        <AvatarFallback>TA</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-left">
                        <span className="text-sm font-semibold text-primary-foreground leading-tight">TrackAviation</span>
                        <span className="text-xs text-primary-foreground/80 leading-tight">Cliente</span>
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 text-primary-foreground/80 flex-shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">TrackAviation Security S.R.L.</p>
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
                <DropdownMenuItem asChild>
                    <Link href="/">
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
