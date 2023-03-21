// components/Crossword.tsx
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { CrosswordCell, CrosswordQuestion, GRID_SIZE } from "@/pages/api/hello";
import { keyframes } from "@emotion/react";
import {
  CrosswordContext,
  CrosswordDispatchContext,
} from "@/pages/api/CrosswordContext";
import styles from "@/styles/Crossword.module.css";
import { animated, useSpring } from "@react-spring/web";

const Grid = styled.div<{ size: number }>`
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 1fr);
  gap: 5px;
  height: 100%;
`;

interface CrosswordProps {
  size: number;
}

const CrosswordWrapper = styled.div<{ size: number }>`
  width: 80vw;
  height: 80vw;
  max-width: 800px;
  max-height: 800px;
  z-index: 5;
`;

export const Crossword: React.FC<CrosswordProps> = ({ size }) => {
  const { grid } = useContext(CrosswordContext);
  return (
    <CrosswordWrapper size={size}>
      <Grid size={size}>
        {grid.map((row, i) =>
          row.map((cell, j) => <Cell key={`${i}-${j}`} cellData={cell} />)
        )}
      </Grid>
    </CrosswordWrapper>
  );
};

const CellWrapper = styled.div<{
  isFocused: boolean;
  isFocusedDirectionColor: string;
  isHovering: boolean;
  isHoveringColor: string;
  isClicked: boolean;
}>`
  position: relative;
  background: ${(props) => (props.isFocused ? "none" : "transparent")};
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: ${(props) => (props.isHovering ? 1 : props.isFocused ? 1 : 0)};
    transition: opacity 0.3s;
  }

  &::before {
    ${(props) =>
      props.isClicked
        ? `
        background-color: ${props.isFocusedDirectionColor};
        box-shadow: 0 0 5px
        ${props.isFocusedDirectionColor},
      0 0 10px
        ${props.isFocusedDirectionColor},
      0 0 20px
        ${props.isFocusedDirectionColor},
      0 0 30px
        ${props.isFocusedDirectionColor},
      0 0 40px
        ${props.isFocusedDirectionColor};
        `
        : `
    background-color: ${
      props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
    };
    box-shadow: 0 0 5px
        ${
          props.isHovering
            ? props.isHoveringColor
            : props.isFocusedDirectionColor
        },
      0 0 10px
        ${
          props.isHovering
            ? props.isHoveringColor
            : props.isFocusedDirectionColor
        },
      0 0 20px
        ${
          props.isHovering
            ? props.isHoveringColor
            : props.isFocusedDirectionColor
        },
      0 0 30px
        ${
          props.isHovering
            ? props.isHoveringColor
            : props.isFocusedDirectionColor
        },
      0 0 40px
        ${
          props.isHovering
            ? props.isHoveringColor
            : props.isFocusedDirectionColor
        };`}
  }

  &::after {
    ${(props) =>
      props.isClicked
        ? `
    background-color: ${props.isFocusedDirectionColor};
    box-shadow: 0 0 5px ${props.isFocusedDirectionColor},
      0 0 10px ${props.isFocusedDirectionColor},
      0 0 20px ${props.isFocusedDirectionColor},
      0 0 30px ${props.isFocusedDirectionColor},
      0 0 40px ${props.isFocusedDirectionColor};
    transform: scale(1.05);
    `
        : `
    background-color: ${
      props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
    };
    box-shadow: 0 0 5px ${
      props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
    },
      0 0 10px ${
        props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
      },
      0 0 20px ${
        props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
      },
      0 0 30px ${
        props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
      },
      0 0 40px ${
        props.isHovering ? props.isHoveringColor : props.isFocusedDirectionColor
      };
    transform: scale(1.05);
`}
  }
`;

const CellNumber = styled.span`
  position: absolute;
  top: clamp(3px, 1vw, 8px);
  left: clamp(3px, 1vw, 8px);
  color: black;
  font-size: clamp(0.8rem, 1.4vw, 1.4rem);
  font-weight: bold;
`;

const rotate = keyframes`
  100% {
    transform: translate(-50%, -50%) rotate(1turn);
  }
`;

