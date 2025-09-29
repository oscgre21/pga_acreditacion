
"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ReportesRedirectPage() {
    useEffect(() => {
        // Redirect to the main Liberaciones page which contains the report cards
        redirect('/dashboard/acreditaciones');
    }, []);

    return null;
}
