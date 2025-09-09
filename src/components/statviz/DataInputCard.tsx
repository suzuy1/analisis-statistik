import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface DataInputCardProps {
  dataString: string;
  setDataString: Dispatch<SetStateAction<string>>;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function DataInputCard({ dataString, setDataString, onFileUpload, onProcess, isProcessing }: DataInputCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Input Data</CardTitle>
        <CardDescription>Masukkan data secara manual atau unggah file CSV.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="csv">Unggah CSV</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="mt-4">
            <Label htmlFor="manual-data">Masukkan data</Label>
            <Textarea
              id="manual-data"
              placeholder="Masukkan angka yang dipisahkan koma. Gunakan baris baru untuk beberapa set data (misalnya, untuk scatter plot)."
              value={dataString}
              onChange={(e) => setDataString(e.target.value)}
              className="mt-2 min-h-[200px] font-code"
            />
          </TabsContent>
          <TabsContent value="csv" className="mt-4">
            <Label htmlFor="csv-file">Unggah file .csv</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={onFileUpload}
              className="mt-2"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              File harus berisi kolom data numerik.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={onProcess} disabled={isProcessing} className="w-full">
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? "Memproses..." : "Proses Data"}
        </Button>
      </CardFooter>
    </Card>
  );
}
