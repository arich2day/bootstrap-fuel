"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

interface Props {
  onSubmit: (code: string) => void;
}

export function PasscodeGate({ onSubmit }: Props) {
  const [code, setCode] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) onSubmit(code.trim());
        }}
        className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-orange-300">
          <KeyRound size={18} />
          <h1 className="text-lg font-semibold tracking-tight">
            BootstrapFuel
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          This workspace is passcode-protected. Enter the access passcode shared
          by the operator.
        </p>
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Access passcode"
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500/60"
        />
        <button
          type="submit"
          disabled={!code.trim()}
          className="w-full rounded-md bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 font-medium text-sm py-2"
        >
          Unlock
        </button>
        <p className="text-[11px] text-neutral-500">
          Stored only in this browser's localStorage. Clear it from the sidebar
          footer to sign out.
        </p>
      </form>
    </div>
  );
}
