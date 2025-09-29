"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LockContextType = {
  isLocked: boolean;
  lockScreen: () => void;
  unlockScreen: () => void;
};

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);

  const lockScreen = () => setIsLocked(true);
  const unlockScreen = () => setIsLocked(false);

  return (
    <LockContext.Provider value={{ isLocked, lockScreen, unlockScreen }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  const context = useContext(LockContext);
  if (context === undefined) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
}
