import html2canvas from "html2canvas";
import type { ResultType } from "@/types";

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function captureResultImage(
  element: HTMLElement,
  backgroundColor: string
): Promise<Blob> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성 실패"))),
      "image/png",
      1
    );
  });
}

export function buildShareText(result: ResultType): string {
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  return `나는 "${result.name}"이에요!\n${result.summary}\n\n나 뭐하지? 진로 탐색 테스트 해보세요 👇\n${siteUrl}`;
}

function createImageFile(blob: Blob, result: ResultType): File {
  return new File([blob], `나뭐하지_${result.name}.png`, {
    type: "image/png",
  });
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/** 이미지 파일만 저장 (공유 시트 사용 안 함) */
export async function downloadImage(
  blob: Blob,
  result: ResultType
): Promise<"saved" | "failed"> {
  const filename = `나뭐하지_${result.name}.png`;
  const url = URL.createObjectURL(blob);

  if (isIOS()) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return "saved";
  }

  try {
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    return "saved";
  } catch {
    URL.revokeObjectURL(url);
    return "failed";
  }
}

/** SNS 공유 (카카오톡, 인스타 등) */
export async function shareToSNS(
  blob: Blob,
  result: ResultType
): Promise<"shared" | "cancelled" | "failed"> {
  if (!navigator.share) return "failed";

  const file = createImageFile(blob, result);
  const text = buildShareText(result);

  const attempts: ShareData[] = [
    { files: [file], title: `나 뭐하지? - ${result.name}`, text },
    { files: [file] },
    { title: `나 뭐하지? - ${result.name}`, text },
    { text },
  ];

  for (const data of attempts) {
    try {
      if (navigator.canShare && !navigator.canShare(data)) continue;
      await navigator.share(data);
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }

  return "failed";
}

export async function copyShareLink(): Promise<boolean> {
  const siteUrl = window.location.origin;

  try {
    await navigator.clipboard.writeText(siteUrl);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = siteUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function isIOSDevice(): boolean {
  return isIOS();
}
