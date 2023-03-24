import React, { useRef, useState, useEffect } from "react";
import {
  animated,
  useInView,
  useSpring,
  useTransition,
  useTrail,
} from "@react-spring/web";
import { FaTwitter, FaMediumM, FaGithub } from "react-icons/fa";
import styled from "@emotion/styled";

const linkData = [
  {
    alt: "twitter",
    url: "https://twitter.com/",
    icon: FaTwitter,
  },
  {
    alt: "github",
    url: "https://github.com/cooperate",
    icon: FaGithub,
  },
  {
    title: "medium",
    url: "https://medium.com/",
    icon: FaMediumM,
  },
];

export const Link = ({ url, Icon }: { url: string; Icon: any }) => {
  return (
    <div className="link">
      <a href={url} target="_blank" rel="noreferrer">
        <Icon size="90px" color="#fff" />
      </a>
    </div>
  );
};

const LinksWrapper = styled(animated.div)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  & .link {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0px 20px;
    img {
      width: 70px;
      max-width: 100px;
    }
  }
`;

export const Links = () => {
  const [ref, inView] = useInView();
  const [trails, api] = useTrail(linkData.length, () => ({}), linkData);

  useEffect(() => {
    if (inView) {
      api.start({
        from: { opacity: 0 },
        to: { opacity: 1 },
      });
    }
  }, [inView]);

  return (
    <LinksWrapper id="links" ref={ref}>
      <LinksContainer className="links">
        {trails.map((props, index) => {
          return (
            <animated.div key={index} style={props}>
              <Link
                key={index}
                url={linkData?.[index].url}
                Icon={linkData?.[index]?.icon}
              />
            </animated.div>
          );
        })}
      </LinksContainer>
    </LinksWrapper>
  );
};
