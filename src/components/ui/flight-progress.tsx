"use client";

import React, { useState, useEffect } from 'react';

const FaceIcon: React.FC<{ progress: number }> = ({ progress }) => {
    // Determine the mouth shape based on progress
    let mouthPath: string;
    if (progress < 33) {
      mouthPath = "M 8 18 Q 12 15, 16 18"; // Sad mouth
    } else if (progress < 66) {
      mouthPath = "M 8 17 H 16"; // Neutral mouth
    } else {
      mouthPath = "M 8 16 Q 12 22, 16 16"; // Happy mouth
    }

    return (
        <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Face background, color inherited from parent */}
            <circle cx="12" cy="12" r="10" />
            
            {/* Eyes, slightly darker than face color */}
            <circle cx="9" cy="10" r="1.5" fill="rgba(0,0,0,0.2)" />
            <circle cx="15" cy="10" r="1.5" fill="rgba(0,0,0,0.2)" />
            
            {/* Mouth, slightly darker than face color */}
            <path
                d={mouthPath}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
};


export const FlightProgress: React.FC<{ duration?: number; onComplete?: () => void; }> = ({ duration = 5000, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // This timeout ensures the animation starts after the component is mounted,
    // which is better for performance and visual consistency.
    const startTimer = setTimeout(() => {
      if (duration <= 0) {
        setProgress(100);
        if (onComplete) onComplete();
        return;
      }

      // We set a minimum interval time to prevent the browser from being overwhelmed.
      const intervalTime = Math.max(15, duration / 100); 
      const animationTimer = setInterval(() => {
        setProgress(prev => {
          const nextProgress = prev + 1;
          if (nextProgress >= 100) {
            clearInterval(animationTimer);
            // Allow the 100% to render before completing
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 300);
            return 100;
          }
          return nextProgress;
        });
      }, intervalTime);

      return () => clearInterval(animationTimer);
    }, 100);

    return () => clearTimeout(startTimer);
  }, [duration, onComplete]);

  // Calculate HSL color based on progress. Hue from 0 (red) to 120 (green).
  const hue = progress * 1.2;
  const color = `hsl(${hue}, 90%, 45%)`;

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      {/* Container for the face and the progress bar */}
      <div className="w-full relative h-8">
        {/* The face icon, absolutely positioned to move along the bar */}
        <div
          className="absolute z-10"
          style={{
            left: `${progress}%`,
            transform: 'translateX(-50%)',
            top: '-12px', // Adjusted for the new icon size
            transition: 'left 0.1s linear, color 0.1s linear',
            color: color, // Apply dynamic color
          }}
        >
          <FaceIcon progress={progress} />
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full bg-muted rounded-full h-3 absolute top-1/2 -translate-y-1/2">
          {/* Progress Bar Fill */}
          <div
            className="h-3 rounded-full"
            style={{ 
                width: `${progress}%`,
                backgroundColor: color, // Apply dynamic color
                transition: 'width 0.1s linear, background-color 0.1s linear' // Animate color change
            }}
          />
        </div>
      </div>
      
      {/* Percentage Text, positioned below */}
      <span className="text-xl font-bold" style={{ color: color }}>
        {Math.round(progress)}%
      </span>
    </div>
  );
};
