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

const SubmitCrosswordButton = styled.button`
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: #fff;
        color: #000;
    }
`;

export const SubmitCrossword = () => {
    const { isOpen, open, close } = useWeb3Modal();
    const { connector, isConnected } = useAccount();
    const { grid } = useContext(CrosswordContext);

    return (
        <div>
            <SubmitCrosswordButton>Submit To Blockchain</SubmitCrosswordButton>
        </div>
    );
};