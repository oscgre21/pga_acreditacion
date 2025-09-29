export const PgaReportLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <div className="flex flex-col items-center text-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-slate-400 dark:stroke-slate-500">
          <path d="M32 34 L52 12" />
          <path d="M32 34 L12 24" />
          <path d="M32 34 L22 50" />
          <path d="M32 34 L42 50" />
        </g>
        <g>
          <rect x="5" y="17" width="14" height="14" rx="3" className="fill-cyan-400 dark:fill-cyan-500"/>
          <rect x="15" y="43" width="14" height="14" rx="3" className="fill-cyan-400 dark:fill-cyan-500"/>
          <rect x="35" y="43" width="14" height="14" rx="3" className="fill-cyan-400 dark:fill-cyan-500"/>
          <rect x="25" y="27" width="14" height="14" rx="3" className="fill-slate-400 dark:fill-slate-500"/>
          <rect x="45" y="5" width="14" height="14" rx="3" className="fill-slate-400 dark:fill-slate-500"/>
          <g className="fill-black/70 dark:fill-black/80">
              <rect x="10" y="22" width="4" height="4" rx="1" />
              <rect x="20" y="48" width="4" height="4" rx="1" />
              <rect x="40" y="48" width="4" height="4" rx="1" />
              <rect x="30" y="32" width="4" height="4" rx="1" />
              <rect x="50" y="10" width="4" height="4" rx="1" />
          </g>
        </g>
      </svg>
    </div>
);
