
'use client';

import React, { Suspense } from "react";
import TramitePageUI from "../TramitePageUI";
import { mockTramitesData } from "../../../../mantenimiento/data";
import { useParams } from "next/navigation";

// Since this is now a client page, we don't use generateStaticParams here.
// The dynamic routing is handled by the parent layout.

export default function ActividadesPage() {
  const params = useParams();
  const tramiteId = params.id as string;

  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center text-lg">Cargando actividades...</div>}>
      <TramitePageUI tramiteId={tramiteId} />
    </Suspense>
  )
}
