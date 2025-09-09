import type { Statistics } from "@/lib/statistics";
import { StatCard } from "@/components/statviz/StatCard";
import { BarChartHorizontalBig, Calculator, GitCommitHorizontal, Repeat, Variable, MoveHorizontal, ArrowRight, ArrowLeft, MoveVertical } from "lucide-react";

interface StatisticsDisplayProps {
  stats: Statistics;
}

export function StatisticsDisplay({ stats }: StatisticsDisplayProps) {
  const { mean, median, mode, variance, stdDev, count, range, q1, q3, iqr } = stats;

  const modeDisplay = mode.length > 0 ? mode.join(", ") : "N/A";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        title="Jumlah"
        value={count}
        icon={Calculator}
        description="Total titik data"
      />
      <StatCard
        title="Rentang"
        value={range.toFixed(2)}
        icon={MoveHorizontal}
        description="Maks - Min"
      />
      <StatCard
        title="Varians"
        value={variance.toFixed(2)}
        icon={Variable}
        description="Kuadrat deviasi dari rata-rata"
      />
       <StatCard
        title="Deviasi Standar"
        value={stdDev.toFixed(2)}
        icon={BarChartHorizontalBig}
        description="Ukuran sebaran data"
      />
      <StatCard
        title="Kuartil 1 (Q1)"
        value={q1.toFixed(2)}
        icon={ArrowRight}
        description="Persentil ke-25"
      />
      <StatCard
        title="Kuartil 3 (Q3)"
        value={q3.toFixed(2)}
        icon={ArrowLeft}
        description="Persentil ke-75"
      />
      <StatCard
        title="Rentang Interkuartil (IQR)"
        value={iqr.toFixed(2)}
        icon={MoveVertical}
        description="Q3 - Q1"
      />
    </div>
  );
}
