
"use client";

import { Bell, HelpCircle, Loader } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserProfileDropdown } from "./user-profile-dropdown";

export function DashboardHeader() {
  const [isHelpDeskModalOpen, setIsHelpDeskModalOpen] = React.useState(false);

  const handleHelpDeskClick = () => {
    setIsHelpDeskModalOpen(true);
    setTimeout(() => {
      window.open(
        "https://servicios.cesac.mil.do/aomSoporte/respuestas.xhtml",
        "_blank",
        "noopener,noreferrer"
      );
      setIsHelpDeskModalOpen(false); // Close modal after opening link
    }, 3000);
  };

  return (
    <div className="sticky top-0 z-30">
      <header className="flex h-16 items-center justify-between gap-2 bg-black px-4 text-white sm:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <UserProfileDropdown />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className="hidden sm:inline-flex hover:bg-white/10"
            onClick={handleHelpDeskClick}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Desk
          </Button>
          <div className="hidden h-8 w-px bg-white/20 sm:inline-block" />
          <div className="hidden text-sm sm:inline-block">Versión 1.0</div>
        </div>
      </header>

      {/* Light mode border */}
      <div className="h-px w-full bg-border dark:hidden" />
      {/* Dark mode gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-[#7ed957] to-transparent hidden dark:block" />

      <AlertDialog
        open={isHelpDeskModalOpen}
        onOpenChange={setIsHelpDeskModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-primary">
              Redireccionando...
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col items-center gap-6 py-6 text-center text-base text-muted-foreground">
                <Loader className="h-16 w-16 animate-spin text-primary" />
                <p>
                  Atención: Estas siendo redireccionado al Dpto. de Soporte
                  Tecnico.... espere un momento por favor.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
