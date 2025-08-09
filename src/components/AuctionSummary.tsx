import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerRow {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  category: 'A' | 'B' | 'C' | 'S' | 'LT';
  status: 'sold' | 'unsold' | 'retained' | null;
  team_name: string | null;
  sold_price?: number | null;
  updated_at: string | null;
  interested_teams: string[] | null;
}

interface AuctionSummaryProps {
  players: PlayerRow[];
  teams: { name: string; display_name: string }[];
}

export function AuctionSummary({ players, teams }: AuctionSummaryProps) {
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'sold': return 'bg-success text-success-foreground';
      case 'unsold': return 'bg-destructive text-destructive-foreground';
      case 'retained': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatTeamName = (teamName: string) => {
    return teamName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTeamDisplayName = (systemName: string | null) => {
    if (!systemName) return '';
    return teamDisplayNames[systemName] || teams.find(t => t.name === systemName)?.display_name || formatTeamName(systemName);
  };

  const interestedTeamsText = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.map(getTeamDisplayName).join(', ');
  };

  const playersWithActivity = [...players]
    .filter(p => p.status === 'sold' || p.status === 'unsold')
    .sort((a, b) => new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="h-full cursor-pointer">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Auction Summary
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] px-6">
              {playersWithActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No auction activity yet</p>
                  <p className="text-sm">Bidding history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {playersWithActivity.map((p) => (
                    <div 
                      key={p.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      {/* Timestamp */}
                      <div className="text-xs text-muted-foreground font-mono">
                        {p.updated_at ? formatTime(new Date(p.updated_at)) : '--:--'}
                      </div>

                      {/* Status Badge */}
                      <Badge 
                        className={cn(
                          "text-xs font-medium px-2 py-1",
                          getStatusColor(p.status)
                        )}
                      >
                        {(p.status || 'pending').toUpperCase()}
                      </Badge>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          {p.status === 'unsold' && (
                            <span>
                              {p.first_name} {p.last_name} remains unsold.
                            </span>
                          )}
                          {p.status === 'sold' && (
                            <span>
                              {p.first_name} {p.last_name} sold to {getTeamDisplayName(p.team_name)} at NPR {p.sold_price?.toLocaleString()}.
                            </span>
                          )}
                          {p.status === 'retained' && (
                            <span>
                              {p.first_name} {p.last_name} retained by {getTeamDisplayName(p.team_name)}.
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
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Auction Summary</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Player</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Team</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Interested Teams</th>
              </tr>
            </thead>
            <tbody>
              {playersWithActivity.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono">{p.updated_at ? formatTime(new Date(p.updated_at)) : '--:--'}</td>
                  <td className="py-2 pr-4">{p.first_name} {p.last_name}</td>
                  <td className="py-2 pr-4">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryDisplayName(p.category)}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4">
                    <Badge className={cn("px-2 py-0.5", getStatusColor(p.status))}>{(p.status || 'pending').toUpperCase()}</Badge>
                  </td>
                  <td className="py-2 pr-4">{getTeamDisplayName(p.team_name)}</td>
                  <td className="py-2 pr-4">
                    {p.category === 'LT' ? 'FREE' : (p.sold_price ? `NPR ${p.sold_price.toLocaleString()}` : '-')}
                  </td>
                  <td className="py-2 pr-4">{interestedTeamsText(p.interested_teams)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}