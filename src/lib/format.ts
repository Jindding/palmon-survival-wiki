export function formatKrNum(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "0";
  if (n < 10_000) return n.toLocaleString("ko-KR");

  if (n >= 100_000_000) {
    const 억 = n / 100_000_000;
    if (Number.isInteger(억)) return `${억}억`;
    return `${억.toFixed(3).replace(/\.?0+$/, "")}억`;
  }

  const 만 = n / 10_000;
  if (Number.isInteger(만)) return `${만.toLocaleString("ko-KR")}만`;
  return n.toLocaleString("ko-KR");
}

// 만/억으로 줄이지 않고 자릿수를 그대로 보여준다.
// 계산기 결과처럼 게임 화면의 숫자와 1:1로 대조해야 하는 값에만 쓴다.
export function formatKrExact(n: number): string {
  return n.toLocaleString("ko-KR");
}

// 소수점을 버리고 남은 0만 떼어낸다. "5.50" → "5.5", "100.00" → "100".
function trimDecimals(value: number, digits: number): string {
  const s = value.toFixed(digits);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}

// 항상 만/억으로 줄여서 보여준다. formatKrNum과 달리 딱 나누어떨어지지 않아도 반올림한다.
// 경험치처럼 자릿수가 긴 값을 표에서 훑어볼 때 쓴다. 정확한 값이 필요하면 formatKrExact.
export function formatKrCompact(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n < 10_000) return n.toLocaleString("ko-KR");
  if (n < 100_000_000) return `${trimDecimals(n / 10_000, 1)}만`;
  return `${trimDecimals(n / 100_000_000, 2)}억`;
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "미확인";
  if (seconds < 60) return `${seconds}초`;

  const min = Math.floor(seconds / 60);
  if (min < 60) return `${min}분`;

  const hours = Math.floor(min / 60);
  const restMin = min % 60;
  if (hours < 24) {
    return restMin ? `${hours}시간 ${restMin}분` : `${hours}시간`;
  }

  const days = Math.floor(hours / 24);
  const restH = hours % 24;
  return restH ? `${days}일 ${restH}시간` : `${days}일`;
}
