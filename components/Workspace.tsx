"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Download,
  Loader2,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import { listRecipes } from "@/lib/promptTemplates";
import { extractChecklist, mergeChecklist } from "@/lib/checklistParser";
import { matchFunding } from "@/lib/fundingDatabase";
import { downloadBlueprint } from "@/lib/blueprintExport";
import type { Project, RecipeKey } from "@/lib/types";
import { MarkdownView } from "./MarkdownView";
import { ChecklistBoard } from "./ChecklistBoard";
import { FundingPanel } from "./FundingPanel";
import { RecipeTabs } from "./RecipeTabs";

interface Props {
  project: Project;
  apiKeyMissing: boolean;
  passcode?: string | null;
  onPasscodeReject?: () => void;
  onUpdate: (patch: Partial<Project>) => void;
}

export function Workspace({
  project,
  apiKeyMissing,
  passcode,
  onPasscodeReject,
  onUpdate,
}: Props) {
  const [activeRecipe, setActiveRecipe] = useState<RecipeKey>("audience");
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [refinement, setRefinement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const recipes = useMemo(() => listRecipes(), []);
  const activeOutput = project.outputs[activeRecipe];
  const displayedContent = streaming
    ? streamBuffer
    : activeOutput?.content ?? "";

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function runGenerate(refinementText?: string) {
    if (apiKeyMissing) {
      setError("Cannot generate: GEMINI_API_KEY is missing.");
      return;
    }
    if (!project.idea.trim()) {
      setError("Add a startup idea above before generating.");
      return;
    }
    setError(null);
    setStreaming(true);
    setStreamBuffer("");

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (passcode) headers["x-bootstrap-passcode"] = passcode;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          recipe: activeRecipe,
          idea: project.idea,
          audience: project.audience,
          competitorContext: project.competitorContext,
          previous: refinementText ? activeOutput?.content : undefined,
          refinement: refinementText,
        }),
      });

      if (res.status === 401) {
        onPasscodeReject?.();
        throw new Error("Passcode rejected. Re-enter and try again.");
      }
      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStreamBuffer(acc);
      }

      const finalContent = acc.trim();
      const parsedChecklist = extractChecklist(finalContent);
      const mergedChecklist = mergeChecklist(project.checklist, parsedChecklist);

      const patch: Partial<Project> = {
        outputs: {
          ...project.outputs,
          [activeRecipe]: {
            recipe: activeRecipe,
            content: finalContent,
            generatedAt: Date.now(),
          },
        },
        checklist: mergedChecklist,
      };

      if (activeRecipe === "funding") {
        const query = `${project.idea} ${project.audience} ${project.competitorContext}`;
        patch.fundingMatches = matchFunding(query);
      }

      onUpdate(patch);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Generation failed.");
    } finally {
      setStreaming(false);
      setRefinement("");
    }
  }

  function toggleChecklistItem(id: string) {
    const next = project.checklist.map((i) =>
      i.id === id ? { ...i, done: !i.done } : i
    );
    onUpdate({ checklist: next });
  }

  const recipeLabel =
    recipes.find((r) => r.key === activeRecipe)?.label ?? activeRecipe;

  return (
    <div className="flex-1 min-w-0 px-6 py-6 space-y-6">
      {apiKeyMissing && (
        <div className="flex items-start gap-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-100 px-3 py-2 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div>
            <strong>GEMINI_API_KEY not set.</strong> Add it to{" "}
            <code className="text-yellow-200">.env.local</code> at the project
            root and restart <code>npm run dev</code>. The UI still works for
            local-only project editing.
          </div>
        </div>
      )}

      <header className="space-y-3">
        <input
          value={project.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Project name"
          className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none border-b border-transparent focus:border-neutral-700 pb-1"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field
            label="Startup idea"
            value={project.idea}
            onChange={(v) => onUpdate({ idea: v })}
            placeholder="One paragraph: what you're building and for whom."
            rows={4}
          />
          <Field
            label="Audience guess"
            value={project.audience}
            onChange={(v) => onUpdate({ audience: v })}
            placeholder="Who you think will pay."
            rows={4}
          />
          <Field
            label="Competitor context & gaps"
            value={project.competitorContext}
            onChange={(v) => onUpdate({ competitorContext: v })}
            placeholder="Closest competitors, what they miss, your wedge."
            rows={4}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <section className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <RecipeTabs
              active={activeRecipe}
              onChange={(k) => setActiveRecipe(k)}
              hasOutput={(k) => Boolean(project.outputs[k])}
            />
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => runGenerate()}
                disabled={streaming}
                className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-medium text-sm px-3 py-1.5 transition"
              >
                {streaming ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {streaming ? "Streaming…" : `Generate ${recipeLabel}`}
              </button>
              <button
                onClick={() => downloadBlueprint(project)}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 hover:bg-neutral-900 text-sm px-3 py-1.5"
                title="Download consolidated blueprint markdown"
              >
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-200 text-xs px-3 py-2">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 min-h-[280px]">
            {displayedContent ? (
              <MarkdownView content={displayedContent} />
            ) : (
              <div className="text-sm text-neutral-500">
                <Wand2 size={14} className="inline mr-1 -mt-0.5" />
                {activeOutput
                  ? "Loading…"
                  : `Click "Generate ${recipeLabel}" to stream a fresh ${recipeLabel.toLowerCase()} output.`}
              </div>
            )}
          </div>

          {activeOutput && !streaming && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (refinement.trim()) runGenerate(refinement.trim());
              }}
              className="flex items-center gap-2"
            >
              <input
                value={refinement}
                onChange={(e) => setRefinement(e.target.value)}
                placeholder="Refine: e.g. 'shorten ICP 3, make tone less aggressive'"
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500/60"
              />
              <button
                type="submit"
                disabled={!refinement.trim() || streaming}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 hover:bg-neutral-900 text-sm px-3 py-2 disabled:opacity-40"
              >
                <Send size={14} /> Refine
              </button>
            </form>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Action checklist
            </h3>
            <ChecklistBoard
              items={project.checklist}
              onToggle={toggleChecklistItem}
            />
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Capital matchmaker
            </h3>
            <FundingPanel matches={project.fundingMatches} />
            {activeRecipe !== "funding" && project.fundingMatches.length === 0 && (
              <button
                onClick={() => setActiveRecipe("funding")}
                className="mt-3 text-xs text-orange-300 hover:text-orange-200 underline"
              >
                Switch to Capital Matchmaker tab →
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block text-xs text-neutral-400 space-y-1">
      <span className="uppercase tracking-wider text-[10px]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows ?? 3}
        className="w-full rounded-md border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 px-3 py-2 outline-none focus:border-orange-500/60 resize-none"
      />
    </label>
  );
}
