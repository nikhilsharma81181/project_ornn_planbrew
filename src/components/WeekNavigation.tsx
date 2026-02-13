"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekLabel } from "@/lib/utils";

interface WeekNavigationProps {
  weekStart: Date;
  weekEnd: Date;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
}

export function WeekNavigation({
  weekStart,
  weekEnd,
  onPrevious,
  onNext,
  canGoNext,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onPrevious}
        className="p-1.5 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium text-foreground min-w-[200px] text-center">
        {formatWeekLabel(weekStart, weekEnd)}
      </span>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="p-1.5 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
