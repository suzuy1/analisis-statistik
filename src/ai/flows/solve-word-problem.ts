'use server';
/**
 * @fileOverview Solves a statistical word problem.
 *
 * - solveWordProblem - A function that solves the input word problem.
 */

import {ai} from '@/ai/genkit';
import {
  SolveWordProblemInputSchema,
  SolveWordProblemOutputSchema,
  type SolveWordProblemInput,
  type SolveWordProblemOutput,
} from '@/ai/schemas/statviz-schemas';

export async function solveWordProblem(
  input: SolveWordProblemInput
): Promise<SolveWordProblemOutput> {
  return solveWordProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveWordProblemPrompt',
  input: {schema: SolveWordProblemInputSchema},
  output: {schema: SolveWordProblemOutputSchema},
  prompt: `You are an expert math tutor specializing in statistics. Your task is to solve the following word problem. Provide a clear, step-by-step solution and the final numerical answer.

The user is from Indonesia, so please provide the solution in Bahasa Indonesia.

Word Problem:
"{{{problem}}}"

Analyze the problem, identify the given values, determine the steps needed, perform the calculations, and state the final answer.
`,
});

const solveWordProblemFlow = ai.defineFlow(
  {
    name: 'solveWordProblemFlow',
    inputSchema: SolveWordProblemInputSchema,
    outputSchema: SolveWordProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
