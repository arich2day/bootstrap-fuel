"use client";

import { useState } from "react";
import { BadgeCheck, ExternalLink, Loader2, Sparkles, X } from "lucide-react";

interface Props {
  license: string | null;
  isPro: boolean;
  checkoutUrl: string | null;
  freeLimit: number;
  proLimit: number;
  onValidated: (key: string) => void;
  onCleared: () => void;
}

export function LicenseBar({
  license,
  isPro,
  checkoutUrl,
  freeLimit,
  proLimit,
  onValidated,
  onCleared,
}: Props) {
  const [open, setOpen] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function activate() {
    if (!keyInput.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: keyInput.trim() }),
      });
      const data = (await res.json()) as { valid: boolean; reason?: string };
      if (!res.ok || !data.valid) {
        throw new Error(data.reason || "Key rejected");
      }
      onValidated(keyInput.trim());
      setOpen(false);
      setKeyInput("");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (isPro) {
    return (
      <div className="px-3 py-2 border-t border-neutral-800 bg-neutral-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-300">
            <BadgeCheck size={14} /> Pro · {proLimit}/hr
          </div>
          <button
            onClick={() => {
              if (confirm("Sign out of Pro?")) onCleared();
            }}
            className="text-[10px] text-neutral-500 hover:text-red-400"
          >
            Sign out
          </button>
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
          Key: {license?.slice(0, 8)}…
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-neutral-800 bg-neutral-900/40">
      {!open ? (
        <div className="px-3 py-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Free · {freeLimit}/hr
            </span>
            <button
              onClick={() => setOpen(true)}
              className="text-[10px] text-orange-300 hover:text-orange-200 underline"
            >
              Have a key?
            </button>
          </div>
          {checkoutUrl && (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-1 w-full rounded-md bg-orange-500 hover:bg-orange-400 text-neutral-950 font-medium text-xs py-1.5"
            >
              <Sparkles size={12} /> Upgrade to Pro
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      ) : (
        <div className="px-3 py-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Paste license key
            </span>
            <button
              onClick={() => {
                setOpen(false);
                setErr(null);
              }}
              className="text-neutral-500 hover:text-neutral-300"
              aria-label="Cancel"
            >
              <X size={12} />
            </button>
          </div>
          <input
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-xs outline-none focus:border-orange-500/60"
          />
          <button
            onClick={activate}
            disabled={busy || !keyInput.trim()}
            className="flex items-center justify-center gap-1 w-full rounded-md bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 font-medium text-xs py-1.5"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : null}
            Activate
          </button>
          {err && (
            <div className="text-[10px] text-red-300">{err}</div>
          )}
        </div>
      )}
    </div>
  );
}
