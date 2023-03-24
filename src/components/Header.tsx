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

const ENSName = styled.div`
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

export const Header = () => (
  <Container>
    <Web3Button />
    <h1>CROSSw<span style={{color: "#8a6d8f"}}>3</span>b</h1>
    <ENSName>
      <span>A website by</span>
      <a
        href="https://app.ens.domains/name/brettcizmar.eth/details"
        target="_blank"
      >
        brettcizmar.eth
      </a>
    </ENSName>
  </Container>
);
