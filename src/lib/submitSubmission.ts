import type { CategoryScores, ResultTypeId } from "@/types";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export interface SubmissionPayload {
  email: string;
  age_group: string | null;
  youngest_child_age: string | null;
  career_break_period: string | null;
  previous_job: string | null;
  main_concern: string | null;
  desired_service: string | null;
  answers_json: number[];
  scores_json: CategoryScores;
  result_type: ResultTypeId;
}

export function isSubmissionConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

export async function submitTestSubmission(
  payload: SubmissionPayload
): Promise<void> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("데이터베이스가 설정되지 않았습니다. 관리자에게 문의해주세요.");
  }

  if (supabaseKey.startsWith("sb_secret_")) {
    throw new Error(
      "잘못된 API 키입니다. secret key 대신 anon 또는 publishable key를 사용해주세요."
    );
  }

  const headers: Record<string, string> = {
    apikey: supabaseKey,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };

  // legacy anon JWT (eyJ...)는 apikey + Authorization 둘 다 필요
  if (supabaseKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${supabaseKey}`;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/test_submissions`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Supabase submit error:", response.status, body);

    if (response.status === 401) {
      throw new Error("인증에 실패했습니다. API 키 설정을 확인해주세요.");
    }
    if (response.status === 403) {
      throw new Error("저장 권한이 없습니다. 데이터베이스 설정을 확인해주세요.");
    }
    throw new Error("데이터 저장에 실패했습니다.");
  }
}
