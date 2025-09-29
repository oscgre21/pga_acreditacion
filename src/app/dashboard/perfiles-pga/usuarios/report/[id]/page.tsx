
import React, { Suspense } from 'react';
import UserReportPageContent from './user-report-client';
import { usersData } from '../../data';

export async function generateStaticParams() {
    return usersData.map((user) => ({
        id: String(user.id),
    }));
}

async function getUserData(id: string) {
    return usersData.find(user => user.id === parseInt(id)) || null;
}

export default async function UserReportPage({ params }: { params: { id: string } }) {
    const user = await getUserData(params.id);

    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-lg">Cargando reporte...</div>}>
            <UserReportPageContent user={user} />
        </Suspense>
    )
}
