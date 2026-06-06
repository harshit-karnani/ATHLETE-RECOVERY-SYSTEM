-- 1. Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- 2. Create the clinical rehabilitation protocols table
drop table if exists public.historical_inferences;
drop table if exists public.rehab_protocols;
drop function if exists match_protocols;
drop function if exists match_inferences;

create table public.rehab_protocols (
  id uuid primary key default gen_random_uuid(),
  injury_type text,
  source_citation text,
  acute_phase_protocol text,
  sub_acute_protocol text,
  red_flags jsonb,
  return_to_play_criteria text,
  load_recommendation text,
  embedding vector(768) -- OpenAI text-embedding-3-small uses 1536 dimensions
);

-- 3. Create the historical inferences table for the semantic cache
create table if not exists public.historical_inferences (
  id uuid primary key default gen_random_uuid(),
  parsed_symptoms jsonb,
  generated_response jsonb,
  embedding vector(768),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create a function to match rehab protocols (RAG Retrieval)
-- This uses cosine similarity (<=>). A lower distance means a higher similarity.
create or replace function match_protocols(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  injury_type text,
  source_citation text,
  acute_phase_protocol text,
  sub_acute_protocol text,
  red_flags jsonb,
  return_to_play_criteria text,
  load_recommendation text,
  similarity float
)
language sql stable
as $$
  select
    rehab_protocols.id,
    rehab_protocols.injury_type,
    rehab_protocols.source_citation,
    rehab_protocols.acute_phase_protocol,
    rehab_protocols.sub_acute_protocol,
    rehab_protocols.red_flags,
    rehab_protocols.return_to_play_criteria,
    rehab_protocols.load_recommendation,
    1 - (rehab_protocols.embedding <=> query_embedding) as similarity
  from rehab_protocols
  where 1 - (rehab_protocols.embedding <=> query_embedding) > match_threshold
  order by rehab_protocols.embedding <=> query_embedding
  limit match_count;
$$;

-- 5. Create a function to match historical inferences (Semantic Cache Hit)
create or replace function match_inferences(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  parsed_symptoms jsonb,
  generated_response jsonb,
  created_at timestamp with time zone,
  similarity float
)
language sql stable
as $$
  select
    historical_inferences.id,
    historical_inferences.parsed_symptoms,
    historical_inferences.generated_response,
    historical_inferences.created_at,
    1 - (historical_inferences.embedding <=> query_embedding) as similarity
  from historical_inferences
  where 1 - (historical_inferences.embedding <=> query_embedding) > match_threshold
  limit match_count;
$$;

-- 6. Create tables for frontend data persistence (Sessions, Overrides, Injuries)
create table if not exists public.daily_sessions (
  id uuid primary key default gen_random_uuid(),
  athlete_id text not null,
  date_str text not null,
  session_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(athlete_id, date_str)
);

create table if not exists public.coach_overrides (
  id uuid primary key default gen_random_uuid(),
  athlete_id text not null,
  date_str text not null,
  override_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(athlete_id, date_str)
);

create table if not exists public.injury_records (
  id uuid primary key default gen_random_uuid(),
  athlete_id text not null,
  injury_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
