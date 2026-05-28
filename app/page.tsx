"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Workspace } from "@/components/Workspace";
import { PasscodeGate } from "@/components/PasscodeGate";
import { LicenseBar } from "@/components/LicenseBar";
import {
  createProject,
  loadActiveId,
  loadProjects,
  saveActiveId,
  saveProjects,
} from "@/lib/projectStore";
import type { Project } from "@/lib/types";

const PASSCODE_STORAGE_KEY = "bootstrap-fuel.passcode.v1";
const LICENSE_STORAGE_KEY = "bootstrap-fuel.license.v1";

interface AppConfig {
  hasApiKey: boolean;
  passcodeRequired: boolean;
  freeRateLimitPerHour: number;
  proRateLimitPerHour: number;
  checkoutUrl: string | null;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [passcode, setPasscode] = useState<string | null>(null);
  const [license, setLicense] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

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
    setPasscode(window.localStorage.getItem(PASSCODE_STORAGE_KEY));
    const storedLicense = window.localStorage.getItem(LICENSE_STORAGE_KEY);
    setLicense(storedLicense);
    if (storedLicense) {
      fetch("/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: storedLicense }),
      })
        .then((r) => r.json())
        .then((j: { valid: boolean }) => setIsPro(Boolean(j.valid)))
        .catch(() => setIsPro(false));
    }
    setHydrated(true);

    fetch("/api/config")
      .then((r) => r.json())
      .then((j: AppConfig) => setConfig(j))
      .catch(() =>
        setConfig({
          hasApiKey: false,
          passcodeRequired: false,
          freeRateLimitPerHour: 3,
          proRateLimitPerHour: 100,
          checkoutUrl: null,
        })
      );
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

  const handlePasscodeSubmit = useCallback((code: string) => {
    window.localStorage.setItem(PASSCODE_STORAGE_KEY, code);
    setPasscode(code);
  }, []);

  const handlePasscodeReject = useCallback(() => {
    window.localStorage.removeItem(PASSCODE_STORAGE_KEY);
    setPasscode(null);
  }, []);

  const handleLicenseValidated = useCallback((key: string) => {
    window.localStorage.setItem(LICENSE_STORAGE_KEY, key);
    setLicense(key);
    setIsPro(true);
  }, []);

  const handleLicenseCleared = useCallback(() => {
    window.localStorage.removeItem(LICENSE_STORAGE_KEY);
    setLicense(null);
    setIsPro(false);
  }, []);

  if (!hydrated || !config) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500 text-sm">
        Loading workspace…
      </main>
    );
  }

  if (config.passcodeRequired && !passcode) {
    return <PasscodeGate onSubmit={handlePasscodeSubmit} />;
  }

  return (
    <main className="min-h-screen flex bg-neutral-950 text-neutral-100">
      <Sidebar
        projects={projects}
        activeId={activeId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
        footer={
          <LicenseBar
            license={license}
            isPro={isPro}
            checkoutUrl={config.checkoutUrl}
            freeLimit={config.freeRateLimitPerHour}
            proLimit={config.proRateLimitPerHour}
            onValidated={handleLicenseValidated}
            onCleared={handleLicenseCleared}
          />
        }
      />
      {activeProject ? (
        <Workspace
          project={activeProject}
          apiKeyMissing={!config.hasApiKey}
          passcode={passcode}
          license={isPro ? license : null}
          checkoutUrl={config.checkoutUrl}
          onPasscodeReject={handlePasscodeReject}
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
