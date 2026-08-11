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
