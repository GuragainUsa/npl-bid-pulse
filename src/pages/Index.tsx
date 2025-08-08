import { useState, useEffect } from "react";
import { AuctionHeader } from "@/components/AuctionHeader";
import { CurrentPlayer } from "@/components/CurrentPlayer";
import { LiveAuctionStatus } from "@/components/LiveAuctionStatus";
import { AuctionSummary } from "@/components/AuctionSummary";
import { TeamsOverview } from "@/components/TeamsOverview";
import { AdminPanel } from "@/components/AdminPanel";
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

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const auctionSubscription = supabase
      .channel('auction-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_state' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(auctionSubscription);
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch auction state
      const { data: auctionData } = await supabase
        .from('auction_state')
        .select('*')
        .single();

      // Fetch current player if any
      if (auctionData?.current_player_id) {
        const { data: playerData } = await supabase
          .from('players')
          .select('*')
          .eq('id', auctionData.current_player_id)
          .single();
        setCurrentPlayer(playerData);
        setInterestedTeams(playerData?.interested_teams || []);
      } else {
        setCurrentPlayer(null);
        setInterestedTeams([]);
      }

      // Fetch teams
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*');
      setTeams(teamsData || []);

      // Fetch all players
      const { data: playersData } = await supabase
        .from('players')
        .select('*');
      setPlayers(playersData || []);

      setCurrentBid(auctionData?.current_bid);
      setAuctionActive(auctionData?.auction_active || false);
      setLuckyDrawActive(auctionData?.lucky_draw_active || false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AuctionHeader currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'auction' ? (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Auction Summary */}
            <div className="lg:col-span-1">
              <AuctionSummary auctionLog={[]} />
            </div>

            {/* Center - Current Player */}
            <div className="lg:col-span-2">
              <CurrentPlayer player={currentPlayer} currentBid={currentBid} />
            </div>

            {/* Right Sidebar - Live Status */}
            <div className="lg:col-span-1">
              <LiveAuctionStatus
                currentBid={currentBid}
                highestBidder={null}
                auctionActive={auctionActive}
                luckyDrawActive={luckyDrawActive}
                teams={teams}
                interestedTeams={interestedTeams}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <TeamsOverview teams={teams} players={players.filter(p => p.status === 'sold')} />
        </div>
      )}

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