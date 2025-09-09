'use server';
/**
 * @fileOverview Generates insights from statistical data.
 *
 * - generateDataInsights - A function that generates insights from the input data.
 * - GenerateDataInsightsInput - The input type for the generateDataInsights function.
 * - GenerateDataInsightsOutput - The return type for the generateDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataInsightsInputSchema = z.object({
  dataSummary: z
    .string()
    .describe(
      'A summary of the statistical data including mean, median, mode, standard deviation, and variance.'
    ),
  visualizationType: z
    .string()
    .describe('Type of visualization used e.g. histogram, pie chart'),
});
export type GenerateDataInsightsInput = z.infer<typeof GenerateDataInsightsInputSchema>;

const GenerateDataInsightsOutputSchema = z.object({
  insights: z.string().describe('Generated insights from the statistical data.'),
});
export type GenerateDataInsightsOutput = z.infer<typeof GenerateDataInsightsOutputSchema>;

export async function generateDataInsights(
  input: GenerateDataInsightsInput
): Promise<GenerateDataInsightsOutput> {
  return generateDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataInsightsPrompt',
  input: {schema: GenerateDataInsightsInputSchema},
  output: {schema: GenerateDataInsightsOutputSchema},
  prompt: `Anda adalah seorang ahli statistik. Harap analisis ringkasan data dan jenis visualisasi yang diberikan untuk menghasilkan wawasan utama.

Ringkasan Data: {{{dataSummary}}}
Jenis Visualisasi: {{{visualizationType}}}

Wawasan:`,
});

const generateDataInsightsFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsFlow',
    inputSchema: GenerateDataInsightsInputSchema,
    outputSchema: GenerateDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
