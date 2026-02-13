interface StatsProps {
  stats: {
    totalUpdates: number;
    completions: number;
    sessions: number;
    blockers: number;
    mostActiveDay: string | null;
    featuresWorkedOn: number;
  };
}

export function WeeklyStats({ stats }: StatsProps) {
  const dayName = stats.mostActiveDay
    ? new Date(stats.mostActiveDay + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "—";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Updates" value={stats.totalUpdates} />
      <StatCard label="Completed" value={stats.completions} color="text-emerald-400" />
      <StatCard label="Features" value={stats.featuresWorkedOn} color="text-primary" />
      <StatCard label="Most Active" value={dayName} small />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  small,
}: {
  label: string;
  value: string | number;
  color?: string;
  small?: boolean;
}) {
  return (
    <div className="p-3 rounded-lg bg-card border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`${small ? "text-sm" : "text-xl"} font-semibold ${color || "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
