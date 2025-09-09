import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { InputMode } from "@/app/page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DataInputCardProps {
  dataString: string;
  setDataString: Dispatch<SetStateAction<string>>;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  isProcessing: boolean;
  inputMode: InputMode;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
}

export function DataInputCard({ dataString, setDataString, onFileUpload, onProcess, isProcessing, inputMode, setInputMode }: DataInputCardProps) {
  
  const handleModeChange = (value: string) => {
    if (value === 'data' || value === 'problem') {
      setInputMode(value as InputMode);
    }
  }

  const manualInputPlaceholder = inputMode === 'data'
    ? "Masukkan angka yang dipisahkan koma. Gunakan baris baru untuk beberapa set data (misalnya, untuk scatter plot)."
    : "Ketik atau tempel soal cerita statistik di sini. Contoh: 'Nilai rata-rata 40 siswa adalah 62. Jika nilai seorang siswa, yaitu 23, tidak dihitung, berapa rata-rata barunya?'";


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Input Data</CardTitle>
        <CardDescription>Pilih mode input: data mentah atau soal cerita.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <RadioGroup defaultValue="data" onValueChange={handleModeChange} className="mb-4 flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="data" id="data" />
            <Label htmlFor="data">Data Mentah</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="problem" id="problem" />
            <Label htmlFor="problem">Soal Cerita</Label>
          </div>
        </RadioGroup>

        <Tabs value={inputMode === 'data' ? 'manual' : 'problem'} className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" disabled={inputMode !== 'data'}>Manual</TabsTrigger>
            <TabsTrigger value="csv" disabled={inputMode !== 'data'}>Unggah CSV</TabsTrigger>
          </TabsList>
           <TabsContent value="manual" className="mt-4 flex-grow">
             <Label htmlFor="manual-data">{inputMode === 'data' ? 'Masukkan Data' : 'Masukkan Soal Cerita'}</Label>
            <Textarea
              id="manual-data"
              placeholder={manualInputPlaceholder}
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
              disabled={inputMode !== 'data'}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              File harus berisi kolom data numerik.
            </p>
          </TabsContent>
           <TabsContent value="problem" className="mt-4 flex-grow">
             <Label htmlFor="problem-data">Masukkan Soal Cerita</Label>
            <Textarea
              id="problem-data"
              placeholder={manualInputPlaceholder}
              value={dataString}
              onChange={(e) => setDataString(e.target.value)}
              className="mt-2 min-h-[200px]"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={onProcess} disabled={isProcessing} className="w-full">
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? "Memproses..." : "Proses"}
        </Button>
      </CardFooter>
    </Card>
  );
}

    