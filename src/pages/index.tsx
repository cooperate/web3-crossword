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
import { useContext, useRef, useEffect } from "react";
import { CrosswordContext } from "./api/CrosswordContext";
import { CrosswordProvider } from "@/components/CrosswordProvider";
import ClueCard from "@/components/Clue";
import { GRID_SIZE } from "./api/hello";
import ClueList from "@/components/ClueList";
import { useScroll, useSpring, animated } from "@react-spring/web";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Links } from "@/components/Links";
import styled from "@emotion/styled";
import { ENSName, Header } from "@/components/Header";
import { SubmitCrossword } from "@/components/SubmitCrossword";

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

const CrosswordContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default function Home() {
  const size = GRID_SIZE;
  const { grid } = useContext(CrosswordContext);
  const containerRef = useRef<any>(null);
  const [{ y }, textApi] = useSpring(() => ({ y: "100%" }));
  const { scrollYProgress } = useScroll({
    container: containerRef,
    onChange: ({ value: { scrollYProgress } }) => {
      if (scrollYProgress > 0.7) {
        textApi.start({ y: "0" });
      } else {
        textApi.start({ y: "100%" });
      }
    },
  });
  return (
    <>
      <Head>
        <title>CrossWeb</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WagmiConfig client={wagmiClient}>
        <Scrollbars
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "#8a6d8f",
                borderRadius: "4px",
              }}
            />
          )}
          className={"custom-scrollbar"}
          universal={true}
          style={{ height: "100vh" }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          <main className={`${styles.main} ${spaceMono.className}`}>
            <animated.div
              ref={containerRef}
              className={styles.background}
              style={{
                transform: y.interpolate((y) => `translate3d(0, ${y}, 0)`),
              }}
            />
            <div className={styles.initialView}>
              <div className={styles.headerSection}>
                <Header />
              </div>
              <div className={styles.gameSection}>
                <CrosswordProvider>
                  <CrosswordContainer>
                    <Crossword size={size} />
                    <ClueList />
                  </CrosswordContainer>
                  <ClueCard />
                  {/* <SubmitCrossword /> */}
                </CrosswordProvider>
              </div>
            </div>
            <div className={styles.aboutSection}>
              <animated.h2>
                This is a <span style={{ color: "#8a6d8f" }}>&lt;</span>Web3
                <span style={{ color: "#8a6d8f" }}>&gt;</span> Crossword
                <span style={{ color: "#8a6d8f" }}>.</span>
              </animated.h2>
              <animated.p>
                Fill out this weekly crossword. If you&apos;re feeling
                confident, you may submit your results. The first person to
                submit a 100% correct puzzle receives the weekly prize! Take
                your time and most importantly...have fun!
              </animated.p>
            </div>
            <div className={styles.linksSection}>
              <Links />
              <ENSName style={{textAlign: "center", alignItems: "center"}}>
                <span>A website by</span>
                <a
                  href="https://app.ens.domains/name/brettcizmar.eth/details"
                  target="_blank"
                >
                  brettcizmar.eth
                </a>
              </ENSName>
            </div>
          </main>
        </Scrollbars>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
