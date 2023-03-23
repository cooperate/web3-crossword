import {
  CrosswordContext,
  CrosswordDispatchContext,
} from "@/pages/api/CrosswordContext";
import { useSpring } from "@react-spring/web";
import React, { useContext, useEffect } from "react";
import styled from "@emotion/styled";
import { TfiClose } from "react-icons/tfi";
import { CrosswordWord } from "@/pages/api/hello";

const CardContainer = styled.div`
  z-index: 10;
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  position: relative;
  flex-grow: 1;
`;

const ClueWrapper = styled.div<{ isFocused: boolean; direction: string }>`
  margin-bottom: 16px;
  color: black;
  cursor: pointer;
  padding: 0.5rem;
  background: ${({ isFocused, direction }) =>
    isFocused
      ? isFocused && direction == "across"
        ? "#a784b0"
        : isFocused && direction == "down"
        ? "#f97124"
        : "transparent"
      : "transparent"};
   border-radius: 10px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ClueTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const ClueContent = styled.p`
  font-size: 14px;
  margin: 0;
`;

const ClueAcross = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClueDown = styled.div`
  display: flex;
  flex-direction: column;
`;

const CloseWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  cursor: pointer;
  svg {
    color: black;
  }
  &:hover {
    svg {
      background-color: rgba(0, 0, 0, 0.1);
      color: rgb(215, 98, 33);
    }
  }
`;

const ClueList: React.FC = () => {
  const dispatch = useContext(CrosswordDispatchContext);
  const { crosswordWords, appState } = useContext(CrosswordContext);
  const handleMouseEnter = (word: CrosswordWord) => {
    dispatch({ type: "SET_IS_HOVERING", payload: word });
  };

  const handleMouseLeave = () => {
    dispatch({ type: "SET_NO_HOVERING" });
  };

  const selectWord = (word: CrosswordWord) => {
    dispatch({ type: "SET_FOCUS_WORD_BY_WORD", payload: word });
  };
  return (
    <>
      {appState?.showClueList && (
        <CardContainer>
          <CloseWrapper>
            <TfiClose
              size={26}
              onClick={() => {
                dispatch({ type: "SET_SHOW_CLUE_LIST", payload: false });
              }}
            />
          </CloseWrapper>
          <ClueAcross>
            {crosswordWords
              .filter((word) => {
                return word?.direction == "across";
              })
              .map((word, index) => {
                return (
                  <ClueWrapper
                    key={index}
                    onMouseEnter={() => handleMouseEnter(word)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => selectWord(word)}
                    isFocused={word?.isFocused || false}
                    direction={word?.direction || "across"}
                  >
                    <ClueTitle>
                      {word?.questionNumber} ({word?.direction})
                    </ClueTitle>
                    <ClueContent>{word?.clueText}</ClueContent>
                  </ClueWrapper>
                );
              })}
          </ClueAcross>
          <ClueDown>
            {crosswordWords
              .filter((word) => {
                return word?.direction == "down";
              })
              .map((word, index) => {
                return (
                  <ClueWrapper
                    key={index}
                    onMouseEnter={() => handleMouseEnter(word)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => selectWord(word)}
                    isFocused={word?.isFocused || false}
                    direction={word?.direction}
                  >
                    <ClueTitle>
                      {word?.questionNumber} ({word?.direction})
                    </ClueTitle>
                    <ClueContent>{word?.clueText}</ClueContent>
                  </ClueWrapper>
                );
              })}
          </ClueDown>
        </CardContainer>
      )}
    </>
  );
};

export default ClueList;
