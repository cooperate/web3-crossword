import Head from "next/head";
import Image from "next/image";
import { Inter, Space_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { Web3Button } from "@web3modal/react";
import { Crossword, Cell } from "../components/Crossword";
import { useContext } from "react";
import { CrosswordContext } from "./api/CrosswordContext";
import { CrosswordProvider } from "@/components/CrosswordProvider";
import ClueCard from "@/components/Clue";
import { GRID_SIZE } from "./api/hello";
import ClueList from "@/components/ClueList";

const chains = [arbitrum, mainnet, polygon];
const projectId = "9267b6388ea54a987c770a45e9b61301";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});


export default function Home() {
  const size = GRID_SIZE;
  const { grid } = useContext(CrosswordContext);
  return (
    <>
      <Head>
        <title>CrossWeb</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WagmiConfig client={wagmiClient}>
        <main className={`${styles.main} ${spaceMono.className}`}>
          <div className={styles.gameSection}>
            <CrosswordProvider>
              <Crossword size={size} />
              <ClueList />
              <ClueCard />
            </CrosswordProvider>
            <Web3Button />
          </div>
        </main>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
