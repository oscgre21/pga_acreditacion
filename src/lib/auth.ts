// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { UsuarioService } from '@/lib/services/usuario.service'

const usuarioService = new UsuarioService()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        usuario: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.password) {
          return null
        }

        try {
          const user = await usuarioService.authenticateUser(
            credentials.usuario,
            credentials.password
          )

          return {
            id: user.id.toString(),
            name: user.nombre,
            email: user.correo,
            usuario: user.usuario,
            departamento: user.departamento,
            nivelPerfil: user.nivelPerfil,
            rango: user.rango,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.usuario = user.usuario
        token.departamento = user.departamento
        token.nivelPerfil = user.nivelPerfil
        token.rango = user.rango
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = parseInt(token.sub!)
        session.user.usuario = token.usuario as string
        session.user.departamento = token.departamento as string
        session.user.nivelPerfil = token.nivelPerfil as string
        session.user.rango = token.rango as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
}