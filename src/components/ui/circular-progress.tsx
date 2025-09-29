
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(({ className, value, size = 48, strokeWidth = 5, ...props }, ref) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // A timeout ensures the animation is visible when the component loads
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // The offset is based on the animated 'progress' state
  const offset = circumference - (progress / 100) * circumference;

  const getProgressColor = (p: number) => {
    if (p <= 25) return "text-red-500";
    if (p < 75) return "text-amber-500";
    return "text-green-500";
  };

  // Color is determined by the final 'value', not the animated 'progress'
  const colorClass = getProgressColor(value);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center transition-transform duration-300 hover:scale-110",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          className="text-muted/20"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(
            // The transition is specifically for the stroke-dashoffset property
            "transition-[stroke-dashoffset] duration-1000 ease-out",
            colorClass
          )}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span
        className={cn(
          "absolute text-sm font-bold",
          colorClass
        )}
      >
        {`${Math.round(value)}%`}
      </span>
    </div>
  );
});
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
