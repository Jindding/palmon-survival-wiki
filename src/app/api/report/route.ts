import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// 신고 접수 → 운영자 메일.
//
// 신고 내용을 DB에 쌓지 않고 메일로만 보낸다. 신고가 잦은 사이트가 아니라
// 테이블과 관리 화면을 하나 더 만드는 것보다 메일함이 낫다.
// 메일에는 관리자 도구에서 바로 지울 수 있도록 대상 ID와 링크를 함께 싣는다.

export const runtime = "nodejs";

const REASON_MAX = 500;
const EXCERPT_MAX = 200;

// 신고 도배를 막는다. 문의(5회)보다 조금 더 조인다.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

const TARGET_LABEL: Record<string, string> = {
  post: "게시글",
  comment: "댓글",
  tip: "한줄팁",
};

const hits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    return NextResponse.json(
      { error: "메일 서비스가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { targetType, targetId, reason, excerpt, hp } = (payload ?? {}) as {
    targetType?: unknown;
    targetId?: unknown;
    reason?: unknown;
    excerpt?: unknown;
    hp?: unknown;
  };

  if (typeof hp === "string" && hp.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof targetType !== "string" ||
    !(targetType in TARGET_LABEL) ||
    typeof targetId !== "string" ||
    targetId.length === 0 ||
    targetId.length > 64
  ) {
    return NextResponse.json(
      { error: "잘못된 신고 대상입니다." },
      { status: 400 }
    );
  }

  const cleanReason =
    typeof reason === "string" ? reason.trim().slice(0, REASON_MAX) : "";
  const cleanExcerpt =
    typeof excerpt === "string" ? excerpt.trim().slice(0, EXCERPT_MAX) : "";

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "신고가 너무 잦습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const label = TARGET_LABEL[targetType];
  const origin = req.headers.get("origin") ?? "";
  const link =
    targetType === "post"
      ? `${origin}/board/${targetId}`
      : targetType === "tip"
        ? `${origin}/tips`
        : origin;

  const html = `
    <div style="font-family:sans-serif;font-size:14px;line-height:1.6">
      <h2 style="margin:0 0 8px">🚨 [팰몬 허브] ${escapeHtml(label)} 신고</h2>
      <table style="border-collapse:collapse;font-size:13px">
        <tr><td style="padding:4px 12px 4px 0;color:#888">종류</td><td>${escapeHtml(label)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">대상 ID</td><td><code>${escapeHtml(targetId)}</code></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">링크</td><td><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></td></tr>
      </table>
      ${
        cleanExcerpt
          ? `<p style="margin:12px 0 4px;color:#888;font-size:12px">신고된 내용</p>
             <div style="white-space:pre-wrap;padding:12px;border:1px solid #eee;border-radius:8px;background:#fafafa">${escapeHtml(cleanExcerpt)}</div>`
          : ""
      }
      ${
        cleanReason
          ? `<p style="margin:12px 0 4px;color:#888;font-size:12px">신고 사유</p>
             <div style="white-space:pre-wrap;padding:12px;border:1px solid #eee;border-radius:8px;background:#fff8f8">${escapeHtml(cleanReason)}</div>`
          : `<p style="margin:12px 0 0;color:#888;font-size:12px">신고 사유가 입력되지 않았습니다.</p>`
      }
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee" />
      <p style="color:#888;font-size:12px;margin:0">
        관리자 도구: <a href="${escapeHtml(origin)}/admin">${escapeHtml(origin)}/admin</a><br />
        신고자 IP: ${escapeHtml(ip)}
      </p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "팰몬 허브 신고 <onboarding@resend.dev>",
      to: [toEmail],
      subject: `[팰몬 허브] ${label} 신고 · ${targetId.slice(0, 8)}`,
      html,
      text: `${label} 신고\n대상 ID: ${targetId}\n링크: ${link}\n\n내용: ${cleanExcerpt}\n사유: ${cleanReason}\n\nIP: ${ip}`,
    });
    if (error) {
      return NextResponse.json(
        { error: "신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "신고 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
