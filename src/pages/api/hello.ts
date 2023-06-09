// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export const GRID_SIZE = 7;

type Data = {
  name: string;
};

export interface CrosswordQuestion {
  answer: string;
  answerLength: number;
  question: string;
  direction: "across" | "down";
  questionNumber: number;
  startX: number;
  startY: number;
}

export interface Position {
  x: number;
  y: number;
}
export interface CrosswordCell {
  id: string;
  letter?: string;
  questionNumber: number[];
  rootCell: boolean;
  rootCellQuestionNumber: number;
  position: Position;
  isFocused?: boolean;
  isFocusedDirection?: "across" | "down";
  isFocusedLetter?: boolean;
  isHovering?: boolean;
  letterPositionAcross?: number;
  letterPositionDown?: number;
  wordLengthAcross?: number;
  wordLengthDown?: number;
}
export interface CrosswordWord {
  id: number;
  questionNumber: number;
  clueText: string;
  letterPositions: Position[];
  direction: "across" | "down";
  isFocused?: boolean;
  isHovering?: boolean;
}

export type WordDirection = "next" | "previous";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}

export const crosswordTestData: CrosswordQuestion[] = [
  {
    answer: "RAINBOW",
    answerLength: 7,
    question: "Sky Illusion",
    direction: "across",
    questionNumber: 1,
    startX: 0,
    startY: 0,
  },
  {
    answer: "BET",
    answerLength: 3,
    question: "Wager",
    direction: "down",
    questionNumber: 2,
    startX: 4,
    startY: 0,
  },
  {
    answer: "WATCH",
    answerLength: 5,
    question: "Timepiece",
    direction: "down",
    questionNumber: 3,
    startX: 6,
    startY: 0,
  },
  {
    answer: "RED",
    answerLength: 3,
    question: "Color of Blood",
    direction: "down",
    questionNumber: 1,
    startX: 0,
    startY: 0,
  },
  {
    answer: "DOUBT",
    answerLength: 5,
    question: "Lack of Confidence",
    direction: "across",
    questionNumber: 4,
    startX: 0,
    startY: 2,
  },
  {
    answer: "BIN",
    answerLength: 3,
    question: "Trash Can",
    direction: "down",
    questionNumber: 5,
    startX: 3,
    startY: 2,
  },
  {
    answer: "FINISH",
    answerLength: 6,
    question: "End",
    direction: "across",
    questionNumber: 6,
    startX: 1,
    startY: 4,
  },
  {
    answer: "FAN",
    answerLength: 3,
    question: "Device for Cooling",
    direction: "down",
    questionNumber: 6,
    startX: 1,
    startY: 4,
  },
  {
    answer: "ENGLAND",
    answerLength: 7,
    question: "Country in Europe",
    direction: "across",
    questionNumber: 7,
    startX: 0,
    startY: 6,
  },
];

export const generateMessage = async (
  clue: string,
  letterCount: number
): Promise<string> => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  // Initialize GPT-3.5 API
  const prompt = `Provide another clue that helps the solver figure out the answer to the clue: "${clue}".  The answer to the clue is a ${letterCount} letter word. Do not give out the answer.`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${gptApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  const message = data.choices[0].message.content.trim();

  return message;
};

export const PAY_ADDRESS = "0x48eaf9742ed24718E9dF09Ab91E1a8e91067D1eA";
