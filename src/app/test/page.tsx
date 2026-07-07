"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import LikertScale from "@/components/LikertScale";
import { QUESTIONS } from "@/lib/questions";
import { STORAGE_KEY } from "@/lib/scoring";

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(24).fill(null)
  );

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentIndex];

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = value;
      setAnswers(newAnswers);

      setTimeout(() => {
        if (currentIndex < QUESTIONS.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          const finalAnswers = newAnswers.map((a) => a as number);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finalAnswers));
          router.push("/result");
        }
      }, 300);
    },
    [answers, currentIndex, router]
  );

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <main className="min-h-screen bg-cream-100">
      <div className="mx-auto max-w-lg px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-brown-500 hover:text-brown-700"
          >
            ← 나가기
          </Link>
          <span className="text-sm text-brown-500">나 뭐하지?</span>
        </div>

        <div className="mb-10">
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold leading-relaxed text-brown-800">
            {currentQuestion.text}
          </h2>
        </div>

        <LikertScale value={currentAnswer} onChange={handleAnswer} />

        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="mt-6 w-full rounded-2xl border border-beige-300 py-3 text-sm text-brown-600 transition-colors hover:bg-beige-100"
          >
            이전 문항
          </button>
        )}
      </div>
    </main>
  );
}
