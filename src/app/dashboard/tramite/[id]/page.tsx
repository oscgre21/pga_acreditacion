
import React, { Suspense } from "react";
import TramitePageUI from "./TramitePageUI";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center text-lg">Cargando detalles del trámite...</div>}>
            <TramitePageUI tramiteId={id} />
        </Suspense>
    );
}
