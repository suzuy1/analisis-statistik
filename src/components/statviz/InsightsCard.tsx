import { Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsCardProps {
  insights: string | null;
  isLoading: boolean;
}

export function InsightsCard({ insights, isLoading }: InsightsCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <div>
          <CardTitle>Wawasan Data AI</CardTitle>
          <CardDescription>Dihasilkan oleh Genkit AI</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : insights ? (
          <p className="text-sm text-muted-foreground leading-relaxed">{insights}</p>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
            <p>Proses data untuk menghasilkan wawasan bertenaga AI di sini.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
