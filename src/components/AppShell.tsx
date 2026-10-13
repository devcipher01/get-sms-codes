import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Smartphone, Inbox, Wallet, LifeBuoy, X } from "lucide-react";
import { naira, useStore } from "@/lib/store";
import { AddFundsDialog } from "./AddFunds";
import { HelpDialog } from "./HelpDialog";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/get-number", label: "Get a number", icon: Smartphone },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/wallet", label: "Wallet", icon: Wallet },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { balance } = useStore();
  const [open, setOpen] = useState(false);
  const [help, setHelp] = useState(false);
  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-sidebar p-3 md:h-screen md:w-60 md:shrink-0 md:gap-6 md:border-b-0 md:border-r md:p-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">relay<span className="text-primary">.</span></Link>
          <div className="flex items-center gap-2 md:hidden">
            <span className="font-mono text-sm">{naira(balance)}</span>
            <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => setOpen(true)}>Add funds</button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-primary/10 !text-primary font-medium" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden rounded-xl border border-border bg-card p-4 md:block">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Balance</div>
          <div className="mt-1 font-mono text-2xl font-semibold">{naira(balance)}</div>
          <button className="btn-primary mt-3 w-full py-2 text-sm" onClick={() => setOpen(true)}>Add funds</button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-10"><div className="mx-auto max-w-5xl">{children}</div></main>
      <AddFundsDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
