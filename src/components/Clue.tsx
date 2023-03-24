// components/ClueCard.tsx
import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  CrosswordContext,
  CrosswordDispatchContext,
} from "@/pages/api/CrosswordContext";
import { useSpring, animated } from "@react-spring/web";
import { BsInfoSquare } from "react-icons/bs";
import { useWeb3Modal } from "@web3modal/react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { PAY_ADDRESS } from "@/pages/api/hello";
import { useDebounce } from "use-debounce";
import { parseEther } from "ethers/lib/utils.js";

interface ClueCardProps {
  clueId: number;
  direction: "Across" | "Down";
  content: string;
}

const CardContainer = styled(animated.div)`
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 80%;
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

const InfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    svg {
      background-color: rgba(0, 0, 0, 0.1);
      color: #8a6d8f;
    }
  }
`;

const HelpText = styled.span`
  font-size: 0.8rem;
  color: #8a6d8f;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PayForHintButton = styled.button`
  background-color: #8a6d8f;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    background-color: #6b4f6f;
  }
`;

const PayForHint = ({
  paymentWalletAddress,
  displayHint
}: {
  paymentWalletAddress: string;
  displayHint: () => void;
}) => {
  const to = paymentWalletAddress;
  const amount = "0.003";
  const [debouncedTo] = useDebounce(to, 500);
  const [debouncedAmount] = useDebounce(amount, 500);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { config, status, error: prepareError } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  });

  const { data, sendTransaction, isError, error: sendError } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handlePayForHint = () => {
    console.log('handlePayForHint', sendTransaction);
    if (sendTransaction) {
      sendTransaction();
    }
  };
  useEffect(() => {
    if(isSuccess) {
      displayHint();
    }
  }, [isSuccess]);

  return (
    <>
      <PayForHintButton onClick={handlePayForHint}>
        Pay for a hint.
      </PayForHintButton>
      {isLoading && <div>Loading...</div>}
      {isSuccess && <div>Transaction succeeded with hash: {data?.hash}</div>}
      {/* {errorMessage && <div>{errorMessage}</div>}
      {isError && <div>{sendError?.message}</div>}
      {prepareError && <div>{prepareError?.message}</div>} */}
    </>
  );
};

const NeedHelp = () => {
  const { isOpen, open, close } = useWeb3Modal();
  const { connector, isConnected } = useAccount();
  const [walletConnectModalOpen, setWalletConnectModalOpen] =
    React.useState(false);

  const askForHelp = () => {
    if (!isConnected) {
      open();
    }
  };

  const displayHint = () => {
    console.log('displayHint');
  };

  const closeModal = () => {
    setWalletConnectModalOpen(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={askForHelp}
    >
      <HelpText>Need help?</HelpText>
      {isConnected && <PayForHint paymentWalletAddress={PAY_ADDRESS} displayHint={displayHint} />}
    </div>
  );
};

const ClueCard: React.FC = () => {
  const [prevClueText, setPrevClueText] = React.useState<string | undefined>(
    undefined
  );
  const { crosswordWords, appState } = useContext(CrosswordContext);
  const dispatch = useContext(CrosswordDispatchContext);
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
  const showClueList = () => {
    dispatch({ type: "SET_SHOW_CLUE_LIST", payload: true });
  };
  return (
    <>
      {focusedWord && !appState?.showClueList && (
        <CardContainer style={springProps}>
          <ClueTitle>
            {focusedWord?.questionNumber} ({focusedWord?.direction})
          </ClueTitle>
          <ClueContent>{focusedWord?.clueText}</ClueContent>
          <NeedHelp />
          <InfoWrapper onClick={showClueList}>
            <BsInfoSquare />
          </InfoWrapper>
        </CardContainer>
      )}
    </>
  );
};

export default ClueCard;
