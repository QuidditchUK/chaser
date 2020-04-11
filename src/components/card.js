import React from 'react';
import styled from 'styled-components';
import { space, variant } from 'styled-system';
import { rem } from '../styles/theme';

const variants = (theme) => ({
  light: {
    bg: theme.colors.white,
    color: theme.colors.primary,
  },
  primary: {
    bg: theme.colors.primary,
    color: theme.colors.white,
  },
  secondary: {
    bg: theme.colors.secondary,
    color: theme.colors.white,
  },
  dark: {
    bg: theme.colors.black,
    color: theme.colors.white,
  },
});

const Card = styled.article`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius[1]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.125s;

  ${({ theme }) => variant({ variants: variants(theme) })};
  ${space};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.box};
  }
`;

const Image = styled.div`
  position: relative;
  z-index: 2;
`;

const Content = styled.div`
  padding: 0 ${({ theme }) => theme.space[4]};
`;

const Name = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.headingCard};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.greyMedium};
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  line-height: ${rem(18)};
  max-height: ${rem(36)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default ({
  image,
  name,
  description,
  ...cardProps
}) => (
  <Card {...cardProps}>
    <Image>{image}</Image>
    <Content>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </Content>
  </Card>
);
