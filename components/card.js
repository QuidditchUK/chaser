import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, variant, typography } from 'styled-system';
import { RichText } from 'prismic-reactjs';
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
  background: ${({ theme }) => theme.categoryColors[Math.floor((Math.random() * theme.categoryColors.length))]};
  border-radius: ${({ theme }) => theme.radius[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

const Card = ({
  image,
  name,
  category,
  content,
  ...cardProps
}) => (
  <StyledCard {...cardProps}>
    <Image>{image}</Image>

    <Content>
      {category && <Category fontWeight="bold" fontSize={(rem(10))}>{category}</Category>}
      {name && <Heading as="h2" fontSize={3} isBody>{name}</Heading>}
      {content && <Content>{RichText.render(content)}</Content>}
    </Content>
  </StyledCard>
);

Card.defaultProps = {
  category: null,
  content: null,
  name: null,
};

Card.propTypes = {
  name: PropTypes.string,
  category: PropTypes.string,
  image: PropTypes.shape({}).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Card;
