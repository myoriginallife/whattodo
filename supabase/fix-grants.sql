-- Supabase SQL Editor에서 실행하세요.
-- "데이터 저장에 실패했습니다" 오류 해결용

grant insert on public.test_submissions to anon;
grant insert on public.test_submissions to authenticated;

-- 정책이 없다면 함께 실행
-- create policy "Allow anonymous insert"
--   on test_submissions
--   for insert
--   to anon
--   with check (true);
