
import React, { Suspense } from "react";
import TramiteDetailClient from "./tramite-detail-client";
import { mockTramitesData } from "../../data";

// Fetch data on the server
async function getTramiteData(id: string) {
    return mockTramitesData[id as keyof typeof mockTramitesData] || null;
}

export default async function TramiteDetailPage({ params }: { params: { id: string } }) {
    const tramite = await getTramiteData(params.id);

    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center text-lg">Cargando detalles del trámite...</div>}>
            <TramiteDetailClient tramite={tramite} />
        </Suspense>
    )
}
