import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface WordProblemCardProps {
  solution: string;
  answer: number;
}

export function WordProblemCard({ solution, answer }: WordProblemCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-3">
        <Lightbulb className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
        <div>
          <CardTitle>Solusi Soal Cerita</CardTitle>
          <CardDescription>Berikut adalah langkah-langkah penyelesaian dan jawabannya.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
            <h3 className="font-semibold mb-2 text-foreground">Langkah-langkah Penyelesaian:</h3>
            <div className="text-sm text-muted-foreground space-y-2 leading-relaxed whitespace-pre-wrap">{solution}</div>
        </div>
      </CardContent>
       <CardFooter className="bg-muted/50 p-4 rounded-b-lg mt-4">
          <div className="flex items-center gap-4">
             <h3 className="font-semibold text-foreground text-lg">Jawaban Akhir:</h3>
             <p className="text-2xl font-bold text-primary">{answer.toLocaleString()}</p>
          </div>
      </CardFooter>
    </Card>
  );
}

    