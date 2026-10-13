import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PaystackForm } from "@/components/AddFunds";
import { getService, naira, timeAgo, useStore } from "@/lib/store";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — Relay" },
      { name: "description", content: "Your naira balance, Paystack deposits and payment history." },
      { property: "og:title", content: "Wallet — Relay" },
      { property: "og:description", content: "Your naira balance, Paystack deposits and payment history." },
    ],
  }),
  component: Wallet,
});

function Wallet() {
  const { balance, deposits, numbers } = useStore();
  const history = [
    ...deposits.map((d) => ({ id: d.id, label: `Paystack deposit · ${d.ref}`, amount: d.amount, at: d.at })),
    ...numbers.map((n) => ({ id: n.id, label: `${getService(n.service).name} number · ${n.phone}`, amount: -n.price, at: n.boughtAt })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold tracking-tight">Wallet</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel bg-hero">
          <div className="text-xs uppercase tracking-wider opacity-70">Naira balance</div>
          <div className="mt-2 font-mono text-5xl font-semibold">{naira(balance)}</div>
        </div>
        <div className="panel"><PaystackForm /></div>
      </div>
      <section className="panel mt-6">
        <h2 className="panel-title">Payment history</h2>
        <ul className="divide-y divide-border">
          {history.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div><div>{h.label}</div><div className="text-xs text-muted-foreground">{timeAgo(h.at)}</div></div>
              <span className={`font-mono ${h.amount > 0 ? "text-success" : ""}`}>{h.amount > 0 ? "+" : "−"}{naira(Math.abs(h.amount))}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
