import type { Metadata } from "next";
import { simulatorDict } from "@/lib/i18n/simulator";
import { AuroraSummonView } from "./AuroraSummonView";

// metadata는 서버에서만 만들 수 있고 클라이언트 언어 상태를 읽지 못한다.
// 검색 노출은 한국어 기준이므로 한국어로 고정한다.
export const metadata: Metadata = {
  title: simulatorDict.ko.auroraSummon.title,
  description: simulatorDict.ko.auroraSummon.metaDescription,
};

export default function AuroraSummonPage() {
  return <AuroraSummonView />;
}
