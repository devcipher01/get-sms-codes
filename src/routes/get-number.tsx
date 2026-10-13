import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PaystackForm } from "@/components/AddFunds";
import { countries, getCountry, getService, naira, popularCountries, priceFor, services, useStore } from "@/lib/store";

export const Route = createFileRoute("/get-number")({
  head: () => ({
    meta: [
      { title: "Get a number — Relay" },
      { name: "description", content: "Pick a country and service to buy a number for SMS verification." },
      { property: "og:title", content: "Get a number — Relay" },
      { property: "og:description", content: "Pick a country and service to buy a number for SMS verification." },
    ],
  }),
  component: GetNumber,
});

function GetNumber() {
  const { balance, buy } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"popular" | "cheapest">("popular");

  const c = country ? getCountry(country) : null;
  const s = service ? getService(service) : null;
  const price = c && s ? priceFor(c, s) : 0;

  const go = (n: number) => { setStep(n); setQ(""); };

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold tracking-tight">Get a number</h1>
      <ol className="mt-6 flex gap-2 text-xs">
        {["Country", "Service", "Review"].map((l, i) => (
          <li key={l}>
            <button disabled={i + 1 > step} onClick={() => go(i + 1)}
              className={`rounded-full border px-3 py-1 ${step === i + 1 ? "border-primary bg-primary text-primary-foreground" : step > i + 1 ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
              {i + 1}. {l}
            </button>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="mt-6">
          <input placeholder="Search countries" value={q} onChange={(e) => setQ(e.target.value)} className="search" />
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="self-center text-xs text-muted-foreground">Popular:</span>
            {popularCountries.map((code) => { const x = getCountry(code); return (
              <button key={code} className="rounded-full border border-border px-3 py-1 text-sm hover:bg-accent" onClick={() => { setCountry(code); go(2); }}>{x.flag} {x.name}</button>
            ); })}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countries.filter((x) => (x.name + x.city).toLowerCase().includes(q.toLowerCase())).map((x) => (
              <button key={x.code} onClick={() => { setCountry(x.code); go(2); }}
                className={`panel text-left transition hover:border-primary ${country === x.code ? "border-primary" : ""}`}>
                <div className="text-2xl">{x.flag}</div>
                <div className="mt-2 font-medium">{x.name}</div>
                <div className="text-xs text-muted-foreground">{x.city}</div>
                <div className="mt-2 font-mono text-sm">{naira(x.min)} – {naira(x.max)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && c && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            <input placeholder="Search services" value={q} onChange={(e) => setQ(e.target.value)} className="search flex-1" />
            <div className="flex rounded-md border border-border p-1 text-sm">
              {(["popular", "cheapest"] as const).map((k) => (
                <button key={k} onClick={() => setSort(k)} className={`rounded px-3 py-1 capitalize ${sort === k ? "bg-accent font-medium" : "text-muted-foreground"}`}>{k}</button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{c.flag} {c.name} · Balance {naira(balance)}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()))
              .sort((a, b) => sort === "popular" ? b.popularity - a.popularity : a.base - b.base)
              .map((x) => { const p = priceFor(c, x); const ok = balance >= p; return (
                <button key={x.id} onClick={() => { setService(x.id); go(3); }} className="panel flex items-center justify-between text-left transition hover:border-primary">
                  <div>
                    <div className="font-medium">{x.name}</div>
                    <div className={`text-xs ${ok ? "text-success" : "text-destructive"}`}>{ok ? "Balance covers this" : "Not enough balance"}</div>
                  </div>
                  <div className="font-mono text-sm">{naira(p)}</div>
                </button>
              ); })}
          </div>
        </div>
      )}

      {step === 3 && c && s && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h2 className="panel-title">Review</h2>
            <dl className="space-y-3 text-sm">
              <Row k="Number" v={`${c.flag} ${c.name} (${c.city}) — assigned on purchase`} />
              <Row k="Service" v={s.name} />
              <Row k="Price" v={naira(price)} mono />
              <Row k="Your balance" v={naira(balance)} mono />
            </dl>
            <div className="mt-5 rounded-lg bg-muted p-4 text-sm">
              <div className="font-medium">Where your text will appear</div>
              <p className="mt-1 text-muted-foreground">Inbox → {s.name}. Your {s.name} code shows there with a copy button, usually within a minute.</p>
            </div>
            {balance >= price && (
              <button className="btn-primary mt-5 w-full py-3" onClick={() => { const id = buy(c.code, s.id, price); if (id) navigate({ to: "/inbox", search: { n: id } }); }}>
                Buy for {naira(price)}
              </button>
            )}
          </div>
          {balance < price && (
            <div className="panel border-destructive/40">
              <p className="mb-4 text-sm text-destructive">You need {naira(price - balance)} more to buy this number.</p>
              <PaystackForm suggested={price - balance} />
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className={`text-right ${mono ? "font-mono" : ""}`}>{v}</dd></div>;
}
