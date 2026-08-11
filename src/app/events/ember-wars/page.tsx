import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "불씨 쟁탈전 (엠버 워즈)",
  description: "팰몬 서바이벌 시즌 1 4주차부터 진행되는 32길드 PvP 이벤트 · 텔레포트 공간 · 코멧 스트라이크 공략",
};

interface Stage {
  no: number;
  name: string;
  when: string;
  kst?: string;
  duration: string;
  desc: string;
  accent: string;
}

const STAGES: Stage[] = [
  {
    no: 1,
    name: "선전포고 (Declare War)",
    when: "화요일 시작",
    duration: "24시간",
    desc: "같은 엠버 수준의 길드만 공격 대상으로 지정 가능. 목표 선정 단계.",
    accent: "from-neutral-500 to-neutral-600",
  },
  {
    no: 2,
    name: "증원 요청 (Invite Reinforcements)",
    when: "수요일",
    duration: "약 13시간",
    desc: "여러 길드에게 공격받는 경우 같은 진영의 다른 길드에 지원 요청. 방어측 협력 조율 시간.",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    no: 3,
    name: "준비 (Preparation)",
    when: "수 13:00 서버",
    kst: "목 00:00 KST",
    duration: "30분",
    desc: "공격받는 길드는 생성기 이전 불가. 패러곤은 이 시점부터 '코멧 스트라이크' 사용 가능.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    no: 4,
    name: "전투 (Battle Stage)",
    when: "수 13:30 서버",
    kst: "목 00:30 KST",
    duration: "20~40분",
    desc: "실제 공격·방어. 이 20~40분이 이벤트의 승패를 사실상 결정.",
    accent: "from-rose-500 to-red-500",
  },
];

interface Rule {
  label: string;
  value: string;
}

const ENTRY_REQS: Rule[] = [
  { label: "엠버 보유", value: "20,000개 이상" },
  { label: "길드 생성기", value: "보유 필수" },
  { label: "서버 순위", value: "엠버 상위 16위 내" },
];

interface StrategyItem {
  emoji: string;
  title: string;
  body: string;
  tag?: string;
}

const DEFENSE_STRATS: StrategyItem[] = [
  {
    emoji: "🏗️",
    title: "생성기 주변 공간 봉쇄",
    tag: "핵심",
    body: "생성기 근처 공간을 자기 캠프로 덮어야 상대의 텔레포트 착지 자체를 막을 수 있다. 이 이벤트에서 텔레포트 공간 = 승리 여부. 준비 단계 시작 순간부터 최대한 많은 캠프를 생성기 근처에 배치.",
  },
  {
    emoji: "☄️",
    title: "코멧 발사 패러곤 집중 공격",
    tag: "필수",
    body: "코멧 준비 6분간 패러곤 도시를 파괴하면 코멧 취소. 코멧이 명중하면 생성기 주변 캠프가 전부 순간이동되어 방어가 붕괴. 최강 플레이어들로 태스크포스 조직해 개별 스쿼드로 먼저 두들기고, 그 뒤 강력 스쿼드 원 랠리로 마무리하는 순서가 효과적. 랠리 준비(5분)와 코멧 준비(6분)의 시간차가 좁아 랠리만 믿으면 실패 위험.",
  },
  {
    emoji: "🔄",
    title: "코멧 착륙 이후 재배치",
    body: "코멧이 성공해도 생성기가 즉시 파괴되는 것은 아님. 캠프가 다 밀려나가는 '땅따먹기' 상태로 전환됨. 가까운 인원은 생성기 사수, 강한 인원은 주변 적 캠프 공격해서 아군 텔레포트 공간 확보. 재배치 후엔 캠프 스킬로 내구도 올려 시간 끌기. 비전투 스쿼드는 해산해서 아미고 절약.",
  },
];

const ATTACK_STRATS: StrategyItem[] = [
  {
    emoji: "🚀",
    title: "텔레포트 공간 조기 확보",
    tag: "핵심",
    body: "준비 단계 시작 즉시 최대한 많은 길드원이 생성기 근처로 순간이동해서 자리 선점. 특히 강한 플레이어의 캠프가 근처에 많을수록 유리. 이 단계에서 자리 못 잡으면 이후 무엇을 해도 어렵다.",
  },
  {
    emoji: "🐝",
    title: "패러곤 허브(Hive) 구성",
    body: "패러곤 캠프를 최강 플레이어들 캠프로 둘러싸서 방어자의 패러곤 파괴 시도를 저지. 6분간 이 대형이 유지되어야 코멧이 발사됨. 패러곤 캠프 자체 내구도 강화도 병행.",
  },
  {
    emoji: "💥",
    title: "생성기 파괴 & 공간 확장",
    body: "생성기에 최대한 가깝게 순간이동 → 즉시 행군으로 생성기 타격. 방어자 캠프가 시야에 있으면 공격해서 밀어내고, 그렇게 확보한 공간에 후속 아군이 순간이동. 모멘텀 유지가 핵심.",
  },
];

