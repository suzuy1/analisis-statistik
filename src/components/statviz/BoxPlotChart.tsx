"use client";

import { Bar, ComposedChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface BoxPlotChartProps {
  data: {
    name: string;
    box: [number, number, number, number, number];
    outliers: [number, number][];
  }[];
}

const BoxPlotTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, box, outliers } = payload[0].payload;
    const [lowerWhisker, q1, median, q3, upperWhisker] = box;
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg text-sm">
        <p className="font-bold mb-2">{name}</p>
        <p>Upper Whisker: {upperWhisker.toFixed(2)}</p>
        <p>Q3: {q3.toFixed(2)}</p>
        <p>Median: {median.toFixed(2)}</p>
        <p>Q1: {q1.toFixed(2)}</p>
        <p>Lower Whisker: {lowerWhisker.toFixed(2)}</p>
        {outliers.length > 0 && <p className="mt-2 font-bold">Outliers: {outliers.map((o: any) => o[1].toFixed(2)).join(", ")}</p>}
      </div>
    );
  }

  return null;
};

export function BoxPlotChart({ data }: BoxPlotChartProps) {
  const chartConfig = {
    box: { label: "Box", color: "hsl(var(--chart-1))" },
    outliers: { label: "Outliers", color: "hsl(var(--chart-2))" },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <ComposedChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis type="category" dataKey="name" hide />
        <XAxis type="number" allowDuplicatedCategory={false} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<BoxPlotTooltipContent />} />
        <Legend />
        <Bar dataKey="box" barSize={40} shape={<BoxAndWhisker />} fill="hsl(var(--chart-1))" />
        <Scatter dataKey="outliers" fill="hsl(var(--chart-2))" shape="cross" />
      </ComposedChart>
    </ChartContainer>
  );
}

const BoxAndWhisker = (props: any) => {
  const { x, y, width, height, payload } = props;
  const [lowerWhisker, q1, median, q3, upperWhisker] = payload.box;
  
  const iqr = q3 - q1;
  const range = upperWhisker - lowerWhisker;

  const q1X = x + width * ((q1 - lowerWhisker) / range);
  const q3X = x + width * ((q3 - lowerWhisker) / range);
  const medianX = x + width * ((median - lowerWhisker) / range);
  const boxWidth = q3X - q1X;

  const whiskerY = y + height / 2;

  return (
    <g>
      {/* Box */}
      <rect x={q1X} y={y} width={boxWidth} height={height} fill="hsl(var(--chart-1))" stroke="#000" />
      {/* Median line */}
      <line x1={medianX} y1={y} x2={medianX} y2={y + height} stroke="#fff" strokeWidth={2} />
      {/* Lower whisker line */}
      <line x1={x} y1={whiskerY} x2={q1X} y2={whiskerY} stroke="hsl(var(--chart-1))" strokeWidth={2} />
      {/* Upper whisker line */}
      <line x1={q3X} y1={whiskerY} x2={x + width} y2={whiskerY} stroke="hsl(var(--chart-1))" strokeWidth={2} />
      {/* Lower whisker end */}
      <line x1={x} y1={y} x2={x} y2={y + height} stroke="hsl(var(--chart-1))" strokeWidth={2} />
       {/* Upper whisker end */}
      <line x1={x + width} y1={y} x2={x + width} y2={y + height} stroke="hsl(var(--chart-1))" strokeWidth={2} />
    </g>
  );
};
