# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application for PGA (Portal de Gestión Aeroportuaria) - a comprehensive airport management system built with Firebase and Google AI integration. The system handles personnel accreditation, profile management, and security operations.

## Development Commands

```bash
# Development
pnpm dev                 # Start Next.js development server with Turbopack
pnpm genkit:dev         # Start Genkit development server
pnpm genkit:watch       # Start Genkit with hot reload

# Build & Production
pnpm build              # Build the production application
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run Next.js linter
pnpm typecheck          # Run TypeScript type checking

# Testing
# No test commands configured - check with team for testing approach
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Genkit with Gemini 2.0 Flash model
- **Backend**: Firebase (Auth, Firestore, Functions, Hosting)
- **Forms**: React Hook Form with Zod validation

### Key Directories
- `/src/app/` - Next.js app router pages
  - `/dashboard/` - Admin dashboard pages
  - `/cliente/` - Client portal pages
  - `/gateway/` - API gateway endpoints
- `/src/components/` - Reusable React components
  - `/ui/` - shadcn/ui components library
- `/src/ai/` - AI/Genkit integration
  - `genkit.ts` - Main Genkit configuration
  - `/flows/` - AI workflow definitions
- `/src/contexts/` - React context providers
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions

### Application Structure
The system consists of two main portals:
1. **Dashboard** (`/dashboard/*`) - Administrative interface for managing:
   - Personnel profiles and accreditations
   - Companies and dependencies
   - Security services and validators
   - Incident reporting and analytics

2. **Client Portal** (`/cliente/*`) - User interface for:
   - Personal profile management
   - Document submissions
   - Request tracking
   - Calendar and notifications

### Important Configuration
- TypeScript path alias: `@/*` maps to `./src/*`
- Build warnings are currently ignored (TypeScript and ESLint)
- Images are unoptimized for Firebase Hosting compatibility
- Firebase project: `portalpgacesac1`

### AI Integration
The project uses Google Genkit for AI capabilities:
- Configuration in `src/ai/genkit.ts`
- Development server via `pnpm genkit:dev`
- Flows defined in `src/ai/flows/`