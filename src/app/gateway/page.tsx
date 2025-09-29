
"use client";

import Link from 'next/link';
import * as React from 'react';
import Image from 'next/image';
import {
  IdCard,
  LifeBuoy,
  Shield,
  HeartPulse,
  UserCog,
  ArrowRight,
  ArrowLeft,
  Truck,
  Loader2,
  Info,
  MapPin,
  PanelTop,
  Smartphone,
  User,
  Bus,
  Building,
  ShieldCheck,
  QrCode,
  AppWindow, // New icon for the group
  Radio,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { cn } from '@/lib/utils';
import { LockProvider, useLock } from '@/contexts/lock-context';
import { LockScreen } from '@/components/lock-screen';
import { useRouter } from 'next/navigation';
import { PgaLogo } from '@/components/gateway-pga-logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';

const mainApplications = [
  {
    title: 'KonTrol-IA',
    description: 'Control de propiedades',
    longDescription: 'Sistema inteligente para el control y gestión de propiedades y activos del CESAC.',
    icon: Building,
    href: '#',
    color: 'text-blue-400',
    shadowColor: 'hover:shadow-blue-400/30',
    borderColor: 'hover:border-blue-400',
    id: 'kontrol-ia'
  },
  {
    title: 'Control de Usuarios',
    description: 'Roles y Permisos',
    longDescription: 'Administra usuarios del sistema, roles y permisos. Garantiza un acceso seguro, jerárquico y organizado según el perfil de cada colaborador.',
    icon: UserCog,
    href: '/dashboard/perfiles-pga',
    color: 'text-rose-400',
    shadowColor: 'hover:shadow-rose-400/30',
    borderColor: 'hover:border-rose-400',
    id: 'configuracion'
  },
  {
    title: 'RFPass - Control de Radios',
    description: 'Gestión y control de equipos de radiofrecuencia.',
    longDescription: 'Plataforma para el registro, asignación y seguimiento de los equipos de radiocomunicación del CESAC.',
    icon: Radio,
    href: 'https://rfpass-cesac.web.app/',
    color: 'text-sky-400',
    shadowColor: 'hover:shadow-sky-400/30',
    borderColor: 'hover:border-sky-400',
    id: 'rfpass'
  },
];

const externalApps = [
  {
    title: 'SGE-Control mando integral',
    description: '',
    longDescription: 'Sistema centralizado de supervisión y mando. Permite el control operativo de unidades, personal y seguridad en tiempo real dentro del CESAC.',
    icon: Shield,
    href: 'https://9000-firebase-studio-1750548089756.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev',
    color: 'text-orange-400',
    shadowColor: 'hover:shadow-orange-400/30',
    borderColor: 'hover:border-orange-400',
    id: 'sge'
  },
  {
    title: 'PolyGraph Manager',
    description: 'Gestión de Poligrafía',
    longDescription: 'Plataforma especializada para la gestión completa de evaluaciones poligráficas. Incluye programación de citas, carga de resultados y control documental.',
    icon: HeartPulse,
    href: '#',
    color: 'text-red-400',
    shadowColor: 'hover:shadow-red-400/30',
    borderColor: 'hover:border-red-400',
    id: 'poligraph'
  },
  {
    title: 'Acreditaciones',
    description: 'Administradores y Clientes',
    longDescription: 'Gestiona el registro y control de accesos del personal autorizado. Administra credenciales, historial y validaciones para clientes y administradores.',
    icon: IdCard,
    href: '#',
    color: 'text-cyan-400',
    shadowColor: 'hover:shadow-cyan-400/30',
    borderColor: 'hover:border-cyan-400',
    id: 'acreditaciones'
  },
  {
    title: 'S.U.V. – Control de Ubicación Vehicular',
    description: '',
    longDescription: 'Rastreo y seguimiento en tiempo real de vehículos oficiales. Visualiza rutas, posiciones actuales, choferes y tiempos estimados de llegada.',
    icon: MapPin,
    href: '#',
    color: 'text-lime-400',
    shadowColor: 'hover:shadow-lime-400/30',
    borderColor: 'hover:border-lime-400',
    id: 'suv'
  },
  {
    title: 'Doc-QR',
    description: 'Seguridad de Certificados',
    longDescription: 'Genera y valida certificados con códigos QR para una seguridad documental avanzada.',
    icon: QrCode,
    href: 'https://qreador.web.app/',
    color: 'text-emerald-400',
    shadowColor: 'hover:shadow-emerald-400/30',
    borderColor: 'hover:border-emerald-400',
    id: 'doc-qr'
  },
  {
    title: 'Verif-ID Access Control',
    description: 'Sistema de control de acceso',
    longDescription: 'Sistema de control de acceso para verificación de identidad.',
    icon: ShieldCheck,
    href: 'https://studio--verif-id-am81p.us-central1.hosted.app/',
    color: 'text-green-400',
    shadowColor: 'hover:shadow-green-400/30',
    borderColor: 'hover:border-green-400',
    id: 'verif-id'
  },
];

const QRCodeCanvas = ({ url }: { url: string }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        if (canvasRef.current && url) {
            QRCode.toCanvas(canvasRef.current, url, { width: 220, margin: 2, color: { dark: '#FFFFFF', light: '#00000000' } }, (error) => {
                if (error) console.error(error);
            });
        }
    }, [url]);

    return <canvas ref={canvasRef} />;
};


