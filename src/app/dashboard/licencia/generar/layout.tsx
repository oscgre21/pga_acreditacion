
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generar Licencia - Acredita PGA',
};

// This layout ensures the printable page doesn't inherit the main dashboard's UI
export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
