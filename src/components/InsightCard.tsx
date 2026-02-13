"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkles, AlertTriangle, AlertCircle, Check } from "lucide-react";
import { api } from "@/lib/api";

interface InsightDetails {
  progressSummary?: string;
  githubHighlights?: string[];
  mcpHighlights?: string[];
  crossValidationFindings?: string[];
  risks?: string[];
  recommendations?: string[];
}

export interface Insight {
  id: string;
  type: "SCHEDULED_REPORT" | "CROSS_VALIDATION" | "RISK_ALERT";
  title: string;
  summary: string;
  details: InsightDetails;
  severity: "INFO" | "WARNING" | "CRITICAL";
  score?: number;
  isRead: boolean;
  createdAt: string;
}

const severityConfig = {
  INFO: { border: "border-l-primary", icon: Sparkles, iconColor: "text-primary" },
  WARNING: { border: "border-l-amber-500", icon: AlertTriangle, iconColor: "text-amber-500" },
  CRITICAL: { border: "border-l-red-500", icon: AlertCircle, iconColor: "text-red-500" },
};

export function InsightCard({ insight, onRead }: { insight: Insight; onRead?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [marking, setMarking] = useState(false);

  const config = severityConfig[insight.severity];
  const Icon = config.icon;

  const markAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMarking(true);
    try {
      await api.patch(`/insights/${insight.id}/read`);
      onRead?.();
    } catch {
      // silent fail
    } finally {
      setMarking(false);
    }
  };

  const details = insight.details;
  const bulletSections: { label: string; items: string[] }[] = [];
  if (details.recommendations?.length) bulletSections.push({ label: "Recommendations", items: details.recommendations });
  if (details.risks?.length) bulletSections.push({ label: "Risks", items: details.risks });
  if (details.githubHighlights?.length) bulletSections.push({ label: "GitHub Highlights", items: details.githubHighlights });
  if (details.mcpHighlights?.length) bulletSections.push({ label: "MCP Highlights", items: details.mcpHighlights });
  if (details.crossValidationFindings?.length) bulletSections.push({ label: "Cross-Validation", items: details.crossValidationFindings });

  return (
    <div
      className={`rounded-lg border-l-4 ${config.border} bg-card border border-border ${insight.isRead ? "opacity-60" : ""} transition-opacity`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.summary}</p>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {details.progressSummary && (
            <p className="text-xs text-muted-foreground">{details.progressSummary}</p>
          )}

          {bulletSections.map((section) => (
            <div key={section.label}>
              <p className="text-xs font-medium text-foreground mb-1">{section.label}</p>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {!insight.isRead && (
            <button
              onClick={markAsRead}
              disabled={marking}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              <Check className="h-3 w-3" />
              {marking ? "Marking…" : "Mark as read"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
