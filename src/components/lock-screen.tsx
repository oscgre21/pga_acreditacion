"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useLock } from '@/contexts/lock-context';

export function LockScreen() {
  const { unlockScreen } = useLock();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const handleUnlockAttempt = () => {
    if (password === '1234') {
      unlockScreen();
      toast({
        title: "Desbloqueado",
        description: "Bienvenido de nuevo.",
      });
    } else {
      setError(true);
      setTimeout(() => setError(false), 820); // Reset error animation
      toast({
        variant: "destructive",
        title: "Acceso Denegado",
        description: "La clave ingresada es incorrecta.",
      });
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUnlockAttempt();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0">
      <Card className={cn(
        "w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95",
        error && 'animate-shake'
      )}>
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person face" />
                <AvatarFallback>KQ</AvatarFallback>
              </Avatar>
            <div>
              <CardTitle className="text-2xl">Kendy Qualey</CardTitle>
              <CardDescription>La sesión está bloqueada.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Ingrese su clave"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Desbloquear
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
