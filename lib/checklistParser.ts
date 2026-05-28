import type { ChecklistItem } from "./types";

const CHECKBOX_RE = /^\s*[-*]\s*\[\s*[ xX]?\s*\]\s+(.+?)\s*$/;
const NUMBERED_RE = /^\s*(\d+)[.)]\s+(.+?)\s*$/;
const BULLET_ACTION_RE = /^\s*[-*]\s+(.+?)\s*$/;

const ACTION_HINTS = [
  "todo", "action", "next step", "action steps", "do this", "validate",
  "ship", "send", "build", "create", "write", "schedule",
];

function looksActionable(line: string): boolean {
  const lower = line.toLowerCase();
  return (
    /^\s*[-*]?\s*\d?[.)]?\s*(write|build|launch|email|dm|message|post|publish|set up|setup|create|schedule|book|test|validate|interview|ship|sign up|sign-up|signup|send|run|measure|track|outline|draft|review)\b/.test(
      lower
    )
  );
}

function hashId(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return `cl_${(h >>> 0).toString(36)}`;
}

export function extractChecklist(markdown: string): ChecklistItem[] {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const items: ChecklistItem[] = [];
  const seen = new Set<string>();

  let inActionSection = false;

  for (const rawLine of lines) {
    const line = rawLine;

    if (/^#{1,6}\s+/.test(line)) {
      inActionSection = /action|next step|todo|do this/i.test(line);
      continue;
    }

    let text: string | null = null;
    const cb = line.match(CHECKBOX_RE);
    if (cb) {
      text = cb[1];
    } else if (inActionSection) {
      const num = line.match(NUMBERED_RE);
      const bul = line.match(BULLET_ACTION_RE);
      if (num) text = num[2];
      else if (bul) text = bul[1];
    } else if (looksActionable(line)) {
      const bul = line.match(BULLET_ACTION_RE);
      const num = line.match(NUMBERED_RE);
      if (bul) text = bul[1];
      else if (num) text = num[2];
    }

    if (!text) continue;
    text = text.replace(/\*\*/g, "").replace(/`/g, "").trim();
    if (text.length < 4 || text.length > 240) continue;

    const id = hashId(text.toLowerCase());
    if (seen.has(id)) continue;
    seen.add(id);
    items.push({ id, text, done: false });
  }

  return items;
}

export function mergeChecklist(
  existing: ChecklistItem[],
  parsed: ChecklistItem[]
): ChecklistItem[] {
  const byId = new Map(existing.map((i) => [i.id, i]));
  const merged: ChecklistItem[] = [];
  for (const item of parsed) {
    const prior = byId.get(item.id);
    merged.push(prior ? { ...item, done: prior.done } : item);
  }
  for (const old of existing) {
    if (!merged.some((m) => m.id === old.id) && old.done) {
      merged.push(old);
    }
  }
  return merged;
}
