/**
 * 팰몬 상세 수집 스크립트.
 *
 * palmons.json의 목록을 순회하며 상세 API를 호출해 스킬·이미지·대표색 등을 채웁니다.
 * 이미 skills가 있는 팰몬은 건너뜁니다 (--force 옵션으로 재수집 가능).
 *
 * 사용법:
 *   node scripts/scrape-palmons.mjs         # 미수집만 채우기
 *   node scripts/scrape-palmons.mjs --force # 전체 재수집
 *
 * 주의: 네이버 이용약관 준수 하에 개인·비상업적 참고 목적으로만 사용하세요.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../src/lib/data/palmons.json");

const DETAIL_URL = (objectId) =>
  `https://comm-api.game.naver.com/nng_main/v1/game/db/character/objectId/${objectId}`;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9",
  Referer: "https://game.naver.com/lounge/PalmonSurvival/db/pal",
};

const force = process.argv.includes("--force");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`   재시도 (${attempt + 1}/${retries}): ${err.message}`);
      await sleep(2000 * (attempt + 1));
    }
  }
}

async function fetchDetail(objectId) {
  const data = await fetchJson(DETAIL_URL(objectId));
  const intro = data?.intro ?? {};
  const skill = data?.skill ?? [];
  return {
    imageUrl: intro.imageUrl,
    mobileBgColor: intro.mobileBgColor,
    skills: skill.map((s) => ({
      objectId: s.objectId,
      name: s.name,
      type: s.type,
      description: s.description,
      imageUrl: s.imageUrl,
    })),
  };
}

async function main() {
  const current = JSON.parse(await readFile(OUTPUT, "utf-8"));

  const targets = current.filter((p) => force || p.skills.length === 0);
  console.log(
    `📋 대상 ${targets.length}개 / 전체 ${current.length}개 ${force ? "(강제 재수집)" : ""}`
  );

  let ok = 0;
  let fail = 0;

  for (const [i, p] of targets.entries()) {
    process.stdout.write(`  [${i + 1}/${targets.length}] ${p.name} ...`);
    try {
      const detail = await fetchDetail(p.objectId);
      const idx = current.findIndex((c) => c.objectId === p.objectId);
      current[idx] = {
        ...current[idx],
        imageUrl: detail.imageUrl ?? current[idx].imageUrl,
        mobileBgColor: detail.mobileBgColor ?? current[idx].mobileBgColor,
        skills: detail.skills,
      };
      ok++;
      console.log(` ✅ 스킬 ${detail.skills.length}개`);
    } catch (err) {
      fail++;
      console.log(` ❌ ${err.message}`);
    }
    await sleep(300);
  }

  await writeFile(OUTPUT, JSON.stringify(current, null, 2) + "\n", "utf-8");
  console.log(`\n💾 저장: ${OUTPUT}`);
  console.log(`   성공 ${ok} · 실패 ${fail}`);
}

main().catch((err) => {
  console.error("실패:", err);
  process.exit(1);
});
