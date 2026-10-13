import { useState } from "react";
import { naira, useStore } from "@/lib/store";

export function AddFundsDialog({ open, onOpenChange, suggested }: { open: boolean; onOpenChange: (o: boolean) => void; suggested?: number | undefined }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4" onClick={() => onOpenChange(false)}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <PaystackForm suggested={suggested} onDone={() => onOpenChange(false)} />
      </div>
    </div>
  );
}

export function PaystackForm({ suggested, onDone }: { suggested?: number | undefined; onDone?: () => void }) {
  const { deposit } = useStore();
  const [amount, setAmount] = useState(suggested ? Math.ceil(suggested / 100) * 100 : 2000);
  const [paying, setPaying] = useState(false);
  const pay = () => {
    setPaying(true);
    setTimeout(() => { deposit(amount); setPaying(false); onDone?.(); }, 1200);
  };
  return (
    <div>
      <h3 className="font-display text-lg font-semibold">Add funds</h3>
      <p className="mt-1 text-sm text-muted-foreground">Top up your naira balance with Paystack.</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[1000, 2000, 5000, 10000].map((v) => (
          <button key={v} onClick={() => setAmount(v)} className={`rounded-md border px-2 py-2 font-mono text-xs ${amount === v ? "border-primary bg-primary/10" : "border-border"}`}>{naira(v)}</button>
        ))}
      </div>
      <label className="mt-4 block text-xs text-muted-foreground">Amount (₦)</label>
      <input type="number" min={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono" />
      <button disabled={paying || amount < 100} onClick={pay} className="btn-paystack mt-4 w-full py-2.5 text-sm">
        {paying ? "Processing…" : `Pay ${naira(amount)} with Paystack`}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">Test mode — no real charge.</p>
    </div>
  );
}
