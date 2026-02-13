import Link from "next/link";
import { Activity, Terminal, BarChart3, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Activity className="h-5 w-5 text-primary" />
            <span>PlanBrew</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
          <Zap className="h-3.5 w-3.5" />
          Fitbit for coding
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          See what you actually
          <br />
          <span className="text-primary">built this week.</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Auto-tracks your coding sessions through your AI assistant.
          Zero configuration. Zero effort. Just code.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Get Started Free
        </Link>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Terminal className="h-4.5 w-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">1. Install MCP</h3>
            <p className="text-sm text-muted-foreground">
              Add PlanBrew to your AI coding tool. Takes 2 minutes.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Activity className="h-4.5 w-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">2. Code normally</h3>
            <p className="text-sm text-muted-foreground">
              Your AI assistant auto-logs what you work on. Nothing changes for you.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <BarChart3 className="h-4.5 w-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">3. See your week</h3>
            <p className="text-sm text-muted-foreground">
              Open PlanBrew and see exactly what you built. Features, sessions, blockers.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
