import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "후피릿 폭주",
  description: "팰몬 서바이벌 격주 이벤트 '후피릿 폭주' 공략 · 500회 지원 업적 · 길드 호핑",
};

interface Strategy {
  emoji: string;
  title: string;
  body: string;
  tag?: string;
}

const STRATEGIES: Strategy[] = [
  {
    emoji: "🔁",
    title: "동일 스쿼드 다중 지원",
    tag: "기본",
    body: "후피릿 스폰 지점에 가장 가까운 캠프에 먼저 지원 → 도달 순간 즉시 회수 → 더 먼 캠프로 재지원. 스쿼드가 후피릿 무리보다 빠르므로 한 웨이브에서 2~3명까지 커버 가능. 단, 이미 후피릿이 도착 안 한 캠프에 보내면 무효, 이미 패배한 길드원 캠프도 무효.",
  },
  {
    emoji: "1️⃣",
    title: "레벨 1 팰몬 1마리 지원 스쿼드",
    tag: "고효율",
    body: "지원 스쿼드에 레벨 1 팰몬 1마리만 넣어두면, 캠프 도달 즉시 '슬퍼 보이는' 상태로 자동 복귀. 어느 스쿼드가 지원을 끝냈는지 파악 쉽고, 다른 길드원 캠프로 재빨리 전환 가능. 이기적 방법이라 실제 방어 도움은 안 되니 남용 주의.",
  },
  {
    emoji: "⚖️",
    title: "균형 잡힌 지원",
    tag: "추천",
    body: "정말 도움 필요한 길드원 캠프에는 풀 팔몬 스쿼드, 나머지 스쿼드로는 1팰몬 전략으로 여러 캠프 순회. 업적 진행률과 길드 기여도를 동시에 챙기는 타협안.",
  },
  {
    emoji: "🚪",
    title: "길드 호핑",
    tag: "S급",
    body: "같은 서버 안에서 이벤트 완료 후 다른 길드로 옮겨 이벤트를 여러 번 진행. 첫 참여 때만 자기 캠프에 웨이브가 오고, 이후에는 방어 부담 없이 전 스쿼드를 지원에만 투입 가능. 웨이브당 10명 × 2.5회 이벤트 = 500회 달성 공식. 서버 리더십들이 일정 조율해야 원활.",
  },
];

interface Reward {
  label: string;
  value: string;
}

const LV2_REWARDS: Reward[] = [
  { label: "진화 정수", value: "10개" },
  { label: "길드 친밀도", value: "21,000" },
  { label: "진화 에너지 상자", value: "252개" },
  { label: "경험치", value: "6,700만" },
  { label: "가속 아이템", value: "4시간" },
];

