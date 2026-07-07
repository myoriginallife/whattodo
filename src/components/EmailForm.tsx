"use client";

import { useState } from "react";
import type { TestSubmission } from "@/types";
import {
  AGE_GROUPS,
  CHILD_AGES,
  CAREER_BREAK_PERIODS,
  MAIN_CONCERNS,
  DESIRED_SERVICES,
} from "@/types";
import { submitTestSubmission, isSubmissionConfigured } from "@/lib/submitSubmission";

interface EmailFormProps {
  answers: number[];
  scores: TestSubmission["scores"];
  resultType: TestSubmission["result_type"];
  onSuccess: () => void;
}

export default function EmailForm({
  answers,
  scores,
  resultType,
  onSuccess,
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [youngestChildAge, setYoungestChildAge] = useState("");
  const [careerBreakPeriod, setCareerBreakPeriod] = useState("");
  const [previousJob, setPreviousJob] = useState("");
  const [mainConcern, setMainConcern] = useState("");
  const [desiredService, setDesiredService] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!privacyAgreed) {
      setError("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setLoading(true);

    try {
      if (!isSubmissionConfigured()) {
        throw new Error("데이터베이스가 설정되지 않았습니다. 관리자에게 문의해주세요.");
      }

      await submitTestSubmission({
        email: email.trim(),
        age_group: ageGroup || null,
        youngest_child_age: youngestChildAge || null,
        career_break_period: careerBreakPeriod || null,
        previous_job: previousJob.trim() || null,
        main_concern: mainConcern || null,
        desired_service: desiredService || null,
        answers_json: answers,
        scores_json: scores,
        result_type: resultType,
      });

      setSubmitted(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 p-6 text-center">
        <p className="mb-1 text-lg font-semibold text-green-800">
          감사합니다!
        </p>
        <p className="text-sm text-green-700">
          신청이 완료되었습니다. 맞춤 정보와 소식을 보내드릴게요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brown-700">
          이메일 <span className="text-coral-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 placeholder:text-brown-300 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
          required
        />
      </div>

      <div>
        <label htmlFor="ageGroup" className="mb-1.5 block text-sm font-medium text-brown-700">
          나이대
        </label>
        <select
          id="ageGroup"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
        >
          <option value="">선택해주세요</option>
          {AGE_GROUPS.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="childAge" className="mb-1.5 block text-sm font-medium text-brown-700">
          막내 아이 나이
        </label>
        <select
          id="childAge"
          value={youngestChildAge}
          onChange={(e) => setYoungestChildAge(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
        >
          <option value="">선택해주세요</option>
          {CHILD_AGES.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="careerBreak" className="mb-1.5 block text-sm font-medium text-brown-700">
          경력단절 기간
        </label>
        <select
          id="careerBreak"
          value={careerBreakPeriod}
          onChange={(e) => setCareerBreakPeriod(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
        >
          <option value="">선택해주세요</option>
          {CAREER_BREAK_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="previousJob" className="mb-1.5 block text-sm font-medium text-brown-700">
          이전 직업
        </label>
        <input
          id="previousJob"
          type="text"
          value={previousJob}
          onChange={(e) => setPreviousJob(e.target.value)}
          placeholder="예: 회사원, 디자이너"
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 placeholder:text-brown-300 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
        />
      </div>

      <div>
        <label htmlFor="mainConcern" className="mb-1.5 block text-sm font-medium text-brown-700">
          현재 가장 큰 고민
        </label>
        <select
          id="mainConcern"
          value={mainConcern}
          onChange={(e) => setMainConcern(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
        >
          <option value="">선택해주세요</option>
          {MAIN_CONCERNS.map((concern) => (
            <option key={concern} value={concern}>
              {concern}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="desiredService" className="mb-1.5 block text-sm font-medium text-brown-700">
          이 결과를 바탕으로 가장 받고 싶은 서비스는?
        </label>
        <select
          id="desiredService"
          value={desiredService}
          onChange={(e) => setDesiredService(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-white px-4 py-3 text-brown-800 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-100"
        >
          <option value="">선택해주세요</option>
          {DESIRED_SERVICES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-beige-200 bg-cream-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-beige-300 text-coral-500 focus:ring-coral-400"
          />
          <span className="text-sm leading-relaxed text-brown-600">
            <span className="font-medium text-brown-700">
              [필수] 개인정보 수집 및 이용 동의
            </span>
            <br />
            수집 항목: 이메일, 나이대, 막내 아이 나이, 경력단절 기간, 이전 직업,
            고민 및 관심 서비스, 테스트 응답 결과
            <br />
            이용 목적: 맞춤 정보 제공, 서비스 안내, 통계 분석
            <br />
            보유 기간: 수집일로부터 1년 (동의 철회 시 즉시 파기)
            <br />
            동의를 거부할 수 있으나, 거부 시 맞춤 정보 제공이 제한됩니다.
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !privacyAgreed}
        className="w-full rounded-2xl bg-coral-500 py-4 font-semibold text-white transition-colors hover:bg-coral-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "신청 중..." : "맞춤 정보 받기"}
      </button>
    </form>
  );
}
