-- Create jam_sessions table
CREATE TABLE public.jam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(8) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  host_id UUID,
  host_nickname TEXT,
  privacy VARCHAR(20) DEFAULT 'public',
  access_code VARCHAR(20),
  playlist_id TEXT,
  playlist_name TEXT,
  current_track JSONB,
  playback_state JSONB DEFAULT '{"is_playing": false, "position_ms": 0}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_jam_sessions_code ON public.jam_sessions(code);
CREATE INDEX idx_jam_sessions_active ON public.jam_sessions(is_active);

-- Enable RLS
ALTER TABLE public.jam_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for jam_sessions
CREATE POLICY "Anyone can read active sessions"
  ON public.jam_sessions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can create sessions"
  ON public.jam_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
  ON public.jam_sessions FOR UPDATE
  USING (true);

-- Create jam_participants table
CREATE TABLE public.jam_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.jam_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  nickname TEXT NOT NULL,
  avatar_color VARCHAR(20) DEFAULT '#00d4ff',
  is_host BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_jam_participants_session ON public.jam_participants(session_id);
CREATE INDEX idx_jam_participants_active ON public.jam_participants(is_active);

-- Enable RLS
ALTER TABLE public.jam_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for jam_participants
CREATE POLICY "Anyone can read participants"
  ON public.jam_participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join sessions"
  ON public.jam_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their presence"
  ON public.jam_participants FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can leave sessions"
  ON public.jam_participants FOR DELETE
  USING (true);

-- Create jam_queue table
CREATE TABLE public.jam_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.jam_sessions(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_art TEXT,
  duration_ms INTEGER,
  added_by UUID REFERENCES public.jam_participants(id) ON DELETE SET NULL,
  added_by_nickname TEXT,
  position INTEGER NOT NULL,
  votes INTEGER DEFAULT 0,
  is_played BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_jam_queue_session ON public.jam_queue(session_id);
CREATE INDEX idx_jam_queue_position ON public.jam_queue(position);

-- Enable RLS
ALTER TABLE public.jam_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for jam_queue
CREATE POLICY "Anyone can read queue"
  ON public.jam_queue FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add to queue"
  ON public.jam_queue FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update queue items"
  ON public.jam_queue FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can remove from queue"
  ON public.jam_queue FOR DELETE
  USING (true);

-- Enable Realtime for all JAM tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.jam_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jam_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jam_queue;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_jam_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_jam_sessions_updated_at
  BEFORE UPDATE ON public.jam_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_jam_session_updated_at();