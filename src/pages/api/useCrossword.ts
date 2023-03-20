import { CrosswordCell, CrosswordWord } from "./hello";

function useCrossword(crosswordWords: CrosswordWord[], crosswordCells: CrosswordCell[]) {
  const setCrosswordCellLetter = (x: number, y: number, letter: string) => {
    //find the cell with position x and y
    const cell = crosswordCells.find((cell) => cell.position.x === x && cell.position.y === y);
    if (cell) {
        cell.letter = letter;
    }
  };


  return { setCrosswordCellLetter };
}

export default useCrossword;