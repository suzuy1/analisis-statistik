'use server';

/**
 * @fileOverview A flow to suggest the most appropriate chart type based on the input data.
 *
 * - suggestChartType - A function that suggests a chart type based on data.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestChartTypeInputSchema,
  SuggestChartTypeOutputSchema,
  type SuggestChartTypeInput,
  type SuggestChartTypeOutput,
} from '@/ai/schemas/statviz-schemas';


export async function suggestChartType(
  input: SuggestChartTypeInput
): Promise<SuggestChartTypeOutput> {
  return suggestChartTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartTypePrompt',
  input: {schema: SuggestChartTypeInputSchema},
  output: {schema: SuggestChartTypeOutputSchema},
  prompt: `Anda adalah konsultan visualisasi data ahli. Diberikan deskripsi dan sampel data, Anda akan menyarankan jenis bagan yang paling sesuai (histogram, diagram lingkaran, plot sebar, boxplot) dan menjelaskan alasan Anda.

Deskripsi Data: {{{dataDescription}}}
Sampel Data: {{{dataSample}}}

Pertimbangkan hal berikut:
- Histogram paling baik untuk menunjukkan distribusi variabel tunggal.
- Diagram lingkaran paling baik untuk menunjukkan proporsi berbagai kategori.
- Plot sebar paling baik untuk menunjukkan hubungan antara dua variabel.
- Boxplot sangat baik untuk menunjukkan sebaran data berdasarkan kuartil, termasuk median, outlier, dan rentang.

Berdasarkan deskripsi dan sampel data, jenis bagan apa yang paling sesuai? Jelaskan alasan Anda.
`,}
);

const suggestChartTypeFlow = ai.defineFlow(
  {
    name: 'suggestChartTypeFlow',
    inputSchema: SuggestChartTypeInputSchema,
    outputSchema: SuggestChartTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
