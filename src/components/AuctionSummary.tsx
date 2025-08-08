import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuctionLogEntry {
  id: string;
  timestamp: Date;
  playerName: string;
  team: string;
  action: 'bid' | 'sold' | 'unsold' | 'started';
  amount?: number;
  category: 'A' | 'B' | 'C';
}

interface AuctionSummaryProps {
  auctionLog: AuctionLogEntry[];
}

export function AuctionSummary({ auctionLog }: AuctionSummaryProps) {
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'sold': return 'bg-success text-success-foreground';
      case 'bid': return 'bg-warning text-warning-foreground';
      case 'unsold': return 'bg-destructive text-destructive-foreground';
      case 'started': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" />
          Auction Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          {auctionLog.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No auction activity yet</p>
              <p className="text-sm">Bidding history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auctionLog.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground font-mono">
                    {formatTime(entry.timestamp)}
                  </div>

                  {/* Action Badge */}
                  <Badge 
                    className={cn(
                      "text-xs font-medium px-2 py-1",
                      getActionColor(entry.action)
                    )}
                  >
                    {entry.action.toUpperCase()}
                  </Badge>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {entry.playerName}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs px-1 py-0",
                          entry.category === 'A' && "border-category-a text-category-a",
                          entry.category === 'B' && "border-category-b text-category-b",
                          entry.category === 'C' && "border-category-c text-category-c"
                        )}
                      >
                        {entry.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {entry.team && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className={cn(
                            "font-medium",
                            `text-${teamColors[entry.team] || 'primary'}`
                          )}>
                            {teamDisplayNames[entry.team] || entry.team}
                          </span>
                        </div>
                      )}
                      {entry.amount && (
                        <span className="text-muted-foreground">
                          NPR {entry.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}