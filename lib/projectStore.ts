"use client";

import type { Project, RecipeKey } from "./types";

const STORAGE_KEY = "bootstrap-fuel.projects.v1";
const ACTIVE_KEY = "bootstrap-fuel.activeId.v1";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(ACTIVE_KEY, id);
  else window.localStorage.removeItem(ACTIVE_KEY);
}

export function createProject(name = "New idea"): Project {
  const now = Date.now();
  return {
    id: `p_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    idea: "",
    audience: "",
    competitorContext: "",
    outputs: {},
    checklist: [],
    fundingMatches: [],
    createdAt: now,
    updatedAt: now,
  };
}

export const recipeOrder: RecipeKey[] = [
  "audience",
  "positioning",
  "copy",
  "pitch",
  "funding",
];
