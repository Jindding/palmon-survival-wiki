import type { Metadata } from "next";
import { calcDict } from "@/lib/i18n/calculator";
import { EvolutionEssenceView } from "./EvolutionEssenceView";

// metadata는 서버에서만 만들 수 있고 클라이언트 언어 상태를 읽지 못한다.
// 검색 노출은 한국어 기준이므로 한국어로 고정한다.
export const metadata: Metadata = {
  title: calcDict.ko.evolutionEssence.title,
  description: calcDict.ko.evolutionEssence.metaDescription,
};

export default function EvolutionEssencePage() {
  return <EvolutionEssenceView />;
}
