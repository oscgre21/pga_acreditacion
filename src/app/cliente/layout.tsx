import { ClientHeader } from '@/components/client-header';
import { ClientSidebar } from '@/components/client-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { ClientPortalProvider } from '@/contexts/client-portal-context';

export const metadata: Metadata = {
  title: 'Portal del Cliente - Acredita PGA',
  description: 'Portal de autoservicio para clientes del sistema Acredita PGA.',
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientPortalProvider>
      <SidebarProvider>
        <ClientSidebar />
        <SidebarInset>
          <ClientHeader />
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900">
            {children}
          </main>
          <footer className="shrink-0 p-4 text-center text-sm font-semibold text-muted-foreground bg-slate-200 dark:bg-slate-950/50">
            Dirección de Tecnología y Comunicaciones del CESAC - by Kendy Qualey - Versión 1.0 - @ 2025
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </ClientPortalProvider>
  );
}
