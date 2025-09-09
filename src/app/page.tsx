
"use client";

import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import Papa from "papaparse";
import { Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
import { WordProblemCard } from "@/components/statviz/WordProblemCard";
import { suggestChartType } from "@/ai/flows/suggest-chart-type";
import { generateDataInsights } from "@/ai/flows/auto-generate-data-insights";
import { solveWordProblem } from "@/ai/flows/solve-word-problem";
import { solveWordProblemFromImage } from "@/ai/flows/solve-word-problem-from-image";
import type { SolveWordProblemOutput } from "@/ai/schemas/statviz-schemas";
import { DataTable } from "@/components/statviz/DataTable";

export type ChartType = "histogram" | "pie" | "scatter" | "boxplot";
export type InputMode = "data" | "problem";
export type ProblemInputMode = "text" | "image";

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
  const [inputMode, setInputMode] = useState<InputMode>("data");
  const [problemInputMode, setProblemInputMode] = useState<ProblemInputMode>("text");
  const [wordProblemSolution, setWordProblemSolution] = useState<SolveWordProblemOutput | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState<string>("");


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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  }

  const processData = () => {
    startProcessing(() => {
      setStatistics(null);
      setInsights(null);
      setSuggestedChartType(null);
      setWordProblemSolution(null);
      setData([]);

      if (inputMode === 'problem') {
        startAiTasks(async () => {
          try {
             if (problemInputMode === 'text') {
              if (!dataString.trim()) {
                toast({ variant: "destructive", title: "Input Kosong", description: "Silakan masukkan soal cerita." });
                return;
              }
              const result = await solveWordProblem({ problem: dataString });
              setWordProblemSolution(result);
            } else if (problemInputMode === 'image') {
              if (!imageFile) {
                toast({ variant: "destructive", title: "Input Kosong", description: "Silakan unggah gambar soal cerita." });
                return;
              }
              const reader = new FileReader();
              reader.readAsDataURL(imageFile);
              reader.onload = async () => {
                const photoDataUri = reader.result as string;
                try {
                  const result = await solveWordProblemFromImage({ photoDataUri, description: imageDescription });
                  setWordProblemSolution(result);
                } catch (aiError: any) {
                  toast({
                    variant: "destructive",
                    title: "Kesalahan Penyelesaian Soal dari Gambar",
                    description: aiError.message || "Gagal memproses gambar."
                  });
                }
              };
              reader.onerror = (error) => {
                toast({
                  variant: "destructive",
                  title: "Kesalahan Membaca File",
                  description: "Tidak dapat membaca file gambar yang dipilih."
                });
              };
            }
          } catch (aiError: any) {
             toast({
              variant: "destructive",
              title: "Kesalahan Penyelesaian Soal",
              description: aiError.message || "Gagal menyelesaikan soal cerita."
            });
          }
        });
        return;
      }
      
      try {
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
              const suggested = chartSuggestion.chartType.toLowerCase().replace(' chart', '').replace(' scatter plot', 'scatter').replace(' pie chart', 'pie').replace('boxplot', 'boxplot');
              setSuggestedChartType(chartSuggestion.chartType);
              if (['histogram', 'pie', 'scatter', 'boxplot'].includes(suggested)) {
                if (suggested === 'scatter' && nonEmptyData.length < 2) {
                   // can't do scatter with one column, so fallback
                  setChartType('histogram');
                } else {
                  setChartType(suggested as ChartType);
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
    if (!statistics && !wordProblemSolution) {
      toast({
        variant: "destructive",
        title: "Tidak Ada Data untuk Diekspor",
        description: "Silakan proses data atau soal cerita terlebih dahulu.",
      });
      return;
    }

    toast({ title: "Membuat PDF...", description: "Mohon tunggu sebentar." });

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 14;
      let yPos = 20;

      const checkPageBreak = (neededHeight: number) => {
        if (yPos + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = 20;
        }
      };

      pdf.setFontSize(22);
      pdf.text("Laporan Analisis StatViz", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      if (wordProblemSolution) {
        pdf.setFontSize(16);
        pdf.text("Solusi Soal Cerita", margin, yPos);
        yPos += 8;

        pdf.setFontSize(11);
        const splitSolution = pdf.splitTextToSize(wordProblemSolution.solution, pageWidth - margin * 2);
        checkPageBreak(splitSolution.length * 5 + 15);
        pdf.text(splitSolution, margin, yPos);
        yPos += splitSolution.length * 5 + 5;

        pdf.setFontSize(14);
        pdf.text(`Jawaban Akhir: ${wordProblemSolution.answer}`, margin, yPos);
        yPos += 15;
      }

      if (statistics) {
        checkPageBreak(80); 
        pdf.setFontSize(16);
        pdf.text("Ringkasan Statistik", margin, yPos);
        yPos += 8;

        pdf.setFontSize(11);
        const statsContent = [
          `Rata-rata: ${statistics.mean.toFixed(2)}`,
          `Median: ${statistics.median.toFixed(2)}`,
          `Modus: ${statistics.mode.length > 0 ? statistics.mode.join(", ") : "N/A"}`,
          `Jumlah Data: ${statistics.count}`,
          `Rentang: ${statistics.range.toFixed(2)}`,
          `Varians: ${statistics.variance.toFixed(2)}`,
          `Deviasi Standar: ${statistics.stdDev.toFixed(2)}`,
          `Kuartil 1 (Q1): ${statistics.q1.toFixed(2)}`,
          `Kuartil 3 (Q3): ${statistics.q3.toFixed(2)}`,
          `Rentang Interkuartil (IQR): ${statistics.iqr.toFixed(2)}`,
        ];
        pdf.text(statsContent, margin, yPos, { lineHeightFactor: 1.5 });
        yPos += statsContent.length * 5 + 10;
      }

      if (insights) {
        checkPageBreak(50);
        pdf.setFontSize(16);
        pdf.text("Wawasan Data (AI)", margin, yPos);
        yPos += 8;

        pdf.setFontSize(11);
        const splitInsights = pdf.splitTextToSize(insights, pageWidth - margin * 2);
        checkPageBreak(splitInsights.length * 4 + 10);
        pdf.text(splitInsights, margin, yPos);
        yPos += splitInsights.length * 4 + 10;
      }

      const chartElement = document.getElementById('visualization-card');
      if (chartElement && statistics) {
        const canvas = await html2canvas(chartElement, { scale: 2, backgroundColor: '#111111' });
        const imgData = canvas.toDataURL('image/png');
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth - margin * 2;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        checkPageBreak(pdfHeight + 20);

        pdf.setFontSize(16);
        pdf.text("Visualisasi Data", margin, yPos);
        yPos += 10;
        
        pdf.addImage(imgData, 'PNG', margin, yPos, pdfWidth, pdfHeight);
        yPos += pdfHeight + 10;
      }

      const tableElement = document.getElementById('data-table-card');
      if (tableElement && statistics) {
        const tableCanvas = await html2canvas(tableElement.querySelector('table')!, { scale: 2.5, backgroundColor: '#111111' });
        const tableImgData = tableCanvas.toDataURL('image/png');
        
        const imgProps = pdf.getImageProperties(tableImgData);
        const pdfWidth = pageWidth - margin * 2;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        checkPageBreak(pdfHeight + 20);

        pdf.setFontSize(16);
        pdf.text("Data Mentah", margin, yPos);
        yPos += 10;
        
        pdf.addImage(tableImgData, 'PNG', margin, yPos, pdfWidth, pdfHeight);
      }

      pdf.save("laporan-statviz.pdf");
      toast({ title: "PDF berhasil dibuat!", description: "Laporan Anda telah diunduh." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Kesalahan Ekspor PDF",
        description: error.message || "Tidak dapat membuat PDF.",
      });
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
                Masukkan data mentah atau soal cerita untuk langsung mendapatkan analisis statistik.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <DataInputCard
                  dataString={dataString}
                  setDataString={setDataString}
                  onFileUpload={handleFileUpload}
                  onImageUpload={handleImageUpload}
                  onProcess={processData}
                  isProcessing={isProcessing}
                  inputMode={inputMode}
                  setInputMode={setInputMode}
                  problemInputMode={problemInputMode}
                  setProblemInputMode={setProblemInputMode}
                  imageFile={imageFile}
                  imageDescription={imageDescription}
                  setImageDescription={setImageDescription}
                />
              </div>

              <div className="lg:col-span-2">
                 {(isProcessing || isAiRunning) && !statistics && !wordProblemSolution ? (
                   <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : statistics ? (
                    <StatisticsDisplay stats={statistics} />
                  ) : wordProblemSolution ? (
                    <WordProblemCard solution={wordProblemSolution.solution} answer={wordProblemSolution.answer} />
                  ) : (
                    <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed bg-card/50">
                      <div className="text-center text-muted-foreground">
                        <p className="font-semibold">Hasil Anda akan muncul di sini.</p>
                        <p className="text-sm">Masukkan data atau soal, lalu klik "Proses" untuk memulai.</p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {inputMode === 'data' && (
              <>
                {data && data.length > 0 && data[0].length > 0 && <DataTable data={data} />}
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
              </>
            )}
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

    