
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/images/CESAC.png"
        alt="Logo del CESAC"
        width={150}
        height={114}
        priority
        data-ai-hint="logo"
        className="drop-shadow-2xl"
      />
      <h1 
        className="text-5xl font-extrabold tracking-tight text-white mt-4"
        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
      >
        CESAC
      </h1>
      <p 
        className="mt-4 text-lg max-w-xs text-white/80"
        style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}
      >
        Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil
      </p>
    </div>
  );
}
