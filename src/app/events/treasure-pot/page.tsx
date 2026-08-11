import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "보물 항아리",
  description: "팰몬 서바이벌 월간 이벤트 '보물 항아리' 공략 · 25층/60층 목표 · 무과금 망치 관리",
};

interface FloorStat {
  floor: number;
  essenceGain: string;
  cumulative: string;
  perFloor: string;
  hammersNeeded: string;
  highlight: "low" | "mid" | "high";
  memo: string;
}

const FLOORS: FloorStat[] = [
  {
    floor: 15,
    essenceGain: "1개",
    cumulative: "1개",
    perFloor: "0.07 / 층",
    hammersNeeded: "-",
    highlight: "low",
    memo: "너무 적음. 여기 멈추면 이벤트 참여 의미 없음.",
  },
  {
    floor: 25,
    essenceGain: "+40개",
    cumulative: "41개",
    perFloor: "1.64 / 층",
    hammersNeeded: "약 300개",
    highlight: "mid",
    memo: "무·소과금의 현실적 목표. 3.6회 이벤트치 망치.",
  },
  {
    floor: 60,
    essenceGain: "+110개",
    cumulative: "총합 시 층당 2.5 / 층",
    perFloor: "2.5 / 층",
    hammersNeeded: "약 720개 (보장)",
    highlight: "high",
    memo: "최대 보상. 8.4회 이벤트치 망치 — 무과금은 사실상 비추.",
  },
];

const HIGHLIGHT_STYLES: Record<FloorStat["highlight"], string> = {
  low: "from-neutral-400 to-neutral-500",
  mid: "from-purple-500 to-fuchsia-500",
  high: "from-amber-400 to-orange-500",
};

const HIGHLIGHT_LABEL: Record<FloorStat["highlight"], string> = {
  low: "낮음",
  mid: "권장",
  high: "최고",
};

