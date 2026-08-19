import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const TITLE_MAX = 100;
const BODY_MAX = 4000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

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

  const { title, body, hp } = (payload ?? {}) as {
    title?: unknown;
    body?: unknown;
    hp?: unknown;
  };

  if (typeof hp === "string" && hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    title.trim().length === 0 ||
    body.trim().length === 0 ||
    title.length > TITLE_MAX ||
    body.length > BODY_MAX
  ) {
    return NextResponse.json(
      { error: "제목과 내용을 올바르게 입력해주세요." },
      { status: 400 }
    );
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const resend = new Resend(apiKey);
  const cleanTitle = title.trim().slice(0, TITLE_MAX);
  const cleanBody = body.trim().slice(0, BODY_MAX);
  const ua = req.headers.get("user-agent") ?? "unknown";

  const html = `
    <div style="font-family:sans-serif;font-size:14px;line-height:1.6">
      <h2 style="margin:0 0 8px">[팰몬 허브 문의] ${escapeHtml(cleanTitle)}</h2>
      <div style="white-space:pre-wrap;padding:12px;border:1px solid #eee;border-radius:8px;background:#fafafa">${escapeHtml(cleanBody)}</div>
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee" />
      <p style="color:#888;font-size:12px;margin:0">
        IP: ${escapeHtml(ip)}<br />
        UA: ${escapeHtml(ua)}
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "팰몬 허브 문의 <onboarding@resend.dev>",
      to: [toEmail],
      subject: `[팰몬 허브] ${cleanTitle}`,
      html,
      text: `${cleanBody}\n\n---\nIP: ${ip}\nUA: ${ua}`,
    });
    if (error) {
      return NextResponse.json(
        { error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "메일 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
