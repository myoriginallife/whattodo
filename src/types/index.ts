export type CategoryKey =
  | "growth"
  | "stability"
  | "autonomy"
  | "people"
  | "creativity"
  | "execution";

export type ResultTypeId = "A" | "B" | "C" | "D" | "E";

export interface Question {
  id: number;
  text: string;
  category: CategoryKey;
}

export interface CategoryScores {
  growth: number;
  stability: number;
  autonomy: number;
  people: number;
  creativity: number;
  execution: number;
}

export interface ResultType {
  id: ResultTypeId;
  name: string;
  summary: string;
  features: string[];
  directions: string[];
  actions: string[];
  caution: string;
  color: string;
  accent: string;
}

export interface TestSubmission {
  email: string;
  age_group?: string;
  youngest_child_age?: string;
  career_break_period?: string;
  previous_job?: string;
  main_concern?: string;
  desired_service?: string;
  answers: number[];
  scores: CategoryScores;
  result_type: ResultTypeId;
}

export const MAIN_CONCERNS = [
  "돈",
  "자아실현",
  "재취업",
  "창업",
  "공부",
  "육아와 병행",
  "내가 뭘 잘하는지 모르겠음",
] as const;

export const DESIRED_SERVICES = [
  "AI 심화 리포트",
  "나에게 맞는 직업 추천",
  "30일 실행 로드맵",
  "실제 사례 모음",
  "온라인 강의",
  "1:1 상담",
] as const;

export const AGE_GROUPS = ["20대", "30대", "40대", "50대 이상"] as const;

export const CHILD_AGES = [
  "0~1세",
  "2~3세",
  "4~6세",
  "초등학생",
  "중학생 이상",
] as const;

export const CAREER_BREAK_PERIODS = [
  "1년 미만",
  "1~3년",
  "3~5년",
  "5년 이상",
] as const;

export const LIKERT_LABELS = [
  "전혀 아니다",
  "아니다",
  "보통이다",
  "그렇다",
  "매우 그렇다",
] as const;
