import React from 'react';
import get from 'just-safe-get';
import styled from 'styled-components';
import Button from './button';

const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.heading};
  margin-top: 0;
  text-shadow: ${({ theme }) => theme.shadows.heading};

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    font-size: ${({ theme }) => theme.fontSizes.headingMobile}
  }
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  height: 80vh;
  justify-content: center;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 40vh;
  }
`;

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  z-index: -1;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 40vh;
  }
`;

const Video = styled.video`
  min-height: 100%;
  min-width: 100%;
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius[0]};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.spaces[1]};
`;

const HomeHero = (rawData) => {
  const data = {
    title: get(rawData, 'primary.slug'),
    cta_text: get(rawData, 'primary.cta_text'),
    cta_url: get(rawData, 'primary.cta_url'),
    video: get(rawData, 'primary.video_url.url'),
  };

  return (
    <Header>
      <VideoWrapper>
        <Video src={data.video} autoPlay loop muted />
      </VideoWrapper>

      <div>
        <Heading>{data.title}</Heading>
        <Input type="text" placeholder="Postcode" /> <Button type="button" variant="primary">{data.cta_text}</Button>
      </div>
    </Header>
  );
};

export default HomeHero;
