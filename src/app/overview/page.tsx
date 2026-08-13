import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "게임 소개",
  description:
    "팰몬 서바이벌의 핵심 시스템 정리. 팰몬·전투·기지·길드·컨텐츠 개요.",
};

// 팰몬 등급.
const GRADES = [
  {
    tier: "UR",
    label: "전설",
    color: "from-amber-400 to-orange-500",
    text: "text-amber-500",
    note: "황금색 · 최상위 등급. 신성한 장소 보스 처치 · 부화 · UR 증표로 별 등급 상승.",
  },
  {
    tier: "SSR",
    label: "에픽",
    color: "from-fuchsia-500 to-purple-500",
    text: "text-fuchsia-500",
    note: "보라색 · 상위 등급.",
  },
  {
    tier: "SR",
    label: "일반",
    color: "from-sky-500 to-blue-500",
    text: "text-sky-500",
    note: "파란색 · 기본 등급.",
  },
];

// 4속성 상성. A → B = A가 B를 상쇄.
const ELEMENTS = [
  { key: "water", label: "물", emoji: "💧", counters: "불", color: "from-sky-500 to-blue-500" },
  { key: "fire", label: "불", emoji: "🔥", counters: "땅", color: "from-red-500 to-orange-500" },
  { key: "earth", label: "땅", emoji: "🌱", counters: "전기", color: "from-amber-600 to-yellow-600" },
  { key: "electric", label: "전기", emoji: "⚡", counters: "물", color: "from-yellow-400 to-amber-500" },
];

interface BuildingInfo {
  emoji: string;
  name: string;
  desc: string;
}

const BUILDINGS_CORE: BuildingInfo[] = [
  { emoji: "🏭", name: "생산 건물", desc: "자원(골드·목판·강철 등)을 생산." },
  { emoji: "⚔️", name: "무기고 (Arm Hubs)", desc: "군대(Amigos)를 훈련." },
  { emoji: "🔬", name: "아카데미", desc: "다양한 기술을 연구." },
  { emoji: "🏕️", name: "캠프", desc: "플레이어 전력 레벨과 팰몬 레벨 업그레이드의 기준 건물." },
  { emoji: "🥚", name: "부화장 (Hatchery)", desc: "알을 부화시켜 팰몬 획득. 중복 팰몬은 해산 → 토큰으로 별 등급 상승." },
  { emoji: "🛏️", name: "침대", desc: "밤에 팰몬이 취침. 부족하면 피로로 작업 효율 저하. 레벨 10에서 2층 침대 해제." },
];

const BUILDINGS_CONTENT: BuildingInfo[] = [
  { emoji: "🚁", name: "비행선 (Airship)", desc: "탐험을 보내 자원 획득. 하루 4회 사용 가능." },
  { emoji: "🏥", name: "병원 (Hospitals)", desc: "부상 Amigos를 치료해 재사용." },
  { emoji: "🎯", name: "팔루시움 (Palucium)", desc: "타 플레이어를 공격해 순위를 올리고 보석·코인을 획득. 명예 상점 재화로 사용." },
  { emoji: "📦", name: "스쿼드 건물", desc: "레벨을 올릴수록 스쿼드에 배치 가능한 Amigos 수 증가." },
  { emoji: "💞", name: "육아실 (Nursery)", desc: "두 팰몬을 교배해 자손 획득. 자손은 부모 특성을 물려받음." },
  { emoji: "🐾", name: "버디 (Buddies)", desc: "길들여 먹이 제공 → 친밀도·레벨 상승. 24시간마다 보상 요청 가능." },
];

const SHOPS = [
  { name: "명예 상점 (Prestige Shop)", currency: "팔루시움에서 얻은 보석·코인" },
  { name: "길드 상점 (Guild Shop)", currency: "길드 코인" },
  { name: "VIP 상점", currency: "할인 가격 (VIP 등급 필요)" },
  { name: "일반 상점 (Normal Shop)", currency: "팔렛(Pallets)" },
];

