import { CrosswordContext, CrosswordDispatchContext, crosswordReducer, generateGrid } from "@/pages/api/CrosswordContext";
import { CrosswordCell, crosswordTestData, CrosswordWord } from "@/pages/api/hello";
import { useContext, useReducer } from "react";

const { grid, crosswordWords }: { grid: (CrosswordCell | null)[][], crosswordWords: CrosswordWord[] } = generateGrid(crosswordTestData, 7);

export const CrosswordProvider = ({ children }: { children: React.ReactNode }) => {
    const [crossword, dispatch] = useReducer(crosswordReducer, { grid, crosswordWords, appState: {
        showClueList: false,
      } });

    return (
        <CrosswordContext.Provider value={crossword}>
            <CrosswordDispatchContext.Provider value={dispatch}>
                {children}
            </CrosswordDispatchContext.Provider>
        </CrosswordContext.Provider>
    );
}