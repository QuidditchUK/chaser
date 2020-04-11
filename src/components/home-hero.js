import React from 'react';
import get from 'just-safe-get';
import styled from 'styled-components';
import { space, color } from 'styled-system';

import Input from './input';
import Button from './button';

const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.heading};
  text-shadow: ${({ theme }) => theme.shadows.heading};
  ${space}

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    font-size: ${({ theme }) => theme.fontSizes.headingMobile}
  }
`;

const Hero = styled.section`
  align-items: center;
  display: flex;
  height: 70vh;
  justify-content: center;
  text-align: center;
  ${color};

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    height: 30vh;
  }
`;

const VideoWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    height: 30vh;
  }
`;

const Video = styled.video`
  width: 100%;
`;

const TextWrapper = styled.div`
  align-items: center;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    height: 30vh;
  }

`;

const CTA = styled.div`
  display: flex;
  flex-direction: row;
`;

const HomeHero = (rawData) => {
  const data = {
    title: get(rawData, 'primary.slug'),
    cta_text: get(rawData, 'primary.cta_text'),
    cta_url: get(rawData, 'primary.cta_url'),
    video: get(rawData, 'primary.video_url.url'),
  };

  return (
    <Hero bg="primary">
      <VideoWrapper>
        <Video src={data.video} autoPlay loop muted />
      </VideoWrapper>

      <TextWrapper>
        <Heading mt={0} mb={8}>{data.title}</Heading>
        <CTA>
          <Input type="text" placeholder="Postcode" /><Button type="button" variant="primary" ml={2}>{data.cta_text}</Button>
        </CTA>
      </TextWrapper>
    </Hero>
  );
};

export default HomeHero;
