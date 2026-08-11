import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "모래폭풍 전장",
  description: "팰몬 서바이벌 주간 이벤트 '모래폭풍 전장' 공략 · 구조물 우선순위 · 전략",
};

interface Structure {
  rank: 1 | 2 | 3 | 4;
  name: string;
  open: string;
  count: string;
  location: string;
  scorePerMin: number;
  buff: string;
  note: string;
  accent: string;
}

const STRUCTURES: Structure[] = [
  {
    rank: 1,
    name: "미라클 템플",
    open: "시작 12분 후",
    count: "1개 (중앙)",
    location: "맵 중앙",
    scorePerMin: 250,
    buff: "-",
    note: "워 알터·힐링 오아시스의 10배, 솔라 볼트의 5배. 사실상 승패의 90%.",
    accent: "from-amber-400 to-orange-500",
  },
  {
    rank: 2,
    name: "워 알터",
    open: "시작 5분 후",
    count: "2개 (각 진영 1)",
    location: "스폰 지점 앞",
    scorePerMin: 25,
    buff: "팰몬 공격력 · 방어력 · HP 증가",
    note: "능력치 버프로 이후 교전 유리. 자기 진영 유지 + 상대 진영 탈취.",
    accent: "from-purple-500 to-fuchsia-500",
  },
  {
    rank: 3,
    name: "솔라 볼트",
    open: "시작 즉시",
    count: "4개 (사이드 2씩)",
    location: "맵 사이드 레인",
    scorePerMin: 50,
    buff: "없음",
    note: "버프는 없지만 점수 기여 큼. 자기 진영 2개 먼저 확보.",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    rank: 4,
    name: "힐링 오아시스",
    open: "시작 8분 후",
    count: "2개 (사이드 중앙)",
    location: "사이드 레인 중앙",
    scorePerMin: 25,
    buff: "아미고 치유 속도 +25%",
    note: "전투 직접 기여도 낮음. 아미고 회복이 필요할 때만 잠깐.",
    accent: "from-emerald-500 to-teal-500",
  },
];

interface TimelineEntry {
  time: string;
  event: string;
}

const TIMELINE: TimelineEntry[] = [
  { time: "0:00", event: "경기 시작 · 솔라 볼트 4개 점령 가능" },
  { time: "5:00", event: "워 알터 2개 오픈" },
  { time: "8:00", event: "힐링 오아시스 2개 오픈" },
  { time: "12:00", event: "미라클 템플 오픈 — 이때부터가 진짜 경기" },
  { time: "60:00", event: "경기 종료 · 점수 높은 팀 승리" },
];

