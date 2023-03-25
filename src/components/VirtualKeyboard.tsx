// components/VirtualKeyboard.tsx
import React, { useContext } from "react";
import styled from "@emotion/styled";
import {
  CrosswordContext,
  CrosswordDispatchContext,
} from "@/pages/api/CrosswordContext";

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #967c9a;
  border-radius: 10px;
  max-width: 100%;
  gap: 0.2rem;
  @media (max-width: 900px) {
    border-radius: 0;
  }
`;

const KeyRow = styled.div`
  display: grid;
  gap: 0.2rem;
  &:nth-child(1) {
    grid-template-columns: repeat(10, 1fr);
  }
  &:nth-child(2) {
    grid-template-columns: 1fr repeat(8, 1fr);
    grid-gap: 0.2rem;
  }
  &:nth-child(3) {
    grid-template-columns: 1fr repeat(7, 1fr);
  }
`;
const Key = styled.button`
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-size: 18px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  color: #000000;
  &:hover {
    background-color: #cccccc;
  }
  &:active {
    background-color: #999999;
  }
`;
type CustomKey = { label: string; action: string };

const keysLayout: (string | CustomKey)[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", { label: "⌫", action: "backspace" }],
];

const VirtualKeyboard: React.FC = () => {
  const { grid } = useContext(CrosswordContext);
  const dispatch = useContext(CrosswordDispatchContext);
  const handleKeyPress = (key: string | CustomKey) => {
    let cellData;
    for (let row of grid) {
      cellData = row.find((cell) => cell?.isFocusedLetter);
      if (cellData) {
        break;
      }
    }
    if (typeof key !== "string" && key?.action == "backspace") {
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
        cellData?.isFocusedDirection == "across" &&
        cellData?.letterPositionAcross != undefined &&
        cellData?.letterPositionAcross == 0
      ) {
        dispatch({
          type: "SET_LETTER_FOCUS",
          payload: {
            x: cellData?.position?.x || 0,
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
      } else if (
        cellData?.isFocusedDirection == "down" &&
        cellData?.letterPositionDown != undefined &&
        cellData?.letterPositionDown == 0
      ) {
        dispatch({
          type: "SET_LETTER_FOCUS",
          payload: {
            x: cellData?.position?.x || 0,
            y: cellData?.position?.y || 0,
          },
        });
      }
    } else if (typeof key == "string") {
      key = key.toUpperCase();
      if (cellData) {
        console.log("entering letter for cellData", cellData);
        dispatch({
          type: "SET_LETTER",
          payload: {
            letter: key,
            x: cellData.position?.x,
            y: cellData.position?.y,
          },
        });
        if (cellData?.isFocusedDirection == "across") {
          if (
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
          } else if (
            cellData?.letterPositionAcross != undefined &&
            cellData?.wordLengthAcross != undefined &&
            cellData?.letterPositionAcross === cellData?.wordLengthAcross - 1
          ) {
            console.log("setting focus to same cell", cellData);
            dispatch({
              type: "SET_LETTER_FOCUS",
              payload: {
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y || 0,
              },
            });
          }
        } else if (cellData?.isFocusedDirection == "down") {
          if (
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
          } else if (
            cellData?.letterPositionDown != undefined &&
            cellData?.wordLengthDown != undefined &&
            cellData?.letterPositionDown === cellData?.wordLengthDown - 1
          ) {
            dispatch({
              type: "SET_LETTER_FOCUS",
              payload: {
                x: cellData?.position?.x || 0,
                y: cellData?.position?.y || 0,
              },
            });
          }
        }
      }
    }
  };

  return (
    <KeyboardContainer>
      {keysLayout.map((row, rowIndex) => (
        <KeyRow key={rowIndex}>
          {row.map((key: any, keyIndex) => (
            <Key
              key={`${rowIndex}-${keyIndex}`}
              onClick={() => handleKeyPress(key)}
            >
              {typeof key === "string" ? key : key.label}
            </Key>
          ))}
        </KeyRow>
      ))}
    </KeyboardContainer>
  );
};

export default VirtualKeyboard;
