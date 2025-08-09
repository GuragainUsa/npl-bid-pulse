-- NPL Auction Database Schema
-- Create players table with all required fields
CREATE TABLE public.players (
  id SERIAL PRIMARY KEY,
  sn INTEGER UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  province TEXT NOT NULL,
  player_type TEXT NOT NULL,
  batting_role TEXT,
  bowling_role TEXT,
  category TEXT NOT NULL CHECK (category IN ('A', 'B', 'C', 'S', 'LT')),
  wicket_keeper BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  team_name TEXT,
  status TEXT CHECK (status IN ('sold', 'unsold', 'retained')) DEFAULT NULL,
  sold_price INTEGER DEFAULT NULL,
  interested_teams TEXT[] DEFAULT '{}',
  base_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auction_state table to manage current auction status
CREATE TABLE public.auction_state (
  id SERIAL PRIMARY KEY,
  current_player_id INTEGER REFERENCES public.players(id),
  current_bid INTEGER DEFAULT NULL,
  highest_bidder TEXT DEFAULT NULL,
  auction_active BOOLEAN DEFAULT FALSE,
  lucky_draw_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial auction state
INSERT INTO public.auction_state (auction_active) VALUES (FALSE);

-- Create teams table for team information
CREATE TABLE public.teams (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  total_purse INTEGER DEFAULT 9000000, -- 90 lakhs in NPR
  remaining_purse INTEGER DEFAULT 9000000,
  grade_a_count INTEGER DEFAULT 0,
  grade_b_count INTEGER DEFAULT 0,
  grade_c_count INTEGER DEFAULT 0,
  marquee_count INTEGER DEFAULT 0,
  local_talent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 8 NPL teams
INSERT INTO public.teams (name, display_name) VALUES 
('janakpur_bolts', 'Janakpur Bolts'),
('sudurpaschim_royals', 'Sudurpaschim Royals'),
('karnali_yaks', 'Karnali Yaks'),
('chitwan_rhinos', 'Chitwan Rhinos'),
('kathmandu_gurkhas', 'Kathmandu Gurkhas'),
('biratnagar_kings', 'Biratnagar Kings'),
('pokhara_avengers', 'Pokhara Avengers'),
('lumbini_lions', 'Lumbini Lions');

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required for viewing)
CREATE POLICY "Players are viewable by everyone" ON public.players FOR SELECT USING (true);
CREATE POLICY "Auction state is viewable by everyone" ON public.auction_state FOR SELECT USING (true);
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);

-- Admin policies for insert/update (would need admin authentication in production)
CREATE POLICY "Admin can manage players" ON public.players FOR ALL USING (true);
CREATE POLICY "Admin can manage auction state" ON public.auction_state FOR ALL USING (true);
CREATE POLICY "Admin can manage teams" ON public.teams FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auction_state_updated_at
  BEFORE UPDATE ON public.auction_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER TABLE public.players REPLICA IDENTITY FULL;
ALTER TABLE public.auction_state REPLICA IDENTITY FULL;
ALTER TABLE public.teams REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;