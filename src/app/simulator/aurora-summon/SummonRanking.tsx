"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { palmons } from "@/lib/data/palmons";
import { useCalcLang } from "@/components/calculator/CalcLangProvider";
import { simulatorDict, type SimulatorDict } from "@/lib/i18n/simulator";
import { palmonName } from "@/lib/i18n/palmon-names";
import { formatExact } from "@/lib/format";
import {
  listTopRecords,
  RANKING_LIMIT,
  type SummonRecord,
} from "@/lib/supabase/summon-records";

// 빨리 뽑은 순 랭킹.
//
// 빈 자리는 "—"로 남겨 둔다. 초반에 목록이 짧으면 허전하기도 하고,
// 자리가 비어 있는 게 보여야 참여 동기가 생긴다.
//
// version이 바뀌면 다시 불러온다. 팝업에서 등록에 성공하면 부모가 이 값을 올린다.

const MEDALS = ["🥇", "🥈", "🥉"];

export function SummonRanking({ version }: { version: number }) {
  const { lang } = useCalcLang();
  const t = simulatorDict[lang].auroraSummon;
  const [records, setRecords] = useState<SummonRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    listTopRecords().then((rows) => {
      if (!alive) return;
      setRecords(rows);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [version]);

  const slots = Array.from({ length: RANKING_LIMIT }, (_, i) => records[i]);
  const isEmpty = loaded && records.length === 0;

  return (
    <div className="bg-card rounded-2xl border border-app shadow-soft p-4 md:p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm font-bold">{t.rankingTitle}</span>
        <span className="text-[11px] text-fg-subtle">{t.rankingNote}</span>
      </div>

      {isEmpty ? (
        <p className="text-sm text-fg-muted text-center py-6">
          {t.rankingEmpty}
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-app text-fg-subtle text-xs">
                <th className="text-left py-2 px-2 font-normal w-12">
                  {t.colRank}
                </th>
                <th className="text-left py-2 px-2 font-normal">{t.colPalmon}</th>
                <th className="text-right py-2 px-2 font-normal">
                  {t.colPulls}
                </th>
                <th className="text-right py-2 px-2 font-normal">
                  {t.colPlayer}
                </th>
              </tr>
            </thead>
            <tbody>
              {slots.map((r, i) => (
                <RankRow key={r?.id ?? `empty-${i}`} rank={i + 1} record={r} t={t} lang={lang} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RankRow({
  rank,
  record,
  t,
  lang,
}: {
  rank: number;
  record?: SummonRecord;
  t: SimulatorDict["auroraSummon"];
  lang: "ko" | "en";
}) {
  const medal = MEDALS[rank - 1];
  const palmon = record
    ? palmons.find((p) => p.id === record.palmon_id)
    : undefined;

  if (!record) {
    return (
      <tr className="border-b border-app/50 last:border-0 text-fg-subtle">
        <td className="py-2 px-2 tabular-nums">{rank}</td>
        <td className="py-2 px-2" colSpan={3}>
          —
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={`border-b border-app/50 last:border-0 ${
        rank <= 3 ? "bg-amber-500/5 dark:bg-amber-500/10" : ""
      }`}
    >
      <td className="py-2 px-2 tabular-nums whitespace-nowrap">
        {medal ? <span className="text-base">{medal}</span> : rank}
      </td>
      <td className="py-2 px-2">
        <span className="flex items-center gap-1.5 min-w-0">
          {palmon?.imagePath && (
            <Image
              src={palmon.imagePath}
              alt=""
              width={64}
              height={64}
              aria-hidden
              className="w-6 h-6 object-contain shrink-0"
            />
          )}
          <span className="truncate">
            {palmon ? palmonName(palmon.name, lang) : record.palmon_id}
          </span>
        </span>
      </td>
      <td className="py-2 px-2 text-right whitespace-nowrap">
        <span className="tabular-nums font-bold">
          {t.pullsValue(formatExact(record.pulls, lang))}
        </span>
        {record.got_by === "ceiling" && (
          <span className="ml-1 text-[10px] text-fg-subtle">
            {t.byCeilingTag}
          </span>
        )}
      </td>
      <td className="py-2 px-2 text-right whitespace-nowrap">
        <span className="text-xs">
          <span className="text-palmon-accent font-semibold">
            {t.serverBadge(record.server)}
          </span>{" "}
          <span className="text-palmon-primary font-semibold">
            {record.nickname}
          </span>
        </span>
      </td>
    </tr>
  );
}
