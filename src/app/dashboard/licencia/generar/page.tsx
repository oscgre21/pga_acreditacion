
'use client';

import React, { Suspense } from 'react';
import LicenseClientPage from './license-client-page';
import { Loader } from 'lucide-react';

export default function GenerateLicensePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200">
                <Loader className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg font-semibold text-gray-700">Cargando...</p>
            </div>
        }>
            <LicenseClientPage />
        </Suspense>
    );
}
