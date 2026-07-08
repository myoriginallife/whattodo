import type { ResultType } from "@/types";
import { getSiteUrl } from "@/lib/siteUrl";

export function buildShareText(result: ResultType): string {
  const siteUrl = getSiteUrl();
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

export function canShareFiles(): boolean {
  if (!canNativeShare() || !navigator.canShare) return false;
  try {
    const testFile = new File(["x"], "test.png", { type: "image/png" });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

export function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function downloadImageBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function shareImageToSNS(
  blob: Blob,
  result: ResultType
): Promise<"shared" | "cancelled" | "failed"> {
  if (!navigator.share) return "failed";

  const file = createImageFile(blob, result);
  const text = buildShareText(result);

  const attempts: ShareData[] = [
    { files: [file], text, title: `나 뭐하지? - ${result.name}` },
    { files: [file], text },
    { files: [file] },
    { text, title: `나 뭐하지? - ${result.name}` },
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
  const siteUrl = getSiteUrl();
  try {
    await navigator.clipboard.writeText(siteUrl);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = siteUrl;
      textarea.style.cssText = "position:fixed;opacity:0";
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
