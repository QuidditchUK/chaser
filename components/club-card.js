import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, typography, color } from 'styled-system';
import Heading from './heading';
import { rem } from '../styles/theme';

const TYPES = {
  University: 'keeperGreen',
  Community: 'northernMagenta',
};

const StyledCard = styled.article`
  border-radius: ${({ theme }) => theme.radius[1]};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.125s;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  
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

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Type = styled.span`
  ${typography};
  ${color};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.radius[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

const ClubCard = ({
  image,
  name,
  type,
  venue,
  ...cardProps
}) => (
  <StyledCard {...cardProps}>
    {image ? (<Image>{image}</Image>) : null}

    <Content>
      <Type fontWeight="bold" fontSize={(rem(10))} bg={TYPES[type]}>{type}</Type>
      <Heading as="h2" fontSize={3} isBody>{name}</Heading>
      <p>{venue}</p>
    </Content>
  </StyledCard>
);

ClubCard.defaultProps = {
  name: null,
  type: null,
  image: null,
  venue: null,
};

ClubCard.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  venue: PropTypes.string,
  image: PropTypes.shape({}),
};

export default ClubCard;
