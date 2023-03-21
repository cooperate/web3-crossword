import { createContext, useReducer } from "react";
import {
    CrosswordCell,
    CrosswordQuestion,
    crosswordTestData,
    CrosswordWord,
} from "./hello";

export function generateGrid(questions: CrosswordQuestion[], size: number) {
    const grid: (CrosswordCell | null)[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
    );

    let crosswordWords: CrosswordWord[] = [];

    questions.forEach((question, questionIndex) => {
        const { startX, startY } = question;
        crosswordWords[questionIndex] = {
            questionNumber: question.questionNumber,
            clueText: question.question,
            direction: question.direction,
            letterPositions: [],
        };
        for (let i = 0; i < question.answerLength; i++) {
            const xIndex = question.direction === "across" ? startX + i : startX;
            const yIndex = question.direction === "down" ? startY + i : startY;

            //check if cell is already occupied
            if (grid[yIndex][xIndex] != null && i === 0) {
                //previous question number
                const prevQuestionNumber = grid?.[yIndex]?.[xIndex]?.questionNumber;
                if (prevQuestionNumber) {
                    grid[yIndex][xIndex] = {
                        //letter: question.answer[i],
                        questionNumber: [...prevQuestionNumber, question.questionNumber],
                        rootCell: i === 0,
                        rootCellQuestionNumber: question.questionNumber,
                        position: { x: xIndex, y: yIndex },
                        letterPositionAcross: question.direction === "across" ? i : grid[yIndex][xIndex]?.letterPositionAcross,
                        letterPositionDown: question.direction === "down" ? i : grid[yIndex][xIndex]?.letterPositionDown,
                        wordLengthAcross: question.direction === "across" ? question.answerLength : grid[yIndex][xIndex]?.wordLengthAcross,
                        wordLengthDown: question.direction === "down" ? question.answerLength : grid[yIndex][xIndex]?.wordLengthDown,
                    };
                }
            } else {
                grid[yIndex][xIndex] = {
                    //letter: question.answer[i],
                    questionNumber: [question.questionNumber],
                    rootCell: i === 0,
                    rootCellQuestionNumber: question.questionNumber,
                    position: { x: xIndex, y: yIndex },
                    letterPositionAcross: question.direction === "across" ? i : grid[yIndex][xIndex]?.letterPositionAcross,
                    letterPositionDown: question.direction === "down" ? i : grid[yIndex][xIndex]?.letterPositionDown,
                    wordLengthAcross: question.direction === "across" ? question.answerLength : grid[yIndex][xIndex]?.wordLengthAcross,
                    wordLengthDown: question.direction === "down" ? question.answerLength : grid[yIndex][xIndex]?.wordLengthDown,
                };
            }
            if (crosswordWords[questionIndex]?.letterPositions.length > 0) {
                crosswordWords[questionIndex] = {
                    ...crosswordWords[questionIndex],
                    letterPositions: [
                        ...crosswordWords[questionIndex].letterPositions,
                        { x: xIndex, y: yIndex },
                    ],
                };
            } else {
                crosswordWords[questionIndex] = {
                    ...crosswordWords[questionIndex],
                    letterPositions: [{ x: xIndex, y: yIndex }],
                };
            }
        }
    });

    return { grid, crosswordWords };
}

const {
    grid,
    crosswordWords,
}: { grid: (CrosswordCell | null)[][]; crosswordWords: CrosswordWord[] } =
    generateGrid(crosswordTestData, 7);

type CrosswordContext = {
    grid: (CrosswordCell | null)[][];
    crosswordWords: CrosswordWord[];
};

export const CrosswordContext = createContext<CrosswordContext>({
    grid,
    crosswordWords,
});
export const CrosswordDispatchContext = createContext<React.Dispatch<any>>(
    () => { }
);

export type CrosswordAction = {
    type: CrosswordActionType;
    payload: any;
};
export type CrosswordActionType = "SET_LETTER" | "SET_LETTER_FOCUS" | "SET_WORD" | "SET_FOCUS_WORD";

export function crosswordReducer(
    crossword: CrosswordContext,
    action: CrosswordAction
) {
    switch (action.type) {
        case "SET_LETTER": {
            const { x, y, letter } = action.payload;
            const cell = crossword.grid[y][x];
            if (cell) {
                cell.letter = letter;
            }
            //replace cell in grid
            const newGrid = crossword.grid.map((row, rowIndex) => {
                if (rowIndex === y) {
                    return row.map((cell, cellIndex) => {
                        if (cellIndex === x) {
                            return cell;
                        }
                        return cell;
                    });
                }
                return row;
            });
            return {
                ...crossword,
                grid: newGrid,
            };
        }
        case "SET_LETTER_FOCUS": {
            const { x, y } = action.payload;
            console.log("set letter focus", x, y);
            //reset all other cells focus
            const newGrid = crossword.grid.map((row, rowIndex) => {
                return row.map((cell, cellIndex) => {
                    if (cell) {
                        if (cellIndex === x && rowIndex === y) {
                            return {
                                ...cell,
                                isFocusedLetter: true
                            }
                        } else {
                            return {
                                ...cell,
                                isFocusedLetter: false
                            }
                        }
                    }
                    return cell;
                });
            });
            return {
                ...crossword,
                grid: newGrid,
            };
        }
        case "SET_FOCUS_WORD": {
            const { x, y, direction } = action.payload;
            //find word based on direction and position
            const newWords = crossword.crosswordWords.map((word) => {
                if (word.direction === direction) {
                    if (word.letterPositions.some((position) => position.x === x && position.y === y)) {
                        return {
                            ...word,
                            isFocused: true,
                        };
                    }
                }
                return {
                    ...word,
                    isFocused: false,
                };
            });
            //find focused word
            const focusedWord = newWords.find((word) => word.isFocused);
            //if focused word, iterate over position for cells
            let newGrid;
            if (focusedWord) {
                newGrid = crossword.grid.map((row, rowIndex) => {
                    return row.map((cell, cellIndex) => {
                        if (cell) {
                            if (
                                focusedWord.letterPositions.some(
                                    (position) =>
                                        position.x === cellIndex && position.y === rowIndex
                                )
                            ) {
                                return {
                                    ...cell,
                                    isFocused: true,
                                    isFocusedDirection: focusedWord.direction,
                                };
                            } else {
                                return {
                                    ...cell,
                                    isFocused: false,
                                };
                            }
                        }
                    });
                });
            }
            return {
                grid: newGrid ? newGrid : crossword.grid,
                crosswordWords: newWords,
            };
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}
