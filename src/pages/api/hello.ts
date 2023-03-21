// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export const GRID_SIZE = 7;

type Data = {
  name: string
}

export interface CrosswordQuestion {
  answer: string;
  answerLength: number;
  question: string;
  direction: 'across' | 'down';
  questionNumber: number;
  startX: number;
  startY: number;
}

export interface Position {
  x: number;
  y: number;
}
export interface CrosswordCell {
  letter?: string;
  questionNumber: number[];
  rootCell: boolean;
  rootCellQuestionNumber: number;
  position: Position;
  isFocused?: boolean;
  isFocusedDirection?: 'across' | 'down';
  isFocusedLetter?: boolean;
  isHovering?: boolean;
  letterPositionAcross?: number;
  letterPositionDown?: number;
  wordLengthAcross?: number;
  wordLengthDown?: number;
}
export interface CrosswordWord {
  questionNumber: number;
  clueText: string;
  letterPositions: Position[];
  direction: 'across' | 'down';
  isFocused?: boolean;
  isHovering?: boolean;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}


export const crosswordTestData: CrosswordQuestion[] = [
  {
    answer: 'RAINBOW',
    answerLength: 7,
    question: 'Sky Illusion',
    direction: 'across',
    questionNumber: 1,
    startX: 0,
    startY: 0,
  },
  {
    answer: 'BET',
    answerLength: 3,
    question: 'Wager',
    direction: 'down',
    questionNumber: 2,
    startX: 4,
    startY: 0,
  },
  {
    answer: 'RED',
    answerLength: 3,
    question: 'Color of Blood',
    direction: 'down',
    questionNumber: 1,
    startX: 0,
    startY: 0,
  }
];