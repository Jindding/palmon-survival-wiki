"use client";

import { useState } from "react";
import { imageUrl } from "@/lib/supabase/uploads";

// 글·팁에 붙은 이미지를 보여준다.
//
// next/image를 쓰지 않는다. 업로드 시점에 이미 1280px로 줄여 두었기 때문에 재최적화할 게 없고,
// Vercel 무료 플랜의 이미지 최적화 할당량(월 1,000장)을 쓰지 않으려는 목적도 있다.
// 대신 loading="lazy"와 고정 비율 컨테이너로 레이아웃 흔들림만 막는다.

export function AttachedImage({
  path,
  alt = "첨부 이미지",
}: {
  path: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = imageUrl(path);

  if (!src || failed) return null;

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="block w-fit max-w-full rounded-xl overflow-hidden border border-app"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="max-h-[480px] w-auto max-w-full object-contain bg-muted"
      />
    </a>
  );
}
