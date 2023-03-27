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
  let gridId = 0;

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
            id: `${yIndex}-${xIndex}`,
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
          gridId++;
        }
      } else {
        grid[yIndex][xIndex] = {
          id: `${yIndex}-${xIndex}`,
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

export type AppState = {
  showClueList: boolean;
  selectedWord: CrosswordWord | null;
  selectedCell: CrosswordCell | null;
};

export type CrosswordContext = {
  grid: (CrosswordCell | null)[][];
  crosswordWords: CrosswordWord[];
  appState: AppState;
};

export const CrosswordContext = createContext<CrosswordContext>({
  grid,
  crosswordWords,
  appState: {
    showClueList: false,
    selectedWord: null,
    selectedCell: null,
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
  | "SET_FOCUS_WORD_BY_WORD"
  | "SELECT_NEXT_WORD"
  | "SELECT_PREVIOUS_WORD"
  | "LOAD_STATE";

export function crosswordReducer(
  crossword: CrosswordContext,
  action: CrosswordAction
): CrosswordContext {
  const currentDirection =
    crossword.appState.selectedWord?.direction || "across";
  const wordsInDirection = crossword.crosswordWords.filter(
    (word) => word.direction === currentDirection
  );
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
      const appState = {
        ...crossword.appState,
      };
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
            const newWord = {
              ...word,
              isFocused: true,
            };
            appState.selectedWord = newWord;
            return newWord;
          } else if (
            prevFocusedWord &&
            prevFocusedWord.clueText === word.clueText &&
            coordinateSpaceWords.length > 1
          ) {
            const isDifferentAxis =
              prevFocusedWord.direction !== word.direction;
            const newWord = {
              ...word,
              isFocused: isDifferentAxis,
            };
            appState.selectedWord = newWord;
            return newWord;
          } else if (!prevFocusedWord && coordinateSpaceWords.length > 1) {
            const newWord = {
              ...word,
              isFocused: word === coordinateSpaceWords[0],
            };
            appState.selectedWord = newWord;
            return newWord;
          } else {
            const newWord = {
              ...word,
              isFocused: true,
            };
            appState.selectedWord = newWord;
            return newWord;
          }
        }
        return {
          ...word,
          isFocused: false,
        };
      });

      const focusedWord = newWords.find((word) => word.isFocused);

      let newGrid = null;
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
                const newCell = {
                  ...cell,
                  isFocused: true,
                  isFocusedDirection: focusedWord.direction,
                };
                appState.selectedCell = newCell;
                return newCell;
              } else {
                return {
                  ...cell,
                  isFocused: false,
                };
              }
            } else {
              return cell;
            }
          });
        });
      }
      return {
        ...crossword,
        appState,
        grid: newGrid ? newGrid : crossword.grid,
        crosswordWords: newWords,
      };
    }
    case "SET_FOCUS_WORD_BY_WORD": {
      const word = action.payload;
      //set appState matching word
      const appState = {
        ...crossword.appState,
        selectedWord: word,
      };
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
              const newCell = {
                ...cell,
                isFocused: true,
                isFocusedDirection: word.direction,
                isFocusedLetter: false,
              };
              appState.selectedCell = newCell;
              return newCell;
            } else if (
              word.letterPositions.some(
                (position: Position) =>
                  position.x === cellIndex && position.y === rowIndex
              )
            ) {
              const newCell = {
                ...cell,
                isFocused: true,
                isFocusedDirection: word.direction,
                isFocusedLetter: false,
              };
              appState.selectedCell = newCell;
              return newCell;
            } else {
              return {
                ...cell,
                isFocused: false,
                isFocusedLetter: false,
              };
            }
          } else {
            return cell;
          }
        });
      });
      return {
        ...crossword,
        appState,
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
    case "SELECT_NEXT_WORD": {
      const currentIndex = wordsInDirection.findIndex(
        (word) => word.id === crossword.appState.selectedWord?.id
      );
      const nextIndex =
        currentIndex + 1 < wordsInDirection.length ? currentIndex + 1 : 0;
      const nextWord = wordsInDirection[nextIndex];
      console.log("select next word", nextWord);
      //iterate over all cells matching nextWord letterpositions and select the cell after the one that matches focusedletter, otherwise select the first cell
      let nextCell: CrosswordCell | null = null;
      nextWord.letterPositions.some((position) => {
        console.log("position", position);
        const cell = crossword.grid[position.y][position.x];
        console.log("cell", cell?.letter);
        if (cell?.letter == undefined || cell?.letter == "") {
          console.log("cell is empty, assigning nextCell");
          nextCell = cell;
          return true;
        }
      });
      if (!nextCell) {
        nextCell =
          crossword.grid[nextWord?.letterPositions[0].y][
            nextWord?.letterPositions[0].x
          ];
      }
      console.log("nextCell", nextCell);
      const updatedGrid = crossword.grid.map((row) =>
        row.map((cell) => {
          if (cell) {
            console.log("cell id", cell?.id);
            console.log("nextCell id", nextCell?.id);
            return cell && cell.id === nextCell?.id
              ? {
                  ...cell,
                  isFocused: true,
                  isFocusedDirection: nextWord.direction,
                  isFocusedLetter: true,
                }
              : {
                  ...cell,
                  isFocused: false,
                  isFocusedDirection: undefined,
                  isFocusedLetter: false,
                };
          } else {
            return cell;
          }
        })
      );

      const updatedCrosswordWords = crossword.crosswordWords.map((word) =>
        word.id === nextWord.id
          ? { ...word, isFocused: true }
          : { ...word, isFocused: false }
      );

      return {
        ...crossword,
        grid: updatedGrid,
        crosswordWords: updatedCrosswordWords,
        appState: {
          ...crossword.appState,
          selectedWord: nextWord,
          selectedCell: nextCell || null,
        },
      };
    }

    case "SELECT_PREVIOUS_WORD": {
      const currentIndex = wordsInDirection.findIndex(
        (word) => word.id === crossword.appState.selectedWord?.id
      );
      const prevIndex =
        currentIndex === 0 ? wordsInDirection.length - 1 : currentIndex - 1;
      const prevWord = wordsInDirection[prevIndex];
      const prevCell =
        crossword.grid[prevWord.letterPositions[0].y][
          prevWord.letterPositions[0].x
        ];

      const updatedGrid = crossword.grid.map((row) =>
        row.map((cell) => {
          if (cell) {
            return cell && cell.id === prevCell?.id
              ? {
                  ...cell,
                  isFocused: true,
                  isFocusedDirection: prevWord.direction,
                  isFocusedLetter: true,
                }
              : {
                  ...cell,
                  isFocused: false,
                  isFocusedDirection: undefined,
                  isFocusedLetter: false,
                };
          } else {
            return cell;
          }
        })
      );

      const updatedCrosswordWords = crossword.crosswordWords.map((word) =>
        word.id === prevWord.id
          ? { ...word, isFocused: true }
          : { ...word, isFocused: false }
      );

      return {
        ...crossword,
        grid: updatedGrid,
        crosswordWords: updatedCrosswordWords,
        appState: {
          ...crossword.appState,
          selectedWord: prevWord,
          selectedCell: prevCell,
        },
      };
    }
    case "LOAD_STATE": {
      const state = action.payload;
      return state;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
