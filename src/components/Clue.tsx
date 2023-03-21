// components/ClueCard.tsx
import React, { useContext, useEffect } from "react";
import styled from "@emotion/styled";
import { CrosswordContext } from "@/pages/api/CrosswordContext";
import { useSpring, animated } from "@react-spring/web";

interface ClueCardProps {
  clueId: number;
  direction: "Across" | "Down";
  content: string;
}

const CardContainer = styled(animated.div)`
  position: absolute;
  bottom: 100px;
  width: 500px;
  z-index: 10;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const ClueTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
`;

const ClueContent = styled.p`
  margin: 0.5rem 0;
  font-size: 1.5rem;
  text-align: center;
`;

const ClueCard: React.FC = () => {
  const [prevClueText, setPrevClueText] = React.useState<string | undefined>(undefined);
  const { crosswordWords } = useContext(CrosswordContext);
  //get focused word
  const focusedWord = crosswordWords.find((word) => word.isFocused);
  const [springProps, setSpringProps] = useSpring(() => ({
    transform: "translateY(100%)",
  }));
  useEffect(() => {
    if (focusedWord && focusedWord?.clueText != prevClueText) {
      setSpringProps({
        from: { transform: "translateY(100%)" },
        to: { transform: "translateY(0%)" },
        config: { duration: 150 },
      });
    }
    setPrevClueText(focusedWord?.clueText);
  }, [focusedWord, setSpringProps]);

  return (
    <>
      {focusedWord && (
        <CardContainer style={springProps}>
          <ClueTitle>
            {focusedWord?.questionNumber} ({focusedWord?.direction})
          </ClueTitle>
          <ClueContent>{focusedWord?.clueText}</ClueContent>
        </CardContainer>
      )}
    </>
  );
};

export default ClueCard;
