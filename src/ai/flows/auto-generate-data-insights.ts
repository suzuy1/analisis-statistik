'use server';
/**
 * @fileOverview Generates insights from statistical data.
 *
 * - generateDataInsights - A function that generates insights from the input data.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateDataInsightsInputSchema,
  GenerateDataInsightsOutputSchema,
  type GenerateDataInsightsInput,
  type GenerateDataInsightsOutput,
} from '@/ai/schemas/statviz-schemas';


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
