import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Import team logos
import BNK from "../../assets/club_logo/BNK.webp";
import CHR from "../../assets/club_logo/CHR.webp";
import JAB from "../../assets/club_logo/JAB.webp";
import KAG from "../../assets/club_logo/KAGnew.jpeg";
import KAY from "../../assets/club_logo/KAY.webp";
import LUL from "../../assets/club_logo/LULnew.jpg";
import POA from "../../assets/club_logo/POA.webp";
import SPR from "../../assets/club_logo/SPR.webp";

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  category: 'A' | 'B' | 'C' | 'S' | 'LT';
  player_type: string;
  wicket_keeper: boolean;
  sold_price?: number;
  team_name?: string;
  status?: 'sold' | 'unsold' | 'retained';
}

interface Team {
  id: number;
  name: string;
  display_name: string;
  remaining_purse: number;
  grade_a_count: number;
  grade_b_count: number;
  grade_c_count: number;
  marquee_count: number;
  local_talent_count: number;
}

interface TeamsOverviewProps {
  teams: Team[];
  players: Player[];
}

export function TeamsOverview({ teams, players }: TeamsOverviewProps) {
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

  const teamLogos: Record<string, string> = {
    'janakpur_bolts': JAB,
    'sudurpaschim_royals': SPR,
    'karnali_yaks': KAY,
    'chitwan_rhinos': CHR,
    'kathmandu_gurkhas': KAG,
    'biratnagar_kings': BNK,
    'pokhara_avengers': POA,
    'lumbini_lions': LUL
  };

  const getTeamPlayers = (teamName: string) => {
    return players.filter(player => player.team_name === teamName);
  };

  const sortPlayersByRole = (players: Player[]) => {
    const roleOrder = ['Batsman', 'Wicket Keeper', 'All-rounder', 'Bowler'];
    return players.sort((a, b) => {
      // First sort by role
      const roleA = a.wicket_keeper ? 'Wicket Keeper' : a.player_type;
      const roleB = b.wicket_keeper ? 'Wicket Keeper' : b.player_type;
      
      const indexA = roleOrder.indexOf(roleA);
      const indexB = roleOrder.indexOf(roleB);
      
      if (indexA !== indexB) {
        return indexA - indexB;
      }
      
      // If same role, sort by category (S, A, B, C, LT)
      const categoryOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'LT': 4 };
      return (categoryOrder[a.category] || 5) - (categoryOrder[b.category] || 5);
    });
  };

  const getCategoryColor = (category: 'A' | 'B' | 'C' | 'S' | 'LT') => {
    switch (category) {
      case 'S': return 'bg-category-s';
      case 'A': return 'bg-category-a';
      case 'B': return 'bg-category-b';
      case 'C': return 'bg-category-c';
      case 'LT': return 'bg-category-lt';
      default: return 'bg-muted';
    }
  };

  const getCategoryDisplayName = (category: 'A' | 'B' | 'C' | 'S' | 'LT') => {
    switch (category) {
      case 'S': return 'Marquee';
      case 'A': return 'A';
      case 'B': return 'B';
      case 'C': return 'C';
      case 'LT': return 'Local Talent';
      default: return category;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {teams.map((team) => {
        const teamPlayers = getTeamPlayers(team.name);
        const sortedPlayers = sortPlayersByRole(teamPlayers);
        const totalSpent = 11000000 - team.remaining_purse; // 110 lakhs - remaining . adding purse of marquee
        const teamLogo = teamLogos[team.name];
        
        return (
          <Card 
            key={team.id}
            className={cn(
              "h-full transition-all duration-200 hover:shadow-lg border-2",
              `hover:border-${teamColors[team.name] || 'primary'}/50`
            )}
          >
            <CardHeader 
              className={cn(
                "text-center text-white relative overflow-hidden",
                `bg-${teamColors[team.name] || 'primary'}`
              )}
              style={{
                backgroundImage: teamLogo ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${teamLogo})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Team Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
              </div>
              
              <div className="relative z-10">
                <CardTitle className="text-lg font-bold mb-2">
                  {team.display_name}
                </CardTitle>
                
                {/* Purse Info */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>Remaining: NPR {(team.remaining_purse / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="text-xs opacity-90">
                    Spent: NPR {(totalSpent / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              {/* Team Stats */}
              <div className="mb-4 grid grid-cols-5 gap-2 text-center">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Crown className="w-3 h-3" />
                    Marquee
                  </div>
                  <Badge 
                    variant={team.marquee_count >= 1 ? "destructive" : "outline"}
                    className="w-full justify-center"
                  >
                    {team.marquee_count}/1
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Grade A</div>
                  <Badge 
                    variant={team.grade_a_count >= 3 ? "destructive" : "outline"}
                    className="w-full justify-center"
                  >
                    {team.grade_a_count}/3
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Grade B</div>
                  <Badge 
                    variant={team.grade_b_count >= 4 ? "destructive" : "outline"}
                    className="w-full justify-center"
                  >
                    {team.grade_b_count}/4
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Grade C</div>
                  <Badge 
                    variant={team.grade_c_count >= 3 ? "destructive" : "outline"}
                    className="w-full justify-center"
                  >
                    {team.grade_c_count}/3
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    Local
                  </div>
                  <Badge 
                    variant="outline"
                    className="w-full justify-center"
                  >
                    {team.local_talent_count}
                  </Badge>
                </div>
              </div>

              {/* Players List */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Squad ({sortedPlayers.length})</span>
                </div>
                
                {sortedPlayers.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Award className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No players acquired</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {sortedPlayers.map((player) => (
                      <div 
                        key={player.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded text-white text-sm",
                          getCategoryColor(player.category)
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {player.first_name} {player.last_name}
                          </div>
                          <div className="text-xs opacity-90">
                            {player.wicket_keeper ? 'Wicket Keeper' : player.player_type}
                            {player.status === 'retained' && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                Retained
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-right">
                          <div className="font-medium">
                            {player.status === 'retained' ? 'Retained' : 
                             player.category === 'LT' ? 'Free' : 
                             `NPR ${((player.sold_price || 0) / 100000).toFixed(1)}L`}
                          </div>
                          <div className="opacity-80">
                            {getCategoryDisplayName(player.category)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}