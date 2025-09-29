
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { ChevronDown, LogOut, Settings, User, Lock, Briefcase, Users } from "lucide-react";
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
import { useLock } from "@/contexts/lock-context";
import { SettingsSheet } from "./settings-sheet";
import { ProfileSheet } from "./profile-sheet";

export function UserProfileDropdown() {
  const { lockScreen } = useLock();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 p-2 h-auto rounded-full hover:bg-white/10"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://placehold.co/100x100.png"
                alt="User avatar"
                data-ai-hint="person face"
              />
              <AvatarFallback>KQ</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start text-left text-white">
              <span className="text-sm font-semibold leading-tight">
                Kendy Qualey
              </span>
              <span className="text-xs text-white/80 leading-tight">
                Product Designer
              </span>
            </div>
            <ChevronDown className="ml-1 h-5 w-5 text-white/80 hidden md:flex" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 mt-2 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[side=top]:slide-in-from-bottom-2" 
          align="end" 
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 py-1">
              <p className="text-base font-medium leading-none">
                Kendy Qualey
              </p>
              <p className="text-sm leading-none text-muted-foreground">
                kendy.qualey@cesac.mil.do
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
              <User className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Briefcase className="mr-3 h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Empresa</span>
                <span>CESAC</span>
              </div>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/cliente">
                    <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span>Acceso Cliente</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
              <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>Configuración</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); lockScreen(); }}>
            <Lock className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Bloquear Pantalla</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              <span className="text-red-500">Cerrar Sesión</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsSheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <ProfileSheet open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
}
