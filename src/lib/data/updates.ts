import fs from "node:fs";
import path from "node:path";

export type UpdateTag = "NEW" | "UPDATE" | "FIX" | "DATA";

export interface UpdateEntry {
  date: string;
  tag: UpdateTag;
  title: string;
  bullets: string[];
}

const TAG_SET = new Set<UpdateTag>(["NEW", "UPDATE", "FIX", "DATA"]);

// 블록 형식:
//   [YYYY-MM-DD] TAG / 제목
//   - 본문 1
//   - 본문 2
function parseBlock(block: string): UpdateEntry | null {
  const lines = block
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  const header = lines[0];
  const m = header.match(/^\[(\d{4}-\d{2}-\d{2})\]\s*([A-Z]+)\s*\/\s*(.+)$/);
  if (!m) return null;
  const tag = m[2] as UpdateTag;
  if (!TAG_SET.has(tag)) return null;
  const bullets = lines
    .slice(1)
    .map((l) => l.replace(/^-\s*/, "").trim())
    .filter(Boolean);
  return { date: m[1], tag, title: m[3].trim(), bullets };
}

function parseUpdates(text: string): UpdateEntry[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map(parseBlock)
    .filter((e): e is UpdateEntry => e !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function loadUpdates(): UpdateEntry[] {
  const filePath = path.join(process.cwd(), "docs", "sources", "updates.txt");
  try {
    return parseUpdates(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export const updates: UpdateEntry[] = loadUpdates();

export const updatesMeta = {
  updatedAt: updates[0]?.date ?? "-",
  note: "팰몬 허브 사이트의 업데이트 내역을 정리하는 곳이에요.",
};
