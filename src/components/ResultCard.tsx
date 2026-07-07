"use client";

import { forwardRef } from "react";
import type { ResultType, CategoryScores } from "@/types";
import { getTopCategories } from "@/lib/scoring";

interface ResultCardProps {
  result: ResultType;
  scores: CategoryScores;
  forImage?: boolean;
}

const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard({ result, scores, forImage = false }, ref) {
    const topCategories = getTopCategories(scores);

    return (
      <div
        ref={ref}
        className={`overflow-hidden rounded-3xl ${
          forImage ? "w-[360px]" : "w-full"
        }`}
        style={{ backgroundColor: result.color }}
      >
        <div className="px-6 py-8">
          <p className="mb-1 text-sm font-medium text-brown-500">
            나 뭐하지? 진로 탐색 결과
          </p>
          <h2
            className="mb-3 text-2xl font-bold"
            style={{ color: result.accent }}
          >
            {result.name}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-brown-700">
            {result.summary}
          </p>

          <div className="mb-6 space-y-2">
            {topCategories.map((cat) => (
              <div key={cat.key} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-brown-500">
                  {cat.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/60">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((cat.score - 4) / 16) * 100}%`,
                      backgroundColor: result.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold text-brown-700">
              추천 방향
            </p>
            <div className="flex flex-wrap gap-2">
              {result.directions.map((dir) => (
                <span
                  key={dir}
                  className="rounded-full bg-white/70 px-3 py-1 text-xs text-brown-700"
                >
                  {dir}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ResultCard;
