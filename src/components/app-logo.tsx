interface AppLogoProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
}

export function AppLogo({ title = "P.G.A.", subtitle = "Portal de Gestión Administrativa", ...props }: AppLogoProps) {
  return (
    <div
      className="flex items-center justify-start gap-3 font-headline group-data-[collapsible=icon]:justify-center"
      {...props}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
        <svg
          className="h-full w-full"
          viewBox="0 0 64 64"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="29" y="29" width="6" height="6" rx="2" />
          <rect x="16" y="16" width="12" height="12" rx="4" />
          <rect x="36" y="16" width="12" height="12" rx="4" />
          <rect x="16" y="36" width="12" height="12" rx="4" />
          <rect x="36" y="36" width="12" height="12" rx="4" />
        </svg>
      </div>
      <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
        <span className="text-lg font-bold leading-tight text-sidebar-foreground">
          {title}
        </span>
        <span className="text-xs leading-tight text-sidebar-foreground/80">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
