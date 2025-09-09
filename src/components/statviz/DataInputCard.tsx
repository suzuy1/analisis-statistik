import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon, FileText } from "lucide-react";
import type { InputMode, ProblemInputMode } from "@/app/page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DataInputCardProps {
  dataString: string;
  setDataString: Dispatch<SetStateAction<string>>;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  isProcessing: boolean;
  inputMode: InputMode;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
  problemInputMode: ProblemInputMode;
  setProblemInputMode: Dispatch<SetStateAction<ProblemInputMode>>;
  imageFile: File | null;
}

export function DataInputCard({ 
  dataString, 
  setDataString, 
  onFileUpload, 
  onImageUpload,
  onProcess, 
  isProcessing, 
  inputMode, 
  setInputMode,
  problemInputMode,
  setProblemInputMode,
  imageFile
}: DataInputCardProps) {
  
  const handleModeChange = (value: string) => {
    if (value === 'data' || value === 'problem') {
      setInputMode(value as InputMode);
    }
  }

  const handleProblemModeChange = (value: string) => {
     if (value === 'text' || value === 'image') {
      setProblemInputMode(value as ProblemInputMode);
    }
  }

  const manualInputPlaceholder = "Ketik atau tempel soal cerita statistik di sini. Contoh: 'Nilai rata-rata 40 siswa adalah 62. Jika nilai seorang siswa, yaitu 23, tidak dihitung, berapa rata-rata barunya?'";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Input Data</CardTitle>
        <CardDescription>Pilih mode input: data mentah atau soal cerita.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <RadioGroup defaultValue="data" value={inputMode} onValueChange={handleModeChange} className="mb-4 flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="data" id="data" />
            <Label htmlFor="data">Data Mentah</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="problem" id="problem" />
            <Label htmlFor="problem">Soal Cerita</Label>
          </div>
        </RadioGroup>

        {inputMode === 'data' ? (
          <Tabs defaultValue="manual" className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="csv">Unggah CSV</TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="mt-4 flex-grow">
              <Label htmlFor="manual-data">Masukkan Data</Label>
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
        ) : (
          <Tabs value={problemInputMode} onValueChange={handleProblemModeChange} className="flex-grow flex flex-col">
             <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Teks</TabsTrigger>
              <TabsTrigger value="image">Gambar</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4 flex-grow">
              <Label htmlFor="problem-data">Masukkan Soal Cerita</Label>
              <Textarea
                id="problem-data"
                placeholder={manualInputPlaceholder}
                value={dataString}
                onChange={(e) => setDataString(e.target.value)}
                className="mt-2 min-h-[200px]"
              />
            </TabsContent>
            <TabsContent value="image" className="mt-4 flex-grow flex flex-col items-center justify-center">
              <Label htmlFor="image-file" className="cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center w-full hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <span>{imageFile ? imageFile.name : 'Klik untuk mengunggah gambar'}</span>
                </div>
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="mt-2 sr-only"
              />
               {imageFile && <p className="mt-2 text-sm text-muted-foreground">File dipilih: {imageFile.name}</p>}
               <p className="mt-4 text-xs text-muted-foreground text-center">
                Pastikan gambar soal terlihat jelas untuk hasil terbaik.
              </p>
            </TabsContent>
          </Tabs>
        )}
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