export default function SandstormPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        emoji="🏜️"
        title="모래폭풍 전장"
        description="주간 길드 대항 점령전. 30명 풀 참여 + 미라클 템플 점령이 승리 공식."
        meta={<>매주 금요일 · 1시간 진행 · 서버 시간은 UTC−2 (KST = 서버 +11시간)</>}
      />

      {/* 시간 요약 */}
      <section className="rounded-3xl border border-app bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-red-500/15 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-app/60">
          <h2 className="text-lg md:text-xl">🕒 진행 일정</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            매주 금요일 서버 시간 기준 2회 진행 · 각 1시간
          </p>
        </div>
        <div className="p-4 md:p-5 grid gap-3 sm:grid-cols-2">
          <TimeCard
            label="1차 배치"
            server="금요일 10:00 (UTC−2)"
            kst="금요일 21:00 KST"
          />
          <TimeCard
            label="2차 배치"
            server="금요일 22:00 (UTC−2)"
            kst="토요일 09:00 KST"
          />
        </div>
      </section>

      {/* 구조물 우선순위 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl">🏛️ 구조물 우선순위</h2>
          <p className="text-xs text-fg-muted mt-1">
            분당 점수와 버프를 기준으로 한 점령 우선순위. 미라클 템플 &gt; 워 알터 &gt; 솔라 볼트 &gt; 힐링 오아시스.
          </p>
        </div>

        <div className="grid gap-3">
          {STRUCTURES.map((s) => (
            <article
              key={s.rank}
              className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${s.accent}`} />
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center font-bold text-lg shadow-soft`}
                  >
                    {s.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg">{s.name}</h3>
                    <p className="text-xs text-fg-muted mt-0.5">{s.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-fg-subtle">분당 점수</div>
                    <div className="text-xl font-bold tabular-nums bg-gradient-palmon bg-clip-text text-transparent">
                      {s.scorePerMin}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs mb-3">
                  <InfoPill label="오픈" value={s.open} />
                  <InfoPill label="개수" value={s.count} />
                  <InfoPill label="버프" value={s.buff} />
                </div>

                <p className="text-sm text-fg-muted leading-relaxed">{s.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 경기 타임라인 */}
      <section className="space-y-3">
        <h2 className="text-xl px-1">⏱️ 경기 흐름 타임라인</h2>
        <div className="bg-card rounded-2xl border border-app shadow-soft overflow-hidden">
          {TIMELINE.map((t, i) => (
            <div
              key={t.time}
              className={`flex items-start gap-3 p-3 md:p-4 ${
                i !== TIMELINE.length - 1 ? "border-b border-app/60" : ""
              }`}
            >
              <div className="text-sm font-bold tabular-nums text-palmon-primary w-14 shrink-0">
                {t.time}
              </div>
              <div className="text-sm text-fg-muted">{t.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 승리 전략 */}
      <section className="space-y-3">
        <h2 className="text-xl px-1">🎯 승리 전략</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <StrategyCard
            emoji="👥"
            title="30명 풀 스쿼드 참여"
            body="가장 큰 변수. 대부분 팀이 30명을 못 채운다. 참여 인원 1명 늘어날 때마다 압박·점령 여력이 눈에 띄게 커진다. 리더십은 등록 인원 실참여 여부를 확인하고, 불참자는 예비 인원으로 교체."
          />
          <StrategyCard
            emoji="⚔️"
            title="PvP 스쿼드만 투입"
            body="1시간짜리 장기전이라 아미고 관리가 핵심. 초반에 한 건물에 몰빵해서 아미고 잃으면 후반이 없다. 잘 세팅된 1개 스쿼드로도 완주 가능."
          />
          <StrategyCard
            emoji="🧘"
            title="인내심 있는 유지 플레이"
            body="점령 후 공격받지 않을 때는 그대로 앉아 있는 것이 최선. 구조물이 계속 점수를 뽑고 있는 상태다. 아미고 재배치에 시간이 걸리므로 필요 없는 이동은 손해."
          />
          <StrategyCard
            emoji="💬"
            title="팀원과의 소통"
            body="길드 채팅·디스코드·보이스 뭐든 활용. 강한 상대 위치 공유해서 우회 공략, 목표 구조물 조율. 소통이 안 되면 30명이어도 오합지졸."
          />
        </div>
      </section>

      {/* 개인 목표 & 특이사항 */}
      <section className="grid gap-3 md:grid-cols-2">
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <h3 className="text-base mb-2">🏅 개인 점수 목표</h3>
          <p className="text-sm text-fg-muted leading-relaxed">
            경기에 <b>패배해도 개인 보상은 15,000점</b> 이상이면 만점으로 받는다.
            구조물 공격·점령, 상대 캠프 공격으로 점수 확보. 팀이 밀리는 상황에서도
            개인 목표는 반드시 채우기.
          </p>
        </div>
        <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
          <h3 className="text-base mb-2">💊 아미고 관련 특이사항</h3>
          <ul className="text-sm text-fg-muted leading-relaxed space-y-1.5">
            <li>· 이벤트 중 부상 아미고는 <b>종료 후 자동 회복</b>.</li>
            <li>· 즉, 이벤트 중에는 체력 부담 없이 공격적으로 운영 가능.</li>
            <li>· 단, <b>치유 스피드업은 실제 소모</b>됨. 필요 없이 쓰지 말 것.</li>
          </ul>
        </div>
      </section>

      {/* 보상 */}
      <section className="rounded-2xl border border-app bg-muted/40 p-4 md:p-5">
        <h3 className="text-base mb-2">🎁 보상 요약</h3>
        <div className="grid gap-2 md:grid-cols-2 text-sm text-fg-muted">
          <div>
            <div className="text-xs text-fg-subtle mb-1">참여 자체 보상</div>
            프레스티지, 황금 잎, 진화 에너지 선택 상자, 스피드업 등
          </div>
          <div>
            <div className="text-xs text-fg-subtle mb-1">승리 시 추가</div>
            <div>· 길드: 팰몬 알, 황금 잎, 그레늄 5, 스피드업, 자원</div>
            <div>· 개인: 프레스티지, 그레늄 5, 스피드업, 자원</div>
          </div>
        </div>
      </section>

      <div className="rounded-xl bg-muted p-3 text-[11px] text-fg-subtle">
        시간대 안내 · 게임 서버는 UTC−2 기준으로 표시됩니다. KST(한국 표준시)는 서버 시간 + 11시간으로 환산.
      </div>
    </div>
  );
}

function TimeCard({ label, server, kst }: { label: string; server: string; kst: string }) {
  return (
    <div className="bg-card rounded-2xl border border-app p-4 shadow-soft">
      <div className="text-[11px] text-fg-subtle uppercase tracking-wider">{label}</div>
      <div className="mt-2 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-fg-subtle w-10 shrink-0">서버</span>
          <span className="text-sm text-fg-muted">{server}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-palmon-primary w-10 shrink-0 font-bold">KST</span>
          <span className="text-base font-bold bg-gradient-palmon bg-clip-text text-transparent">
            {kst}
          </span>
        </div>
      </div>
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

function StrategyCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
      <h3 className="text-base mb-2 flex items-center gap-2">
        <span>{emoji}</span>
        <span>{title}</span>
      </h3>
      <p className="text-sm text-fg-muted leading-relaxed">{body}</p>
    </div>
  );
}
