'use server';
/**
 * @fileOverview Solves a statistical word problem.
 *
 * - solveWordProblem - A function that solves the input word problem.
 * - SolveWordProblemInput - The input type for the solveWordProblem function.
 * - SolveWordProblemOutput - The return type for the solveWordProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveWordProblemInputSchema = z.object({
  problem: z.string().describe('The statistical word problem to be solved.'),
});
export type SolveWordProblemInput = z.infer<typeof SolveWordProblemInputSchema>;

const SolveWordProblemOutputSchema = z.object({
  solution: z.string().describe('A step-by-step explanation of how the problem was solved.'),
  answer: z.number().describe('The final numerical answer to the problem.'),
});
export type SolveWordProblemOutput = z.infer<typeof SolveWordProblemOutputSchema>;

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

    