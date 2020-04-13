import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const LogoLink = styled(Link)`
  height: 45px;


  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 35px;
  }
`;

export const Logo = styled.img`
  height: 45px;


  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 35px;
  }
`;
