"use client";

import { useState, useCallback, useEffect } from "react";
import type { ResultType } from "@/types";
import {
  captureResultImage,
  copyShareLink,
  downloadImage,
  shareToSNS,
  canNativeShare,
  isIOSDevice,
} from "@/lib/shareResult";

interface ShareResultProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  result: ResultType;
}

export default function ShareResult({ imageRef, result }: ShareResultProps) {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [toast, setToast] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [preparing, setPreparing] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const prepareImage = useCallback(async (): Promise<Blob> => {
    if (imageBlob) return imageBlob;
    if (!imageRef.current) throw new Error("이미지를 생성할 수 없습니다.");
    const blob = await captureResultImage(imageRef.current, result.color);
    setImageBlob(blob);
    return blob;
  }, [imageBlob, imageRef, result.color]);

  useEffect(() => {
    if (!showOptions) return;

    let cancelled = false;
    setPreparing(true);
    prepareImage()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPreparing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showOptions, prepareImage]);

  const handleShare = () => {
    setShowOptions(true);
  };

  const handleSaveImage = async () => {
    setLoading(true);
    try {
      const blob = await prepareImage();
      const status = await downloadImage(blob, result);

      if (status === "saved") {
        showToast(
          isIOSDevice()
            ? "이미지가 열렸습니다. 길게 눌러 '이미지 저장'을 선택하세요."
            : "이미지가 저장되었습니다."
        );
        setShowOptions(false);
      } else {
        showToast("이미지 저장에 실패했습니다.");
      }
    } catch {
      showToast("이미지 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSNSShare = async () => {
    if (!canNativeShare()) {
      showToast("이 기기에서는 SNS 공유를 지원하지 않습니다. 링크 복사를 이용해주세요.");
      return;
    }

    setLoading(true);
    try {
      const blob = await prepareImage();
      const status = await shareToSNS(blob, result);

      if (status === "shared") {
        showToast("공유되었습니다.");
        setShowOptions(false);
      } else if (status === "cancelled") {
        // 사용자 취소
      } else {
        showToast("SNS 공유에 실패했습니다. 링크 복사를 이용해주세요.");
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

  const isBusy = loading || preparing;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="w-full rounded-2xl bg-coral-500 py-3.5 font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-60"
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
              {preparing ? "이미지 준비 중..." : "원하는 방식을 선택하세요"}
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSaveImage}
                disabled={isBusy}
                className="w-full rounded-2xl border-2 border-coral-400 py-3.5 font-medium text-coral-500 transition-colors hover:bg-coral-50 disabled:opacity-50"
              >
                {loading ? "처리 중..." : "이미지 저장"}
              </button>

              <button
                type="button"
                onClick={handleSNSShare}
                disabled={isBusy}
                className="w-full rounded-2xl border border-beige-300 py-3.5 font-medium text-brown-700 transition-colors hover:bg-beige-100 disabled:opacity-50"
              >
                SNS 공유
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                disabled={isBusy}
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

      {toast && (
        <p className="mt-3 text-center text-sm text-coral-600">{toast}</p>
      )}
    </div>
  );
}
