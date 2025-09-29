
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { Notificacion } from '@prisma/client';

// Define types
type CardId = "tramites-proceso" | "tramites-completados" | "documentos-pendientes" | "notificaciones" | "personal-activo" | "vencimientos-proximos";

type VisibleCardsState = Record<CardId, boolean>;

interface ClientPortalContextType {
  visibleCards: VisibleCardsState;
  toggleCardVisibility: (cardId: CardId) => void;
  notificaciones: Notificacion[];
  markAllAsRead: () => void;
  unreadCount: number;
  isLoading: boolean;
}

// Create context with a default value
const ClientPortalContext = createContext<ClientPortalContextType | undefined>(undefined);

// Mock data
const initialVisibleCards: VisibleCardsState = {
  "tramites-proceso": true,
  "tramites-completados": true,
  "documentos-pendientes": true,
  "notificaciones": true,
  "personal-activo": true,
  "vencimientos-proximos": true,
};


// Provider component
export function ClientPortalProvider({ children }: { children: ReactNode }) {
  const [visibleCards, setVisibleCards] = useState<VisibleCardsState>(initialVisibleCards);

  // Reemplazar datos mock con hook real
  const {
    notificaciones = [],
    markAllAsRead,
    unreadCount,
    isLoading
  } = useNotificaciones();

  const toggleCardVisibility = (cardId: CardId) => {
    setVisibleCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const value = {
    visibleCards,
    toggleCardVisibility,
    notificaciones,
    markAllAsRead,
    unreadCount,
    isLoading,
  };

  return (
    <ClientPortalContext.Provider value={value}>
      {children}
    </ClientPortalContext.Provider>
  );
}

// Custom hook
export function useClientPortal() {
  const context = useContext(ClientPortalContext);
  if (context === undefined) {
    throw new Error('useClientPortal must be used within a ClientPortalProvider');
  }
  return context;
}

    