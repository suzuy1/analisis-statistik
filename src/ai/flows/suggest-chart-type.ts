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
  prompt: `You are an expert data visualization consultant. Given a description and sample of data, you will suggest the most appropriate chart type (histogram, pie chart, scatter plot) and explain your reasoning.

Data Description: {{{dataDescription}}}
Data Sample: {{{dataSample}}}

Consider the following:
- Histograms are best for showing the distribution of a single variable.
- Pie charts are best for showing the proportion of different categories.
- Scatter plots are best for showing the relationship between two variables.

Based on the data description and sample, what chart type is most appropriate? Explain your reasoning.
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
