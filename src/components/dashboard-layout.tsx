
"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PgaSidebar } from "@/components/pga-sidebar";
import { LockProvider, useLock } from "@/contexts/lock-context";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LockScreen } from "@/components/lock-screen";
import { usePathname } from "next/navigation";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLocked } = useLock();
  const pathname = usePathname();

  const isPgaSection = pathname.startsWith('/dashboard/perfiles-pga') || pathname.startsWith('/dashboard/reportes') || pathname.startsWith('/dashboard/incidencias');

  return (
    <SidebarProvider>
      {isPgaSection ? <PgaSidebar /> : <DashboardSidebar />}
      <SidebarInset>
        <DashboardHeader />
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
      {isLocked && <LockScreen />}
    </SidebarProvider>
  )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LockProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </LockProvider>
  );
}
