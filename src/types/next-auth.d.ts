// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      usuario: string
      departamento: string
      nivelPerfil: string
      rango: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    usuario: string
    departamento: string
    nivelPerfil: string
    rango: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    usuario: string
    departamento: string
    nivelPerfil: string
    rango: string
  }
}