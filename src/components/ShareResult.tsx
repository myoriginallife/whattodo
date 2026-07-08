"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ResultType, CategoryScores } from "@/types";
import { generateResultImage } from "@/lib/generateResultImage";
import {
  copyShareLink,
  shareImageToSNS,
  downloadImageBlob,
  canNativeShare,
  canShareFiles,
  isMobileDevice,
} from "@/lib/shareResult";
import ImagePreviewModal from "@/components/ImagePreviewModal";

interface ShareResultProps {
  result: ResultType;
  scores: CategoryScores;
}

export default function ShareResult({ result, scores }: ShareResultProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const blobRef = useRef<Blob | null>(null);
  const generatingRef = useRef(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const prepareImage = useCallback(async (): Promise<Blob> => {
    if (blobRef.current) return blobRef.current;
    if (generatingRef.current) {
      while (generatingRef.current) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (blobRef.current) return blobRef.current;
    }

    generatingRef.current = true;
    try {
      const blob = await generateResultImage(result, scores);
      blobRef.current = blob;
      setImageReady(true);
      return blob;
    } finally {
      generatingRef.current = false;
    }
  }, [result, scores]);

  useEffect(() => {
    void prepareImage();
  }, [prepareImage]);

  const openShareMenu = () => {
    setShowOptions(true);
    void prepareImage();
  };

  const handleSaveImage = async () => {
    setLoading(true);
    try {
      const blob = await prepareImage();
      const filename = `나뭐하지_${result.name}.png`;

      if (isMobileDevice() && canShareFiles()) {
        const status = await shareImageToSNS(blob, result);
        if (status === "shared") {
          showToast("공유 메뉴에서 '이미지 저장'을 선택하세요.");
          setShowOptions(false);
          return;
        }
        if (status === "cancelled") return;
      }

      if (isMobileDevice()) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowOptions(false);
        return;
      }

      downloadImageBlob(blob, filename);
      showToast("이미지가 저장되었습니다.");
      setShowOptions(false);
    } catch {
      showToast("이미지 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSNSShare = async () => {
    if (!canNativeShare()) {
      showToast("SNS 공유를 지원하지 않습니다. 이미지 저장 후 직접 공유해주세요.");
      return;
    }

    setLoading(true);
    try {
      const blob = await prepareImage();
      const status = await shareImageToSNS(blob, result);

      if (status === "shared") {
        showToast("공유되었습니다.");
        setShowOptions(false);
      } else if (status === "cancelled") {
        // 사용자 취소
      } else {
        showToast("SNS 공유에 실패했습니다. 이미지 저장을 이용해주세요.");
      }
    } catch {
      showToast("SNS 공유에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const ok = await copyShareLink();
    showToast(ok ? "링크가 복사되었습니다." : "링크 복사에 실패했습니다.");
    setShowOptions(false);
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const busy = loading || !imageReady;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openShareMenu}
        className="w-full rounded-2xl bg-coral-500 py-3.5 font-semibold text-white transition-colors hover:bg-coral-600"
      >
        공유하기
      </button>

      {showOptions && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setShowOptions(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-1 text-center text-lg font-semibold text-brown-700">
              결과 공유하기
            </h4>
            <p className="mb-5 text-center text-sm text-brown-500">
              {imageReady
                ? "원하는 방식을 선택하세요"
                : "이미지를 준비하고 있어요..."}
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSaveImage}
                disabled={busy}
                className="w-full rounded-2xl border-2 border-coral-400 py-3.5 font-medium text-coral-500 transition-colors hover:bg-coral-50 disabled:opacity-50"
              >
                {busy ? "이미지 생성 중..." : "이미지 저장"}
              </button>

              <button
                type="button"
                onClick={handleSNSShare}
                disabled={busy}
                className="w-full rounded-2xl border border-beige-300 py-3.5 font-medium text-brown-700 transition-colors hover:bg-beige-100 disabled:opacity-50"
              >
                {busy ? "준비 중..." : "SNS 공유"}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                disabled={loading}
                className="w-full rounded-2xl border border-beige-300 py-3.5 font-medium text-brown-700 transition-colors hover:bg-beige-100 disabled:opacity-50"
              >
                링크 복사
              </button>

              <button
                type="button"
                onClick={() => setShowOptions(false)}
                className="w-full py-2 text-sm text-brown-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <ImagePreviewModal imageUrl={previewUrl} onClose={closePreview} />
      )}

      {toast && (
        <p className="mt-3 text-center text-sm text-coral-600">{toast}</p>
      )}
    </div>
  );
}
