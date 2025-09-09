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
        title="Rata-rata"
        value={mean.toFixed(2)}
        icon={Calculator}
        description="Nilai rata-rata"
      />
      <StatCard
        title="Median"
        value={median.toFixed(2)}
        icon={GitCommitHorizontal}
        description="Nilai tengah"
      />
      <StatCard
        title="Modus"
        value={modeDisplay}
        icon={Repeat}
        description="Nilai yang paling sering muncul"
      />
      <StatCard
        title="Deviasi Standar"
        value={stdDev.toFixed(2)}
        icon={BarChartHorizontalBig}
        description="Ukuran sebaran data"
      />
      <StatCard
        title="Varians"
        value={variance.toFixed(2)}
        icon={Variable}
        description="Kuadrat deviasi dari rata-rata"
      />
      <StatCard
        title="Jumlah"
        value={count}
        icon={Calculator}
        description="Total titik data"
      />
    </div>
  );
}
