---
name: palmon-hub-rules
description: 팰몬 허브(palmon-hub) 저장소에서 작업할 때 반드시 따라야 할 통합 규칙. 페이지·라우트 추가, 데이터 파일 작성, 컴포넌트·스타일 수정, 게시판/Supabase 연동, 시간·스케줄 계산, 외부 코드 이식 등 이 저장소의 코드를 읽거나 고치는 모든 작업 시작 전에 읽는다.
---

# 팰몬 허브 작업 규칙

팰몬 서바이벌 비공식 팬 위키 + 익명 커뮤니티. 아래 규칙은 기존 코드에서 도출한 것이므로, 새 코드는 반드시 이 패턴을 따른다. 규칙과 다른 방식이 필요하면 먼저 사용자에게 이유를 설명하고 확인받는다.

## 1. 스택과 배치

| 항목 | 값 |
|---|---|
| 프레임워크 | Next.js 14 App Router + TypeScript |
| 스타일 | Tailwind (`darkMode: "class"`) + CSS 변수 |
| DB | Supabase (게시판 전용). **Prisma·SQLite 아님** |
| 메일 | Resend (`/api/contact`) |
| 아이콘 | `lucide-react` 만 사용 |
| 경로 별칭 | `@/*` → `src/*` |
| 배포 | Vercel |

디렉터리 역할이 엄격히 나뉜다.

- `src/app/<route>/page.tsx` — 서버 컴포넌트. `metadata` export + 레이아웃만.
- `src/app/<route>/<Name>View.tsx` — 인터랙션이 필요할 때만 같은 폴더에 `"use client"` 컴포넌트로 분리.
- `src/lib/data/<topic>.ts` — 게임 데이터와 계산 로직. **페이지에 데이터를 인라인하지 않는다.**
- `src/components/` — 라우트 간 공용 컴포넌트. 게시판 전용은 `src/components/board/`.
- `docs/sources/` — 게임 정보 원본 자료(txt/xlsx).

새 의존성 추가는 사용자 확인을 받는다 (현재 런타임 의존성 7개, 의도적으로 최소 유지).

## 2. 페이지 작성

`src/app/gvg/page.tsx`가 표준 형태다.

```tsx
export const metadata: Metadata = {
  title: "GvG 주간 미션",   // layout의 template "%s · 팰몬 허브"가 붙으므로 사이트명 반복 금지
  description: "…",
};

export default function GvGPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        emoji="🏰"
        title="GvG 주간 미션"
        description="…"
        meta={<>{gvgMeta.note} · 최종 업데이트: {gvgMeta.updatedAt} · <SourceBadge name={gvgMeta.updatedBy} /></>}
      />
      <GvGView />
    </div>
  );
}
```

- 컨테이너는 `max-w-5xl mx-auto` (도감 등 넓은 그리드는 예외 허용).
- 제목은 항상 `PageHeader`, 카드 묶음은 항상 `Section`. 직접 `<h1>`/카드 div를 만들지 않는다.
- 출처 표기가 있는 페이지는 `meta`에 `note · 최종 업데이트 · SourceBadge` 3종을 붙인다.
- **페이지를 만들면 `src/lib/menu.ts`의 해당 섹션에 lucide 아이콘과 함께 등록한다.** 자료만 있고 미구현이면 `soon: true`.

## 3. 스타일

색상은 `src/app/globals.css`의 CSS 변수 기반 유틸리티만 쓴다. 라이트/다크 두 벌이 변수로 정의돼 있어서, 이 규칙을 어기면 다크모드가 깨진다.

- 사용 가능: `bg-app` `bg-card` `bg-muted` `border-app` `text-fg` `text-fg-muted` `text-fg-subtle`
- **금지**: 하드코딩 hex, `text-gray-500`·`bg-white` 같은 고정 색 유틸리티
- 강조색 인라인은 `style={{ color: "rgb(var(--primary))" }}` 패턴 (`SourceBadge.tsx` 참고)
- 새 색이 필요하면 `globals.css`에 `:root`/`.dark` 양쪽 변수를 추가하고 `@layer utilities`에 유틸리티를 만든다
- Tailwind 팔레트 색(`emerald`, `amber` …)은 등급·카테고리 구분처럼 의미가 고정된 곳에만, 반드시 `dark:` 변형과 짝지어 사용 (`palmons.ts`의 `gradeStyles` 참고)
- 카드 기본형: `bg-card rounded-2xl p-5 md:p-6 border border-app shadow-soft`
- 반응형은 모바일 우선, `md:` 브레이크포인트 중심

