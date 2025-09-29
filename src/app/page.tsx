
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Mail, Lock } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const [usuario, setUsuario] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  // Si ya está autenticado, redirigir
  React.useEffect(() => {
    if (session) {
      router.push('/gateway');
    }
  }, [session, router]);

  const isFormValid = usuario.trim() !== '' && password.trim() !== '';

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        usuario,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas');
      } else {
        router.push('/gateway');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="flex min-h-screen flex-col bg-cover bg-center bg-fixed"
        style={{
            backgroundImage: "url('https://media.istockphoto.com/id/1329380127/vector/technology-background-big-data-visualization-concept.jpg?s=612x612&w=0&k=20&c=FFDAH1VMuePevCoSI_jCrnLTJfwQxtkmDzewwxK2W64=')"
        }}
    >
      <div className="flex min-h-screen flex-col items-center justify-center bg-black/50 p-4">
        <main className="flex w-full max-w-4xl flex-1 items-center justify-center">
            <div className="grid w-full md:grid-cols-2 rounded-xl shadow-2xl overflow-hidden">
            
            <div className="relative hidden flex-col items-center justify-center bg-[#00297c] p-12 text-center text-white md:flex">
                <BrandLogo />
            </div>

            <div className="relative z-10 bg-[#2c3e50] p-8 sm:p-12">
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-cyan-400" />
                        <Label htmlFor="usuario" className="text-xs font-semibold uppercase text-gray-400">Usuario</Label>
                    </div>
                    <Input
                        id="usuario"
                        name="usuario"
                        type="text"
                        placeholder="admincargos"
                        required
                        className="mt-1 bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-400"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-cyan-400" />
                        <Label htmlFor="password"  className="text-xs font-semibold uppercase text-gray-400">Contraseña</Label>
                    </div>
                    <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        required 
                        className="mt-1 bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-400" 
                        placeholder="**********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me" className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                        <Label htmlFor="remember-me" className="font-normal text-gray-400">Recordarme</Label>
                    </div>
                    <Link href="#" className="font-semibold text-blue-500 hover:underline">
                        ¿Olvidó su contraseña?
                    </Link>
                    </div>
                    <Button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={cn(
                        "w-full h-11 shadow-md font-semibold text-white transform transition-all duration-300 hover:scale-105",
                        isFormValid && !isLoading
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-500 cursor-not-allowed'
                    )}
                    >
                    {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </Button>
                </form>
                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>¿Aún no eres miembro?</p>
                    <Button
                        asChild
                        className="mt-4 w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 text-base font-bold text-white border-none shadow-md transform transition-transform duration-200 hover:scale-105"
                    >
                        <Link href="https://servicios.cesac.mil.do/aomSoporte/respuestas.xhtml" target="_blank" rel="noopener noreferrer">
                            Solicitar Cuenta
                        </Link>
                    </Button>
                </div>
            </div>
            </div>
        </main>

        <footer className="w-full shrink-0 p-4 text-center text-sm font-semibold text-white/80">
            Dirección de Tecnología y Comunicaciones del CESAC - by Kendy Qualey - Versión 1.0 - @ 2025
        </footer>
      </div>
    </div>
  );
}
