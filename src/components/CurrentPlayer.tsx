import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Target, Zap, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  player_type: string;
  batting_role?: string;
  bowling_role?: string;
  category: 'A' | 'B' | 'C';
  province: string;
  wicket_keeper: boolean;
  image_url?: string;
  base_price: number;
}

interface CurrentPlayerProps {
  player: Player | null;
  currentBid: number | null;
}

export function CurrentPlayer({ player, currentBid }: CurrentPlayerProps) {
  if (!player) {
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

  const fullName = `${player.first_name}${player.middle_name ? ` ${player.middle_name}` : ''} ${player.last_name}`;
  const categoryColors = {
    A: 'category-a',
    B: 'category-b', 
    C: 'category-c'
  };

  return (
    <Card className="p-8 bg-gradient-subtle border-0 shadow-auction">
      <div className="flex flex-col items-center gap-6">
        {/* Player Image */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary shadow-glow">
            {player.image_url ? (
              <img 
                src={player.image_url} 
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/160x160/dc2626/ffffff?text=' + player.first_name.charAt(0);
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-6xl font-bold text-primary-foreground">
                  {player.first_name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <Badge 
            className={cn(
              "absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm font-bold",
              `bg-${categoryColors[player.category]} text-white border-0`
            )}
          >
            Category {player.category}
          </Badge>
        </div>

        {/* Player Info */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{fullName}</h2>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">{player.province}</Badge>
            <Badge variant="outline">{player.player_type}</Badge>
            {player.wicket_keeper && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                Wicket Keeper
              </Badge>
            )}
          </div>

          {/* Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            {player.batting_role && (
              <div className="flex items-center gap-2 justify-center">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{player.batting_role}</span>
              </div>
            )}
            {player.bowling_role && (
              <div className="flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{player.bowling_role}</span>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg">Base Price:</span>
              <span className="text-xl font-bold text-primary">
                NPR {player.base_price.toLocaleString()}
              </span>
            </div>
            
            {currentBid && currentBid > player.base_price && (
              <div className="text-center">
                <Button variant="bid" size="lg" className="pointer-events-none">
                  Current Bid: NPR {currentBid.toLocaleString()}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}