"use client";

import { ExternalLink, Coins } from "lucide-react";
import type { FundingMatch } from "@/lib/types";

export function FundingPanel({ matches }: { matches: FundingMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="text-xs text-neutral-500 italic">
        Run the Capital Matchmaker to filter the local funding database against
        your idea and competitor context.
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {matches.map((m) => (
        <li
          key={m.name}
          className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 text-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Coins size={14} className="text-orange-400 shrink-0" />
                <span className="font-semibold tracking-tight">{m.name}</span>
              </div>
              <div className="text-[11px] text-neutral-400">{m.type}</div>
            </div>
            {m.url && (
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-neutral-400 hover:text-orange-300 shrink-0"
                aria-label={`Open ${m.name}`}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <p className="mt-1.5 text-[13px] text-neutral-300 leading-snug">
            {m.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {m.focusKeywords.slice(0, 6).map((k) => (
              <span
                key={k}
                className="text-[10px] px-1.5 py-0.5 rounded border border-neutral-700 text-neutral-400"
              >
                {k}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
