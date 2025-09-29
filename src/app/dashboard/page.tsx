
"use client";

import * as React from "react";
import {
  ArrowUp,
  ArrowDown,
  Settings2,
  Clock,
  ArchiveX,
  CheckCheck,
  Layers,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Building2,
  Plane,
  FilePlus2,
} from "lucide-react";
import * as RechartsPrimitive from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  React.useEffect(() => {
    redirect('/dashboard/acreditaciones');
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
        <p>Redireccionando...</p>
    </div>
  )
}
