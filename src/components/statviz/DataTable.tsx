import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DataTableProps {
  data: number[][];
}

export function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Determine the maximum number of columns needed
  const maxCols = Math.max(...data.map(row => row.length));

  // Create headers
  const headers = Array.from({ length: maxCols }, (_, i) => `Kolom ${i + 1}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabel Data</CardTitle>
        <CardDescription>Tampilan data mentah yang Anda masukkan.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead className="w-[100px]">Baris</TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">Baris {rowIndex + 1}</TableCell>
                  {Array.from({ length: maxCols }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {row[colIndex] !== undefined ? row[colIndex] : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
