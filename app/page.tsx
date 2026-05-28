"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Workspace } from "@/components/Workspace";
import {
  createProject,
  loadActiveId,
  loadProjects,
  saveActiveId,
  saveProjects,
} from "@/lib/projectStore";
import type { Project } from "@/lib/types";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    const loaded = loadProjects();
    if (loaded.length === 0) {
      const fresh = createProject("My first idea");
      setProjects([fresh]);
      setActiveId(fresh.id);
      saveProjects([fresh]);
      saveActiveId(fresh.id);
    } else {
      setProjects(loaded);
      const stored = loadActiveId();
      setActiveId(
        stored && loaded.some((p) => p.id === stored) ? stored : loaded[0].id
      );
    }
    setHydrated(true);

    fetch("/api/config")
      .then((r) => r.json())
      .then((j: { hasApiKey: boolean }) => setApiKeyMissing(!j.hasApiKey))
      .catch(() => setApiKeyMissing(true));
  }, []);

  useEffect(() => {
    if (hydrated) saveProjects(projects);
  }, [projects, hydrated]);

  useEffect(() => {
    if (hydrated) saveActiveId(activeId);
  }, [activeId, hydrated]);

  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  const handleSelect = useCallback((id: string) => setActiveId(id), []);

  const handleCreate = useCallback(() => {
    const p = createProject(`Idea #${Math.floor(Math.random() * 9000) + 1000}`);
    setProjects((cur) => [p, ...cur]);
    setActiveId(p.id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setProjects((cur) => {
      const next = cur.filter((p) => p.id !== id);
      if (next.length === 0) {
        const fresh = createProject("New idea");
        setActiveId(fresh.id);
        return [fresh];
      }
      setActiveId((prev) => (prev === id ? next[0].id : prev));
      return next;
    });
  }, []);

  const handleUpdate = useCallback(
    (patch: Partial<Project>) => {
      if (!activeId) return;
      setProjects((cur) =>
        cur.map((p) =>
          p.id === activeId ? { ...p, ...patch, updatedAt: Date.now() } : p
        )
      );
    },
    [activeId]
  );

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center text-neutral-500 text-sm">
        Loading workspace…
      </main>
    );
  }

  return (
    <main className="min-h-screen flex bg-neutral-950 text-neutral-100">
      <Sidebar
        projects={projects}
        activeId={activeId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
      {activeProject ? (
        <Workspace
          project={activeProject}
          apiKeyMissing={apiKeyMissing}
          onUpdate={handleUpdate}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-500">
          Select or create a project.
        </div>
      )}
    </main>
  );
}
