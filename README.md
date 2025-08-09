# NPL Bid Pulse - Nepal Premier League Auction System

## Project Overview

NPL Bid Pulse is a real-time auction management system for the Nepal Premier League (NPL). The system provides live bidding, team management, and auction administration features.

## Recent Updates (Latest Version)

### New Player Categories
- **S (Marquee)**: Premium players with a maximum bid limit of NPR 20L. Each team can have only 1 marquee player.
- **LT (Local Talent)**: Local talent players who are FREE and don't cost any amount. Teams can have unlimited local talent players.
- **A, B, C**: Existing grade categories with their respective bid limits.

### Retained Players Feature
- Players can now have a "retained" status, meaning teams already own these players.
- Retained players are displayed in team overviews but don't participate in auctions.
- Team budget and slot calculations account for retained players.

### Enhanced Team Management
- Teams now track marquee and local talent player counts.
- Updated team overview displays all player categories with appropriate limits.
- Local talent players show as "FREE" in pricing displays.

## Features

### Live Auction Management
- Real-time bidding with automatic bid increments
- Category-specific bid limits (S: 20L, A: 15L, B: 10L, C: 5L)
- Lucky draw functionality for tie-breaking
- Live auction status and current bid tracking

### Team Overview
- Comprehensive team statistics including all player categories
- Visual indicators for category limits (Marquee: 1/1, Grade A: 3/3, etc.)
- Player sorting by role and category priority
- Budget tracking with remaining purse display

### Admin Panel
- Player selection and auction control
- Real-time team bidding simulation
- Auction statistics and progress tracking
- Category-specific bid limit enforcement

### Auction Summary
- Complete auction history with timestamps
- Status tracking (Sold, Unsold, Retained)
- Category and pricing information
- Interested teams tracking

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Build Tool**: Vite

## Database Schema

### Players Table
- Support for categories: A, B, C, S (Marquee), LT (Local Talent)
- Status: sold, unsold, retained
- Base price and sold price tracking
- Interested teams array

### Teams Table
- Budget management (90L total purse)
- Player count tracking for all categories
- Marquee and local talent specific counters

### Auction State Table
- Current player and bid tracking
- Auction and lucky draw status
- Real-time state management

## Getting Started

### Prerequisites
- Node.js & npm
- Supabase account and project

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd npl-bid-pulse

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Database Setup

1. Create a Supabase project
2. Run the migration files in the `supabase/migrations/` directory
3. Update the Supabase client configuration in `src/integrations/supabase/client.ts`

## Usage

### Admin Panel
- Access via the "Admin" button in the bottom-right corner
- Select players for auction
- Control bidding and auction flow
- Monitor team statistics

### Live Auction
- Real-time bidding interface
- Category-specific bid limits
- Team budget validation
- Lucky draw for tie-breaking

### Team Overview
- View all team rosters
- Track budget and player counts
- Monitor category limits
- See retained players

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/            # shadcn/ui components
│   └── ...            # Custom components
├── pages/             # Page components
├── integrations/      # External integrations
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
```

### Key Components
- `AdminPanel.tsx`: Auction administration
- `TeamsOverview.tsx`: Team roster display
- `CurrentPlayer.tsx`: Live auction interface
- `AuctionSummary.tsx`: Auction history
- `LiveAuctionStatus.tsx`: Real-time status

## Deployment

The project can be deployed using:
- **Lovable**: Click Share -> Publish
- **Vercel**: Connect GitHub repository
- **Netlify**: Deploy from Git
- **Custom hosting**: Build and deploy manually

## Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow the DNS configuration instructions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the Nepal Premier League auction system.
