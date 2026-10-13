import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CopyCode } from "@/components/CodeRow";
import { getService, naira, timeAgo, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Relay" },
      { name: "description", content: "Your Relay balance, numbers and latest SMS verification codes." },
      { property: "og:title", content: "Dashboard — Relay" },
      { property: "og:description", content: "Your Relay balance, numbers and latest SMS verification codes." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { balance, numbers } = useStore();
  const today = new Date().toDateString();
  const texts = numbers.flatMap((n) => n.texts.map((t) => ({ ...t, n })));
  const textsToday = texts.filter((t) => new Date(t.at).toDateString() === today).length;
  const recent = texts.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5);
  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Link to="/get-number" className="btn-primary px-5 py-2.5 text-sm">Get a number</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Balance" value={naira(balance)} />
        <Stat label="Active numbers" value={String(numbers.length)} />
        <Stat label="Texts today" value={String(textsToday)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <h2 className="panel-title">Recent codes</h2>
          {recent.length === 0 && <p className="text-sm text-muted-foreground">No codes yet.</p>}
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{getService(t.n.service).name}</div>
                  <div className="text-xs text-muted-foreground">{t.n.phone} · {timeAgo(t.at)}</div>
                </div>
                <CopyCode code={t.code} />
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2 className="panel-title">Your numbers</h2>
          <ul className="divide-y divide-border">
            {numbers.map((n) => (
              <li key={n.id}>
                <Link to="/inbox" search={{ n: n.id }} className="flex items-center justify-between py-3 hover:text-primary">
                  <div>
                    <div className="font-mono text-sm">{n.flag} {n.phone}</div>
                    <div className="text-xs text-muted-foreground">{getService(n.service).name} · {n.texts.length} texts</div>
                  </div>
                  <span className="text-xs text-muted-foreground">Open →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-mono text-3xl font-semibold">{value}</div>
    </div>
  );
}
