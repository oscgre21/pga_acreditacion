
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Users, FolderKanban, ArrowRight, Menu, X, PlaneTakeoff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

const navItems = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'calendario', label: 'Calendario', icon: Calendar },
  { id: 'personal', label: 'Mi Personal', icon: Users },
  { id: 'tramites', label: 'Mis Trámites', icon: FolderKanban },
];

const AnimatedCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className={cn(
        "bg-white/60 dark:bg-black/50 backdrop-blur-xl border-white/20 dark:border-black/20 shadow-2xl rounded-3xl overflow-hidden transform-gpu transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]",
        className
      )}>
        {children}
      </Card>
    </motion.div>
  );
};

const FeatureSection = ({ id, title, description, imgSrc, imgHint, children, reverse = false }: { id: string, title: string, description: string, imgSrc: string, imgHint: string, children?: React.ReactNode, reverse?: boolean }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  
  return (
    <section id={id} ref={ref} className="min-h-[80vh] py-20 px-4 md:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto"
      >
        <div className={cn("space-y-6 text-foreground", reverse && "lg:order-last")}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-br from-primary via-slate-700 to-primary dark:from-primary dark:via-white dark:to-primary">{title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          {children && <div className="pt-4">{children}</div>}
        </div>
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="perspective-1000"
        >
             <Image 
                src={imgSrc} 
                alt={title} 
                width={1200} 
                height={800} 
                data-ai-hint={imgHint}
                className="rounded-3xl shadow-2xl object-cover transform-gpu rotate-y-0 hover:rotate-y-[-5deg] transition-transform duration-500 ease-out"
              />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default function ManualUsuarioPage() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  };
  
  const navContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
  };
  
  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-50 dark:bg-gray-950 text-foreground overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f633,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f622,transparent)]"></div>
      </div>
      
      {/* Mobile Menu Toggle */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X/> : <Menu />}
      </button>

      {/* Sidebar Navigation */}
      <AnimatePresence>
      {(isMenuOpen || isDesktop) && (
      <motion.aside 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 z-40 h-screen w-64 bg-black/80 dark:bg-black/90 text-white backdrop-blur-lg border-r border-white/10 p-6 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary p-2 rounded-lg"><PlaneTakeoff className="h-6 w-6"/></div>
            <h1 className="font-bold text-lg">Manual de Usuario</h1>
        </div>
        <nav>
          <motion.ul 
            className="space-y-2"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map(item => (
              <motion.li key={item.id} variants={navItemVariants}>
                <a 
                  href={`#${item.id}`} 
                  onClick={() => isMenuOpen && setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out",
                    activeSection === item.id 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-gray-300 hover:bg-white/20 hover:text-white hover:translate-x-1'
                  )}
                >
                  <item.icon className="h-5 w-5"/>
                  {item.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
      </motion.aside>
       )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:pl-64">
        <header className="relative h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={headerVariants}
                className="z-10"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 pb-2">
                    Bienvenido al Portal del Cliente
                </h1>
                <p className="max-w-3xl mx-auto mt-4 text-xl text-muted-foreground">
                    Esta guía interactiva está diseñada para ayudarte a navegar y aprovechar al máximo todas las herramientas que hemos creado para ti.
                </p>
                <Button asChild size="lg" className="mt-10 rounded-full font-bold text-lg px-8 py-6 shadow-2xl bg-gradient-to-r from-primary to-orange-500 text-white transform hover:scale-105 transition-transform duration-300">
                    <a href="#inicio">Empezar ahora <ArrowRight className="ml-2"/></a>
                </Button>
            </motion.div>
        </header>
        
        <main>
          <FeatureSection
            id="inicio"
            title="Un Dashboard Centralizado"
            description="Tu centro de operaciones. Visualiza de un vistazo las métricas más importantes, desde trámites en proceso hasta los próximos vencimientos. Diseñado para darte una visión clara y rápida del estado de tu cuenta."
            imgSrc="https://placehold.co/1200x800.png"
            imgHint="dashboard interface"
          >
            <AnimatedCard>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Puntos Clave</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                    <p>• Resumen visual con tarjetas interactivas.</p>
                    <p>• Acceso rápido a las notificaciones más recientes.</p>
                    <p>• Personaliza qué tarjetas de información deseas ver.</p>
                </CardContent>
            </AnimatedCard>
          </FeatureSection>
          
          <FeatureSection
            id="calendario"
            title="Calendario de Eventos Inteligente"
            description="Nunca más te pierdas una fecha importante. Nuestro calendario visualiza todos los vencimientos, renovaciones, licencias y cancelaciones. Filtra por tipo de evento y selecciona un día para ver todos los detalles."
            imgSrc="https://placehold.co/1200x800.png"
            imgHint="calendar schedule"
            reverse
          >
            <AnimatedCard>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Puntos Clave</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                    <p>• Códigos de color para identificar eventos fácilmente.</p>
                    <p>• Detalles del personal implicado en cada evento.</p>
                    <p>• Imprime un resumen mensual con un solo clic.</p>
                </CardContent>
            </AnimatedCard>
          </FeatureSection>

           <FeatureSection
            id="personal"
            title="Gestión Integral de Personal"
            description="Administra todas las habilitaciones de seguridad de tu equipo desde un solo lugar. Consulta perfiles, edita información, visualiza recomendaciones médicas y mantén un control estadístico de las habilitaciones."
            imgSrc="https://placehold.co/1200x800.png"
            imgHint="team management"
          >
            <AnimatedCard>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Puntos Clave</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                    <p>• Registra y edita perfiles de personal fácilmente.</p>
                    <p>• Filtros potentes para encontrar rápidamente a quien buscas.</p>
                    <p>• Imprime un CV detallado de cada miembro del personal.</p>
                </CardContent>
            </AnimatedCard>
          </FeatureSection>

          <FeatureSection
            id="tramites"
            title="Seguimiento de Trámites en Tiempo Real"
            description="Consulta el estado y el progreso de todas tus solicitudes. Desde la recepción hasta la entrega, visualiza cada paso en una línea de tiempo interactiva. Accede a los hallazgos, comunicaciones y documentos adjuntos de cada trámite."
            imgSrc="https://placehold.co/1200x800.png"
            imgHint="project tracking"
            reverse
          >
            <AnimatedCard>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Puntos Clave</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                    <p>• Línea de tiempo visual para cada trámite.</p>
                    <p>• Pestañas para ver estadísticas, discrepancias y resultados.</p>
                    <p>• Notificaciones directas sobre cualquier novedad.</p>
                </CardContent>
            </AnimatedCard>
          </FeatureSection>
        </main>
        
        <footer className="text-center py-10">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Creado por Kendy Qualey para CESAC. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
