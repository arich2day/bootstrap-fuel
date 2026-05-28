"use client";

import { listRecipes } from "@/lib/promptTemplates";
import type { RecipeKey } from "@/lib/types";

interface Props {
  active: RecipeKey;
  onChange: (k: RecipeKey) => void;
  hasOutput: (k: RecipeKey) => boolean;
}

export function RecipeTabs({ active, onChange, hasOutput }: Props) {
  const recipes = listRecipes();
  return (
    <div className="flex flex-wrap gap-1 border-b border-neutral-800">
      {recipes.map((r) => {
        const isActive = active === r.key;
        return (
          <button
            key={r.key}
            onClick={() => onChange(r.key)}
            className={`relative px-3 py-2 text-xs font-medium tracking-tight border-b-2 transition ${
              isActive
                ? "border-orange-400 text-orange-200"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {r.label}
            {hasOutput(r.key) && (
              <span className="absolute top-1.5 right-0.5 h-1.5 w-1.5 rounded-full bg-orange-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