## 4. 데이터 파일

`src/lib/data/<topic>.ts`는 다음을 갖춘다.

1. 파일 상단에 **한국어 주석으로 게임 시스템 설명** — 무엇이 어떤 주기로 어떻게 돌아가는지.
2. `export interface` / `export type`로 구조 명시. `any` 금지.
3. 데이터 상수 export.
4. 파일 끝에 메타:

```ts
export const <topic>Meta = {
  updatedAt: "2026-08-17",      // 항상 YYYY-MM-DD
  updatedBy: "코라 #201",        // "닉네임 #서버번호" — SourceBadge가 이 형식을 파싱한다
  note: "…",
};
```

원본 근거 자료는 `docs/sources/`에 `.txt`로 저장하고 **`docs/sources/README.md`의 매핑표에 한 줄 추가한다.**

대용량 도감 데이터는 `scripts/build-palmons.js`처럼 빌드 스크립트로 JSON을 생성한다. `palmons.json`을 손으로 고치지 말고 원본 txt + 스크립트를 고친다.

## 5. 시간 처리 — 이 프로젝트에서 가장 실수하기 쉬운 부분

- **게임 서버 시간은 UTC−2. KST = 서버 시간 + 11시간.** 시간을 표시할 때는 KST를 기준으로 하되 서버 시간을 병기한다 (`MvMSlot`의 `timeRangeKst` / `timeRangeServer`).
- **게임 하루의 경계는 KST 11:00**이다. 자정~10:59는 전날 일차에 속한다. 요일 계산 시 `if (hour < 11) dayIndex = (dayIndex + 6) % 7` 보정이 필요하다.
- **요일 고정 매핑 금지.** MvM은 5일 주기라 요일이 매주 밀린다. 반드시 앵커 날짜 + 경과 일수로 계산한다 (`ANCHOR_UTC_MS`, `mvmDayNumber`). 앵커를 새로 잡을 땐 근거 자료를 주석에 남긴다.
- **하이드레이션 불일치 주의.** 서버 컴포넌트에서 `new Date()` 결과를 직접 렌더하지 않는다. 정적 export(`mvmSchedule`)로 초기 렌더 → `useEffect`에서 클라이언트 시각으로 재계산 → `setInterval(…, 60_000)`으로 갱신하는 `MvMView.tsx` 패턴을 따른다.
- KST 변환은 `new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))`.

## 6. 클라이언트 컴포넌트

- `"use client"`는 잎 노드에만. 페이지 전체를 클라이언트로 만들지 않는다.
- `localStorage`·`crypto`·`window` 접근은 `if (typeof window === "undefined") return …` 가드 필수 (`src/lib/supabase/anon.ts` 참고).
- localStorage 키는 `palmon-hub:` 접두사.
- `setInterval`·구독은 반드시 cleanup을 반환한다.

## 7. 게시판 · Supabase

- 익명 구조: `nickname` + `password_hash`. 해시는 `hashPassword()` (`palmon-hub:v1:` prefix + SHA-256). 비밀번호 정책은 `validatePassword()` 재사용 (4~20자).
- 삭제는 **소프트 삭제**(`deleted_at`). 조회 시 `.is("deleted_at", null)` 필수.
- 리액션 중복 방지용 `author_key`는 localStorage 기반이며 **신원 검증 수단이 아니다.** 권한 판단에 쓰지 않는다.
- 클라이언트가 anon key로 직접 접근하는 구조이므로 **모든 테이블은 RLS 전제**다. 테이블·뷰를 추가하면 `docs/supabase-schema.sql`을 갱신하고 RLS 정책을 함께 작성한다.
- 뷰(`posts_with_stats`)에 의존하는 쿼리는 `listPosts`처럼 뷰 부재 시 폴백을 둔다.
- 실시간 구독은 `subscribeToPostChanges` / `subscribeToPostDetail` 패턴을 따르고 채널을 반드시 `removeChannel` 한다.

## 8. API Route 보안

`src/app/api/contact/route.ts`가 기준선이다. 새 라우트도 동일 수준을 지킨다.

- 환경변수 미설정 시 **한국어 메시지로 명확히 실패**시킨다. 키를 코드에 하드코딩하지 않는다.
- 입력은 타입 검사 + 길이 상한(`TITLE_MAX`/`BODY_MAX`) + `trim().slice()`.
- IP 기준 레이트리밋(`x-forwarded-for` 첫 값).
- HTML 조립 전 `escapeHtml()`.
- 스팸 방지는 허니팟 필드(`hp`) — 채워져 있으면 성공 응답만 돌려주고 무시.
- 에러 응답에 내부 예외 메시지를 그대로 노출하지 않는다.

