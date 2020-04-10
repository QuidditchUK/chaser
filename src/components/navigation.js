import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Headroom from 'react-headroom';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { getTopNavigation } from '../modules/prismic';
import Button from './button';

const RedButton = styled(Button)`
  background: ${({ theme }) => theme.colors.red};
  border: ${({ theme }) => theme.radius[0]} solid ${({ theme }) => theme.colors.red}
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
    <Headroom>
      <div className="headroom">
        <div className="container">
          <Link to="/"><img src={logo} alt="Quidditch UK" className="logo" /></Link>

          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.uid}>
                  <NavLink to={item.uid} activeClassName="selected">
                    {RichText.asText(get(item, 'data.title'))}
                  </NavLink>
                </li>
              ))}

              <li><RedButton type="button">Sign in</RedButton></li>
            </ul>
          </nav>
        </div>
      </div>
    </Headroom>
  );
}

export default Navigation;
