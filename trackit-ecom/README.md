# TrackIt Ecom

An automated expense and profit tracking application specifically designed for e-commerce business owners. TrackIt Ecom integrates with popular social media platforms (Facebook, Instagram, WhatsApp) to automate financial data collection while providing a comprehensive dashboard for manual entry and real-time reporting.

## Features

- **Automated Data Fetching**: Integrates with Facebook Graph API, Instagram Business API, and WhatsApp Business API
- **Approval Workflow**: Review and approve automatically fetched data before recording
- **Manual Data Entry**: User-friendly interface for manual expense and profit entry
- **Real-time Dashboard**: Customizable KPIs and financial visualizations
- **Comprehensive Reporting**: P&L statements, cash flow charts, expense breakdowns, product profitability
- **Multi-business Support**: Manage multiple e-commerce businesses from one account
- **Dark Mode**: Professional interface with light/dark theme options

## Tech Stack

- **Frontend**: Next.js 15 with React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication + Edge Functions)
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel (frontend) + Supabase Cloud (backend)
- **APIs**: OAuth 2.0 integration with social media platforms

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Facebook Developer account (for Facebook/Instagram APIs)
- WhatsApp Business API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trackit-ecom
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Fill in your API keys and configuration values.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
trackit-ecom/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # Basic UI components
│   │   ├── layout/         # Layout components
│   │   ├── charts/         # Chart components
│   │   └── forms/          # Form components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration
│   ├── types/              # TypeScript type definitions
│   └── constants/          # Application constants
├── database/               # Database migrations and schema
├── docs/                   # Documentation
├── tests/                  # Test files
└── public/                 # Static assets
```

## Features Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup and configuration
- [x] Basic UI components and design system
- [ ] Supabase setup and authentication

### Phase 2: Core Features (Weeks 3-6)
- [ ] Database schema implementation
- [ ] Manual data entry forms
- [ ] Basic dashboard and reporting

### Phase 3: API Integrations (Weeks 7-10)
- [ ] Facebook Graph API integration
- [ ] Instagram Business API integration
- [ ] WhatsApp Business API integration
- [ ] Automated data approval workflow

### Phase 4: Advanced Features (Weeks 11-12)
- [ ] Advanced reporting and analytics
- [ ] Product profitability tracking
- [ ] Dashboard customization

### Phase 5: Polish & Launch (Weeks 13-16)
- [ ] Performance optimization
- [ ] Security audit and compliance
- [ ] Documentation and testing
- [ ] Production deployment

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For support and questions, please refer to the documentation in the `docs/` directory or create an issue in the repository.