export default function TreasurePotPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🏺"
        title="보물 항아리"
        description="매달 진행되는 일주일간 이벤트. 25층·60층 보상이 사실상 전부. 무과금은 망치 저축이 핵심."
        meta={<>매월 1회 · 1주일간 · 12개 항아리 · 행운의 망치로 개봉</>}
      />

      {/* 이벤트 개요 */}
      <section className="rounded-3xl border border-app bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 dark:from-amber-500/15 dark:via-yellow-500/10 dark:to-orange-500/15 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-app/60">
          <h2 className="text-lg md:text-xl">📋 이벤트 개요</h2>
        </div>
        <div className="p-4 md:p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoBlock label="주기" value="매월 1주일" />
          <InfoBlock label="항아리 수" value="12개" />
          <InfoBlock label="열쇠 아이템" value="행운의 망치" />
          <InfoBlock label="망치 획득처" value="일일 퀘스트 · 번들" />
        </div>
        <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-fg-muted leading-relaxed">
          아미고 훈련·길드 기부 등 일일 퀘스트로 <b>행운의 망치</b>를 얻고, 이걸로 항아리를 개봉해 층을 올린다.
          각 항아리에는 속도업·자원이 담겨 있으며, 12개 중에는 <b>원하는 속성 에너지 300개</b> 잭팟도 존재.
          하지만 진짜 보상은 항아리 내용물이 아니라 <b>층별 진화 정수</b>.
        </div>
      </section>

      {/* 핵심 층 요약 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">🎯 층별 진화 정수 획득량</h2>
          <p className="text-xs text-fg-muted mt-1">
            층당 획득 효율은 25층부터 급상승, 60층에서 최고. 그 이하는 참여 의미가 매우 낮음.
          </p>
        </div>

        <div className="grid gap-3">
          {FLOORS.map((f) => (
            <article
              key={f.floor}
              className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${HIGHLIGHT_STYLES[f.highlight]}`} />
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br ${HIGHLIGHT_STYLES[f.highlight]} text-white flex items-center justify-center font-bold shadow-soft`}
                  >
                    <div className="text-center leading-none">
                      <div className="text-lg">{f.floor}</div>
                      <div className="text-[9px] font-normal opacity-80">층</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg">{f.floor}층 도달 보상</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-br ${HIGHLIGHT_STYLES[f.highlight]} text-white font-bold`}
                      >
                        {HIGHLIGHT_LABEL[f.highlight]}
                      </span>
                    </div>
                    <p className="text-xs text-fg-muted mt-0.5">{f.memo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <InfoPill label="추가 진화 정수" value={f.essenceGain} />
                  <InfoPill label="누적" value={f.cumulative} />
                  <InfoPill label="층당 효율" value={f.perFloor} />
                  <InfoPill label="필요 망치" value={f.hammersNeeded} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 무과금 전략 */}
      <section className="rounded-3xl border border-app shadow-soft overflow-hidden bg-card">
        <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <h2 className="text-xl md:text-2xl">💰 무과금·소과금 전략</h2>
          <p className="text-sm text-white/90 mt-1">
            일주일 일일퀘로 얻는 망치는 총 <b>84개</b>. 60층까지는 층당 평균 1.4개 필요 → 단발 참여로는 절대 불가.
          </p>
        </div>
        <div className="p-4 md:p-5 space-y-3 text-sm text-fg-muted leading-relaxed">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              KEY INSIGHT
            </div>
            <div>
              행운의 망치는 <b>이벤트 종료 후에도 사라지지 않고 다음 이벤트로 이월</b>됨.
              여러 회차를 스킵하며 망치를 쌓아 원하는 층에 몰아 사용하는 것이 정답.
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              · <b>25층 목표</b>: 약 <b>300개</b> 망치 필요 → 대략 <b>3.6회 이벤트</b> 저축.
              현실적인 무·소과금 마지노선.
            </li>
            <li>
              · <b>60층 목표</b>: 보장하려면 약 <b>720개</b> → <b>8.4회 이벤트</b>.
              이벤트 룰 변경 리스크까지 감안하면 무과금은 사실상 비추.
            </li>
            <li>
              · <b>추천 루틴</b>: 최소 <b>450개</b> 모아서 5번 이벤트마다 25층까지 확정 클리어.
              남는 망치는 60층 도전에 쓸지, 다음 이벤트로 이월할지 개인 판단.
            </li>
          </ul>
        </div>
      </section>

      {/* 개봉 통계 */}
      <section className="grid gap-3 md:grid-cols-2">
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <h3 className="text-base mb-2">📊 60층 도달 실측</h3>
          <ul className="text-sm text-fg-muted leading-relaxed space-y-1.5">
            <li>· 총 소모 망치: <b>366개</b> (층당 평균 6.1개)</li>
            <li>· 최대 소모: <b>10개</b> (한 층)</li>
            <li>· 최소 소모: <b>3개</b></li>
            <li>· 가장 흔한 소모량: <b>5개</b></li>
          </ul>
          <div className="mt-2 text-xs text-fg-subtle">
            운에 따라 300~500개 사이에서 분산. 보장을 위한 720개 계산은 상한선.
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <h3 className="text-base mb-2">💳 번들 구매 판단</h3>
          <ul className="text-sm text-fg-muted leading-relaxed space-y-1.5">
            <li>· <b>5달러 티어만 가치 있음</b>. 그 이상은 망치 대비 효율 하락.</li>
            <li>
              · 진화 정수 자체를 얻는 게 목적이라면 이 이벤트보다{" "}
              <b>파워 오브 에볼루션</b> 상품이 더 낫다.
            </li>
            <li>· 이벤트 참여 자체는 자유. 안전 플레이 vs 60층 도전은 취향.</li>
          </ul>
        </div>
      </section>

      {/* 요약 */}
      <section className="rounded-2xl border border-app bg-muted/40 p-4 md:p-5">
        <h3 className="text-base mb-2">📝 한 줄 요약</h3>
        <p className="text-sm text-fg-muted leading-relaxed">
          <b>25층과 60층만 노린다.</b> 무과금은 여러 이벤트에 걸쳐 망치를 쌓아{" "}
          <b>25층 확정 클리어</b>가 표준. 60층은 여유가 있을 때만 도전.
          중간 층에서 애매하게 멈추면 이벤트 참여 가치가 급락.
        </p>
      </section>

      <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
        이벤트 시간대 · 서버 시간(UTC−2) 기준. KST는 서버 시간 +11시간.
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl border border-app p-4 shadow-soft">
      <div className="text-[11px] text-fg-subtle uppercase tracking-wider">{label}</div>
      <div className="text-base md:text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-lg px-2.5 py-1.5">
      <div className="text-[10px] text-fg-subtle">{label}</div>
      <div className="text-xs text-fg-muted truncate mt-0.5">{value}</div>
    </div>
  );
}
