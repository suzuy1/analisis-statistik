'use server';
/**
 * @fileOverview Solves a statistical word problem from an image.
 *
 * - solveWordProblemFromImage - A function that solves the input word problem from an image.
 */

import {ai} from '@/ai/genkit';
import {
  SolveWordProblemFromImageInputSchema,
  SolveWordProblemOutputSchema,
  type SolveWordProblemFromImageInput,
  type SolveWordProblemFromImageOutput,
} from '@/ai/schemas/statviz-schemas';

export async function solveWordProblemFromImage(
  input: SolveWordProblemFromImageInput
): Promise<SolveWordProblemFromImageOutput> {
  return solveWordProblemFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveWordProblemFromImagePrompt',
  input: {schema: SolveWordProblemFromImageInputSchema},
  output: {schema: SolveWordProblemOutputSchema},
  prompt: `You are an expert math tutor specializing in statistics. Your task is to solve the word problem contained in the following image. Provide a clear, step-by-step solution and the final numerical answer.

The user is from Indonesia, so please provide the solution in Bahasa Indonesia.

Word Problem Image:
{{media url=photoDataUri}}

{{#if description}}
User-provided description:
"{{{description}}}"
Use this description as additional context to understand the problem in the image.
{{/if}}

Analyze the problem in the image, identify the given values, determine the steps needed, perform the calculations, and state the final answer.
`,
});

const solveWordProblemFromImageFlow = ai.defineFlow(
  {
    name: 'solveWordProblemFromImageFlow',
    inputSchema: SolveWordProblemFromImageInputSchema,
    outputSchema: SolveWordProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