## 9. 언어 · 표기

- **모든 UI 텍스트와 코드 주석은 한국어.** 주석은 "무엇"보다 "왜"를 적는다.
- 숫자는 `formatKrNum()` (만/억 단위), 소요 시간은 `formatDuration()` (`src/lib/format.ts`), 게시판 상대시간은 `formatWhen()` (`src/components/board/format.ts`). 직접 포맷하지 않는다.
- 한글 조사는 종성 계산 헬퍼(`MvMView.tsx`의 `ko()`)로 처리한다. "와(과)" 같은 병기 표기를 쓰지 않는다.
- 날짜는 `YYYY-MM-DD`, 시각은 24시간제 `HH:MM`.

## 10. 검증

- 테스트 프레임워크가 없다. 기본 검증은 **`npx tsc --noEmit`** 이다. `.next`를 건드리지 않아 안전하므로 이걸 먼저 돌린다.
- **`npm run build`는 dev 서버가 떠 있으면 돌리지 않는다.** `next dev`와 `next build`가 같은 `.next` 디렉터리를 공유해서, 빌드가 dev 서버의 청크·매니페스트를 프로덕션 산출물로 덮어쓴다. 그러면 브라우저에서 CSS·JS가 404 나며 화면이 깨진다. 복구하려면 dev 서버 종료 → `rm -rf .next` → `npm run dev` 재시작이 필요하다.
- **dev 서버는 Claude가 소유한다.** 화면 확인이 필요하면 직접 `npm run dev`를 백그라운드로 띄운다. 사용자에게 서버를 켜달라거나 꺼달라고 요청하지 않는다.
- 따라서 `npm run build`가 필요할 때의 순서는 이렇다.
  1. `netstat -ano | grep :3000` 으로 점유 확인
  2. 떠 있으면 내가 띄운 dev 서버를 먼저 종료
  3. `npm run build`
  4. `rm -rf .next` 후 `npm run dev` 재시작
- **dev 서버 종료는 TaskStop만으로 부족하다.** `npm run dev`의 자식 `next-server`가 살아남아 포트를 계속 잡고 있어서, 재시작하면 3001로 밀린다. 종료 후 반드시 확인하고 남은 프로세스를 정리한다.
  ```bash
  netstat -ano | grep -E ":300[01]\s+.*LISTENING" | awk '{print $5}' | sort -u   # PID 확인
  taskkill //PID <pid> //F                                                        # git bash에선 슬래시 2개
  ```
- 이 환경에서는 `curl http://localhost:3000` 이 권한 거부되므로, 기동·컴파일 확인은 **dev 서버 로그 출력**으로 한다.
- **`npm run lint`는 쓰지 않는다.** ESLint가 초기화돼 있지 않아 대화형 설정 프롬프트에서 멈춘다.
- 시간 계산 로직을 고쳤으면 특정 날짜를 넣어 결과를 직접 확인한다 (예: 앵커일 `2026-08-10`은 시작 카테고리가 `아미고`(index 2)여야 한다).
- 팰몬 데이터를 고쳤으면 `node scripts/build-palmons.js` 출력의 `[warn]`과 `이미지 없음:` 목록을 확인한다.

## 11. 업데이트 소식 기록 (작업 후 필수 판단)

사용자가 체감할 만한 변경을 했다면 **묻지 말고 직접** [`docs/sources/updates.txt`](../../../docs/sources/updates.txt) 맨 위에 항목을 추가한다. 이 파일이 `/updates` 페이지의 원본이며, 빌드 시 파싱된다. `updatesMeta.updatedAt`은 최신 항목 날짜로 자동 계산되므로 따로 손댈 필요 없다.

### 기록한다

- 새 페이지 · 새 메뉴 항목 추가
- 눈에 보이는 기능 추가나 화면 개편 (필터, 정렬, 검색, 카드/레이아웃 변경)
- 게임 데이터 보강 (팰몬 · 특성 · 이벤트 · 시즌 정보 추가나 대량 갱신)
- 사용자가 실제로 겪던 오류 수정

### 기록하지 않는다

- 리팩터링, 타입 정리, 주석 · 문서 수정
- 빌드 스크립트 내부 변경 (결과 데이터가 바뀌지 않는 경우)
- 오타 · 여백 · 미세 스타일 조정, 의존성 버전 업
- `CLAUDE.md`, `.claude/` 등 개발 도구 파일 변경

