// palmon.txt + public/palmons/ + palmons.legacy.json → palmons.json
// Usage: node scripts/build-palmons.js

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// 1) palmon.txt 파싱
const txtPath = path.join(ROOT, "docs/sources/palmon/palmon.txt");
const raw = fs.readFileSync(txtPath, "utf-8");
const rows = raw
  .trim()
  .split(/\r?\n/)
  .slice(1) // skip header
  .map((l) => l.split(/\t/).map((s) => s.trim()))
  .filter((r) => r.length >= 4);

// 2) 이미지 파일 매핑 (번호 → 상대경로)
const imgDir = path.join(ROOT, "public/palmons");
const imgFiles = fs.readdirSync(imgDir).filter((f) => f.endsWith(".png"));
const imgByNum = {};
for (const f of imgFiles) {
  const m = f.match(/^(\d+)_/);
  if (m) imgByNum[parseInt(m[1], 10)] = `/palmons/${f}`;
}

// 3) 기존 스킬 데이터 (이름 매칭용)
const legacyPath = path.join(ROOT, "src/lib/data/palmons.legacy.json");
const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
const legacyByName = {};
for (const p of legacy) legacyByName[p.name] = p;

// 4) 등급 파싱
// 신화 팰몬은 출시 시즌에 따라 "신화(시즌1)" / "신화(시즌2)" 로 표기된다.
// 그 진화형도 "진화(시즌1)" 처럼 시즌이 붙지만, 시즌은 본체에만 저장하고
// 진화형은 본체를 따라가므로 등급만 떼어내면 된다.
function parseGrade(raw) {
  const m = raw.match(/^(.+?)\s*\(\s*시즌\s*(\d+)\s*\)\s*$/);
  if (m) return { grade: m[1].trim(), season: parseInt(m[2], 10) };
  return { grade: raw.trim(), season: null };
}

const ELEMENTS = ["물", "불", "바위", "전기"];

// 5) 팰몬 조립 (진화는 직전 본체 밑으로 그룹)
const palmons = [];
let currentBase = null;
let missingImg = [];

for (const [gradeRaw, elementRaw, numStr, name] of rows) {
  const { grade, season } = parseGrade(gradeRaw);
  const num = parseInt(numStr, 10);
  const imagePath = imgByNum[num] ?? null;
  if (!imagePath) missingImg.push({ num, name });

  if (grade === "진화" || grade === "슈퍼 진화") {
    if (!currentBase) {
      console.warn(`[warn] ${grade} ${name} has no base (UR·신화) — skipping`);
      continue;
    }
    if (!currentBase.evolutions) currentBase.evolutions = [];
    currentBase.evolutions.push({
      stage: grade === "진화" ? "evolved" : "superEvolved",
      id: String(num),
      name,
      imagePath,
    });
  } else {
    // 속성 정규화: 데이터 오타로 "SSR"이 들어간 경우 → 전기 (로토로터/불릿볼트)
    let element = elementRaw;
    if (!ELEMENTS.includes(element)) {
      console.warn(`[warn] 알 수 없는 속성 "${elementRaw}" (${num} ${name}) → 전기로 대체`);
      element = "전기";
    }

    const old = legacyByName[name];
    const palmon = {
      id: String(num),
      name,
      grade, // "SR" | "SSR" | "UR" | "신화"
      element,
      imagePath,
    };
    if (season) palmon.season = season; // 신화 전용: 출시 시즌
    if (old?.skills?.length) palmon.skills = old.skills;
    if (old?.basicInfos?.length) palmon.basicInfos = old.basicInfos;
    palmons.push(palmon);

    // UR·신화만 진화형을 가진다 (SR·SSR 뒤에 오는 진화 행은 없음).
    currentBase = grade === "UR" || grade === "신화" ? palmon : null;
  }
}

// 6) 결과 저장
const outPath = path.join(ROOT, "src/lib/data/palmons.json");
fs.writeFileSync(outPath, JSON.stringify(palmons, null, 2), "utf-8");

console.log(`✅ 팰몬 ${palmons.length}종 생성 → ${outPath}`);
const byGrade = {};
for (const p of palmons) {
  const key = p.season ? `${p.grade}(시즌${p.season})` : p.grade;
  byGrade[key] = (byGrade[key] ?? 0) + 1;
}
console.log(
  `   등급별: ${Object.entries(byGrade)
    .map(([g, c]) => `${g} ${c}`)
    .join(" · ")}`
);
console.log(
  `   진화형 포함 총 엔트리: ${palmons.reduce(
    (s, p) => s + 1 + (p.evolutions?.length ?? 0),
    0
  )}`
);
console.log(
  `   스킬 매칭된 팰몬: ${palmons.filter((p) => p.skills?.length).length}종`
);
if (missingImg.length) {
  console.log(`   이미지 없음:`);
  for (const m of missingImg) console.log(`     - ${m.num} ${m.name}`);
}
