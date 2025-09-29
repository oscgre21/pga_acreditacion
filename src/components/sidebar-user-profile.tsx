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

export function SidebarUserProfile() {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-left h-auto p-2 hover:bg-sidebar-accent">
                <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="person face" />
                        <AvatarFallback>KQ</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold text-sidebar-foreground">Kendy Qualey</span>
                        <span className="text-xs text-sidebar-foreground/80">Product Designer</span>
                    </div>
                    <ChevronDown className="ml-auto h-5 w-5 text-sidebar-foreground/80 flex-shrink-0" />
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={10}>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Kendy Qualey</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        kendy.qualey@cesac.mil.do
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
  );
}
