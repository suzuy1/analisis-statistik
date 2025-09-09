"use client";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ChartType } from "@/app/page";
import { Loader2 } from "lucide-react";
import { BoxPlotChart } from "./BoxPlotChart";
import { calculateQuartiles, calculateIQR, calculateMedian } from "@/lib/statistics";


interface VisualizationCardProps {
  data: number[][];
  chartType: ChartType;
  onChartTypeChange: (value: ChartType) => void;
  suggestedChartType: string | null;
  isProcessing: boolean;
}

const COLORS = ["#6699CC", "#FFA07A", "#8884d8", "#82ca9d", "#ffc658"];

const processForHistogram = (data: number[]) => {
  if (data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const numBins = Math.ceil(Math.sqrt(data.length));
  const binWidth = range > 0 ? range / numBins : 1;

  const bins = Array.from({ length: numBins }, (_, i) => {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    return {
      name: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
      count: 0,
    };
  });

  data.forEach(val => {
    let binIndex = Math.floor((val - min) / binWidth);
    if (val === max) binIndex = numBins - 1; // Put max value in the last bin
    if (bins[binIndex]) {
      bins[binIndex].count++;
    }
  });

  return bins;
};

const processForPie = (data: number[]) => {
  return processForHistogram(data).map(bin => ({ name: bin.name, value: bin.count })).filter(d => d.value > 0);
};

const processForScatter = (data: number[][]) => {
  if (data.length < 2 || data[0].length === 0 || data[1].length === 0) return [];
  const [xData, yData] = data;
  const len = Math.min(xData.length, yData.length);
  return Array.from({ length: len }, (_, i) => ({ x: xData[i], y: yData[i] }));
};

const processForBoxPlot = (data: number[]) => {
  if (data.length === 0) return [];

  const sortedData = [...data].sort((a, b) => a - b);
  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1];
  const median = calculateMedian(sortedData);
  const { q1, q3 } = calculateQuartiles(sortedData);
  const iqr = q3 - q1;

  // Determine outliers
  const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
  const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
  const outliers = sortedData.filter(d => d < lowerWhisker || d > upperWhisker);
  
  return [{
    name: "Data",
    box: [lowerWhisker, q1, median, q3, upperWhisker],
    outliers: outliers.map(o => [0, o]), // Format for recharts scatter
  }];
};

export function VisualizationCard({ data, chartType, onChartTypeChange, suggestedChartType, isProcessing }: VisualizationCardProps) {

  const chartData = React.useMemo(() => {
    if (data.length === 0) return null;
    switch (chartType) {
      case "histogram":
        return processForHistogram(data[0]);
      case "pie":
        return processForPie(data[0]);
      case "scatter":
        return processForScatter(data);
       case "boxplot":
        return processForBoxPlot(data[0]);
      default:
        return null;
    }
  }, [data, chartType]);

  const chartConfig = {
    count: { label: "Jumlah", color: "hsl(var(--chart-1))" },
  };

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
          <p>Bagan akan ditampilkan di sini setelah data diproses.</p>
        </div>
      );
    }

    switch (chartType) {
      case "histogram":
        return (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={chartData as any[]} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        );
      case "pie":
        return (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <PieChart>
              <Tooltip content={<ChartTooltipContent nameKey="name" />} />
              <Legend />
              <Pie data={chartData as any[]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {(chartData as any[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        );
      case "scatter":
         if(data.length < 2) {
             return (
                <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
                    <p>Scatter plot membutuhkan setidaknya dua kolom data.</p>
                </div>
            );
         }
        return (
          <ChartContainer config={{}} className="min-h-[200px] w-full">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="X" />
              <YAxis type="number" dataKey="y" name="Y" />
              <ZAxis type="number" range={[100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter name="Dataset" data={chartData as any[]} fill="hsl(var(--chart-2))" />
            </ScatterChart>
          </ChartContainer>
        );
      case "boxplot":
        return <BoxPlotChart data={chartData as any[]} />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Visualisasi Data</CardTitle>
                <CardDescription>Representasi visual dari kumpulan data Anda.</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Select value={chartType} onValueChange={(value: ChartType) => onChartTypeChange(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih jenis bagan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="histogram">Histogram</SelectItem>
                        <SelectItem value="pie">Diagram Lingkaran</SelectItem>
                        <SelectItem value="scatter" disabled={data.length < 2}>Plot Sebar</SelectItem>
                        <SelectItem value="boxplot">Box Plot</SelectItem>
                    </SelectContent>
                </Select>
                 {suggestedChartType && (
                    <Badge variant="secondary">Saran AI: {suggestedChartType.replace('histogram', 'Histogram').replace('pie chart', 'Diagram Lingkaran').replace('scatter plot', 'Plot Sebar')}</Badge>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        {isProcessing ? (
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
            renderChart()
        )}
      </CardContent>
    </Card>
  );
}
