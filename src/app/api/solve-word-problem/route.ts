
import {NextRequest, NextResponse} from 'next/server';
import {solveWordProblem} from '@/ai/flows/solve-word-problem';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const {problem} = await req.json();
    if (!problem) {
      return NextResponse.json(
        {error: 'Problem statement is required.'},
        {status: 400}
      );
    }
    const result = await solveWordProblem({problem});
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({error: e.message}, {status: 500});
  }
}
