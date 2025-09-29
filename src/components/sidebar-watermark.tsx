export function SidebarWatermark(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div className="flex flex-col items-center gap-2 font-headline text-current" {...props}>
        <div className="flex h-24 w-24 items-center justify-center">
          <svg
            className="h-full w-full"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M32 32L18 18" stroke="currentColor" strokeWidth="3" opacity="0.6" />
            <path d="M32 32L18 46" stroke="currentColor" strokeWidth="3" opacity="0.6" />
            <path d="M32 32L46 18" stroke="currentColor" strokeWidth="3" opacity="0.6" />
            <path d="M32 32L46 46" stroke="currentColor" strokeWidth="3" opacity="0.6" />
            
            <rect x="10" y="10" width="16" height="16" rx="4" fill="currentColor" opacity="0.8" />
            <rect x="14" y="14" width="8" height="8" rx="2" fill="hsl(var(--sidebar-background))"/>
            
            <rect x="10" y="38" width="16" height="16" rx="4" fill="currentColor" opacity="0.8" />
            <rect x="14" y="42" width="8" height="8" rx="2" fill="hsl(var(--sidebar-background))"/>
            
            <rect x="38" y="10" width="16" height="16" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="42" y="14" width="8" height="8" rx="2" fill="hsl(var(--sidebar-background))"/>
            
            <rect x="38" y="38" width="16" height="16" rx="4" fill="currentColor" opacity="0.8" />
            <rect x="42" y="42" width="8" height="8" rx="2" fill="hsl(var(--sidebar-background))"/>

            <rect x="24" y="24" width="16" height="16" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="28" y="28" width="8" height="8" rx="2" fill="hsl(var(--sidebar-background))"/>
          </svg>
        </div>
        <div className="flex flex-col text-center">
          <span className="text-3xl font-bold leading-tight tracking-widest">P.G.A.</span>
          <span className="text-[10px] font-light tracking-[0.2em] opacity-80">PORTAL DE GESTION ADMINISTRATIVA</span>
        </div>
      </div>
    );
  }
  