const CellContent = styled.div<{ isBlack: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${(props) => (props.isBlack ? "black" : "white")};
  outline: none;
  transition: box-shadow 0.2s ease-in-out;
  max-height: 200px;
  max-width: 250px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 0;
  border-radius: ${(props) => (props.isBlack ? "0px" : "10px")};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: clamp(2rem, 6vw, 6rem);

  &:focus {
    background: #292a2e;
    &,
    & * {
      color: #fff !important;
    }
  }
  &:focus::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    position: absolute;
    width: 99999px;
    height: 99999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #1976ed,
      rgba(0, 0, 0, 0) 25%
    );
    animation: ${rotate} 4s linear infinite;
  }

  &:focus::after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 5px;
    top: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    background: #444654;
    border-radius: 7px;
  }
`;

interface CellProps {
  cellData: CrosswordCell | null;
}

export const Cell: React.FC<CellProps> = ({
  cellData,
}: {
  cellData: CrosswordCell | null;
}) => {
  const cellContentRef = useRef<HTMLDivElement>(null);
  const [enteredLetter, setEnteredLetter] = useState("");
  const dispatch = useContext(CrosswordDispatchContext);
  const { crosswordWords } = useContext(CrosswordContext);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    //check if key down is arrow key
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Enter" ||
      e.key === "Tab"
    ) {
      e.preventDefault();
      if (cellData) {
        switch (e.key) {
          case "ArrowUp":
            if (
              cellData?.position?.y !== 0 &&
              cellData?.letterPositionDown != undefined &&
              cellData?.wordLengthDown != undefined
            ) {
              dispatch({
                type: "SET_LETTER_FOCUS",
                payload: {
                  x: cellData?.position?.x || 0,
                  y: cellData?.position?.y - 1 || 0,
                },
              });
              dispatch({
                type: "SET_FOCUS_WORD",
                payload: {
                  x: cellData?.position?.x || 0,
                  y: cellData?.position?.y - 1 || 0,
                },
              });
            }
            break;
          case "ArrowDown":
            if (
              cellData?.position?.y !== GRID_SIZE &&
              cellData?.letterPositionDown != undefined &&
              cellData?.wordLengthDown != undefined &&
              cellData?.letterPositionDown < cellData?.wordLengthDown - 1
            ) {
              dispatch({
                type: "SET_LETTER_FOCUS",
                payload: {
                  x: cellData?.position?.x || 0,
                  y: cellData?.position?.y + 1 || 0,
                },
              });
              dispatch({
                type: "SET_FOCUS_WORD",
                payload: {
                  x: cellData?.position?.x || 0,
                  y: cellData?.position?.y + 1 || 0,
                },
              });
            }
            break;
          case "ArrowLeft":
            if (
              cellData?.position?.x !== 0 &&
              cellData?.letterPositionAcross != undefined &&
              cellData?.wordLengthAcross != undefined
            ) {
              dispatch({
                type: "SET_LETTER_FOCUS",
                payload: {
                  x: cellData?.position?.x - 1 || 0,
                  y: cellData?.position?.y || 0,
                },
              });
              dispatch({
                type: "SET_FOCUS_WORD",
                payload: {
                  x: cellData?.position?.x - 1 || 0,
                  y: cellData?.position?.y || 0,
                },
              });
            }
            break;
          case "ArrowRight":
            if (
              cellData?.position?.x !== GRID_SIZE &&
              cellData?.letterPositionAcross != undefined &&
              cellData?.wordLengthAcross != undefined &&
              cellData?.letterPositionAcross < cellData?.wordLengthAcross - 1
            ) {
              dispatch({
                type: "SET_LETTER_FOCUS",
                payload: {
                  x: cellData?.position?.x + 1 || 0,
                  y: cellData?.position?.y || 0,
                },
              });
              dispatch({
                type: "SET_FOCUS_WORD",
                payload: {
                  x: cellData?.position?.x + 1 || 0,
                  y: cellData?.position?.y || 0,
                },
              });
            }
            break;
          case "Backspace":
          case "Delete":
            dispatch({
              type: "SET_LETTER",
              payload: {
                letter: "",
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y || 0,
              },
            });
            if (
              cellData?.isFocusedDirection == "across" &&
              cellData?.letterPositionAcross != undefined &&
              cellData?.letterPositionAcross > 0
            ) {
              dispatch({
                type: "SET_LETTER_FOCUS",
                payload: {
                  x: cellData?.position?.x - 1 || 0,
                  y: cellData?.position?.y || 0,
                },
              });
            } else if (
              cellData?.isFocusedDirection == "down" &&
              cellData?.letterPositionDown != undefined &&
              cellData?.letterPositionDown > 0
            ) {
              dispatch({
                type: "SET_LETTER_FOCUS",
                payload: {
                  x: cellData?.position?.x || 0,
                  y: cellData?.position?.y - 1 || 0,
                },
              });
            }
            break;
          case "Tab":
            dispatch({
              type: "SET_FOCUS_WORD",
              payload: {
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y || 0,
              },
            });
            break;
        }
      }
    } else {
      const key = e.key.toUpperCase();
      const isAlphabetic = /^[A-Z]$/.test(key);

      if (isAlphabetic) {
        setEnteredLetter(key);
        dispatch({
          type: "SET_LETTER",
          payload: {
            letter: key,
            x: cellData?.position?.x || 0,
            y: cellData?.position?.y || 0,
          },
        });
        if (cellData?.isFocusedDirection == "across") {
          if (
            cellData?.letterPositionAcross != undefined &&
            cellData?.wordLengthAcross != undefined &&
            cellData?.letterPositionAcross < cellData?.wordLengthAcross
          ) {
            dispatch({
              type: "SET_LETTER_FOCUS",
              payload: {
                x: cellData?.position?.x + 1 || 0,
                y: cellData?.position?.y || 0,
              },
            });
          }
        } else if (cellData?.isFocusedDirection == "down") {
          if (
            cellData?.letterPositionDown != undefined &&
            cellData?.wordLengthDown != undefined &&
            cellData?.letterPositionDown < cellData?.wordLengthDown
          ) {
            dispatch({
              type: "SET_LETTER_FOCUS",
              payload: {
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y + 1 || 0,
              },
            });
          }
        }
      }
    }
    e.preventDefault();
  };

  useEffect(() => {
    if (cellContentRef.current && cellData?.isFocusedLetter) {
      cellContentRef.current.focus();
    }
  }, [cellData?.isFocusedLetter]);
  useEffect(() => {
    if (cellData?.isFocused && cellData?.isHovering) {
      setIsClicked(true);
    } else {
      setIsClicked(false);
    }
  }, [cellData?.isHovering, cellData?.isFocused]);
  const [isClicked, setIsClicked] = useState(false);
  if (!cellData) {
    return (
      <CellWrapper
        className={styles.noGap}
        isFocusedDirectionColor={"yellow"}
        isFocused={false}
        isHovering={false}
        isHoveringColor="#cbe3cb"
        isClicked={isClicked}
      >
        <CellContent isBlack={true} />
      </CellWrapper>
    );
  }
  return (
    <CellWrapper
      isFocusedDirectionColor={
        cellData?.isFocusedDirection == "across" ? "#ad88b4" : "#f87225"
      }
      isHoveringColor="#cbe3cb"
      isHovering={cellData?.isHovering || false}
      isFocused={cellData?.isFocused || false}
      isClicked={isClicked}
    >
      <CellContent
        ref={cellContentRef}
        isBlack={false}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (cellContentRef.current) {
            dispatch({
              type: "SET_FOCUS_WORD",
              payload: {
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y || 0,
              },
            });
            dispatch({
              type: "SET_LETTER_FOCUS",
              payload: {
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y || 0,
              },
            });
          }
        }}
      >
        {cellData.rootCell && (
          <CellNumber>{cellData.rootCellQuestionNumber}</CellNumber>
        )}
        <animated.span>{cellData?.letter || ""}</animated.span>
      </CellContent>
    </CellWrapper>
  );
};
