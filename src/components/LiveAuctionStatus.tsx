import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, Dice6, Users, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Team {
  name: string;
  display_name: string;
  remaining_purse: number;
  grade_a_count: number;
  grade_b_count: number;
  grade_c_count: number;
  marquee_count: number;
  local_talent_count: number;
}

interface LiveAuctionStatusProps {
  currentBid: number | null;
  highestBidder: string | null;
  auctionActive: boolean;
  luckyDrawActive: boolean;
  teams: Team[];
  interestedTeams: string[];
  currentPlayer?: {
    category: 'A' | 'B' | 'C' | 'S' | 'LT';
  } | null;
  players?: any[]; // Add players prop for statistics
}

export function LiveAuctionStatus({
  currentBid,
  highestBidder,
  auctionActive,
  luckyDrawActive,
  teams,
  interestedTeams,
  currentPlayer,
  players = []
}: LiveAuctionStatusProps) {
  const formatTeamName = (teamName: string) => {
    return teamName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        {!auctionActive ? (
          // Show auction statistics when paused
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Auction Paused
              </Badge>
            </div>
            
            {/* Team Statistics Table */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Statistics
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Team</th>
                      <th className="text-center py-2">Budget</th>
                      <th className="text-center py-2">Grade A</th>
                      <th className="text-center py-2">Grade B</th>
                      <th className="text-center py-2">Grade C</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams
                      .sort((a, b) => b.remaining_purse - a.remaining_purse)
                      .map((team) => {
                        return (
                          <tr key={team.name} className="border-b last:border-0">
                            <td className="py-2 font-medium">{team.display_name}</td>
                            <td className="py-2 text-center">
                              <span className="font-mono">{(team.remaining_purse / 100000).toFixed(1)}L</span>
                            </td>
                            <td className="py-2 text-center">
                              <Badge 
                                variant={team.grade_a_count >= 3 ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                {team.grade_a_count}/3
                              </Badge>
                            </td>
                            <td className="py-2 text-center">
                              <Badge 
                                variant={team.grade_b_count >= 4 ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                {team.grade_b_count}/4
                              </Badge>
                            </td>
                            <td className="py-2 text-center">
                              <Badge 
                                variant={team.grade_c_count >= 3 ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                {team.grade_c_count}/3
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // Show current bid status when auction is active
          <>
            {/* Current Bid Status */}
            <div className="text-center space-y-3">
              {currentBid ? (
                <>
                  <div className="flex items-center justify-center gap-2">
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
                      Leading: {formatTeamName(highestBidder)}
                    </Badge>
                  )}
                  {/* Show limit reached warning */}
                  {currentPlayer && (() => {
                    const bidLimits = {
                      'S': 2000000, // 20L for Marquee
                      'A': 1500000, // 15L
                      'B': 1000000, // 10L
                      'C': 500000   // 5L
                    };
                    const currentLimit = bidLimits[currentPlayer.category as keyof typeof bidLimits];
                    
                    if (currentLimit && currentBid >= currentLimit) {
                      return (
                        <Badge variant="destructive" className="text-xs">
                          Limit Reached: NPR {(currentLimit / 100000).toFixed(1)}L
                        </Badge>
                      );
                    }
                    return null;
                  })()}
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
                className="px-4 py-2 text-sm font-medium"
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
                  {/* Show highest bidder first */}
                  {highestBidder && (
                    <div 
                      key={highestBidder}
                      className={cn(
                        "p-2 rounded-md text-sm font-medium text-center transition-all duration-200",
                        `bg-${teamColors[highestBidder] || 'muted'}/20 border border-${teamColors[highestBidder] || 'border'}`,
                        "ring-2 ring-primary bg-primary/30"
                      )}
                    >
                    {formatTeamName(highestBidder)}
                    <Trophy className="w-4 h-4 inline-block ml-2 text-primary" />
                  </div>
                )}
                {/* Show other teams */}
                {interestedTeams
                  .filter(teamName => teamName !== highestBidder)
                  .map((teamName) => (
                    <div 
                      key={teamName}
                      className={cn(
                        "p-2 rounded-md text-sm font-medium text-center transition-all duration-200",
                        `bg-${teamColors[teamName] || 'muted'}/20 border border-${teamColors[teamName] || 'border'}`
                      )}
                    >
                      {formatTeamName(teamName)}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="pt-4 border-t space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Auction Statistics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Players Sold:</span>
                <span className="ml-2 font-medium text-primary">{players.filter(p => p.status === 'sold').length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Players Unsold:</span>
                <span className="ml-2 font-medium text-destructive">{players.filter(p => p.status === 'unsold').length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Players Retained:</span>
                <span className="ml-2 font-medium text-secondary">{players.filter(p => p.status === 'retained').length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining:</span>
                <span className="ml-2 font-medium text-muted-foreground">{players.filter(p => !p.status).length}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);
}