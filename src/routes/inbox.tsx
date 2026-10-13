import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CopyCode } from "@/components/CodeRow";
import { getService, timeAgo, useStore } from "@/lib/store";

export const Route = createFileRoute("/inbox")({
  validateSearch: (s: Record<string, unknown>): { n?: string } => (typeof s["n"] === "string" ? { n: s["n"] } : {}),
  head: () => ({
    meta: [
      { title: "Inbox — Relay" },
      { name: "description", content: "Verification texts for each of your Relay numbers, grouped by service." },
      { property: "og:title", content: "Inbox — Relay" },
      { property: "og:description", content: "Verification texts for each of your Relay numbers, grouped by service." },
    ],
  }),
  component: Inbox,
});

function Inbox() {
  const { numbers } = useStore();
  const { n } = Route.useSearch();
  const active = numbers.find((x) => x.id === n) ?? numbers[0];
  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold tracking-tight">Inbox</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
        <ul className="space-y-2">
          {numbers.map((x) => (
            <li key={x.id}>
              <Link to="/inbox" search={{ n: x.id }}
                className={`block rounded-lg border p-3 ${active?.id === x.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}>
                <div className="font-medium">{getService(x.service).name}</div>
                <div className="font-mono text-xs text-muted-foreground">{x.flag} {x.phone}</div>
              </Link>
            </li>
          ))}
        </ul>
        {active && (
          <section className="panel">
            <div className="border-b border-border pb-4">
              <div className="font-display text-xl font-semibold">{getService(active.service).name}</div>
              <div className="font-mono text-sm text-muted-foreground">{active.flag} {active.phone}</div>
              <p className="mt-2 text-sm text-muted-foreground">Texts for {getService(active.service).name} sent to this number appear here.</p>
            </div>
            {active.texts.length === 0 ? (
              <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
                <span className="pulse-dot" /> Waiting for a text…
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {active.texts.map((t) => (
                  <li key={t.id} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CopyCode code={t.code} />
                      <span className="text-xs text-muted-foreground">{timeAgo(t.at)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
