import {
  CrosswordContext,
  CrosswordDispatchContext,
  crosswordReducer,
  generateGrid,
} from "@/pages/api/CrosswordContext";
import {
  CrosswordCell,
  crosswordTestData,
  CrosswordWord,
} from "@/pages/api/hello";
import { loadStateFromLocalStorage, saveStateToLocalStorage } from "@/utils";
import { useContext, useEffect, useReducer, useState } from "react";

const {
  grid,
  crosswordWords,
}: { grid: (CrosswordCell | null)[][]; crosswordWords: CrosswordWord[] } =
  generateGrid(crosswordTestData, 7);
const initialDefault = {
  grid,
  crosswordWords,
  appState: {
    showClueList: false,
    selectedWord: null,
    selectedCell: null,
  },
};

export const CrosswordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initialState, setInitialState] = useState<{
    state: CrosswordContext;
    isLoaded: boolean;
  }>({
    state: initialDefault as CrosswordContext,
    isLoaded: false,
  });
  const [crossword, dispatch] = useReducer(
    crosswordReducer,
    initialState.state
  );

  useEffect(() => {
    const savedState = loadStateFromLocalStorage();
    console.log("savedState", savedState);
    setInitialState((prevState) => ({
      state: savedState || prevState.state,
      isLoaded: true,
    }));
  }, []);

  useEffect(() => {
    dispatch({
      type: "LOAD_STATE",
      payload: initialState?.state,
    });
  }, [initialState?.state]);

  useEffect(() => {
    console.log("crossword", crossword);
    if (
      crossword &&
      Object.keys(crossword).length > 0 &&
      crossword?.grid != initialDefault?.grid
    ) {
      saveStateToLocalStorage(crossword);
      console.log("writing to local storage", crossword.grid);
    }
  }, [crossword]);
  return (
    <CrosswordContext.Provider value={crossword}>
      {initialState.isLoaded &&
      initialState.state &&
      Object.keys(initialState.state).length > 0 ? (
        <CrosswordDispatchContext.Provider value={dispatch}>
          {children}
        </CrosswordDispatchContext.Provider>
      ) : (
        <div>Loading...</div>
      )}
    </CrosswordContext.Provider>
  );
};
