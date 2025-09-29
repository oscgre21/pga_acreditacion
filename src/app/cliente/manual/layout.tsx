
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manual de Usuario - Portal del Cliente',
  description: 'Guía completa para utilizar el Portal del Cliente de Acredita PGA.',
};

export default function ManualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 dark:bg-gray-950 font-sans">
      {children}
    </div>
  );
}
