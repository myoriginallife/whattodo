"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import ShareResult from "@/components/ShareResult";
import EmailForm from "@/components/EmailForm";
import { RESULT_TYPES } from "@/lib/resultTypes";
import {
  calculateScores,
  determineResultType,
  validateAnswers,
  STORAGE_KEY,
} from "@/lib/scoring";
import type { CategoryScores, ResultTypeId } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const imageRef = useRef<HTMLDivElement>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<CategoryScores | null>(null);
  const [resultTypeId, setResultTypeId] = useState<ResultTypeId | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      router.replace("/test");
      return;
    }

    try {
      const parsed: number[] = JSON.parse(stored);
      if (!validateAnswers(parsed)) {
        router.replace("/test");
        return;
      }

      const calculatedScores = calculateScores(parsed);
      const typeId = determineResultType(calculatedScores);

      setAnswers(parsed);
      setScores(calculatedScores);
      setResultTypeId(typeId);
      setReady(true);
    } catch {
      router.replace("/test");
    }
  }, [router]);

  if (!ready || !scores || !resultTypeId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-brown-500">결과를 분석하고 있어요...</p>
      </main>
    );
  }

  const result = RESULT_TYPES[resultTypeId];

  return (
    <main className="min-h-screen bg-cream-100">
      <div className="mx-auto max-w-lg px-6 py-8">
        <div className="mb-8 text-center">
          <p className="mb-1 text-sm text-coral-500">나의 진로 탐색 결과</p>
          <h1
            className="text-3xl font-bold"
            style={{ color: result.accent }}
          >
            {result.name}
          </h1>
        </div>

        <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-6 text-lg leading-relaxed text-brown-700">
            {result.summary}
          </p>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-brown-700">
              핵심 특징
            </h3>
            <ul className="space-y-2">
              {result.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-brown-600"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: result.accent }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-brown-700">
              추천 방향
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.directions.map((dir) => (
                <span
                  key={dir}
                  className="rounded-full px-3 py-1.5 text-sm"
                  style={{
                    backgroundColor: result.color,
                    color: result.accent,
                  }}
                >
                  {dir}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-brown-700">
              지금 시작하면 좋은 행동
            </h3>
            <ol className="space-y-2">
              {result.actions.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-brown-600"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: result.accent }}
                  >
                    {i + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ol>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: result.color }}
          >
            <h3 className="mb-1 text-sm font-semibold text-brown-700">
              주의할 점
            </h3>
            <p className="text-sm text-brown-600">{result.caution}</p>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-4 text-center text-sm font-semibold text-brown-700">
            결과 공유하기
          </h3>

          <div className="mb-4 flex justify-center">
            <ResultCard
              ref={imageRef}
              result={result}
              scores={scores}
            />
          </div>

          <ShareResult imageRef={imageRef} result={result} />
        </section>

        <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="mb-1 text-lg font-semibold text-brown-700">
            맞춤 정보와 소식 받기
          </h3>
          <p className="mb-6 text-sm text-brown-500">
            관심 정보를 남겨주시면 결과에 맞는 소식과 콘텐츠를 보내드립니다.
          </p>
          <EmailForm
            answers={answers}
            scores={scores}
            resultType={resultTypeId}
            onSuccess={() => {}}
          />
        </section>

        <div className="space-y-4 text-center">
          <Link
            href="/test"
            onClick={() => sessionStorage.removeItem(STORAGE_KEY)}
            className="block text-sm text-brown-500 hover:text-brown-700"
          >
            테스트 다시 하기
          </Link>
          <p className="text-xs leading-relaxed text-brown-400">
            이 테스트는 자기이해와 진로 탐색을 돕기 위한 참고용 도구입니다.
            의학적, 임상적 진단을 목적으로 하지 않습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
