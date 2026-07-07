import { QUESTIONS } from "./questions";
import type { CategoryKey, CategoryScores, ResultTypeId } from "@/types";

const CATEGORY_PRIORITY: CategoryKey[] = [
  "growth",
  "creativity",
  "autonomy",
  "stability",
  "execution",
  "people",
];

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  growth: "성장 욕구",
  stability: "안정 지향",
  autonomy: "자율성",
  people: "사람 지향",
  creativity: "창조성",
  execution: "실행력",
};

export function calculateScores(answers: number[]): CategoryScores {
  const scores: CategoryScores = {
    growth: 0,
    stability: 0,
    autonomy: 0,
    people: 0,
    creativity: 0,
    execution: 0,
  };

  QUESTIONS.forEach((q, index) => {
    const answer = answers[index];
    if (answer >= 1 && answer <= 5) {
      scores[q.category] += answer;
    }
  });

  return scores;
}

function getRankedCategories(scores: CategoryScores): CategoryKey[] {
  return [...CATEGORY_PRIORITY].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return CATEGORY_PRIORITY.indexOf(a) - CATEGORY_PRIORITY.indexOf(b);
  });
}

export function determineResultType(scores: CategoryScores): ResultTypeId {
  const ranked = getRankedCategories(scores);
  const first = ranked[0];
  const second = ranked[1];

  if (first === "growth" && (second === "people" || second === "stability")) {
    return "A";
  }
  if (first === "creativity" && second === "autonomy") {
    return "B";
  }
  if (first === "creativity" && second === "execution") {
    return "C";
  }
  if (first === "stability") {
    return "D";
  }
  if (first === "autonomy" && second === "execution") {
    return "E";
  }

  // Fallback for combinations not explicitly listed
  if (first === "growth") return "A";
  if (first === "creativity") return second === "execution" ? "C" : "B";
  if (first === "autonomy") return "E";
  if (first === "execution") return "E";
  if (first === "people") return "A";

  return "D";
}

export function getTopCategories(
  scores: CategoryScores
): { key: CategoryKey; label: string; score: number }[] {
  const ranked = getRankedCategories(scores);
  return ranked.slice(0, 3).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    score: scores[key],
  }));
}

export function validateAnswers(answers: number[]): boolean {
  return (
    answers.length === 24 && answers.every((a) => a >= 1 && a <= 5)
  );
}

export const STORAGE_KEY = "whattodo_test_answers";