애매하면 **"이 변경을 모르고 사이트에 들어온 사용자가 달라진 걸 알아챌까?"** 로 판단한다. 알아채지 못하면 적지 않는다. 자잘한 변경을 여러 개 묶어서 억지로 한 항목을 만들지 않는다.

### 형식

블록은 **빈 줄로 구분**된다 (파서가 빈 줄 기준으로 나눔). 헤더 형식이 어긋난 블록은 조용히 버려지므로 정확히 지킨다.

```
[YYYY-MM-DD] TAG / 제목
- 본문 1
- 본문 2
```

- 태그: `NEW`(새 페이지·기능) · `UPDATE`(기존 개선) · `FIX`(오류 수정) · `DATA`(데이터 보강)
- 날짜는 작업일. 최신 항목이 항상 파일 맨 위
- 본문은 2~5줄. **사용자 대상 존댓말**("~했어요", "~됩니다")로 쓰고, 컴포넌트명·파일명·타입명 같은 내부 구현 용어는 쓰지 않는다
- 위치 안내는 `사이드바 [카테고리 → 메뉴명] 에서 확인하실 수 있어요` 관례를 따른다
- 아직 안 된 부분이 있으면 마지막 줄에 "순차 반영할 예정이에요"처럼 솔직히 적는다

## 12. 게임 용어 표기

영어 자료를 정리해 만든 페이지(특히 `season2.ts`)에는 게임 내 한국어 명칭 대신 영어나 음차 표기가 그대로 남아 있는 곳이 있다. 한국 유저가 게임에서 보는 이름과 달라 혼란을 준다.

- 대조표는 [`docs/term-translation.txt`](../../../docs/term-translation.txt)에 있다. `현재 표기 = 게임 내 한국어` 형식이며 **사용자가 직접 채운다.**
- 사용자가 채워 넣은 뒤에 그 표대로 각 페이지 표기를 일괄 수정한다. **비어 있는 항목은 건드리지 않는다.**
- `= 그대로`라고 적힌 항목은 원래 표기를 유지한다.
- 통상적인 외래어(버프 · 서버 · 이벤트 · 패스 등)는 대상이 아니다. 이 게임 고유의 명칭만 다룬다.
- 팰몬 이름은 항상 `palmons.json`의 도감 정식 명칭을 쓴다. 약칭·영문 이름을 본문에 남기지 않는다.
- **영문 페이지의 팰몬 이름**은 `src/lib/i18n/palmon-names.ts`의 한글→영문 표에서 가져온다. 표에 없으면 한국어 이름을 그대로 보여준다 — 영문명을 지어내지 않는다. 새 이름을 확인하면 이 표와 `docs/term-translation.txt` 양쪽을 함께 갱신한다.
- 이 파일은 페이지로 노출하지 않는다.

## 13. 계산기 페이지

`/calculator/*`는 사용자가 직접 수치를 넣어 계산해보는 카테고리다. 메뉴 섹션 이름은 **"계산기"**이며 "시뮬레이터"라고 쓰지 않는다. palmon-tool의 계산기들을 기능 단위로 잘게 쪼개서 옮겨오는 중이며, 원본 UI를 그대로 베끼지 않고 팰몬 허브 디자인에 맞춰 재구성한다.

### 페이지 구조 (고정)

1. `PageHeader` — 제목 + 한 줄 설명 + `meta`(최종 업데이트 · 수치 출처)
2. `Section` **📐 계산 방법** — **반드시 계산기보다 먼저 온다.** 규칙을 모르고 숫자만 넣게 두지 않는다.
   - **맨 위에 게임 내 아이템 이미지 + 한 줄 정의.** 이미지가 무엇에 대한 계산인지 즉시 알려주는 핵심 요소다
   - 비용·확률 표를 그대로 보여주고
   - 최종 계산식을 강조 박스에 한 줄로 적고, 바로 밑에 구체적인 예시 한 줄 ("보유 100 + 4단계 1마리 초기화 300 = 400 → 1마리 완성, 100 남음")
   - 예외·범위는 짧은 불릿 목록으로. **문단형 설명을 길게 쓰지 않는다** — 표와 계산식이 설명을 대신한다
3. `Section` **🧮 계산기** — 클라이언트 컴포넌트
4. 하단에 "수치가 다르면 문의하기로 알려달라"는 안내

### 아이템 이미지