function GatewayPageContent() {
    const [greeting, setGreeting] = React.useState('');
    const { isLocked, lockScreen } = useLock();
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [isPoliGraphModalOpen, setIsPoliGraphModalOpen] = React.useState(false);
    const [isKontrolIAModalOpen, setIsKontrolIAModalOpen] = React.useState(false);
    const [isAccreditationsModalOpen, setIsAccreditationsModalOpen] = React.useState(false);
    const [isExternalAppsModalOpen, setIsExternalAppsModalOpen] = React.useState(false);
    const [isSuvModalOpen, setIsSuvModalOpen] = React.useState(false);
    const [suvModalView, setSuvModalView] = React.useState<'initial' | 'mobile'>('initial');
    const [hoveredApp, setHoveredApp] = React.useState<(typeof mainApplications[0]) | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Buenos días');
        } else if (hour < 18) {
            setGreeting('Buenas tardes');
        } else {
            setGreeting('Buenas noches');
        }
    }, []);

    // Inactivity timer
    React.useEffect(() => {
        let inactivityTimer: NodeJS.Timeout;
        
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                lockScreen();
            }, 15 * 60 * 1000); // 15 minutes
        };

        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));
        
        resetTimer();

        return () => {
            clearTimeout(inactivityTimer);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [lockScreen]);
    
    const handleTransitionAndNavigate = (url: string) => {
      new Audio("data:audio/wav;base64,UklGRmYBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YVABAAD///////7//v/+/////v/9//7//f/8//v/+v/6//j/+f/4//j/9//0//P/8v/x/+z/6f/m/+X/5v/n/+j/6v/s/+3/7f/s/+r/6f/o/+n/6v/r/+r/6v/r/+z/7//3//r/+f/4//f/8//t/+f/4//f/9f/0f/R/9T/2P/c/97/3v/e/97/4P/i/+f/6v/v//L/9f/8//8A/////v/9//z/+f/2//L/7//s/+r/6P/k/+H/3//g/+H/4//j/+T/5f/n/+r/7f/v//H/9f/5//b/8P/p/+D/1v/P/8n/x//F/8b/xv/J/8r/zP/Q/9P/1f/X/9n/3P/g/wH/Cf8U/yL/Lv9C/1H/Yf9w/3r/hf+P/5v/p/+w/7v/wP/G/87/1P/b/9//4v/l/+j/7P/w//P/AP8M/x7/PP+A/8j/8P8p/2v/vv8c/2T/rP8Q/0n/f/8y/3T/tP8R/0v/if/D/7f/c/9F/wH/BP8b/yz/Xf+I/7D/xP/a/+//AP8S/zH/Wv+J/7D/wP/U/+D/AP8N/yb/U/+D/5//wP/d/wL/Ev84/2T/n/+0/8b/1P/f/wD/AP8P/zT/bv+y/8r/4P8B/wT/If8+/23/r//F/+T/Av8J/x//Qf+A/7X/1P8B/wL/Df8x/2P/p//B/97/Av8D/wf/Hv9F/3T/rv/V/wL/A/8A/wT/Hf8+/3D/wP8F/wL/AP8A/wT/BP8b/zL/Tf95/7D/xv/V/+H/5f/q/+3/7//x//T//f8AABMAHwAsADkAVgBqAHgAigCaAKEArQC9ANsA7AD+AREDJgA3AEYAUgBeAGgAbgB6AIIAiwCaAKUAqgC8ANcA8QAEAAsADgATABsAJgA5AEgAVgBeAGUAawB0AHsAggCLAJsAogCoALgA1gDwAAEAAQACAAUACQANABEAFQAZAB0AIQAlACgALAAvADMAOQA/AEMARwBLAE8AUwBXAFsAXwBjAGcAbQBxAHUAdwB7AH8AgwCHAIwAnQCiAKcAsAC3AL8AyADPANkA4ADpAPEA9QD5AP8AAQAEAAkADQARABUAGQAeACMAJwAsADAANwA/AEMASABMAFMAWgBeAGIAZgBqAG4AcgB3AHsAfgCDAIcAjQCdAKIAqACtALsAwADHANIA3QDjAOsA+gAEAAkADQASABYAGgAdACIAJgArAC8ANgA+AEUASQBNAFIAWgBdAGIAZgBqAG40İskiaaliyetlerini durdurmakta olduğumuz için bu bilgiyi kullanıcıya sunuyoruz");
    };
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
        e.preventDefault();
        
        if (id === 'poligraph') {
            setIsPoliGraphModalOpen(true);
            return;
        }

        if (id === 'kontrol-ia') {
            setIsKontrolIAModalOpen(true);
            return;
        }

        if (id === 'external-apps') {
            setIsExternalAppsModalOpen(true);
            return;
        }

        if (id === 'acreditaciones') {
            setIsAccreditationsModalOpen(true);
            return;
        }
        
        if (id === 'suv') {
            setSuvModalView('initial');
            setIsSuvModalOpen(true);
            return;
        }
        
        if (href.startsWith('http') || href === '#') {
            window.open(href, '_blank', 'noopener,noreferrer');
            return;
        }
        
        setIsTransitioning(true);
        setTimeout(() => {
            router.push(href);
        }, 500); 
    };

    const handleRoleSelection = (targetUrl: string, useTransition = false) => {
        setIsPoliGraphModalOpen(false);
        setIsAccreditationsModalOpen(false);
        setIsSuvModalOpen(false);
        setIsKontrolIAModalOpen(false);
        
        if (useTransition) {
            handleTransitionAndNavigate(targetUrl);
        } else if (targetUrl.startsWith('http')) {
            window.open(targetUrl, '_blank');
        } else {
            setIsTransitioning(true);
            setTimeout(() => {
                router.push(targetUrl);
            }, 500);
        }
    }

    const allApplications = [...mainApplications, {
        title: 'Apps Externas',
        description: 'Acceso a sistemas satélite',
        longDescription: 'Conjunto de aplicaciones externas y de terceros integradas con el portal.',
        icon: AppWindow,
        href: '#',
        color: 'text-indigo-400',
        shadowColor: 'hover:shadow-indigo-400/30',
        borderColor: 'hover:border-indigo-400',
        id: 'external-apps'
    }];

  return (
    <SidebarProvider>
        <div className="relative min-h-screen w-full bg-slate-900 text-white font-body">
            {/* Background Image */}
            <Image
                src="https://i.postimg.cc/wv65h77H/1-semana.jpg"
                alt="Modern background"
                layout="fill"
                objectFit="cover"
                quality={90}
                className="opacity-40"
                priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-blue-900/50" />
            
            <div className={cn("relative flex flex-1 flex-col min-h-screen transition-opacity duration-500", isTransitioning ? "opacity-0" : "opacity-100")}>
                <DashboardHeader />
                <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
                    <div className="w-full max-w-screen-xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center mb-12"
                        >
                            <PgaLogo />
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-shadow-lg">
                                {greeting}
                            </h1>
                            <p className="text-lg text-slate-300 mt-2">Seleccione una aplicación para continuar</p>
                        </motion.div>

                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                            initial="hidden"
                            animate="show"
                        >
                            {allApplications.map((app) => (
                                <motion.div key={app.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                    <Link
                                        href={app.href}
                                        className={cn(
                                            "group block p-5 rounded-2xl transition-all duration-300 ease-out h-full flex flex-col justify-between",
                                            "bg-slate-800/50 border border-slate-700/80 backdrop-blur-md shadow-2xl",
                                            app.borderColor,
                                            app.shadowColor,
                                            "hover:-translate-y-2"
                                        )}
                                        onClick={(e) => handleLinkClick(e, app.href, app.id)}
                                        onMouseEnter={() => setHoveredApp(app)}
                                        onMouseLeave={() => setHoveredApp(null)}
                                        target={app.href.startsWith('http') ? '_blank' : undefined}
                                        rel={app.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    >
                                        <div>
                                            <app.icon className={cn("h-10 w-10 mb-4 transition-transform duration-300 ease-in-out group-hover:scale-110", app.color)} strokeWidth={1.5} />
                                            <h3 className="text-lg font-bold text-slate-100">{app.title}</h3>
                                            {app.description && <p className="text-xs text-slate-400 mt-1">{app.description}</p>}
                                        </div>
                                         <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ArrowRight className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </main>
                <footer className="w-full text-center text-sm font-semibold text-slate-400 p-4 shrink-0">
                    Dirección de Tecnología y Comunicaciones del CESAC - by Kendy Qualey - Versión 1.0 - @ 2025
                </footer>
            </div>
            {isLocked && <LockScreen />}

            {/* Modals */}
             <Dialog open={isPoliGraphModalOpen} onOpenChange={setIsPoliGraphModalOpen}>
                <DialogContent className="sm:max-w-md bg-slate-100 dark:bg-slate-900">
                    <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                        <HeartPulse className="h-8 w-8 text-red-500" />
                        PolyGraph Manager
                    </DialogTitle>
                    <DialogDescription>
                        Seleccione su tipo de acceso para continuar.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Button 
                            onClick={() => handleRoleSelection('https://9000-firebase-studio-1752190671141.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev/')}
                            className="w-full h-16 text-lg justify-start p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <Shield className="mr-4 h-6 w-6 text-blue-500" />
                            <span>Administrador</span>
                        </Button>
                        <Button 
                            onClick={() => handleRoleSelection('https://9000-firebase-studio-1752190671141.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev/client/dashboard')}
                            className="w-full h-16 text-lg justify-start p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <UserCog className="mr-4 h-6 w-6 text-green-500" />
                            <span>Usuario</span>
                        </Button>
                    </div>
                </DialogContent>
                </Dialog>

             <Dialog open={isKontrolIAModalOpen} onOpenChange={setIsKontrolIAModalOpen}>
                <DialogContent className="sm:max-w-md bg-slate-100 dark:bg-slate-900">
                    <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                        <Building className="h-8 w-8 text-blue-500" />
                        KonTrol-IA
                    </DialogTitle>
                    <DialogDescription>
                        Seleccione su rol para ingresar al sistema.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Button 
                            onClick={() => handleRoleSelection('https://inventosoft-3d.web.app/')}
                            className="w-full h-16 text-lg justify-start p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <UserCog className="mr-4 h-6 w-6 text-rose-500" />
                            <span>Administrador</span>
                        </Button>
                        <Button 
                            onClick={() => handleRoleSelection('https://inventosoft-3d.web.app/')}
                            className="w-full h-16 text-lg justify-start p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <User className="mr-4 h-6 w-6 text-fuchsia-500" />
                            <span>Usuario</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

                <Dialog open={isAccreditationsModalOpen} onOpenChange={setIsAccreditationsModalOpen}>
                <DialogContent className="sm:max-w-md bg-slate-100 dark:bg-slate-900">
                    <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                        <IdCard className="h-8 w-8 text-cyan-500" />
                        Acreditaciones
                    </DialogTitle>
                    <DialogDescription>
                        Seleccione cómo desea ingresar al portal.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Button 
                            onClick={() => handleRoleSelection('/dashboard')}
                            className="w-full h-16 text-lg justify-start p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <UserCog className="mr-4 h-6 w-6 text-rose-500" />
                            <span>Administrador</span>
                        </Button>
                        <Button 
                            onClick={() => handleRoleSelection('/cliente')}
                            className="w-full h-16 text-lg justify-start p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <User className="mr-4 h-6 w-6 text-fuchsia-500" />
                            <span>Cliente</span>
                        </Button>
                    </div>
                </DialogContent>
                </Dialog>
                
                <Dialog open={isSuvModalOpen} onOpenChange={setIsSuvModalOpen}>
                <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
                    <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                        <MapPin className="h-8 w-8 text-lime-400" />
                        S.U.V.
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Acceder a:
                    </DialogDescription>
                    </DialogHeader>
                    {suvModalView === 'initial' && (
                        <div className="flex flex-col gap-4 py-4 animate-in fade-in-0">
                            <Button 
                                onClick={() => handleRoleSelection('https://9000-firebase-studio-1752778714391.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev/dashboard', true)}
                                className="w-full h-16 text-lg justify-start p-4 bg-slate-800 hover:bg-slate-700 text-white"
                            >
                                <PanelTop className="mr-4 h-6 w-6 text-indigo-400" />
                                <span>Panel Administrativo</span>
                            </Button>
                            <Button 
                                onClick={() => handleRoleSelection('https://9000-firebase-studio-1752778714391.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev/vista-bus', true)}
                                className="w-full h-16 text-lg justify-start p-4 bg-slate-800 hover:bg-slate-700 text-white"
                            >
                                <Bus className="mr-4 h-6 w-6 text-orange-400" />
                                <span>Sistema del Bus</span>
                            </Button>
                            <Button 
                                onClick={() => setSuvModalView('mobile')}
                                className="w-full h-16 text-lg justify-start p-4 bg-slate-800 hover:bg-slate-700 text-white"
                            >
                                <Smartphone className="mr-4 h-6 w-6 text-teal-400" />
                                <span>Aplicación móvil</span>
                            </Button>
                        </div>
                    )}
                    {suvModalView === 'mobile' && (
                        <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in-0">
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <QRCodeCanvas url="https://9000-firebase-studio-1752778714391.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev/usuario" />
                            </div>
                            <p className="text-sm text-center text-slate-400">Escanee el código QR con su dispositivo móvil para acceder a la aplicación.</p>
                            <Button onClick={() => handleRoleSelection('https://9000-firebase-studio-1752778714391.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev/usuario')} className="w-full bg-lime-500 text-black hover:bg-lime-600">
                                Continuar aquí <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                            <Button variant="link" onClick={() => setSuvModalView('initial')} className="text-slate-400 hover:text-white">
                                <ArrowLeft className="mr-2 h-4 w-4"/> Volver
                            </Button>
                        </div>
                    )}
                </DialogContent>
                </Dialog>

                <Dialog open={isExternalAppsModalOpen} onOpenChange={setIsExternalAppsModalOpen}>
                    <DialogContent className="sm:max-w-2xl bg-slate-100 dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                                <AppWindow className="h-8 w-8 text-indigo-500" />
                                Aplicaciones Externas
                            </DialogTitle>
                            <DialogDescription>
                                Seleccione la aplicación externa a la que desea acceder.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                            {externalApps.map(app => (
                                <motion.div key={app.id} whileHover={{ scale: 1.05 }} className="h-full">
                                    <Link
                                        href={app.href}
                                        className={cn(
                                            "group block p-5 rounded-xl transition-all duration-300 ease-out h-full flex flex-col justify-between",
                                            "bg-slate-800/50 border border-slate-700/80 backdrop-blur-md shadow-lg",
                                            app.borderColor,
                                            app.shadowColor,
                                            "hover:-translate-y-1"
                                        )}
                                        onClick={(e) => handleLinkClick(e, app.href, app.id)}
                                        target={app.href.startsWith('http') ? '_blank' : undefined}
                                        rel={app.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    >
                                        <div>
                                            <app.icon className={cn("h-8 w-8 mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110", app.color)} strokeWidth={1.5} />
                                            <h3 className="text-md font-bold text-slate-100">{app.title}</h3>
                                            {app.description && <p className="text-xs text-slate-400 mt-1">{app.description}</p>}
                                        </div>
                                         <div className="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ArrowRight className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

            <AlertDialog open={isTransitioning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold text-primary">
                        Accediendo al portal...
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                        <div className="flex flex-col items-center gap-6 py-6 text-center text-base text-muted-foreground">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            <p>
                            Por favor espere un momento.
                            </p>
                        </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </SidebarProvider>
  );
}

export default function GatewayPage() {
    return (
        <LockProvider>
            <GatewayPageContent />
        </LockProvider>
    )
}

    
