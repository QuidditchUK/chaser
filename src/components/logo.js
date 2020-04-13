import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const LogoLink = styled(Link)`
  height: 45px;
  z-index: 5;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 35px;
  }
`;

export const Logo = styled.img`
  height: 45px;
  filter: ${({ white }) => (white ? 'brightness(0) invert(1);' : 'inherit;')};

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 35px;
  }
`;
