import React, { useState } from 'react';
import Link from 'next/link';
import Headroom from 'react-headroom';
import styled from 'styled-components';
import { space } from 'styled-system';
import { transparentize, tint } from 'polished';
import ScrollLock from 'react-scrolllock';
import HamburgerIcon from '../public/images/hamburger.svg';
import { TOP_NAVIGATION } from '../constants/navigation';

import ActiveLink from './active-link';
import { Logo, LogoLink } from './logo';
import Button from './button';

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

const Wrapper = styled(Headroom)`
  position: relative;
  z-index: 5;
`;

const Header = styled.header`
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.box};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: row;
  height: 60px;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.space.gutter._};

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    height: 50px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const List = styled.ul`
  align-items: center;
  display: flex;
  flex-direction: row;
  list-style-type: none;
  padding-left: 0;

  a {
    text-decoration: none;
  }

  span {
    &.active {
      color: ${({ theme }) => theme.colors.primary};

      @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
        font-weight: 700;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    background: ${({ theme }) => transparentize(0.1, theme.colors.primary)};
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    height: 100vh;
    margin: 0;
    position: absolute;
    left: 0;
    top: 0;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s;
    width: 100%;
    padding: 0 ${({ theme }) => theme.space[4]};
  }
`;

const Item = styled.li`
  ${space}

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    padding-left: 0;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.space[4]};

    button {
      width: 100%;
    }
  }
`;

const NavItem = styled.span`
  color: ${({ theme }) => theme.colors.greyDark};
  font-weight: bold;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius[0]};
    color: ${({ theme }) => theme.colors.darkBlue};
    display: block;
    font-weight: normal;
    padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
    text-align: center;

    &:hover {
      background: ${({ theme }) => tint(0.9, theme.colors.primary)};
    }
  }
`;

const Hamburger = styled(HamburgerIcon)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    color: ${({ open, theme }) => (open ? theme.colors.white : theme.colors.primary)};
    cursor: pointer;
    display: block;
    z-index: 5;
  }
`;

function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <Wrapper>
      <Header>
        <Link href="/" passHref>
          <LogoLink onClick={() => setOpen(false)}>
            <>
              <Logo src={logo} alt="Quidditch UK" white={open} />
              <Logo src={logoText} alt="Quidditch UK" white={open} />
            </>
          </LogoLink>
        </Link>

        <Nav>
          <List open={open}>
            {TOP_NAVIGATION.map((item) => (
              <Item key={item.link} pl={8}>
                <ActiveLink href={item.link}>
                  <NavItem onClick={() => setOpen(false)}>{item.label}</NavItem>
                </ActiveLink>
              </Item>
            ))}

            <Item pl={8}><Button type="button" variant={{ _: 'secondary', l: 'primary' }}>Find Quidditch</Button></Item>
            <Item pl={4}><Button type="button" variant="light">Sign in</Button></Item>
            <ScrollLock isActive={open} />
          </List>
          <Hamburger
            open={open}
            aria-hidden="true"
            onClick={() => setOpen(!open)}
          />
        </Nav>
      </Header>
    </Wrapper>
  );
}

export default Navigation;
