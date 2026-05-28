"use client";

import { CheckSquare, Square } from "lucide-react";
import type { ChecklistItem } from "@/lib/types";

interface Props {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export function ChecklistBoard({ items, onToggle }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-xs text-neutral-500 italic">
        Action steps extracted from your generated copy will appear here as a
        checkable list.
      </div>
    );
  }
  const remaining = items.filter((i) => !i.done).length;
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        {remaining}/{items.length} remaining
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onToggle(item.id)}
              className={`w-full text-left flex items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-800/60 transition ${
                item.done ? "text-neutral-500 line-through" : "text-neutral-200"
              }`}
            >
              {item.done ? (
                <CheckSquare size={16} className="mt-0.5 shrink-0 text-orange-400" />
              ) : (
                <Square size={16} className="mt-0.5 shrink-0 text-neutral-500" />
              )}
              <span>{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
