"use client";

import { useState, useCallback } from "react";
import type { ResultType } from "@/types";
import {
  captureResultImage,
  copyShareLink,
  nativeShare,
  saveOrShareImage,
  shareText,
  canNativeShare,
  canShareImageFiles,
  isMobile,
} from "@/lib/shareResult";

interface ShareResultProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  result: ResultType;
}

export default function ShareResult({ imageRef, result }: ShareResultProps) {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const getImageBlob = useCallback(async () => {
    if (!imageRef.current) throw new Error("이미지를 생성할 수 없습니다.");
    return captureResultImage(imageRef.current, result.color);
  }, [imageRef, result.color]);

  const handleShare = async () => {
    if (isMobile() && canNativeShare()) {
      setShowOptions(true);
      return;
    }

    setLoading(true);
    try {
      if (canNativeShare()) {
        const blob = await getImageBlob();
        const status = await nativeShare(result, blob);
        if (status === "shared") {
          showToast("공유되었습니다.");
          return;
        }
        if (status === "cancelled") return;
      }
      setShowOptions(true);
    } catch {
      setShowOptions(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    setLoading(true);
    try {
      const blob = await getImageBlob();
      const status = await saveOrShareImage(blob, result);

      if (status === "saved") {
        showToast(
          isMobile()
            ? "이미지가 열렸습니다. 길게 눌러 저장하세요."
            : "이미지가 저장되었습니다."
        );
        setShowOptions(false);
      } else if (status === "shared") {
        showToast("공유 메뉴에서 '이미지 저장'을 선택하세요.");
        setShowOptions(false);
      } else if (status === "cancelled") {
        // 사용자 취소
      } else {
        showToast("이미지 저장에 실패했습니다.");
      }
    } catch {
      showToast("이미지 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const ok = await copyShareLink();
    showToast(ok ? "링크가 복사되었습니다." : "링크 복사에 실패했습니다.");
    setShowOptions(false);
  };

  const handleShareText = async () => {
    setLoading(true);
    try {
      const status = await shareText(result);
      if (status === "shared") {
        showToast("공유되었습니다.");
        setShowOptions(false);
      } else if (status === "cancelled") {
        // 사용자 취소
      } else {
        showToast("공유에 실패했습니다. 링크 복사를 이용해주세요.");
      }
    } catch {
      showToast("공유에 실패했습니다. 링크 복사를 이용해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareImage = async () => {
    setLoading(true);
    try {
      const blob = await getImageBlob();
      const status = await saveOrShareImage(blob, result);
      if (status === "shared") {
        showToast("이미지 공유 메뉴가 열렸습니다.");
        setShowOptions(false);
      } else if (status === "cancelled") {
        // 사용자 취소
      } else {
        showToast("이미지 공유에 실패했습니다.");
      }
    } catch {
      showToast("이미지 공유에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="w-full rounded-2xl bg-coral-500 py-3.5 font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-60"
      >
        {loading ? "준비 중..." : "공유하기"}
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
              {isMobile()
                ? "이미지 저장 또는 링크 공유를 선택하세요"
                : "이미지 저장 또는 링크 공유를 선택하세요"}
            </p>

            <div className="space-y-3">
              {canShareImageFiles() ? (
                <button
                  type="button"
                  onClick={handleShareImage}
                  disabled={loading}
                  className="w-full rounded-2xl border-2 border-coral-400 py-3.5 font-medium text-coral-500 transition-colors hover:bg-coral-50"
                >
                  이미지 저장 / 공유
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveImage}
                  disabled={loading}
                  className="w-full rounded-2xl border-2 border-coral-400 py-3.5 font-medium text-coral-500 transition-colors hover:bg-coral-50"
                >
                  이미지 저장
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full rounded-2xl border border-beige-300 py-3.5 font-medium text-brown-700 transition-colors hover:bg-beige-100"
              >
                링크 복사
              </button>

              {canNativeShare() && (
                <button
                  type="button"
                  onClick={handleShareText}
                  disabled={loading}
                  className="w-full rounded-2xl border border-beige-300 py-3.5 font-medium text-brown-700 transition-colors hover:bg-beige-100"
                >
                  텍스트로 공유
                </button>
              )}

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
