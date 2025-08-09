import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Play, Pause, Dice6, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Player {
  id: number;
  sn: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  category: string;
  base_price: number;
  status?: string;
  team_name?: string;
  sold_price?: number;
  interested_teams?: string[];
}

interface Team {
  name: string;
  display_name: string;
  remaining_purse: number;
  marquee_count: number;
  local_talent_count: number;
}

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AdminPanel({ isVisible, onClose }: AdminPanelProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [auctionActive, setAuctionActive] = useState(false);
  const [luckyDrawActive, setLuckyDrawActive] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    if (isVisible) {
      fetchData();
      
      // Set up real-time subscription for admin panel
      const adminSubscription = supabase
        .channel('admin-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_state' }, () => {
          fetchData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
          fetchData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(adminSubscription);
      };
    }
  }, [isVisible]);

  const fetchData = async () => {
    try {
      
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('sn');
      
      if (playersError) throw playersError;
      setPlayers(playersData || []);

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');
      
      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      // Fetch auction state
      const { data: auctionData, error: auctionError } = await supabase
        .from('auction_state')
        .select('*')
        .single();
      
      if (auctionError) throw auctionError;
      
      if (auctionData?.current_player_id) {
        const selectedPlayer = playersData?.find(p => p.id === auctionData.current_player_id);
        setCurrentPlayer(selectedPlayer || null);
      } else {
        setCurrentPlayer(null);
      }
      
      setCurrentBid(auctionData?.current_bid || 0);
      setAuctionActive(auctionData?.auction_active || false);
      setLuckyDrawActive(auctionData?.lucky_draw_active || false);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const selectPlayer = async (playerId: number) => {
    try {
      const player = players.find(p => p.id === playerId);
      if (!player) return;

      // Update auction state
      const { error } = await supabase
        .from('auction_state')
        .update({
          current_player_id: playerId,
          current_bid: 0,
          highest_bidder: null,
          auction_active: true
        })
        .eq('id', 1);

      if (error) throw error;

      // Update local state for immediate UI feedback
      setCurrentPlayer(player);
      setCurrentBid(0);
      // setCurrentBid(player.base_price);
      setAuctionActive(true);

      toast({
        title: "Player Selected",
        description: `${player.first_name} ${player.last_name} is now up for auction`,
      });

    } catch (error) {
      console.error('Error selecting player:', error);
      toast({
        title: "Error",
        description: "Failed to select player",
        variant: "destructive",
      });
    }
  };

  const placeBid = async (teamName: string) => {
    if (!currentPlayer) return;

    // Define bid limits for each category
    const bidLimits = {
      'S': 2000000, // 20L for Marquee
      'A': 1500000, // 15L
      'B': 1000000, // 10L
      'C': 500000   // 5L
    };

    const bidIncrement = currentPlayer.category === 'C' ? 25000 : 50000;
    const currentLimit = bidLimits[currentPlayer.category as keyof typeof bidLimits];
    let newBid;    
    //
    if (currentBid === 0) {
      // First bid starts at base price
      newBid = currentPlayer.base_price;
    } else {
      newBid = currentBid + bidIncrement;
    }
        //
    // const newBid = currentBid + bidIncrement;
    try {
      // Check if we're at or above the limit
      if (currentLimit && currentBid >= currentLimit) {
        // At limit - just add to interested teams without increasing bid
        const { data: playerData, error: fetchError } = await supabase
          .from('players')
          .select('interested_teams')
          .eq('id', currentPlayer.id)
          .single();

        if (fetchError) throw fetchError;

        const interestedTeams = playerData?.interested_teams || [];
        if (!interestedTeams.includes(teamName)) {
          const { error: updateError } = await supabase
            .from('players')
            .update({
              interested_teams: [...interestedTeams, teamName]
            })
            .eq('id', currentPlayer.id);

          if (updateError) throw updateError;
        }

        toast({
          title: "Team Added",
          description: `${teams.find(t => t.name === teamName)?.display_name} added to interested teams (at limit: NPR ${(currentLimit / 100000).toFixed(1)}L)`,
        });
        return;
      }

      // Below limit - proceed with normal bidding
      const { error: auctionError } = await supabase
        .from('auction_state')
        .update({
          current_bid: newBid,
          highest_bidder: teamName
        })
        .eq('id', 1);

      if (auctionError) throw auctionError;

      // Update player's interested teams
      const { data: playerData, error: fetchError } = await supabase
        .from('players')
        .select('interested_teams')
        .eq('id', currentPlayer.id)
        .single();

      if (fetchError) throw fetchError;

      const interestedTeams = playerData?.interested_teams || [];
      if (!interestedTeams.includes(teamName)) {
        const { error: updateError } = await supabase
          .from('players')
          .update({
            interested_teams: [...interestedTeams, teamName]
          })
          .eq('id', currentPlayer.id);

        if (updateError) throw updateError;
      }

      // Update local state for immediate UI feedback
      setCurrentBid(newBid);

      toast({
        title: "Bid Placed",
        description: `${teams.find(t => t.name === teamName)?.display_name} bid NPR ${newBid.toLocaleString()}`,
      });

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid",
        variant: "destructive",
      });
    }
  };

  const finalizeAuction = async (sold: boolean, winningTeam?: string) => {
    if (!currentPlayer) return;

    try {
      if (sold && winningTeam) {
        // Update player as sold
        const { error: playerError } = await supabase
          .from('players')
          .update({
            status: 'sold',
            team_name: winningTeam,
            sold_price: currentBid
          })
          .eq('id', currentPlayer.id);

        if (playerError) throw playerError;

        // Update team purse and counts
        const team = teams.find(t => t.name === winningTeam);
        if (team) {
          const newPurse = team.remaining_purse - currentBid;
          
          // Determine which count field to update based on category
          let updateFields: any = { remaining_purse: newPurse };
          
          if (currentPlayer.category === 'S') {
            updateFields.marquee_count = (team.marquee_count || 0) + 1;
          } else if (currentPlayer.category === 'LT') {
            updateFields.local_talent_count = (team.local_talent_count || 0) + 1;
          } else {
          const categoryField = `grade_${currentPlayer.category.toLowerCase()}_count`;
            updateFields[categoryField] = (team[categoryField as keyof Team] as number || 0) + 1;
          }
          
          const { error: teamError } = await supabase
            .from('teams')
            .update(updateFields)
            .eq('name', winningTeam);

          if (teamError) throw teamError;
        }

        toast({
          title: "Player Sold",
          description: `${currentPlayer.first_name} ${currentPlayer.last_name} sold to ${teams.find(t => t.name === winningTeam)?.display_name} for NPR ${currentBid.toLocaleString()}`,
        });
      } else {
        // Mark as unsold
        const { error } = await supabase
          .from('players')
          .update({
            status: 'unsold'
          })
          .eq('id', currentPlayer.id);

        if (error) throw error;

        toast({
          title: "Player Unsold",
          description: `${currentPlayer.first_name} ${currentPlayer.last_name} remains unsold`,
        });
      }

      // Reset auction state
      const { error: resetError } = await supabase
        .from('auction_state')
        .update({
          current_player_id: null,
          current_bid: null,
          highest_bidder: null,
          auction_active: false,
          lucky_draw_active: false
        })
        .eq('id', 1);

      if (resetError) throw resetError;

      // Refresh data to update the admin panel state
      fetchData();

    } catch (error) {
      console.error('Error finalizing auction:', error);
      toast({
        title: "Error",
        description: "Failed to finalize auction",
        variant: "destructive",
      });
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'S': return 'Marquee';
      case 'A': return 'Grade A';
      case 'B': return 'Grade B';
      case 'C': return 'Grade C';
      case 'LT': return 'Local Talent';
      default: return category;
    }
  };

  if (!isVisible) return null;

  const availablePlayers = players.filter(p => !p.status);
  const fullName = currentPlayer ? 
    `${currentPlayer.first_name}${currentPlayer.middle_name ? ` ${currentPlayer.middle_name}` : ''} ${currentPlayer.last_name}` : '';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              NPL Auction Admin Panel
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Current Player Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Player for Auction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select onValueChange={(value) => selectPlayer(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a player to auction" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        #{player.sn} - {player.first_name} {player.last_name} ({getCategoryDisplayName(player.category)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentPlayer && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-bold text-lg mb-2">{fullName}</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <Badge className={cn(
                          "ml-2",
                          currentPlayer.category === 'S' && "bg-category-s",
                          currentPlayer.category === 'A' && "bg-category-a",
                          currentPlayer.category === 'B' && "bg-category-b",
                          currentPlayer.category === 'C' && "bg-category-c",
                          currentPlayer.category === 'LT' && "bg-category-lt"
                        )}>
                          {getCategoryDisplayName(currentPlayer.category)}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Base Price:</span>
                        <span className="ml-2 font-medium">
                          {currentPlayer.category === 'LT' ? 'FREE' : `NPR ${currentPlayer.base_price.toLocaleString()}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Bid:</span>
                        <span className="ml-2 font-bold text-primary">
                          {currentPlayer.category === 'LT' ? 'FREE' : `NPR ${currentBid.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bidding Controls */}
          {currentPlayer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dice6 className="w-5 h-5" />
                  Bidding Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {teams.map((team) => (
                    <Button
                      key={team.name}
                      variant="team"
                      className={cn(
                        "h-16 flex flex-col gap-1 text-sm",
                        `hover:bg-${teamColors[team.name]}/20 hover:border-${teamColors[team.name]}`
                      )}
                      onClick={() => placeBid(team.name)}
                      disabled={!auctionActive || currentPlayer.category === 'LT'}
                    >
                      <span className="font-medium">{team.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        NPR {(team.remaining_purse / 100000).toFixed(1)}L
                      </span>
                    </Button>
                  ))}
                </div>

                {/* Auction Control Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    variant={auctionActive ? "destructive" : "default"}
                    onClick={async () => {
                      try {
                        await supabase
                          .from('auction_state')
                          .update({ auction_active: !auctionActive })
                          .eq('id', 1);
                      } catch (error) {
                        console.error('Error toggling auction:', error);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    {auctionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {auctionActive ? "Pause Auction" : "Start Auction"}
                  </Button>

                  <Button
                    variant="gold"
                    onClick={async () => {
                      try {
                        await supabase
                          .from('auction_state')
                          .update({ lucky_draw_active: !luckyDrawActive })
                          .eq('id', 1);
                      } catch (error) {
                        console.error('Error toggling lucky draw:', error);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    {luckyDrawActive ? "Stop" : "Start"} Lucky Draw
                  </Button>

                  <Button
                    variant="sold"
                    onClick={async () => {
                      try {
                        const { data: auctionState } = await supabase
                          .from('auction_state')
                          .select('highest_bidder')
                          .eq('id', 1)
                          .single();
                        
                        if (auctionState?.highest_bidder) {
                          finalizeAuction(true, auctionState.highest_bidder);
                        } else {
                          toast({
                            title: "Error",
                            description: "No highest bidder found",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        console.error('Error getting highest bidder:', error);
                      }
                    }}
                    className="flex items-center gap-2"
                    disabled={!currentPlayer}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Sold
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => finalizeAuction(false)}
                    className="flex items-center gap-2"
                    disabled={!currentPlayer}
                  >
                    <XCircle className="w-4 h-4" />
                    Mark as Unsold
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Auction Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Auction Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{players.filter(p => p.status === 'sold').length}</div>
                  <div className="text-sm text-muted-foreground">Players Sold</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{players.filter(p => p.status === 'unsold').length}</div>
                  <div className="text-sm text-muted-foreground">Players Unsold</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{players.filter(p => p.status === 'retained').length}</div>
                  <div className="text-sm text-muted-foreground">Players Retained</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">{availablePlayers.length}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}