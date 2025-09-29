
"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectPage() {
  useEffect(() => {
    redirect('/dashboard/reportes/incidentes');
  }, []);

  return null;
}
