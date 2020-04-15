import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, variant } from 'styled-system';
import Heading from './heading';
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
    bg: theme.colors.darkBlue,
    color: theme.colors.white,
  },
});

const StyledCard = styled.article`
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

const Description = styled.p`
  color: ${({ theme }) => theme.colors.greyMedium};
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  line-height: ${rem(18)};
  max-height: ${rem(36)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Card = ({
  image,
  name,
  description,
  ...cardProps
}) => (
  <StyledCard {...cardProps}>
    <Image>{image}</Image>
    <Content>
      <Heading as="h2" fontSize={3}>{name}</Heading>
      <Description>{description}</Description>
    </Content>
  </StyledCard>
);

Card.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.shape({}).isRequired,
};

export default Card;
