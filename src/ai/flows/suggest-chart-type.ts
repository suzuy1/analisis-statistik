'use server';

/**
 * @fileOverview A flow to suggest the most appropriate chart type based on the input data.
 *
 * - suggestChartType - A function that suggests a chart type based on data.
 * - SuggestChartTypeInput - The input type for the suggestChartType function.
 * - SuggestChartTypeOutput - The return type for the suggestChartType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChartTypeInputSchema = z.object({
  dataDescription: z
    .string()
    .describe('A detailed description of the dataset including the type of data, purpose of collection, and expected relationships.'),
  dataSample: z
    .string()
    .describe('A representative sample of the data, formatted as a comma-separated string.'),
});
export type SuggestChartTypeInput = z.infer<typeof SuggestChartTypeInputSchema>;

const SuggestChartTypeOutputSchema = z.object({
  chartType: z
    .enum(['histogram', 'pie chart', 'scatter plot'])
    .describe('The suggested chart type for visualizing the data.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested chart type, explaining why it is appropriate for the given data.'),
});
export type SuggestChartTypeOutput = z.infer<typeof SuggestChartTypeOutputSchema>;

export async function suggestChartType(
  input: SuggestChartTypeInput
): Promise<SuggestChartTypeOutput> {
  return suggestChartTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartTypePrompt',
  input: {schema: SuggestChartTypeInputSchema},
  output: {schema: SuggestChartTypeOutputSchema},
  prompt: `Anda adalah konsultan visualisasi data ahli. Diberikan deskripsi dan sampel data, Anda akan menyarankan jenis bagan yang paling sesuai (histogram, diagram lingkaran, plot sebar) dan menjelaskan alasan Anda.

Deskripsi Data: {{{dataDescription}}}
Sampel Data: {{{dataSample}}}

Pertimbangkan hal berikut:
- Histogram paling baik untuk menunjukkan distribusi variabel tunggal.
- Diagram lingkaran paling baik untuk menunjukkan proporsi berbagai kategori.
- Plot sebar paling baik untuk menunjukkan hubungan antara dua variabel.

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
