import fs from "node:fs";
import path from "node:path";

export interface Tip {
  content: string;
  by: string; // "Name #Server" 형식 — SourceBadge가 파싱
}

// "출처 : 201서버 Aiden Reed" → "Aiden Reed #201"
// 서버 앞/뒤, "#" 표기, "서버" 생략 등 여러 형태 허용
function parseSource(line: string): string {
  const body = line.replace(/^출처\s*:?\s*/, "").trim();
  // 패턴1: "201서버 Aiden Reed", "#201 Aiden Reed"
  const serverFirst = body.match(/^(?:#\s*)?(\d+)\s*서버?\s+(.+)$/);
  if (serverFirst) return `${serverFirst[2].trim()} #${serverFirst[1]}`;
  // 패턴2: "Aiden Reed #201", "Aiden Reed 201서버"
  const nameFirst = body.match(/^(.+?)\s+#?\s*(\d+)\s*서?버?\s*$/);
  if (nameFirst) return `${nameFirst[1].trim()} #${nameFirst[2]}`;
  return body;
}

function parseTipsFromText(text: string): Tip[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map<Tip | null>((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const sourceIdx = lines.findIndex((l) => l.startsWith("출처"));
      const contentLines = sourceIdx >= 0 ? lines.slice(0, sourceIdx) : lines;
      const sourceLine = sourceIdx >= 0 ? lines[sourceIdx] : "";
      const content = contentLines.join(" ").trim();
      if (!content) return null;
      return { content, by: parseSource(sourceLine) };
    })
    .filter((t): t is Tip => t !== null);
}

function loadTips(): Tip[] {
  const filePath = path.join(process.cwd(), "docs", "sources", "tips.txt");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return parseTipsFromText(raw);
  } catch {
    return [];
  }
}

// 파일 뒤쪽(최근 추가)이 위로 오도록 뒤집어서 노출
export const tips: Tip[] = loadTips().reverse();

export const tipsMeta = {
  updatedAt: "2026-08-14",
  note: "유저 제보 한줄팁. 게임 내 채팅 · 커뮤니티에서 받은 팁을 정리합니다.",
};
