import { CrosswordContext } from "@/pages/api/CrosswordContext";

export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export function saveStateToLocalStorage(state: CrosswordContext) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("crosswordState", serializedState);
  } catch (error) {
    console.error("Error saving state to local storage:", error);
  }
}

export function loadStateFromLocalStorage(): CrosswordContext | undefined {
  try {
    const serializedState = typeof window !== "undefined" ?  window.localStorage.getItem("crosswordState") : null;
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as CrosswordContext;
  } catch (error) {
    console.error("Error loading state from local storage:", error);
    return undefined;
  }
}
