import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, variant, typography } from 'styled-system';
import Heading from './heading';

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
  flex-grow: 1;
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
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};
`;

const Category = styled.span`
  ${typography};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius[1]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
`;

export const Card = ({
  image,
  name,
  category,
  ...cardProps
}) => (
  <StyledCard {...cardProps}>
    <Image>{image}</Image>
    <Content>
      <Category fontWeight="bold" fontSize={1}>{category}</Category>
      <Heading as="h2" fontSize={3}>{name}</Heading>

    </Content>
  </StyledCard>
);

Card.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  image: PropTypes.shape({}).isRequired,
};

export default Card;