- 원본 저장소의 아이템 PNG는 1MB 넘는 경우가 많다. **반드시 리사이즈해서** `public/items/<name>.png`에 넣는다 (240px 폭이면 충분, 1.1MB → 90KB).
  ```bash
  npx --yes sharp-cli -i <원본>.png -o public/items resize 240
  ```
- 경로는 계산 모듈에 `export const <X>_IMAGE = "/items/....png"`로 두고 페이지·계산기가 같은 상수를 쓴다.
- 노출 위치는 **페이지 안에서만** — 계산 방법 상단(72px) · 결과 카드 옆(48px) · 입력 라벨 옆(20px).
- **사이드바 메뉴에는 이미지를 쓰지 않는다.** 18px에서는 아이템 그림이 뭉개져 알아보기 어렵다. 메뉴는 lucide 아이콘으로 통일한다 (계산기는 `Calculator`).
- 메뉴 라벨은 짧게 (`"진화 정수"`, 괄호 부연 금지).

### 게임 UI 표식은 SVG로 다시 그린다

진화 단계 배지처럼 **숫자·문자가 문양 위에 겹쳐 그려진** 게임 아이콘은 원본을 잘라 쓸 수 없다(숫자를 지우면 구멍이 남는다). 이런 표식은 SVG 컴포넌트로 재현한다 — `EvolutionStageBadge.tsx`가 기준 구현이다.

- 상태를 prop으로 받아 도형 일부만 켜고 끈다 (활성 금색 그라데이션 / 비활성 회색 + `fillOpacity` 0.45).
- 좌표는 상수(`CENTER`/`TIP_RADIUS`/`HALF_WIDTH`)로 두고 삼각함수로 계산한다. 매직 넘버를 path 문자열에 박지 않는다.
- 그라데이션 `id`는 고정 문자열로 둔다. 같은 정의가 중복돼도 브라우저가 첫 정의를 쓰므로 안전하고, `useId()`를 피해 서버 컴포넌트로 유지할 수 있다.
- `role="img"` + `aria-label`로 단계를 읽어준다.
- **눈으로 확인할 것.** dev 서버 화면을 못 보므로, 같은 좌표 계산을 쓰는 임시 노드 스크립트로 SVG를 만들어 `sharp-cli`로 PNG를 뽑고 Read로 직접 본다.

### 구현 규칙

- 계산 로직은 `src/lib/data/calculators/<name>.ts`에 **순수 함수**로 두고 UI와 분리한다. 입력 타입 · 결과 타입 · 상수 · `<name>Meta`를 함께 export 한다.
- 클라이언트 컴포넌트 이름은 `<Name>Calc.tsx`.
- 입력값은 `useState<string>`으로 들고 계산 직전에 숫자로 바꾼다. 숫자 state로 잡으면 사용자가 칸을 비울 때 `0`이 남아 지워지지 않는다.
- 계산은 `useMemo`로 **실시간 갱신**한다. "계산하기" 버튼을 만들지 않는다.
- 결과 카드는 상태에 따라 테두리 색을 바꾼다 — 미입력 `border-app` / 부족 `border-red-500/40` / 충족 `border-emerald-500/40`.
- 핵심 숫자 하나를 크게(`text-4xl md:text-5xl`) 보여주고, 그 밑에 계산 내역을 행으로 펼친다. 사용자가 "왜 이 숫자인지" 역추적할 수 있어야 한다.
- 숫자에는 `tabular-nums`, 포맷은 `formatKrNum()`.
- 남는 자원·부족분처럼 **다음 행동으로 이어지는 정보**를 반드시 함께 낸다.
- `<name>Meta`는 다른 데이터 파일과 똑같이 `updatedAt` + `updatedBy`("닉네임 #서버") 두 필드만 둔다. 페이지 `meta`에는 `최종 업데이트: … · <SourceBadge name={…updatedBy} />` 형태로 붙인다 (`equipment` 페이지와 동일). **"수치 출처" 같은 별도 문구를 쓰지 않는다.**

## 14. 저작권 · 외부 코드

- 게임 저작권은 Lilith Games. 본 프로젝트는 비공식 팬 참고용이며 이 성격을 벗어나는 표현을 쓰지 않는다.

- `github.com/longchiri/palmon-tool`은 원저작자 사용 허락을 받았다(2026-09-07 확인). 해당 저장소의 PNG 에셋도 그대로 가져올 수 있다.
- 게임 스크린샷·아이콘을 새로 추가할 때는 용량(현재 `public/palmons/` 규모)과 출처를 함께 고려한다.