const PREP_ITEMS = [
  {
    emoji: "🎖️",
    title: "아미고 대량 훈련",
    body: "20~40분 전투를 아미고 부족으로 중도 이탈하는 게 최악 시나리오. 이벤트 전주까지 최대한 훈련 큐를 채워둘 것.",
  },
  {
    emoji: "🧪",
    title: "팰몬 스쿼드 몰빵 강화",
    body: "다른 길드전 대비로 자원 아끼는 습관이 있지만 엠버 워즈는 우선순위 1위. 보유 중인 OMNI 토큰·전설 스킬 과일·XP 아이템을 여기에 다 소진해서 스쿼드 화력을 극대화.",
  },
  {
    emoji: "📣",
    title: "리더십 지시 100% 준수",
    body: "서버 전체 32길드가 얽히는 이벤트라 개인 판단으로 튀면 전략이 무너진다. 배정된 역할(공격·방어·패러곤 허브·태스크포스)을 그대로 수행.",
  },
];

export default function EmberWarsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🔥"
        title="불씨 쟁탈전 (엠버 워즈)"
        description="시즌 1의 판도를 결정하는 32길드 PvP 대전. 텔레포트 공간 확보가 승패의 90%."
        meta={<>시즌 1 · 4주차부터 4주간 · 매주 화~수 진행 · 서버 32길드 참여</>}
      />

      {/* 참가 조건 */}
      <section className="rounded-3xl border border-app bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-amber-500/10 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-amber-500/15 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-app/60">
          <h2 className="text-lg md:text-xl">📋 참가 조건 & 진영</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            매주 월요일 서버별 진영 및 상위 16개 길드가 자동 확정됨
          </p>
        </div>
        <div className="p-4 md:p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {ENTRY_REQS.map((r) => (
              <div key={r.label} className="bg-card rounded-2xl border border-app p-4 shadow-soft">
                <div className="text-[11px] text-fg-subtle uppercase tracking-wider">{r.label}</div>
                <div className="text-base md:text-lg font-bold mt-1">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl p-4 border border-sky-500/30 bg-gradient-to-br from-sky-500/15 to-cyan-500/10">
              <div className="text-xs text-sky-700 dark:text-sky-300 font-bold mb-1">
                ❄️ 프로스트 리전 (Frost Legion)
              </div>
              <div className="text-sm text-fg-muted">1라운드 공격측 · 2라운드 방어측</div>
            </div>
            <div className="rounded-2xl p-4 border border-rose-500/30 bg-gradient-to-br from-rose-500/15 to-orange-500/10">
              <div className="text-xs text-rose-700 dark:text-rose-300 font-bold mb-1">
                🔥 엠버 얼라이언스 (Ember Alliance)
              </div>
              <div className="text-sm text-fg-muted">1라운드 방어측 · 2라운드 공격측</div>
            </div>
          </div>
        </div>
      </section>

      {/* 주간 5단계 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">📅 주간 진행 단계</h2>
          <p className="text-xs text-fg-muted mt-1">
            매주 2라운드(화·수 반복). 아래는 한 라운드 진행. 실제 승부는 4단계(전투)에서 결정.
          </p>
        </div>

        <div className="grid gap-3">
          {STAGES.map((s) => (
            <article
              key={s.no}
              className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${s.accent}`} />
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center font-bold text-lg shadow-soft`}
                  >
                    {s.no}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg">{s.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="text-fg-muted">🕒 {s.when}</span>
                      {s.kst && (
                        <span className="px-2 py-0.5 rounded-full bg-palmon-primary/15 text-palmon-primary font-bold">
                          {s.kst}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-muted text-fg-muted">
                        {s.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-xl bg-muted p-3 text-xs text-fg-muted">
          ⚠️ 서버 시간은 UTC−2 기준. KST = 서버 +11시간. 준비/전투 시작이 <b>한국 새벽 자정~00:30</b>에 걸리므로 스케줄 관리 중요.
        </div>
      </section>

      {/* 코멧 스트라이크 특별 섹션 */}
      <section className="rounded-3xl border border-app shadow-soft overflow-hidden bg-card">
        <div className="p-4 md:p-5 bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur font-bold">
              GAME CHANGER
            </span>
          </div>
          <h2 className="text-xl md:text-2xl">☄️ 코멧 스트라이크</h2>
          <p className="text-sm text-white/90 mt-1">
            공격측 패러곤이 발사하는 필살기. 생성기 주변 캠프를 통째로 순간이동시켜 방어 구도를 붕괴시킴.
          </p>
        </div>
        <div className="p-4 md:p-5 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-base mb-2 text-rose-600 dark:text-rose-400">공격측 관점</h3>
            <ul className="text-sm text-fg-muted leading-relaxed space-y-1.5">
              <li>· 패러곤 도시에서 발사, <b>준비 시간 6분</b></li>
              <li>· 준비 중 패러곤 도시 파괴되면 <b>취소</b></li>
              <li>· 성공 시 방어측 근접 캠프가 <b>강제 순간이동</b> → 공격 유리</li>
              <li>· 6분간 패러곤 지키는 <b>허브 구성</b> 필수</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base mb-2 text-sky-600 dark:text-sky-400">방어측 관점</h3>
            <ul className="text-sm text-fg-muted leading-relaxed space-y-1.5">
              <li>· 패러곤 도시를 <b>6분 내에 파괴</b>해야 코멧 봉쇄</li>
              <li>· 랠리(5분)와 코멧(6분)의 여유가 <b>1분</b>뿐 → 랠리 대신 개별 스쿼드로 선타격</li>
              <li>· 코멧 성공 후에도 <b>재배치 + 캠프 스킬</b>로 시간 끌면 만회 가능</li>
              <li>· 코멧 이전엔 방어자 유리, 이후엔 완전히 다른 게임</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 방어 전략 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">🛡️ 방어 측 전략</h2>
          <p className="text-xs text-fg-muted mt-1">
            생성기 주변 공간 봉쇄 + 코멧 저지 + 코멧 이후 대비. 3중 방어선 사고.
          </p>
        </div>
        <div className="grid gap-3">
          {DEFENSE_STRATS.map((s) => (
            <StrategyCard key={s.title} item={s} accent="sky" />
          ))}
        </div>
      </section>

      {/* 공격 전략 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">⚔️ 공격 측 전략</h2>
          <p className="text-xs text-fg-muted mt-1">
            텔레포트 공간 선점 → 패러곤 허브로 코멧 발사 → 생성기 타격의 3단 스텝.
          </p>
        </div>
        <div className="grid gap-3">
          {ATTACK_STRATS.map((s) => (
            <StrategyCard key={s.title} item={s} accent="rose" />
          ))}
        </div>
      </section>

      {/* 준비 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">✅ 이벤트 전 계정 준비</h2>
          <p className="text-xs text-fg-muted mt-1">
            엠버 워즈는 시즌 최종 보상에 크게 기여하므로 다른 GvG보다 우선순위 1위.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {PREP_ITEMS.map((s) => (
            <div
              key={s.title}
              className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5"
            >
              <h3 className="text-base mb-2 flex items-center gap-2">
                <span>{s.emoji}</span>
                <span>{s.title}</span>
              </h3>
              <p className="text-sm text-fg-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 보상 */}
      <section className="rounded-2xl border border-app bg-muted/40 p-4 md:p-5">
        <h3 className="text-base mb-2">🎁 보상 요약</h3>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-fg-muted">
          <div>
            <div className="text-xs text-fg-subtle mb-1">라운드 승리 시</div>
            <ul className="space-y-1">
              <li>· UR OMNI 토큰 2개</li>
              <li>· 길드 배지 100개</li>
              <li>· 프레스티지 10,000</li>
              <li>· 자원 선택 상자</li>
            </ul>
          </div>
          <div>
            <div className="text-xs text-fg-subtle mb-1">기여도별 추가</div>
            <ul className="space-y-1">
              <li>· 오로라 오브</li>
              <li>· 길드 배지 · 플라이트</li>
              <li>· 프레스티지 XP · 템퍼레이트</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 text-xs text-fg-muted">
          🎯 <b>진짜 보상</b>은 방어측이 지켜낸 <b>길드 엠버</b>, 공격측이 약탈한 <b>상대 길드 엠버</b>.
          이 엠버가 다음 주 진영·순위 결정에 그대로 반영되고, 시즌 최종 보상에도 직결.
        </div>
      </section>

      <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
        시간대 안내 · 게임 서버 UTC−2 기준. KST(한국 표준시)는 서버 시간 +11시간.
      </div>
    </div>
  );
}

function StrategyCard({
  item,
  accent,
}: {
  item: { emoji: string; title: string; body: string; tag?: string };
  accent: "sky" | "rose";
}) {
  const border =
    accent === "sky"
      ? "border-l-sky-500"
      : "border-l-rose-500";

  return (
    <article
      className={`bg-card rounded-2xl border border-app border-l-4 ${border} shadow-soft p-4 md:p-5`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base flex items-center gap-2">
          <span>{item.emoji}</span>
          <span>{item.title}</span>
        </h3>
        {item.tag && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-palmon text-white font-bold shrink-0">
            {item.tag}
          </span>
        )}
      </div>
      <p className="text-sm text-fg-muted leading-relaxed">{item.body}</p>
    </article>
  );
}
