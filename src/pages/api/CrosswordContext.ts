import { createContext, useReducer } from "react";
import {
  CrosswordCell,
  CrosswordQuestion,
  crosswordTestData,
  CrosswordWord,
  Position,
} from "./hello";

export function generateGrid(questions: CrosswordQuestion[], size: number) {
  const grid: (CrosswordCell | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

  let crosswordWords: CrosswordWord[] = [];

  questions.forEach((question, questionIndex) => {
    const { startX, startY } = question;
    crosswordWords[questionIndex] = {
      id: questionIndex,
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
            id: yIndex + xIndex,
            //letter: question.answer[i],
            questionNumber: [...prevQuestionNumber, question.questionNumber],
            rootCell: i === 0,
            rootCellQuestionNumber: question.questionNumber,
            position: { x: xIndex, y: yIndex },
            letterPositionAcross:
              question.direction === "across"
                ? i
                : grid[yIndex][xIndex]?.letterPositionAcross,
            letterPositionDown:
              question.direction === "down"
                ? i
                : grid[yIndex][xIndex]?.letterPositionDown,
            wordLengthAcross:
              question.direction === "across"
                ? question.answerLength
                : grid[yIndex][xIndex]?.wordLengthAcross,
            wordLengthDown:
              question.direction === "down"
                ? question.answerLength
                : grid[yIndex][xIndex]?.wordLengthDown,
          };
        }
      } else {
        grid[yIndex][xIndex] = {
          id: questionIndex,
          //letter: question.answer[i],
          questionNumber: [question.questionNumber],
          rootCell: i === 0,
          rootCellQuestionNumber: question.questionNumber,
          position: { x: xIndex, y: yIndex },
          letterPositionAcross:
            question.direction === "across"
              ? i
              : grid[yIndex][xIndex]?.letterPositionAcross,
          letterPositionDown:
            question.direction === "down"
              ? i
              : grid[yIndex][xIndex]?.letterPositionDown,
          wordLengthAcross:
            question.direction === "across"
              ? question.answerLength
              : grid[yIndex][xIndex]?.wordLengthAcross,
          wordLengthDown:
            question.direction === "down"
              ? question.answerLength
              : grid[yIndex][xIndex]?.wordLengthDown,
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

type AppState = {
  showClueList: boolean;
};

type CrosswordContext = {
  grid: (CrosswordCell | null)[][];
  crosswordWords: CrosswordWord[];
  appState: AppState;
};

export const CrosswordContext = createContext<CrosswordContext>({
  grid,
  crosswordWords,
  appState: {
    showClueList: false,
  },
});
export const CrosswordDispatchContext = createContext<React.Dispatch<any>>(
  () => {}
);

export type CrosswordAction = {
  type: CrosswordActionType;
  payload: any;
};
export type CrosswordActionType =
  | "SET_LETTER"
  | "SET_LETTER_FOCUS"
  | "SET_WORD"
  | "SET_FOCUS_WORD"
  | "SET_SHOW_CLUE_LIST"
  | "SET_IS_HOVERING"
  | "SET_NO_HOVERING"
  | "SET_FOCUS_WORD_BY_WORD";

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
                isFocusedLetter: true,
              };
            } else {
              return {
                ...cell,
                isFocusedLetter: false,
              };
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
      const { x, y } = action.payload;

      const prevFocusedWord = crossword.crosswordWords.find(
        (word) => word.isFocused
      );

      const coordinateSpaceWords = crossword.crosswordWords.filter((word) =>
        word.letterPositions.some(
          (position) => position.x === x && position.y === y
        )
      );

      const newWords = crossword.crosswordWords.map((word) => {
        if (
          word.letterPositions.some(
            (position) => position.x === x && position.y === y
          )
        ) {
          if (
            prevFocusedWord &&
            prevFocusedWord.clueText === word.clueText &&
            coordinateSpaceWords.length === 1
          ) {
            return {
              ...word,
              isFocused: true,
            };
          } else if (
            prevFocusedWord &&
            prevFocusedWord.clueText === word.clueText &&
            coordinateSpaceWords.length > 1
          ) {
            const isDifferentAxis =
              prevFocusedWord.direction !== word.direction;
            return {
              ...word,
              isFocused: isDifferentAxis,
            };
          } else if (!prevFocusedWord && coordinateSpaceWords.length > 1) {
            return {
              ...word,
              isFocused: word === coordinateSpaceWords[0],
            };
          } else {
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

      const focusedWord = newWords.find((word) => word.isFocused);

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
        ...crossword,
        grid: newGrid ? newGrid : crossword.grid,
        crosswordWords: newWords,
      };
    }
    case "SET_FOCUS_WORD_BY_WORD": {
      const word = action.payload;
      const newWords = crossword.crosswordWords.map((crosswordWord) => {
        if (crosswordWord.clueText === word.clueText) {
          return {
            ...crosswordWord,
            isFocused: true,
          };
        } else {
          return {
            ...crosswordWord,
            isFocused: false,
          };
        }
      });
      //set all matching cells to word isFocused
      const newGrid = crossword.grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          if (cell) {
            //if cell is the first cell of the word, set it to isFocused
            if (
              cellIndex === word.letterPositions[0].x &&
              rowIndex === word.letterPositions[0].y
            ) {
              console.log("setting first cell to isFocused", cellIndex, rowIndex, word.letterPositions);
              return {
                ...cell,
                isFocused: true,
                isFocusedDirection: word.direction,
                isFocusedLetter: true,
              };
            } else if (
              word.letterPositions.some(
                (position: Position) =>
                  position.x === cellIndex && position.y === rowIndex
              )
            ) {
              console.log("setting cell to isFocused", cellIndex, rowIndex,  word.letterPositions);
              return {
                ...cell,
                isFocused: true,
                isFocusedDirection: word.direction,
                isFocusedLetter: false,
              };
            } else {
              return {
                ...cell,
                isFocused: false,
                isFocusedLetter: false,
              };
            }
          }
        });
      });
      return {
        ...crossword,
        grid: newGrid,
        crosswordWords: newWords,
      };
    }
    case "SET_SHOW_CLUE_LIST": {
      const showClueList = action.payload;
      return {
        ...crossword,
        appState: {
          ...crossword.appState,
          showClueList,
        },
      };
    }
    case "SET_IS_HOVERING": {
      const word = action.payload;
      const newWords = crossword.crosswordWords.map((crosswordWord) => {
        if (crosswordWord.clueText === word.clueText) {
          return {
            ...crosswordWord,
            isHovering: true,
          };
        }
        return crosswordWord;
      });
      //set all matching cells to word isHovering
      const newGrid = crossword.grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          if (cell) {
            if (
              word.letterPositions.some(
                (position: Position) =>
                  position.x === cellIndex && position.y === rowIndex
              )
            ) {
              return {
                ...cell,
                isHovering: true,
              };
            }
          }
          return cell;
        });
      });
      return {
        ...crossword,
        crosswordWords: newWords,
        grid: newGrid,
      };
    }
    case "SET_NO_HOVERING": {
      const newWords = crossword.crosswordWords.map((crosswordWord) => {
        return {
          ...crosswordWord,
          isHovering: false,
        };
      });
      //set all matching cells to word isHovering
      const newGrid = crossword.grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          if (cell) {
            return {
              ...cell,
              isHovering: false,
            };
          }
          return cell;
        });
      });
      return {
        ...crossword,
        crosswordWords: newWords,
        grid: newGrid,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
