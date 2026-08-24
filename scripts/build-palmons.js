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

// 4) 팰몬 조립 (진화는 UR 밑으로 그룹)
const palmons = [];
let currentBase = null;
let missingImg = [];

for (const [grade, elementRaw, numStr, name] of rows) {
  const num = parseInt(numStr, 10);
  const imagePath = imgByNum[num] ?? null;
  if (!imagePath) missingImg.push({ num, name });

  if (grade === "진화" || grade === "슈퍼 진화") {
    if (!currentBase) {
      console.warn(`[warn] ${grade} ${name} has no base UR — skipping`);
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
    if (!["물", "불", "바위", "전기"].includes(element)) {
      element = "전기";
    }

    const old = legacyByName[name];
    const palmon = {
      id: String(num),
      name,
      grade, // "SR" | "SSR" | "UR" | "신화" (신화는 내일 추가 예정)
      element,
      imagePath,
    };
    if (old?.skills?.length) palmon.skills = old.skills;
    if (old?.basicInfos?.length) palmon.basicInfos = old.basicInfos;
    palmons.push(palmon);

    currentBase = grade === "UR" ? palmon : null;
  }
}

// 5) 결과 저장
const outPath = path.join(ROOT, "src/lib/data/palmons.json");
fs.writeFileSync(outPath, JSON.stringify(palmons, null, 2), "utf-8");

console.log(`✅ 팰몬 ${palmons.length}종 생성 → ${outPath}`);
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
