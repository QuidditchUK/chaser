import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Headroom from 'react-headroom';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import styled from 'styled-components';
import { space } from 'styled-system';
import { transparentize, tint } from 'polished';

import logo from '../images/logo.png';
import { ReactComponent as HamburgerIcon } from '../images/hamburger.svg';
import { getTopNavigation } from '../modules/prismic';

import { Logo, LogoLink } from './logo';
import Button from './button';

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

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 50px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const List = styled.ul`
  align-items: center;
  display: flex;
  flex-direction: row;
  list-style-type: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    background: ${({ open, theme }) => (open ? transparentize(0.1, theme.colors.primary) : 'none')};
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    height: 100vh;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s;
    width: 100%;
  }
`;

const Item = styled.li`
  ${space}

    @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
      padding-bottom: ${({ theme }) => theme.space[4]};

      button {
        background: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.primary};

        &:hover {
          background: ${({ theme }) => tint(0.9, theme.colors.primary)};
        }
      }
    }
`;

const Hamburger = styled(HamburgerIcon)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    color: ${({ open, theme }) => (open ? theme.colors.white : theme.colors.primary)};
    cursor: pointer;
    display: block;
    z-index: 5;
  }
`;

function Navigation() {
  const [navigation, setNavigation] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopNavigation();
      setNavigation(data);
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <Header>
        <LogoLink to="/"><Logo src={logo} alt="Quidditch UK" /></LogoLink>

        <Nav>
          <List open={open}>
            {navigation.map((item) => (
              <Item key={item.uid} pl={4}>
                <NavLink to={item.uid} activeClassName="selected" onClick={() => setOpen(false)}>
                  {RichText.asText(get(item, 'data.title'))}
                </NavLink>
              </Item>
            ))}

            <Item pl={4}><Button type="button" variant="primary">Find Quidditch</Button></Item>
            <Item pl={4}><Button type="button" variant="light">Sign in</Button></Item>
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
