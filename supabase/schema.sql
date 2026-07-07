# Supabase SQL - test_submissions 테이블 생성
# Supabase Dashboard > SQL Editor에서 실행하세요.

create table if not exists test_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  email text not null,
  age_group text,
  youngest_child_age text,
  career_break_period text,
  previous_job text,
  main_concern text,
  desired_service text,
  answers_json jsonb not null,
  scores_json jsonb not null,
  result_type text not null
);

-- Row Level Security 활성화
alter table test_submissions enable row level security;

-- 익명 사용자가 insert만 가능하도록 정책 설정
create policy "Allow anonymous insert"
  on test_submissions
  for insert
  to anon
  with check (true);

-- 인덱스 (조회 성능)
create index if not exists test_submissions_created_at_idx
  on test_submissions (created_at desc);

create index if not exists test_submissions_result_type_idx
  on test_submissions (result_type);
