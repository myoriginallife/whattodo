import html2canvas from "html2canvas";
import type { ResultType } from "@/types";

export async function captureResultImage(
  element: HTMLElement,
  backgroundColor: string
): Promise<Blob> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor,
    useCORS: true,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성 실패"))),
      "image/png"
    );
  });
}

export function buildShareText(result: ResultType): string {
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  return `나는 "${result.name}"이에요!\n${result.summary}\n\n나 뭐하지? 수익화 탐색 테스트 해보세요 👇\n${siteUrl}`;
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyShareLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.origin);
    return true;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export async function nativeShare(
  result: ResultType,
  imageBlob?: Blob
): Promise<"shared" | "cancelled" | "unsupported"> {
  if (!navigator.share) return "unsupported";

  const shareData: ShareData = {
    title: `나 뭐하지? - ${result.name}`,
    text: buildShareText(result),
    url: window.location.origin,
  };

  if (imageBlob) {
    const file = new File([imageBlob], `나뭐하지_${result.name}.png`, {
      type: "image/png",
    });
    if (navigator.canShare?.({ ...shareData, files: [file] })) {
      try {
        await navigator.share({ ...shareData, files: [file] });
        return "shared";
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return "cancelled";
      }
    }
  }

  try {
    await navigator.share(shareData);
    return "shared";
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "cancelled";
    return "unsupported";
  }
}
