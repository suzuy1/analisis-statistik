"use client";

import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import Papa from "papaparse";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateStdDev,
  calculateVariance,
  calculateRange,
  calculateQuartiles,
  calculateIQR,
} from "@/lib/statistics";
import type { Statistics } from "@/lib/statistics";

import { DataInputCard } from "@/components/statviz/DataInputCard";
import { StatisticsDisplay } from "@/components/statviz/StatisticsDisplay";
import { VisualizationCard } from "@/components/statviz/VisualizationCard";
import { InsightsCard } from "@/components/statviz/InsightsCard";
import { StatvizIcon } from "@/components/icons/StatvizIcon";
import { suggestChartType } from "@/ai/flows/suggest-chart-type";
import { generateDataInsights } from "@/ai/flows/auto-generate-data-insights";

export type ChartType = "histogram" | "pie" | "scatter";

export default function Home() {
  const [dataString, setDataString] = useState<string>("1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5");
  const [data, setData] = useState<number[][]>([
    [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5],
  ]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [chartType, setChartType] = useState<ChartType>("histogram");
  const [suggestedChartType, setSuggestedChartType] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [isProcessing, startProcessing] = useTransition();
  const [isAiRunning, startAiTasks] = useTransition();
  const { toast } = useToast();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const textData = result.data.map((row: any) => row.join(",")).join("\n");
          setDataString(textData);
        },
        error: (error) => {
          toast({
            variant: "destructive",
            title: "Kesalahan Parsing CSV",
            description: error.message,
          });
        },
      });
    }
  };

  const processData = () => {
    startProcessing(() => {
      try {
        setStatistics(null);
        setInsights(null);
        setSuggestedChartType(null);

        const rows = dataString.trim().split("\n");
        const parsedData = rows.map((row) =>
          row.split(",").map((val) => parseFloat(val.trim())).filter((num) => !isNaN(num))
        );

        const nonEmptyData = parsedData.filter((arr) => arr.length > 0);

        if (nonEmptyData.length === 0 || nonEmptyData.every(arr => arr.length === 0)) {
          throw new Error("Tidak ada data numerik yang valid ditemukan. Silakan periksa masukan Anda.");
        }
        
        setData(nonEmptyData);

        const flatData = nonEmptyData.flat();
        const { q1, q3 } = calculateQuartiles(flatData);

        const stats: Statistics = {
          mean: calculateMean(flatData),
          median: calculateMedian(flatData),
          mode: calculateMode(flatData),
          variance: calculateVariance(flatData),
          stdDev: calculateStdDev(flatData),
          count: flatData.length,
          range: calculateRange(flatData),
          q1: q1,
          q3: q3,
          iqr: calculateIQR(flatData),
        };
        setStatistics(stats);

        startAiTasks(async () => {
          try {
            const chartTypePromise = suggestChartType({
              dataDescription: "Serangkaian angka untuk analisis statistik.",
              dataSample: flatData.slice(0, 20).join(", "),
            });

            const insightsPromise = generateDataInsights({
              dataSummary: `Rata-rata: ${stats.mean.toFixed(2)}, Median: ${stats.median}, Modus: ${stats.mode.join(", ")}, Deviasi Standar: ${stats.stdDev.toFixed(2)}, Varians: ${stats.variance.toFixed(2)}, Rentang: ${stats.range.toFixed(2)}, Q1: ${stats.q1.toFixed(2)}, Q3: ${stats.q3.toFixed(2)}, IQR: ${stats.iqr.toFixed(2)}. Total ${stats.count} titik data.`,
              visualizationType: chartType,
            });

            const [chartSuggestion, insightResult] = await Promise.all([
              chartTypePromise,
              insightsPromise,
            ]);
            
            if (chartSuggestion) {
              const suggested = chartSuggestion.chartType.toLowerCase().replace(' chart', '').replace(' scatter plot', 'scatter').replace(' pie chart', 'pie');
              setSuggestedChartType(chartSuggestion.chartType);
              if (suggested === 'histogram' || suggested === 'pie' || suggested === 'scatter') {
                if (suggested === 'scatter' && nonEmptyData.length < 2) {
                   // can't do scatter with one column, so fallback
                  setChartType('histogram');
                } else {
                  setChartType(suggested);
                }
              }
            }

            if (insightResult) {
              setInsights(insightResult.insights);
            }
          } catch (aiError: any) {
            toast({
              variant: "destructive",
              title: "Kesalahan Tugas AI",
              description: aiError.message || "Gagal menghasilkan wawasan AI atau saran bagan."
            });
          }
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Kesalahan Pemrosesan Data",
          description: error.message,
        });
        setData([]);
        setStatistics(null);
      }
    });
  };

  const handleExport = async () => {
    const { default: jspdf } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const content = document.getElementById("pdf-export");
    if (content) {
      try {
        toast({ title: "Membuat PDF...", description: "Mohon tunggu sebentar." });
        const canvas = await html2canvas(content, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#F0F0F0", // Match background
        });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jspdf("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        pdf.save("laporan-statviz.pdf");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Kesalahan Ekspor PDF",
          description: error.message || "Tidak dapat membuat PDF.",
        });
      }
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <StatvizIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight font-headline text-foreground">
              StatViz
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExport}>Ekspor sebagai PDF</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div id="pdf-export" className="container mx-auto px-4 py-8 md:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
                Statistik & Visualisasi Interaktif
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Masukkan data Anda untuk langsung menghitung statistik utama dan memvisualisasikan kumpulan data Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <DataInputCard
                  dataString={dataString}
                  setDataString={setDataString}
                  onFileUpload={handleFileUpload}
                  onProcess={processData}
                  isProcessing={isProcessing}
                />
              </div>

              <div className="lg:col-span-2">
                 {(isProcessing && !statistics) ? (
                   <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : statistics ? (
                    <StatisticsDisplay stats={statistics} />
                  ) : (
                    <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed bg-card/50">
                      <div className="text-center text-muted-foreground">
                        <p className="font-semibold">Statistik Anda akan muncul di sini.</p>
                        <p className="text-sm">Masukkan data dan klik "Proses Data" untuk memulai.</p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VisualizationCard
                  data={data}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                  suggestedChartType={suggestedChartType}
                  isProcessing={isProcessing || isAiRunning}
                />
              </div>
              <div className="lg:col-span-1">
                 <InsightsCard insights={insights} isLoading={isAiRunning} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t bg-background/50">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            Dibuat dengan Next.js dan Genkit.
          </p>
        </div>
      </footer>
    </div>
  );
}
