"use client";

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  imageUrl,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/80 p-4"
      onClick={onClose}
    >
      <p className="mb-3 text-center text-sm text-white">
        이미지를 길게 눌러 &lsquo;이미지 저장&rsquo; 또는 &lsquo;공유&rsquo;를
        선택하세요
      </p>
      <div
        className="mx-auto flex max-h-[70vh] flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="나 뭐하지? 테스트 결과"
          className="max-h-full max-w-full rounded-2xl shadow-lg"
        />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-2xl bg-white py-3.5 font-medium text-brown-700"
      >
        닫기
      </button>
    </div>
  );
}
