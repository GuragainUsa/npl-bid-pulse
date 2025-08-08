import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, DollarSign, Dice6 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Team {
  name: string;
  display_name: string;
  remaining_purse: number;
}

interface LiveAuctionStatusProps {
  currentBid: number | null;
  highestBidder: string | null;
  auctionActive: boolean;
  luckyDrawActive: boolean;
  teams: Team[];
  interestedTeams: string[];
}

export function LiveAuctionStatus({
  currentBid,
  highestBidder,
  auctionActive,
  luckyDrawActive,
  teams,
  interestedTeams
}: LiveAuctionStatusProps) {
  const teamDisplayNames: Record<string, string> = {
    'janakpur_bolts': 'Janakpur Bolts',
    'sudurpaschim_royals': 'Sudurpaschim Royals',
    'karnali_yaks': 'Karnali Yaks',
    'chitwan_rhinos': 'Chitwan Rhinos',
    'kathmandu_gurkhas': 'Kathmandu Gurkhas',
    'biratnagar_kings': 'Biratnagar Kings',
    'pokhara_avengers': 'Pokhara Avengers',
    'lumbini_lions': 'Lumbini Lions'
  };

  const teamColors: Record<string, string> = {
    'janakpur_bolts': 'team-1',
    'sudurpaschim_royals': 'team-2', 
    'karnali_yaks': 'team-3',
    'chitwan_rhinos': 'team-4',
    'kathmandu_gurkhas': 'team-5',
    'biratnagar_kings': 'team-6',
    'pokhara_avengers': 'team-7',
    'lumbini_lions': 'team-8'
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className="w-5 h-5 text-primary" />
          Live Auction Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Bid Status */}
        <div className="text-center space-y-3">
          {currentBid ? (
            <>
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold text-success">
                  NPR {currentBid.toLocaleString()}
                </span>
              </div>
              {highestBidder && (
                <Badge 
                  className={cn(
                    "text-white font-medium px-3 py-1",
                    `bg-${teamColors[highestBidder] || 'primary'}`
                  )}
                >
                  Leading: {teamDisplayNames[highestBidder] || highestBidder}
                </Badge>
              )}
            </>
          ) : (
            <div className="text-muted-foreground">
              <Timer className="w-8 h-8 mx-auto mb-2" />
              <p>Waiting for bidding to start...</p>
            </div>
          )}
        </div>

        {/* Lucky Draw */}
        {luckyDrawActive && (
          <div className="text-center py-4 bg-gradient-gold rounded-lg">
            <Dice6 className="w-8 h-8 mx-auto mb-2 animate-dice-roll" />
            <p className="font-bold text-foreground">Lucky Draw Active!</p>
          </div>
        )}

        {/* Auction Status */}
        <div className="flex justify-center">
          <Badge 
            variant={auctionActive ? "default" : "secondary"}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              auctionActive && "animate-pulse-glow"
            )}
          >
            {auctionActive ? "🔴 LIVE AUCTION" : "⏸️ AUCTION PAUSED"}
          </Badge>
        </div>

        {/* Interested Teams */}
        {interestedTeams.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Teams in Bidding War
            </h4>
            <div className="grid gap-2">
              {interestedTeams.map((teamName) => (
                <div 
                  key={teamName}
                  className={cn(
                    "p-2 rounded-md text-sm font-medium text-center transition-all duration-200",
                    `bg-${teamColors[teamName] || 'muted'}/20 border border-${teamColors[teamName] || 'border'}`,
                    teamName === highestBidder && "ring-2 ring-primary animate-pulse-glow"
                  )}
                >
                  {teamDisplayNames[teamName] || teamName}
                  {teamName === highestBidder && (
                    <Trophy className="w-4 h-4 inline-block ml-2 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Quick Stats
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Active Teams:</span>
              <span className="ml-2 font-medium">{interestedTeams.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Teams:</span>
              <span className="ml-2 font-medium">8</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}