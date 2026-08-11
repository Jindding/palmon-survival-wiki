# 원본 자료 ↔ 페이지 매핑

이 폴더에는 팰몬 서바이벌 게임 정보를 정리하기 위한 **원본 참고 자료(txt)** 가 모여 있습니다.
각 txt는 하나의 페이지 또는 데이터 파일의 근거 자료로 사용됩니다.

## 매핑 테이블

| 원본 자료 | 카테고리 | 서비스 경로 | 구현 파일 |
|-----------|----------|-------------|-----------|
| `build.txt` | 초보자 가이드 | `/buildings` | `src/app/buildings/page.tsx` · `src/lib/data/build.ts` |
| `GvG.txt` | 길드전 | `/gvg` | `src/app/gvg/page.tsx` · `src/lib/data/gvg.ts` |
| `season1.txt` | 시즌 가이드 | `/season1` | `src/app/season1/page.tsx` · `src/lib/data/season1.ts` |
| `sandstorm.txt` | 정기 이벤트 (주간) | `/events/sandstorm` | `src/app/events/sandstorm/page.tsx` |
| `hoofrit.txt` | 정기 이벤트 (격주) | `/events/hoofrit-rampage` | `src/app/events/hoofrit-rampage/page.tsx` |
| `treasurepot.txt` | 정기 이벤트 (월간) | `/events/treasure-pot` | `src/app/events/treasure-pot/page.tsx` |
| `emberwars.txt` | 정기 이벤트 (시즌) | `/events/ember-wars` | `src/app/events/ember-wars/page.tsx` |
| `palympic.txt` | 미구현 | — | *(팰몬 올림픽 이벤트 페이지 미제작)* |

## 관리 규칙

- 새로운 게임 정보 원본 자료가 생기면 이 폴더에 `.txt`로 저장하고 위 표에 한 줄 추가합니다.
- 페이지가 생기기 전(자료만 있는 상태)에는 "미구현"으로 표시합니다.
- 서버 시간이 언급된 자료는 UTC−2 기준이므로 페이지에서는 항상 **KST(서버 시간 +11h)** 를 병기합니다.

## 출처 계열

원본 자료는 주로 다음 소스에서 정리:

- 팰몬 서바이벌 공식 · 블루스택 가이드
- 인벤 · 나무위키
- 유튜브 공략 영상 요약

저작권은 Lilith Games에 있으며, 본 프로젝트는 팬 참고용입니다.
