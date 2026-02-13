"use client";

import { useState } from "react";
import { Search, Download, X } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "update" | "completion" | "session" | "blocker";
  summary: string;
  createdAt: string;
  filesChanged?: string[];
  featureArea?: string;
  severity?: string;
}

type ActivityType = "all" | "update" | "completion" | "session" | "blocker";

interface SearchAndExportProps {
  activities: ActivityItem[];
  onFilteredChange: (filtered: ActivityItem[]) => void;
}

const typeFilters: { value: ActivityType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completion", label: "Completed" },
  { value: "session", label: "Sessions" },
  { value: "update", label: "Updates" },
  { value: "blocker", label: "Blockers" },
];

function filterActivities(
  activities: ActivityItem[],
  query: string,
  typeFilter: ActivityType
): ActivityItem[] {
  let filtered = activities;
  if (typeFilter !== "all") {
    filtered = filtered.filter((a) => a.type === typeFilter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.summary.toLowerCase().includes(q) ||
        a.featureArea?.toLowerCase().includes(q) ||
        a.filesChanged?.some((f) => f.toLowerCase().includes(q))
    );
  }
  return filtered;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportToCSV(activities: ActivityItem[]) {
  const headers = ["Date", "Type", "Summary", "Feature Area", "Files Changed", "Severity"];
  const rows = activities.map((a) => [
    new Date(a.createdAt).toLocaleString(),
    a.type,
    `"${a.summary.replace(/"/g, '""')}"`,
    a.featureArea || "",
    a.filesChanged?.join("; ") || "",
    a.severity || "",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csv, "planbrew-activity.csv", "text/csv;charset=utf-8;");
}

function exportToJSON(activities: ActivityItem[]) {
  downloadFile(JSON.stringify(activities, null, 2), "planbrew-activity.json", "application/json");
}

export function SearchAndExport({ activities, onFilteredChange }: SearchAndExportProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType>("all");
  const [showExportMenu, setShowExportMenu] = useState(false);

  function apply(newQuery: string, newType: ActivityType) {
    onFilteredChange(filterActivities(activities, newQuery, newType));
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    apply(value, typeFilter);
  }

  function handleTypeChange(type: ActivityType) {
    setTypeFilter(type);
    apply(query, type);
  }

  function clearSearch() {
    setQuery("");
    setTypeFilter("all");
    onFilteredChange(activities);
  }

  const hasFilters = query.trim() !== "" || typeFilter !== "all";
  const currentFiltered = filterActivities(activities, query, typeFilter);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          {hasFilters && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
          {showExportMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[120px]">
                <button
                  onClick={() => {
                    exportToCSV(currentFiltered);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors"
                >
                  CSV
                </button>
                <button
                  onClick={() => {
                    exportToJSON(currentFiltered);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors"
                >
                  JSON
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => handleTypeChange(f.value)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              typeFilter === f.value
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
