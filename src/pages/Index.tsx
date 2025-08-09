import { useState, useEffect } from "react";
import { AuctionHeader } from "@/components/AuctionHeader";
import { CurrentPlayer } from "@/components/CurrentPlayer";
import { LiveAuctionStatus } from "@/components/LiveAuctionStatus";
import { AuctionSummary } from "@/components/AuctionSummary";
import { TeamsOverview } from "@/components/TeamsOverview";
import { AdminPanel } from "@/components/AdminPanel";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [currentView, setCurrentView] = useState<'auction' | 'teams'>('auction');
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(null);
  const [auctionActive, setAuctionActive] = useState(false);
  const [luckyDrawActive, setLuckyDrawActive] = useState(false);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [interestedTeams, setInterestedTeams] = useState([]);
  const [lastAuctionedPlayer, setLastAuctionedPlayer] = useState(null);

  useEffect(() => {
    initializeApp();
    
    // Set up real-time subscriptions
    const auctionSubscription = supabase
      .channel('auction-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_state' }, (payload) => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, (payload) => {
        fetchData();
      })
      .subscribe((status) => {
        // Subscription status handled silently
      });

    return () => {
      supabase.removeChannel(auctionSubscription);
    };
  }, []);

  const [auctionData, setAuctionData] = useState(null);

  const initializeApp = async () => {
    try {
      // First fetch all data
      await fetchData();
      
      // Then ensure retained and sold players are properly assigned to teams
      await ensurePlayersAssignedToTeams();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const ensurePlayersAssignedToTeams = async () => {
    try {
      // Get all players with status 'sold' or 'retained' but no team_name
      const { data: unassignedPlayers, error: playersError } = await supabase
        .from('players')
        .select('*')
        .in('status', ['sold', 'retained'])
        .is('team_name', null);

      if (playersError) {
        console.error('Error fetching unassigned players:', playersError);
        return;
      }

      if (!unassignedPlayers || unassignedPlayers.length === 0) {
        return; // All players are properly assigned
      }

      // Get all teams
      const { data: allTeams, error: teamsError } = await supabase
        .from('teams')
        .select('*');

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        return;
      }

      if (!allTeams || allTeams.length === 0) {
        console.error('No teams found');
        return;
      }

      console.log(`Found ${unassignedPlayers.length} unassigned players. Auto-assigning...`);

      // Auto-assign using round-robin
      for (let i = 0; i < unassignedPlayers.length; i++) {
        const player = unassignedPlayers[i];
        const team = allTeams[i % allTeams.length];

        const { error: updateError } = await supabase
          .from('players')
          .update({ team_name: team.name })
          .eq('id', player.id);

        if (updateError) {
          console.error(`Error assigning player ${player.first_name} ${player.last_name}:`, updateError);
        } else {
          console.log(`Assigned ${player.first_name} ${player.last_name} (${player.status}) to ${team.display_name}`);
        }
      }

      // Refresh data after assignments
      await fetchData();
    } catch (error) {
      console.error('Error ensuring players are assigned to teams:', error);
    }
  };

  const fetchData = async () => {
    try {
      
      // Fetch auction state
      const { data: auctionStateData, error: auctionError } = await supabase
        .from('auction_state')
        .select('*')
        .single();

      if (auctionError) {
        console.error('Error fetching auction state:', auctionError);
        return;
      }

      setAuctionData(auctionStateData);

      // Fetch current player if any
      if (auctionStateData?.current_player_id) {
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('id', auctionStateData.current_player_id)
          .single();
        
        if (playerError) {
          console.error('Error fetching current player:', playerError);
        } else {
          setCurrentPlayer(playerData);
          setInterestedTeams(playerData?.interested_teams || []);
        }
      } else {
        setCurrentPlayer(null);
        setInterestedTeams([]);
        
        // If no current player, get the last auctioned player
        const { data: lastPlayerData } = await supabase
          .from('players')
          .select('*')
          .in('status', ['sold', 'unsold'])
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        
        setLastAuctionedPlayer(lastPlayerData || null);
      }

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');
      
      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
      } else {
        setTeams(teamsData || []);
      }

      // Fetch all players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*');
      
      if (playersError) {
        console.error('Error fetching players:', playersError);
      } else {
        setPlayers(playersData || []);
      }

      setCurrentBid(auctionStateData?.current_bid);
      setAuctionActive(auctionStateData?.auction_active || false);
      setLuckyDrawActive(auctionStateData?.lucky_draw_active || false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <AuctionHeader currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1">
        {currentView === 'auction' ? (
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Auction Summary */}
              <div className="lg:col-span-1">
                <AuctionSummary players={players} teams={teams} />
              </div>

              {/* Center - Current Player */}
              <div className="lg:col-span-2">
                <CurrentPlayer 
                player={currentPlayer} 
                currentBid={currentBid} 
                lastAuctionedPlayer={lastAuctionedPlayer}
              />
              </div>

              {/* Right Sidebar - Live Status */}
              <div className="lg:col-span-1">
                <LiveAuctionStatus
                  currentBid={currentBid}
                  highestBidder={auctionData?.highest_bidder || null}
                  auctionActive={auctionActive}
                  luckyDrawActive={luckyDrawActive}
                  teams={teams}
                  interestedTeams={interestedTeams}
                  currentPlayer={currentPlayer}
                  players={players}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-6">
            <TeamsOverview teams={teams} players={players.filter(p => p.status === 'sold' || p.status === 'retained')} />
          </div>
        )}
      </div>

      <Footer />

      {/* Admin Access Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-40"
        onClick={() => setShowAdmin(true)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Admin
      </Button>

      <AdminPanel isVisible={showAdmin} onClose={() => setShowAdmin(false)} />
    </div>
  );
}