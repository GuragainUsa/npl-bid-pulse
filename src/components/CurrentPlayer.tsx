import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Target, Zap, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Confetti } from "./Confetti";
import { useEffect, useState } from "react";

interface Player {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  player_type: string;
  batting_role?: string;
  bowling_role?: string;
  category: 'A' | 'B' | 'C' | 'S' | 'LT';
  province: string;
  wicket_keeper: boolean;
  image_url?: string;
  base_price: number;
  status?: 'sold' | 'unsold' | 'retained';
  team_name?: string;
  sold_price?: number;
  updated_at?: string;
}

interface CurrentPlayerProps {
  player: Player | null;
  currentBid: number | null;
  lastAuctionedPlayer?: Player | null;
}

export function CurrentPlayer({ player, currentBid, lastAuctionedPlayer }: CurrentPlayerProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastSoldPlayer, setLastSoldPlayer] = useState(lastAuctionedPlayer);

  // Handle confetti when player is sold
  useEffect(() => {
    if (lastAuctionedPlayer?.status === 'sold' && lastAuctionedPlayer.id !== lastSoldPlayer?.id) {
      setShowConfetti(true);
      setLastSoldPlayer(lastAuctionedPlayer);
    }
  }, [lastAuctionedPlayer, lastSoldPlayer]);

  // Show last auctioned player if no current player
  const displayPlayer = player || lastAuctionedPlayer;
  const isLastAuctioned = !player && lastAuctionedPlayer;

  if (!displayPlayer) {
    return (
      <Card className="p-8 text-center bg-gradient-subtle border-2 border-dashed border-muted-foreground/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
          <p className="text-xl text-muted-foreground">No player selected for auction</p>
        </div>
      </Card>
    );
  }

  const fullName = `${displayPlayer.first_name}${displayPlayer.middle_name ? ` ${displayPlayer.middle_name}` : ''} ${displayPlayer.last_name}`;
  const categoryColors = {
    S: 'category-s',
    A: 'category-a',
    B: 'category-b', 
    C: 'category-c',
    LT: 'category-lt'
  };

  const getCategoryDisplayName = (category: 'A' | 'B' | 'C' | 'S' | 'LT') => {
    switch (category) {
      case 'S': return 'Marquee';
      case 'A': return 'Grade A';
      case 'B': return 'Grade B';
      case 'C': return 'Grade C';
      case 'LT': return 'Local Talent';
      default: return category;
    }
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Card className={cn(
        "p-8 bg-gradient-subtle border-0 shadow-auction",
        isLastAuctioned && "border-2 border-muted-foreground/30"
      )}>
        <div className="flex flex-col items-center gap-6">
          {/* Player Image */}
          <div className="relative">
            <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-primary shadow-glow">
              {displayPlayer.image_url ? (
                <img 
                  src={displayPlayer.image_url} 
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/160x160/dc2626/ffffff?text=' + displayPlayer.first_name.charAt(0);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary-foreground">
                    {displayPlayer.first_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <Badge 
              className={cn(
                "absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-6 py-2 text-lg font-bold",
                `bg-${categoryColors[displayPlayer.category]} text-white border-0`
              )}
            >
              {getCategoryDisplayName(displayPlayer.category)}
            </Badge>
          </div>

        {/* Player Info */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{fullName}</h2>
          
          {/* Status for last auctioned player */}
          {isLastAuctioned && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-muted-foreground font-mono">
                {displayPlayer.updated_at ? new Date(displayPlayer.updated_at).toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '--:--'}
              </div>
              {displayPlayer.status === 'sold' ? (
                <Badge className="bg-success text-success-foreground px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  SOLD
                </Badge>
              ) : displayPlayer.status === 'retained' ? (
                <Badge className="bg-secondary text-secondary-foreground px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  RETAINED
                </Badge>
              ) : (
                <Badge className="bg-destructive text-destructive-foreground px-3 py-1">
                  <XCircle className="w-4 h-4 mr-1" />
                  UNSOLD
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">{displayPlayer.province}</Badge>
            <Badge variant="outline">{displayPlayer.player_type}</Badge>
            {displayPlayer.wicket_keeper && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                Wicket Keeper
              </Badge>
            )}
          </div>

          {/* Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            {displayPlayer.batting_role && (
              <div className="flex items-center gap-2 justify-center">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{displayPlayer.batting_role}</span>
              </div>
            )}
            {displayPlayer.bowling_role && (
              <div className="flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{displayPlayer.bowling_role}</span>
              </div>
            )}
          </div>

          {/* Pricing and Status */}
          <div className="space-y-2">
            {isLastAuctioned ? (
              // Show sold/unsold info for last auctioned player
              <div className="text-center space-y-2">
                {displayPlayer.status === 'sold' && displayPlayer.sold_price && (
                  <div className="space-y-1">
                    <div className="text-lg font-medium text-success">
                      Sold for: NPR {displayPlayer.sold_price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Team: {displayPlayer.team_name || 'Unknown'}
                    </div>
                  </div>
                )}
                {displayPlayer.status === 'retained' && (
                  <div className="text-lg font-medium text-secondary">
                    Retained by Team
                  </div>
                )}
                {displayPlayer.status === 'unsold' && (
                  <div className="text-lg font-medium text-destructive">
                    Remains Unsold
                  </div>
                )}
              </div>
            ) : (
              // Show normal bidding info for current player
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">Base Price:</span>
                  <span className="text-xl font-bold text-primary">
                    {displayPlayer.category === 'LT' ? 'FREE' : `NPR ${displayPlayer.base_price.toLocaleString()}`}
                  </span>
                </div>
                
                {currentBid && currentBid > displayPlayer.base_price && displayPlayer.category !== 'LT' && (
                  <div className="text-center space-y-2">
                    <Button variant="bid" size="lg" className="pointer-events-none">
                      Current Bid: NPR {currentBid.toLocaleString()}
                    </Button>
                    {/* Show bid limit */}
                    {(() => {
                      const bidLimits = {
                        'S': 2000000, // 20L for Marquee
                        'A': 1500000, // 15L
                        'B': 1000000, // 10L
                        'C': 500000   // 5L
                      };
                      const currentLimit = bidLimits[displayPlayer.category as keyof typeof bidLimits];
                      
                      if (currentLimit && currentBid >= currentLimit) {
                        return (
                          <div className="text-sm text-destructive font-medium">
                            Limit Reached: NPR {(currentLimit / 100000).toFixed(1)}L
                          </div>
                        );
                      } else if (currentLimit) {
                        return (
                          <div className="text-sm text-muted-foreground">
                            Limit: NPR {(currentLimit / 100000).toFixed(1)}L
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
    </>
  );
}