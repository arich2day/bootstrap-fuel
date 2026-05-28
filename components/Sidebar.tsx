"use client";

import { Plus, Trash2, Flame } from "lucide-react";
import type { Project } from "@/lib/types";

interface Props {
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ projects, activeId, onSelect, onCreate, onDelete }: Props) {
  return (
    <aside className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-950 text-neutral-200 flex flex-col h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-neutral-800 flex items-center gap-2">
        <Flame size={18} className="text-orange-400" />
        <span className="font-semibold tracking-tight">BootstrapFuel</span>
      </div>

      <button
        onClick={onCreate}
        className="mx-3 mt-3 mb-2 flex items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-sm py-2 transition"
      >
        <Plus size={14} /> New project
      </button>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {projects.length === 0 && (
          <p className="text-xs text-neutral-500 px-2 py-4">
            No projects yet. Create one to start.
          </p>
        )}
        {projects.map((p) => {
          const isActive = p.id === activeId;
          return (
            <div
              key={p.id}
              className={`group flex items-center justify-between gap-1 rounded-md px-2 py-2 text-sm cursor-pointer ${
                isActive
                  ? "bg-orange-500/10 text-orange-200 border border-orange-500/30"
                  : "hover:bg-neutral-900 border border-transparent"
              }`}
              onClick={() => onSelect(p.id)}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{p.name || "Untitled"}</div>
                <div className="truncate text-[10px] text-neutral-500">
                  {new Date(p.updatedAt).toLocaleDateString()} ·{" "}
                  {Object.keys(p.outputs).length} outputs
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete project "${p.name}"?`)) onDelete(p.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition p-1"
                aria-label="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-neutral-800 text-[10px] text-neutral-500 leading-tight">
        Local-first. All projects live in your browser's localStorage. Clearing
        site data wipes them.
      </div>
    </aside>
  );
}
