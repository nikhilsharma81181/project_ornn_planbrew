import Link from "next/link";
import {
  Activity,
  Terminal,
  BarChart3,
  Zap,
  CheckCircle2,
  User,
  Settings,
  Clock,
  TrendingUp,
  Code2,
  Calendar,
} from "lucide-react";

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
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
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

        {/* Dashboard Preview */}
        <div className="mt-16 rounded-xl border border-border bg-card p-1 shadow-lg shadow-primary/5">
          <div className="rounded-lg border border-border/50 bg-background p-4 sm:p-6">
            {/* Mock header bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                This Week&apos;s Overview
              </div>
              <span className="text-xs text-muted-foreground">Feb 10 – Feb 14</span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Updates", value: "12", icon: Activity },
                { label: "Completed", value: "5", icon: CheckCircle2 },
                { label: "Features", value: "3", icon: Code2 },
                { label: "Most Active", value: "Wed", icon: Calendar },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/50 bg-card p-3 text-left"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <stat.icon className="h-3 w-3" />
                    {stat.label}
                  </div>
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Sample activity items */}
            <div className="space-y-2">
              {[
                { text: "Implemented user auth flow", time: "2h ago", color: "text-green-400" },
                { text: "Fixed sidebar resize bug", time: "5h ago", color: "text-blue-400" },
                { text: "Added dashboard analytics page", time: "Yesterday", color: "text-green-400" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center justify-between rounded-md border border-border/30 bg-card/50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${item.color} bg-current`} />
                    <span className="text-foreground">{item.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid sm:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Settings className="h-4.5 w-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">What it does</h3>
            <p className="text-sm text-muted-foreground">
              Auto-tracks your coding progress through AI assistants. No manual logging, no
              timesheets, no context switching.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <User className="h-4.5 w-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Who it&apos;s for</h3>
            <p className="text-sm text-muted-foreground">
              Solo devs, freelancers, and indie hackers who lose track of what they ship each week.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Clock className="h-4.5 w-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">How it works</h3>
            <p className="text-sm text-muted-foreground">
              Install an MCP plugin, code normally, open PlanBrew to see your week. That&apos;s it.
            </p>
          </div>
        </div>

        {/* How it works steps */}
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-foreground mb-6">Get started in 3 steps</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
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
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </Link>
          <p className="text-sm text-muted-foreground mt-3">Free forever. No credit card needed.</p>
        </div>
      </main>
    </div>
  );
}
