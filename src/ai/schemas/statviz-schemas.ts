import {z} from 'genkit';

export const SolveWordProblemInputSchema = z.object({
  problem: z.string().describe('The statistical word problem to be solved.'),
});
export type SolveWordProblemInput = z.infer<typeof SolveWordProblemInputSchema>;

export const SolveWordProblemOutputSchema = z.object({
  solution: z
    .string()
    .describe('A step-by-step explanation of how the problem was solved.'),
  answer: z.number().describe('The final numerical answer to the problem.'),
});
export type SolveWordProblemOutput = z.infer<
  typeof SolveWordProblemOutputSchema
>;

export const SolveWordProblemFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a word problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('An optional description or context for the word problem in the image.'),
});
export type SolveWordProblemFromImageInput = z.infer<
  typeof SolveWordProblemFromImageInputSchema
>;

export type SolveWordProblemFromImageOutput = SolveWordProblemOutput;

export const SuggestChartTypeInputSchema = z.object({
  dataDescription: z
    .string()
    .describe(
      'A detailed description of the dataset including the type of data, purpose of collection, and expected relationships.'
    ),
  dataSample: z
    .string()
    .describe(
      'A representative sample of the data, formatted as a comma-separated string.'
    ),
});
export type SuggestChartTypeInput = z.infer<
  typeof SuggestChartTypeInputSchema
>;

export const SuggestChartTypeOutputSchema = z.object({
  chartType: z
    .enum(['histogram', 'pie chart', 'scatter plot', 'boxplot'])
    .describe('The suggested chart type for visualizing the data.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested chart type, explaining why it is appropriate for the given data.'
    ),
});
export type SuggestChartTypeOutput = z.infer<
  typeof SuggestChartTypeOutputSchema
>;

export const GenerateDataInsightsInputSchema = z.object({
  dataSummary: z
    .string()
    .describe(
      'A summary of the statistical data including mean, median, mode, standard deviation, and variance.'
    ),
  visualizationType: z
    .string()
    .describe('Type of visualization used e.g. histogram, pie chart'),
});
export type GenerateDataInsightsInput = z.infer<
  typeof GenerateDataInsightsInputSchema
>;

export const GenerateDataInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe('Generated insights from the statistical data.'),
});
export type GenerateDataInsightsOutput = z.infer<
  typeof GenerateDataInsightsOutputSchema
>;
