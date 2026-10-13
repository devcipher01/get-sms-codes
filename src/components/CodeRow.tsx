import { useState } from "react";

export function CopyCode({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span className="code-chip">{code}</span>
      <button className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
        onClick={() => { navigator.clipboard?.writeText(code); setDone(true); setTimeout(() => setDone(false), 1500); }}>
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
