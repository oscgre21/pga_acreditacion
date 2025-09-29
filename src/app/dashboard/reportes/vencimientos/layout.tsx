import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reporte de Vencimientos - Acredita PGA',
};

// This layout ensures the printable report page doesn't inherit the main dashboard's UI
export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
