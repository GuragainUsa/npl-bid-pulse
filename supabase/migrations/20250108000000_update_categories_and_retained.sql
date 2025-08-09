-- Update players table to include new categories and retained status
ALTER TABLE public.players 
DROP CONSTRAINT IF EXISTS players_category_check;

ALTER TABLE public.players 
ADD CONSTRAINT players_category_check 
CHECK (category IN ('A', 'B', 'C', 'S', 'LT'));

ALTER TABLE public.players 
DROP CONSTRAINT IF EXISTS players_status_check;

ALTER TABLE public.players 
ADD CONSTRAINT players_status_check 
CHECK (status IN ('sold', 'unsold', 'retained'));

-- Add new columns to teams table
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS marquee_count INTEGER DEFAULT 0;

ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS local_talent_count INTEGER DEFAULT 0;

-- Function to automatically assign retained players to teams
CREATE OR REPLACE FUNCTION assign_retained_players_to_teams()
RETURNS void AS $$
DECLARE
  retained_player RECORD;
  team_name_val TEXT;
BEGIN
  -- Loop through all retained players that don't have a team_name
  FOR retained_player IN 
    SELECT * FROM players 
    WHERE status = 'retained' AND team_name IS NULL
  LOOP
    -- You can customize this logic based on your data structure
    -- Here are some examples:
    
    -- Option 1: Assign based on a specific field (e.g., 'retained_team')
    -- IF retained_player.retained_team IS NOT NULL THEN
    --   team_name_val := retained_player.retained_team;
    
    -- Option 2: Assign based on player category or other criteria
    -- IF retained_player.category = 'S' THEN
    --   team_name_val := 'kathmandu_gurkhas'; -- Assign marquee players to specific team
    
    -- Option 3: Round-robin assignment
    -- team_name_val := CASE 
    --   WHEN (retained_player.id % 8) = 0 THEN 'janakpur_bolts'
    --   WHEN (retained_player.id % 8) = 1 THEN 'sudurpaschim_royals'
    --   WHEN (retained_player.id % 8) = 2 THEN 'karnali_yaks'
    --   WHEN (retained_player.id % 8) = 3 THEN 'chitwan_rhinos'
    --   WHEN (retained_player.id % 8) = 4 THEN 'kathmandu_gurkhas'
    --   WHEN (retained_player.id % 8) = 5 THEN 'biratnagar_kings'
    --   WHEN (retained_player.id % 8) = 6 THEN 'pokhara_avengers'
    --   ELSE 'lumbini_lions'
    -- END;
    
    -- Option 4: Manual assignment based on player name or other criteria
    -- IF retained_player.first_name ILIKE '%kathmandu%' THEN
    --   team_name_val := 'kathmandu_gurkhas';
    -- ELSIF retained_player.first_name ILIKE '%pokhara%' THEN
    --   team_name_val := 'pokhara_avengers';
    -- END IF;
    
    -- For now, we'll use a simple round-robin assignment
    team_name_val := CASE 
      WHEN (retained_player.id % 8) = 0 THEN 'janakpur_bolts'
      WHEN (retained_player.id % 8) = 1 THEN 'sudurpaschim_royals'
      WHEN (retained_player.id % 8) = 2 THEN 'karnali_yaks'
      WHEN (retained_player.id % 8) = 3 THEN 'chitwan_rhinos'
      WHEN (retained_player.id % 8) = 4 THEN 'kathmandu_gurkhas'
      WHEN (retained_player.id % 8) = 5 THEN 'biratnagar_kings'
      WHEN (retained_player.id % 8) = 6 THEN 'pokhara_avengers'
      ELSE 'lumbini_lions'
    END;
    
    -- Update the player with the assigned team
    IF team_name_val IS NOT NULL THEN
      UPDATE players 
      SET team_name = team_name_val, updated_at = NOW()
      WHERE id = retained_player.id;
      
      RAISE NOTICE 'Assigned player % % to team %', 
        retained_player.first_name, 
        retained_player.last_name, 
        team_name_val;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically assign retained players when their status changes
CREATE OR REPLACE FUNCTION handle_retained_player_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If a player is marked as retained and doesn't have a team_name, assign them
  IF NEW.status = 'retained' AND NEW.team_name IS NULL THEN
    -- You can customize this logic based on how you want to assign retained players
    -- For example, assign to a default team or based on some other criteria
    NEW.team_name := 'default_team'; -- Replace with your logic
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS retained_player_assignment_trigger ON players;
CREATE TRIGGER retained_player_assignment_trigger
  BEFORE INSERT OR UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION handle_retained_player_assignment();
