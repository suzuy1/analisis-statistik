import type { Statistics } from "@/lib/statistics";
import { StatCard } from "@/components/statviz/StatCard";
import { BarChartHorizontalBig, Calculator, GitCommitHorizontal, Repeat, Variable } from "lucide-react";

interface StatisticsDisplayProps {
  stats: Statistics;
}

export function StatisticsDisplay({ stats }: StatisticsDisplayProps) {
  const { mean, median, mode, variance, stdDev, count } = stats;

  const modeDisplay = mode.length > 0 ? mode.join(", ") : "N/A";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        title="Mean"
        value={mean.toFixed(2)}
        icon={Calculator}
        description="The average value"
      />
      <StatCard
        title="Median"
        value={median.toFixed(2)}
        icon={GitCommitHorizontal}
        description="The middle value"
      />
      <StatCard
        title="Mode"
        value={modeDisplay}
        icon={Repeat}
        description="Most frequent value"
      />
      <StatCard
        title="Std. Deviation"
        value={stdDev.toFixed(2)}
        icon={BarChartHorizontalBig}
        description="Measure of data spread"
      />
      <StatCard
        title="Variance"
        value={variance.toFixed(2)}
        icon={Variable}
        description="Squared deviation from mean"
      />
      <StatCard
        title="Count"
        value={count}
        icon={Calculator}
        description="Total data points"
      />
    </div>
  );
}
