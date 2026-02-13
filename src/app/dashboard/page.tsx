"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Settings } from "lucide-react";
import { Header } from "@/components/Header";
import { WeekNavigation } from "@/components/WeekNavigation";
import { ActivityFeed } from "@/components/ActivityFeed";
import { WeeklyStats } from "@/components/WeeklyStats";
import { onAuthChange } from "@/lib/firebase";
import { api } from "@/lib/api";
import { getWeekRange } from "@/lib/utils";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "update" | "completion" | "session" | "blocker";
  summary: string;
  createdAt: string;
  filesChanged?: string[];
  featureArea?: string;
  severity?: string;
}

interface Stats {
  totalUpdates: number;
  completions: number;
  sessions: number;
  blockers: number;
  mostActiveDay: string | null;
  featuresWorkedOn: number;
}

interface FeedResponse {
  activities: ActivityItem[];
  stats: Stats;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch project ID
  useEffect(() => {
    if (!authChecked) return;
    api
      .get<{ projects: { id: string }[] }>("/projects/with-keys")
      .then((data) => {
        if (data.projects.length > 0) {
          setProjectId(data.projects[0].id);
        } else {
          router.push("/setup");
        }
      })
      .catch(() => router.push("/setup"));
  }, [authChecked, router]);

  // Calculate week range
  const now = new Date();
  const offsetDate = new Date(now);
  offsetDate.setDate(offsetDate.getDate() + weekOffset * 7);
  const { start: weekStart, end: weekEnd } = getWeekRange(offsetDate);
  const canGoNext = weekOffset < 0;

  const weekStartISO = weekStart.toISOString();
  const weekEndISO = weekEnd.toISOString();

  // Fetch activity feed
  const fetchFeed = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<FeedResponse>(
        `/progress/${projectId}/activity-feed?from=${weekStartISO}&to=${weekEndISO}&limit=100`
      );
      setFeed(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, weekStartISO, weekEndISO]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Week navigation */}
        <div className="mb-6">
          <WeekNavigation
            weekStart={weekStart}
            weekEnd={weekEnd}
            onPrevious={() => setWeekOffset((o) => o - 1)}
            onNext={() => setWeekOffset((o) => o + 1)}
            canGoNext={canGoNext}
          />
        </div>

        {loading && !feed ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        ) : feed && feed.activities.length > 0 ? (
          <div className="space-y-6">
            <WeeklyStats stats={feed.stats} />
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Activity</h2>
              <ActivityFeed activities={feed.activities} />
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No activity this week</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Set up your MCP server to start tracking your coding sessions.
            </p>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Set up tracking
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
