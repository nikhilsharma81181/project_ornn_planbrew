"use client";

import { CheckCircle2, Activity, AlertTriangle, Circle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "update" | "completion" | "session" | "blocker";
  summary: string;
  createdAt: string;
  filesChanged?: string[];
  featureArea?: string;
  severity?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const typeConfig = {
  completion: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    label: "Completed",
  },
  session: {
    icon: Activity,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    label: "Session",
  },
  update: {
    icon: Circle,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Update",
  },
  blocker: {
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    label: "Blocker",
  },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => {
        const config = typeConfig[activity.type];
        const Icon = config.icon;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-border/80 transition-colors"
          >
            <div className={`mt-0.5 p-1.5 rounded-md ${config.bg}`}>
              <Icon className={`h-3.5 w-3.5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">
                {activity.summary}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${config.color}`}>{config.label}</span>
                {activity.featureArea && (
                  <span className="text-xs text-muted-foreground">
                    · {activity.featureArea}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  · {formatRelativeTime(activity.createdAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
