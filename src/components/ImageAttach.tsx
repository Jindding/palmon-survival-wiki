"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { isAllowedImage, MAX_SOURCE_BYTES } from "@/lib/supabase/uploads";

// 게시글 · 한줄팁이 함께 쓰는 이미지 첨부 위젯.
//
// 파일을 고르면 바로 올리지 않고 미리보기만 띄운다. 실제 업로드는 글을 등록할 때 한 번만 한다.
// 글을 쓰다 말고 나가는 경우가 많은데, 미리 올려 버리면 주인 없는 파일이 계속 쌓이기 때문이다.

export interface ImageAttachHandle {
  file: File | null;
  clear: () => void;
}

export function ImageAttach({
  file,
  onChange,
  disabled,
  busy,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  /** 업로드 중 표시. 등록 버튼을 누른 뒤 부모가 켠다. */
  busy?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pick(next: File | null) {
    setError(null);
    if (!next) {
      onChange(null);
      return;
    }
    if (!isAllowedImage(next)) {
      setError("JPG · PNG · WebP · GIF 이미지만 올릴 수 있어요.");
      return;
    }
    if (next.size > MAX_SOURCE_BYTES) {
      setError("이미지가 너무 커요. 10MB 이하로 올려주세요.");
      return;
    }
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0] ?? null);
          // 같은 파일을 다시 골라도 change가 뜨도록 초기화한다.
          e.target.value = "";
        }}
      />

      {preview ? (
        <div className="relative inline-block max-w-full">
          {/* 로컬 미리보기라 next/image를 쓸 수 없다 (blob URL). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="첨부한 이미지 미리보기"
            className="max-h-48 w-auto rounded-xl border border-app object-contain"
          />
          {busy && (
            <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-white" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled || busy}
            aria-label="이미지 제거"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-app shadow-soft flex items-center justify-center hover:bg-muted disabled:opacity-50"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-app text-xs text-fg-muted hover:border-palmon-primary hover:text-palmon-primary transition-colors disabled:opacity-50"
        >
          <ImagePlus size={14} />
          이미지 첨부 (1장)
        </button>
      )}

      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
}
