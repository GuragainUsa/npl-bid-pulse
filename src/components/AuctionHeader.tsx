import { Button } from "@/components/ui/button";
import { Trophy, Users, Gavel } from "lucide-react";
import nplHeroBanner from "@/assets/npl-hero-banner.jpg";

interface AuctionHeaderProps {
  currentView: 'auction' | 'teams';
  onViewChange: (view: 'auction' | 'teams') => void;
}

export function AuctionHeader({ currentView, onViewChange }: AuctionHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Hero Banner Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${nplHeroBanner})` }}
      />
      <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      
      {/* Header Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  Nepal Premier League
                </h1>
                <p className="text-white/80 text-lg">Player Auction 2024</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant={currentView === 'auction' ? 'gold' : 'team'}
                size="lg"
                onClick={() => onViewChange('auction')}
                className="flex items-center gap-2"
              >
                <Gavel className="w-5 h-5" />
                Live Auction
              </Button>
              <Button
                variant={currentView === 'teams' ? 'gold' : 'team'}
                size="lg"
                onClick={() => onViewChange('teams')}
                className="flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Team Overview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}