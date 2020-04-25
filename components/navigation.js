import React, { useState } from 'react';
import Link from 'next/link';
import Headroom from 'react-headroom';
import styled from 'styled-components';
import { space } from 'styled-system';
import { transparentize, tint, rgba } from 'polished';
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
  z-index: ${({ open }) => (open ? 7 : 5)};
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

  li {
    cursor: pointer;
  }

  ul {
    display: none;
  }

  li:hover > ul, 
  li:focus > ul,
  li ul:focus {
    border-top: 25px solid ${rgba(0, 0, 0, 0)};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: absolute;
    top: 35px;
    z-index: 15;

    li {
      background: ${({ theme }) => theme.colors.white};
      box-shadow: 0 10px 0.625rem rgba(0,0,0,0.3);
      width: 100%;

      a {         
        color: ${({ theme }) => theme.colors.greyDark};
        display: block;
        width: 100%;

        &:hover {
          color: ${({ theme }) => theme.colors.white};
        }
      }

      span {
        color: inherit;
        display: block;
        padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
        width: 100%;

        &:hover {
          color: ${({ theme }) => theme.colors.white};
        }

        &.active {
          background: ${({ theme }) => theme.colors.primary};
          color: ${({ theme }) => theme.colors.white};
        }
      }

      &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.white};
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    background: ${({ theme }) => transparentize(0.1, theme.colors.primary)};
    display: ${({ testingtest }) => (testingtest ? 'flex' : 'flex')};
    flex-direction: column;
    flex-wrap: wrap;
    left: 0;
    justify-content: center;
    height: 100vh;
    margin: 0;
    padding: 0 ${({ theme }) => theme.space[4]};
    position: absolute;
    top: 0;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s;
    width: 100%;
    
    li > ul,
    ul,
    li:hover > ul, 
    li:focus > ul,
    li ul:focus {
      background: unset;
      border-top: 0;
      display: block;
      margin: initial;
      max-height: 0;
      overflow: hidden;
      padding: initial;
      position: initial;
      transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
      transition: max-height 0.3s;

      li {
        box-shadow: none;
        display: flex;
        margin: ${({ theme }) => theme.space[3]} auto;
        width: 100%;

        a {
          width: 100%;

          &:hover {
            color: ${({ theme }) => theme.colors.primary};
          }
        }

        span {
          background: ${({ theme }) => tint(0.7, theme.colors.primary)};
          display: block;
          padding: ${({ theme }) => theme.space[2]} 0;

          &.active {
            background: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.white};

            &:hover {
              color: ${({ theme }) => theme.colors.white};
            }
          }

          &:hover {
            color: ${({ theme }) => theme.colors.primary};
          }
        }
      }

      &.dropdown, .dropdown:hover {
        height: auto;
        max-height: 200px;
      }
    }
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
  const [navigationToggle, setNavigationToggle] = useState(10);

  return (
    <Wrapper open={open}>
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
            {TOP_NAVIGATION.map((item, i) => (
              <Item key={item.label} pl={8}>
                {item.list
                  ? (
                    <>
                      <NavItem onClick={() => setNavigationToggle(navigationToggle === i ? 10 : i)}>{item.label}</NavItem>
                    </>
                  )
                  : (
                    <ActiveLink href={item.href} as={item.as} passHref>
                      <NavItem onClick={() => setOpen(false)}>{item.label}</NavItem>
                    </ActiveLink>
                  )}


                {item.list && (
                  <List className={`${navigationToggle === i ? 'dropdown' : ''}`}>
                    {item.list.map((subItem) => (
                      <Item key={subItem.href}>
                        <ActiveLink href={subItem.href} as={item.as} passHref>
                          <NavItem onClick={() => setOpen(false)}>{subItem.label}</NavItem>
                        </ActiveLink>
                      </Item>
                    ))}
                  </List>
                )}
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
