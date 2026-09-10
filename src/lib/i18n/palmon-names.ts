// 팰몬 이름 한글 ↔ 영문 대응.
//
// 도감(palmons.json)에는 한국어 이름만 있어서, 영문 페이지에서 쓸 이름을 따로 둔다.
// 출처는 docs/term-translation.txt 의 "팰몬 이름" 섹션이다. 새 이름이 확인되면 양쪽을 함께 갱신한다.
//
// 여기에 없는 팰몬은 한국어 이름을 그대로 보여준다. 잘못된 영문명을 지어내는 것보다
// 한글 이름이 그대로 나오는 편이 낫기 때문이다.

import type { CalcLang } from "./calculator";
import type { PalmonElement } from "@/lib/data/palmons";

/**
 * 속성 영문명. 바위가 Rock이 아니라 Earth인 점에 주의한다 (게임 내 표기).
 * season2.ts의 "Scorphelia (Earth)" 표기와도 일치한다.
 */
export const ELEMENT_EN: Record<PalmonElement, string> = {
  물: "Water",
  불: "Fire",
  바위: "Earth",
  전기: "Electric",
};

/** 언어에 맞는 속성 이름 */
export function elementName(element: PalmonElement, lang: CalcLang): string {
  return lang === "ko" ? element : ELEMENT_EN[element];
}

/** 한국어 이름 → 게임 내 영문 이름 */
export const PALMON_NAME_EN: Record<string, string> = {
  // 시즌 1 신화 (전부 확인됨)
  글레이스윙: "Glacewing",
  마몰리스: "Mammolith",
  썬더투스: "Thundertooth",
  "엠버 가이스트": "Embergeist",

  // 시즌 2 신화
  루트워든: "Rootwarden",

  // 일반 팰몬
  닌점프: "Ninjump",
  바크플러그: "Barkplug",
  돌피렌드: "Dolphriend",
  맨틀레이: "Mantleray",
  미스티레이: "Mystiray",
  마그몰린: "Magmolin",
  솔호른: "Solhorn",
  후피릿: "Hoofrit",
  서베일링크스: "Surveilynx",
  프레달린스: "Predalynx",
  섀도우캐루: "Shadowkaeru",
  레비아돌프: "Leviadolph",
  루시디아: "Lucidina",
  아버즈니안: "Abuzzinian",
};

/** 언어에 맞는 팰몬 이름. 영문명이 없으면 한국어 이름을 그대로 쓴다. */
export function palmonName(koName: string, lang: CalcLang): string {
  if (lang === "ko") return koName;
  return PALMON_NAME_EN[koName] ?? koName;
}
