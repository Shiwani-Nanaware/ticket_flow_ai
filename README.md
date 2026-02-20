# TicketFlow AI - Enterprise ITSM Platform

An intelligent ticket resolution system powered by AI, designed to streamline IT Service Management (ITSM) operations with automated ticket resolution, human review workflows, and comprehensive analytics.

**Live Demo**: https://ticket-flow-ai-tau.vercel.app/

## Features

- **AI-Powered Ticket Resolution**: Automatically resolves tickets with confidence scoring
- **Smart Categorization**: Intelligent ticket categorization and routing
- **Human Review Workflow**: Escalation and manual review for complex tickets
- **Real-time Analytics**: Dashboard with key metrics and performance insights
- **SLA Compliance Tracking**: Monitor service level agreements
- **Explainability Panel**: Understand AI decision-making process
- **Enterprise-Grade UI**: Professional sidebar navigation and responsive design

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd bright-resolution-engine

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```


## Technology Stack

- **Vite** - Next generation frontend tooling
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **React Hook Form** - Efficient form handling
- **TanStack Query** - Data fetching and caching
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── AppLayout.tsx # Main layout shell
│   └── ...
├── pages/            # Page components
│   ├── Index.tsx     # Dashboard overview
│   ├── TicketSubmission.tsx
│   ├── AutoResolved.tsx
│   ├── HumanReview.tsx
│   ├── Analytics.tsx
│   └── NotFound.tsx
├── data/             # Mock data
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── App.tsx           # Main app component
```

## Pages

- **Overview** - Dashboard with key metrics and recent tickets
- **Submit Ticket** - Create new support tickets
- **Auto-Resolved** - View automatically resolved tickets
- **Human Review** - Manage tickets requiring human intervention
- **Analytics** - Performance metrics and insights



