import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Headroom from 'react-headroom';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import styled from 'styled-components';
import { space } from 'styled-system';

import logo from '../images/logo.png';
import { getTopNavigation } from '../modules/prismic';
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

const List = styled.ul`
  align-items: center;
  display: flex;
  flex-direction: row;
  list-style-type: none;
`;

const Item = styled.li`
  ${space}
`;

const LogoLink = styled(Link)`
  height: 45px;


  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 35px;
  }
`;

const Logo = styled.img`
  height: 45px;


  @media (max-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 35px;
  }
`;

function Navigation() {
  const [navigation, setNavigation] = useState([]);

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

        <nav>
          <List>
            {navigation.map((item) => (
              <Item key={item.uid} pl={4}>
                <NavLink to={item.uid} activeClassName="selected">
                  {RichText.asText(get(item, 'data.title'))}
                </NavLink>
              </Item>
            ))}

            <Item pl={4}><Button type="button" variant="primary">Find Quidditch</Button></Item>
            <Item pl={4}><Button type="button" variant="light">Sign in</Button></Item>
          </List>
        </nav>
      </Header>
    </Wrapper>
  );
}

export default Navigation;
