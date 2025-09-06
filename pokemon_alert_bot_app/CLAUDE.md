# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokemon Alert Bot SaaS application that enables users to create and customize alert trackers for Pokémon card restocks and new releases across multiple retailers including Pokémon Center, Best Buy, Walmart, Target, and others. The system includes automated monitoring scripts, API integrations, and a user-friendly interface.

## Technology Stack

- **Frontend**: Next.js 15 with React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Database**: PostgreSQL with Prisma ORM
- **Job Queue**: BullMQ with Redis
- **Web Scraping**: Puppeteer
- **Notifications**: Resend (email), Twilio (SMS), Web Push

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database operations
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## Environment Setup

1. Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pokemon_alerts"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
REDIS_URL="redis://localhost:6379"
RESEND_API_KEY="your-resend-api-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

2. Set up PostgreSQL database
3. Set up Redis for job queue
4. Run `npm run db:generate` to generate Prisma client
5. Run `npm run db:push` to create database tables

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   └── alerts/         # Alert management pages
├── components/         # React components
├── lib/               # Utility functions
│   ├── auth.ts        # NextAuth configuration
│   ├── prisma.ts      # Prisma client
│   └── utils.ts       # General utilities
├── server/            # Backend logic
│   ├── api/           # tRPC API routes
│   ├── monitoring/    # Store monitoring scripts
│   └── notifications/ # Notification services
├── types/             # TypeScript type definitions
└── hooks/             # Custom React hooks

prisma/
└── schema.prisma      # Database schema
```

## Key Features

### Core Backend Functionality
- **User Authentication**: NextAuth.js with OAuth and credentials
- **Database Models**: Users, stores, products, alerts, stock checks, community reports
- **Store Monitoring**: Automated scripts for multiple retailers
- **Alert System**: Configurable alerts with multiple notification channels
- **Community Reports**: User-submitted stock status verification

### Frontend Interface
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication Flow**: Secure sign-in/sign-up with Google OAuth
- **Dashboard**: Real-time alert status and activity monitoring
- **Alert Management**: Create, modify, and manage alert configurations

### Monitoring System
- **Multi-Store Support**: Pokemon Center, Best Buy, Target, Walmart, etc.
- **Scheduled Jobs**: BullMQ for regular stock checking
- **Rate Limiting**: Anti-bot protection and proxy rotation
- **Stock Detection**: Real-time availability and price monitoring

## Database Schema

The application uses PostgreSQL with the following main models:
- `User` - User accounts and profiles
- `Store` - Retailer information and configuration
- `Product` - Pokemon card products and metadata
- `Alert` - User-configured alert rules
- `StockCheck` - Historical stock status data
- `CommunityReport` - User-submitted stock reports

## API Integration

### Store Monitoring
- Web scraping with Puppeteer for dynamic content
- Direct API integration where available
- Error handling and retry logic
- Proxy rotation for reliability

### Notification Channels
- Email notifications via Resend
- SMS alerts via Twilio
- Push notifications with web-push
- Webhook support for Discord/Slack

## Testing

- Testing framework setup pending
- Will include unit tests for core functions
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Deployment

- Docker containerization ready
- Environment variables configured
- Database migrations handled via Prisma
- Production optimizations in place

## Git Repository Information

- Main branch: `main`
- Follow conventional commits for change tracking
- Pull request workflow for feature development

## Development Notes

- The application is currently in active development
- Core authentication and database setup complete
- Store monitoring and alert features in progress
- Frontend components being developed iteratively