const FOUR_X = [
  { letter: "E", label: "Explore", ko: "탐험" },
  { letter: "E", label: "Expand", ko: "확장" },
  { letter: "E", label: "Exploit", ko: "착취" },
  { letter: "E", label: "Exterminate", ko: "섬멸" },
];

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🎮"
        title="게임 소개"
        description="팰몬 서바이벌의 핵심 시스템을 한눈에. 팰몬·전투·기지·길드·컨텐츠 개요를 정리했습니다."
      />

      {/* 4X 개요 */}
      <Section
        emoji="🌐"
        title="4X 전략 생존 게임 + 몬스터 육성"
        description="4X 전략에 팰몬 포획·육성 시스템을 결합한 장르. 다양한 전략과 팰몬 조합이 승패를 가릅니다."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {FOUR_X.map((x) => (
            <div
              key={x.label}
              className="rounded-xl border border-app bg-muted/40 p-3 text-center"
            >
              <div className="text-2xl font-bold bg-gradient-palmon bg-clip-text text-transparent">
                {x.letter}
              </div>
              <div className="text-xs text-fg-muted mt-0.5">{x.label}</div>
              <div className="text-sm mt-0.5">{x.ko}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 팰몬 시스템 */}
      <Section
        emoji="🐣"
        title="팰몬 (Palmon) 시스템"
        description="포획·강화·전투의 핵심. 등급이 높을수록 별 등급과 스킬 성장 상한이 높습니다."
      >
        <div className="space-y-4">
          <div className="grid gap-2 md:grid-cols-3">
            {GRADES.map((g) => (
              <div
                key={g.tier}
                className="rounded-xl border border-app bg-card p-4 shadow-soft"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g.color} text-white flex items-center justify-center text-xs font-bold shadow-soft`}
                  >
                    {g.tier}
                  </span>
                  <span className={`text-sm font-bold ${g.text}`}>{g.label}</span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">{g.note}</p>
              </div>
            ))}
          </div>

          <ul className="text-sm text-fg-muted space-y-1.5 leading-relaxed">
            <li>
              · <b>캐처</b>를 사용해 팰몬을 포획. 실패해도{" "}
              <b>팰몬 조각(토큰)</b>이 남아 업그레이드에 사용할 수 있습니다.
            </li>
            <li>
              · 부화장의 <b>중복 팰몬</b>은 해산하면 토큰으로 교환되어{" "}
              <b>별 등급</b>을 올릴 수 있습니다.
            </li>
            <li>
              · 스킬 레벨을 올리려면 팰몬의 <b>별 등급</b>을 먼저 올려야 합니다.
            </li>
            <li>
              · 업그레이드 · 스킬 향상 · 장비 착용으로 팰몬을 강화합니다.
            </li>
          </ul>
        </div>
      </Section>

      {/* 스쿼드·전투 */}
      <Section
        emoji="⚔️"
        title="스쿼드 · 아미고(Amigos) 전투"
        description="팰몬은 아미고(군대)를 이끌고 스쿼드 단위로 전투에 참여합니다."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-app bg-muted/40 p-4">
            <h3 className="text-sm font-bold mb-2">스쿼드 구성</h3>
            <ul className="text-sm text-fg-muted space-y-1.5 leading-relaxed">
              <li>· 총 <b>4개 스쿼드</b> (초반 2, 이후 진행으로 2개 추가 해제)</li>
              <li>· 각 스쿼드에 <b>팰몬 5명</b> 배치</li>
              <li>· 전방 <b>탱커 2 + 후방 공격수 3</b> 전형</li>
              <li>· 스쿼드 건물 레벨업 → 아미고 배치 수 증가</li>
            </ul>
          </div>
          <div className="rounded-xl border border-app bg-muted/40 p-4">
            <h3 className="text-sm font-bold mb-2">아미고(Amigos)</h3>
            <ul className="text-sm text-fg-muted space-y-1.5 leading-relaxed">
              <li>· <b>아미고 허브</b>에서 훈련</li>
              <li>· 아미고 없이는 전투 불가</li>
              <li>· 총 <b>9개 등급</b>. 캠프 레벨이 오르면 자동 해제</li>
              <li>· 부상 시 <b>병원</b>에서 치료 후 재사용</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 속성 상성 */}
      <Section
        emoji="🔥"
        title="속성 상성 (4속성)"
        description="4속성 순환 상성. 후반부는 스쿼드를 단일 속성으로 통일해 보너스를 받는 편이 유리."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {ELEMENTS.map((el) => (
            <div
              key={el.key}
              className="rounded-xl border border-app bg-card p-3 text-center shadow-soft"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${el.color} flex items-center justify-center text-2xl shadow-soft`}
              >
                {el.emoji}
              </div>
              <div className="text-sm font-bold mt-2">{el.label}</div>
              <div className="text-[11px] text-fg-muted mt-0.5">
                → <b>{el.counters}</b> 상쇄
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-muted/40 border border-app p-3 text-xs text-fg-muted leading-relaxed">
          💧 물 → 🔥 불 → 🌱 땅 → ⚡ 전기 → 💧 물 (순환). 초반에는 팰몬·속성 접근성이 낮아
          혼합 편성이 유리하고, 후반부에는 단일 속성 스쿼드로 큰 보너스를 받습니다.
        </div>
      </Section>

      {/* 길드 시스템 */}
      <Section
        emoji="🏰"
        title="길드 · 신성한 장소 (Sanctums)"
        description="서버 전체의 성장을 도모하는 협력 시스템. 다른 서버와 경쟁도 진행됩니다."
      >
        <ul className="text-sm text-fg-muted space-y-1.5 leading-relaxed">
          <li>· 길드는 초기 <b>100명</b>까지 수용. 직접 생성하거나 기존 길드에 가입.</li>
          <li>· <b>신성한 장소(Sanctums)</b> 점령 → 농업/생산 <b>버프</b> 획득.</li>
          <li>
            · 초기 <b>2개</b> 보유 → 기술 발전으로 <b>3개</b> → 추가 발전으로 최대{" "}
            <b>6개</b>까지.
          </li>
          <li>· 신성한 장소 버프는 <b>중첩되어 적용</b>됩니다.</li>
          <li>· 신성한 장소 <b>보스 처치</b> 시 해당 보스를 <b>UR 팰몬</b>으로 획득.</li>
        </ul>
      </Section>

      {/* 기지 건물 */}
      <Section
        emoji="🏗️"
        title="기지 건물"
        description="자원·훈련·연구·팰몬 성장의 축이 되는 주요 건물들."
      >
        <div className="mb-3">
          <div className="text-xs uppercase tracking-wider text-fg-subtle mb-2">
            핵심 건물
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {BUILDINGS_CORE.map((b) => (
              <BuildingCard key={b.name} info={b} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-fg-subtle mb-2">
            탐험 · 전투 · 육성 시설
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {BUILDINGS_CONTENT.map((b) => (
              <BuildingCard key={b.name} info={b} />
            ))}
          </div>
        </div>
      </Section>

      {/* 상점 */}
      <Section
        emoji="🛒"
        title="상점 시스템"
        description="사용 재화가 서로 달라 목적에 맞춰 이용해야 합니다."
      >
        <div className="grid gap-2 md:grid-cols-2">
          {SHOPS.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-app bg-muted/40 p-3"
            >
              <div className="text-sm font-bold">{s.name}</div>
              <div className="text-xs text-fg-muted mt-0.5">사용 재화 · {s.currency}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 컨텐츠 */}
      <Section
        emoji="🗺️"
        title="아이돌 랜즈 (Idol Lands)"
        description="시간 경과로 보상이 쌓이는 방치형 탐험 컨텐츠."
      >
        <ul className="text-sm text-fg-muted space-y-1.5 leading-relaxed">
          <li>· 총 <b>500개 이상의 레벨</b>이 존재.</li>
          <li>· 각 레벨의 보스를 처치하고 다음 레벨로 진행.</li>
          <li>· <b>파워 · 전략적 배치</b>가 클리어 관건.</li>
          <li>· 레벨을 해제할수록 시간이 지나면서 상자에 <b>보상이 자동으로 축적</b>.</li>
          <li>· <b>자동 진행</b> 기능으로 게임이 알아서 보스를 처치하며 레벨업.</li>
        </ul>
      </Section>

      {/* VIP */}
      <Section
        emoji="⭐"
        title="VIP 시스템"
        description="레벨별 상시 버프와 성장 보너스를 제공합니다."
      >
        <ul className="text-sm text-fg-muted space-y-1.5 leading-relaxed">
          <li>· 총 <b>14개 레벨</b>.</li>
          <li>· 레벨별로 <b>생산 · 연구 · 건설 속도 증가</b> 버프 제공.</li>
          <li>· <b>팰몬 · 군대 관련 보너스</b>도 함께 적용.</li>
          <li>
            · <b>VIP 14</b> 달성 시 매일 <b>UR 토큰 3개</b> 획득 → UR 팰몬 별 등급 상승에 사용.
          </li>
        </ul>
      </Section>

      <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
        이 문서는 게임 시스템 개요만 다룹니다. 상세 가이드는 왼쪽 메뉴의 팰몬 도감 · 특성
        가이드 · 캠프 업그레이드 · 재화·과금 · GvG · 모험가 대회 페이지를 참고하세요.
      </div>
    </div>
  );
}

function BuildingCard({ info }: { info: BuildingInfo }) {
  return (
    <div className="rounded-xl border border-app bg-card p-3 shadow-soft flex items-start gap-3">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-muted flex items-center justify-center text-xl">
        {info.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold">{info.name}</div>
        <div className="text-xs text-fg-muted mt-0.5 leading-relaxed">{info.desc}</div>
      </div>
    </div>
  );
}
