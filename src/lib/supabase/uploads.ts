import { getSupabase, isSupabaseConfigured } from "./client";

// 게시글 · 한줄팁 이미지 업로드.
//
// 무료 플랜 용량이 한정돼 있어(Storage 1GB, 월 전송량 5GB) 원본을 그대로 올리지 않는다.
// 브라우저 canvas로 긴 변 1280px · WebP 품질 0.8로 줄이면 장당 200KB 안팎이 된다.
// 버킷에도 2MB 상한과 MIME 화이트리스트가 걸려 있어, 이 압축을 건너뛴 요청은 서버가 막는다.

export const UPLOAD_BUCKET = "uploads";
export const MAX_EDGE = 1280;
export const WEBP_QUALITY = 0.8;
/** 압축 전 원본 허용 크기. 이보다 크면 애초에 받지 않는다. */
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function isAllowedImage(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

/**
 * 긴 변을 MAX_EDGE로 줄이고 WebP로 다시 인코딩한다.
 * 이미 작은 이미지는 확대하지 않는다. 변환에 실패하면 원본을 그대로 돌려준다.
 */
export async function compressImage(file: File): Promise<Blob> {
  // GIF는 애니메이션이 살아 있어야 의미가 있는데 canvas로 다시 그리면 첫 프레임만 남는다.
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
  );
  // 압축한 게 원본보다 크면(작은 PNG 등) 원본을 쓴다.
  if (!blob || blob.size >= file.size) return file;
  return blob;
}

function extensionFor(type: string): string {
  if (type === "image/webp") return "webp";
  if (type === "image/png") return "png";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export type UploadResult =
  | { ok: true; path: string }
  | { ok: false; message: string };

/**
 * 이미지를 올리고 저장 경로를 돌려준다.
 * @param folder "posts" | "tips" — 나중에 사람이 훑어볼 때 구분되도록 폴더를 나눈다.
 */
export async function uploadImage(
  folder: "posts" | "tips",
  file: File
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "이미지 업로드가 설정되지 않았습니다." };
  }
  if (!isAllowedImage(file)) {
    return { ok: false, message: "JPG · PNG · WebP · GIF 이미지만 올릴 수 있어요." };
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return { ok: false, message: "이미지가 너무 커요. 10MB 이하로 올려주세요." };
  }

  const blob = await compressImage(file);
  const ext = extensionFor(blob.type || file.type);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await getSupabase()
    .storage.from(UPLOAD_BUCKET)
    .upload(path, blob, {
      contentType: blob.type || file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    console.warn("[uploads] failed:", error.message, error);
    return { ok: false, message: "이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요." };
  }
  return { ok: true, path };
}

/** 저장 경로 → 공개 URL. */
export function imageUrl(path: string): string {
  if (!isSupabaseConfigured) return "";
  return getSupabase().storage.from(UPLOAD_BUCKET).getPublicUrl(path).data
    .publicUrl;
}
