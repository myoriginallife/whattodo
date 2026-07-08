import html2canvas from "html2canvas";
import type { ResultType } from "@/types";

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
    imageTimeout: 0,
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

export function canShareImageFiles(): boolean {
  if (!canNativeShare() || !navigator.canShare) return false;
  try {
    const testFile = new File([new Uint8Array(0)], "test.png", {
      type: "image/png",
    });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

export async function saveOrShareImage(
  blob: Blob,
  result: ResultType
): Promise<"saved" | "shared" | "cancelled" | "failed"> {
  const filename = `나뭐하지_${result.name}.png`;
  const file = createImageFile(blob, result);

  if (canShareImageFiles()) {
    try {
      await navigator.share({
        files: [file],
        title: `나 뭐하지? - ${result.name}`,
      });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }

  if (isIOS()) {
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank");
    URL.revokeObjectURL(url);
    return opened ? "saved" : "failed";
  }

  try {
    const url = URL.createObjectURL(blob);
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
    return "failed";
  }
}

export async function copyShareLink(): Promise<boolean> {
  const siteUrl = window.location.origin;
  const text = `${siteUrl}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
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

export async function shareText(result: ResultType): Promise<
  "shared" | "cancelled" | "failed"
> {
  if (!navigator.share) return "failed";

  const shareData: ShareData = {
    title: `나 뭐하지? - ${result.name}`,
    text: buildShareText(result),
    url: window.location.origin,
  };

  try {
    if (navigator.canShare && !navigator.canShare(shareData)) {
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
      });
    } else {
      await navigator.share(shareData);
    }
    return "shared";
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "cancelled";
    return "failed";
  }
}

export async function nativeShare(
  result: ResultType,
  imageBlob?: Blob
): Promise<"shared" | "cancelled" | "unsupported"> {
  if (!navigator.share) return "unsupported";

  if (imageBlob && canShareImageFiles()) {
    try {
      const file = createImageFile(imageBlob, result);
      await navigator.share({
        files: [file],
        title: `나 뭐하지? - ${result.name}`,
        text: buildShareText(result),
      });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }

  const status = await shareText(result);
  if (status === "shared") return "shared";
  if (status === "cancelled") return "cancelled";
  return "unsupported";
}

export { isMobile };