export default function HoofritRampagePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🐗"
        title="후피릿 폭주"
        description="격주 진행 캠프 디펜스 이벤트. 진짜 목표는 방어가 아니라 '길드원 500회 지원' 업적."
        meta={<>2주마다 · 20파 · 약 40분 소요 · 오프라인 진행 가능</>}
      />

      {/* 이벤트 개요 */}
      <section className="rounded-3xl border border-app bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-amber-500/10 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-amber-500/15 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-app/60">
          <h2 className="text-lg md:text-xl">📋 이벤트 개요</h2>
        </div>
        <div className="p-4 md:p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoBlock label="주기" value="2주" />
          <InfoBlock label="웨이브" value="총 20파" />
          <InfoBlock label="소요 시간" value="약 40분" />
          <InfoBlock label="오프라인" value="접속 안 해도 진행" />
        </div>
        <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-fg-muted leading-relaxed">
          길드 캠프의 지정 집결지를 향해 후피릿 무리가 파도처럼 밀려오는 디펜스 이벤트.
          플레이어가 접속 중이 아니어도 후피릿은 계속 공격하므로 <b>이벤트 시간에 자리를 못 지켜도 기본 보상은 획득</b>.
          단, 메인 팰몬 스쿼드는 캠프에 배치해 두어야 방어 성공.
        </div>
      </section>

      {/* 핵심 업적 */}
      <section className="rounded-3xl border border-app shadow-soft overflow-hidden bg-card">
        <div className="p-4 md:p-5 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur font-bold">
              CORE ACHIEVEMENT
            </span>
          </div>
          <h2 className="text-xl md:text-2xl">🏆 길드원 500회 지원</h2>
          <p className="text-sm text-white/90 mt-1">
            진화 정수를 대량으로 뽑아내는 이벤트 핵심 업적. 후피릿 공격을 받는 길드원 캠프에
            스쿼드를 배치할 때마다 1회 카운트.
          </p>
        </div>
        <div className="p-4 md:p-5 text-sm text-fg-muted leading-relaxed">
          단일 이벤트에서 500회를 채우려면 <b>웨이브당 10명 지원 × 2.5회 이벤트</b> 반복이 공식.
          접속 상태에서 스쿼드를 계속 돌려야 한다. 늦게 반응하면 이미 후피릿이 캠프에 안 도착했거나,
          해당 캠프가 이미 함락되어 지원 자체가 무효 처리되니 <b>웨이브 시작 직후 즉시 대응</b>이 관건.
        </div>
      </section>

      {/* 전략 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">🎯 지원 업적 달성 전략</h2>
          <p className="text-xs text-fg-muted mt-1">
            아래 전략을 조합해서 사용. 순수 효율은 1팰몬 스쿼드 + 길드 호핑, 매너는 균형 전략.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {STRATEGIES.map((s) => (
            <article
              key={s.title}
              className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base flex items-center gap-2">
                  <span>{s.emoji}</span>
                  <span>{s.title}</span>
                </h3>
                {s.tag && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-palmon text-white font-bold shrink-0">
                    {s.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-fg-muted leading-relaxed">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 보상 예시 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">🎁 보상 (2레벨 예시)</h2>
          <p className="text-xs text-fg-muted mt-1">
            길드가 1레벨을 클리어하면 다음 회차부터 레벨이 상승. 아래는 2레벨 모든 웨이브 생존 시 기준.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {LV2_REWARDS.map((r) => (
            <div
              key={r.label}
              className="bg-card rounded-2xl p-4 border border-app shadow-soft"
            >
              <div className="text-[11px] text-fg-subtle">{r.label}</div>
              <div className="text-lg md:text-xl font-bold mt-1 bg-gradient-palmon bg-clip-text text-transparent">
                {r.value}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-muted p-3 text-xs text-fg-muted">
          위 기본 보상 외에 <b>추가 진화 정수 · 진화 에너지 상자 · 경험치 · 자원</b>을 주는 업적이
          별도로 존재. 500회 지원 업적이 그중 하나로, 이벤트 참여 가치의 대부분을 차지.
        </div>
      </section>

      {/* 체크리스트 */}
      <section className="rounded-2xl border border-app bg-card shadow-soft p-4 md:p-5">
        <h3 className="text-base mb-3">✅ 이벤트 전 체크리스트</h3>
        <ul className="text-sm text-fg-muted leading-relaxed space-y-2">
          <li>· 메인 팔몬 스쿼드를 <b>본인 캠프</b>에 미리 배치</li>
          <li>· 지원용 <b>레벨 1 팰몬 1마리 스쿼드</b> 1~2개 편성해 두기</li>
          <li>· 길드 리더십의 사전 공지 확인 (집결지 위치, 레벨 목표)</li>
          <li>· 길드 호핑 참여 시 미리 초대 받을 다른 길드와 일정 조율</li>
          <li>· 이벤트 시간 40분간 접속 가능한지 스케줄 확인</li>
        </ul>
      </section>

      <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
        이벤트 시간대 · 서버 시간(UTC−2) 기준으로 공지되며, KST는 서버 시간 +11시간.
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
