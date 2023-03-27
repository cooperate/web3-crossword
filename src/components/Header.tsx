import React, { useContext, useEffect, useState } from "react";
import { Web3Button } from "@web3modal/react";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  max-width: 900px;
  gap: 16px;
`;

export const ENSName = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  flex-direction: column;
  font-size: 0.8rem;
  margin: 0.5rem 0;
  text-align: center;
  a {
    color: #8a6d8f;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ENSNameWrapper = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 8vw, 2.5rem);
`;

export const Header = () => (
  <Container>
    <Web3Button />
    <Title>
      CROSSw<span style={{ color: "#8a6d8f" }}>3</span>b
    </Title>
    <ENSNameWrapper>
      <ENSName>
        <span>A website by</span>
        <a
          href="https://app.ens.domains/name/brettcizmar.eth/details"
          target="_blank"
        >
          brettcizmar.eth
        </a>
      </ENSName>
    </ENSNameWrapper>
  </Container>
);
