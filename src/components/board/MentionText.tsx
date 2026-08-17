import { Fragment } from "react";

// @닉네임 패턴 매칭 (한글/영문/숫자/언더바 허용, 20자 이내)
const MENTION_REGEX = /@([\p{L}\p{N}_]{1,20})/gu;

/**
 * 텍스트 내 @닉네임을 스타일링해 렌더링.
 * 개행은 <br />로 보존.
 */
export function MentionText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {renderLine(line)}
          {li < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

function renderLine(line: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  MENTION_REGEX.lastIndex = 0;
  while ((m = MENTION_REGEX.exec(line)) !== null) {
    if (m.index > lastIndex) parts.push(line.slice(lastIndex, m.index));
    parts.push(
      <span
        key={`m-${m.index}`}
        className="text-palmon-primary font-bold bg-palmon-primary/10 px-1 rounded"
      >
        @{m[1]}
      </span>,
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < line.length) parts.push(line.slice(lastIndex));
  return parts;
}
