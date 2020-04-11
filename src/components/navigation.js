import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Headroom from 'react-headroom';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';

import logo from '../images/logo.png';
import { getTopNavigation } from '../modules/prismic';
import Button from './button';

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

              <li><Button type="button" variant="primary">Find Quidditch</Button></li>
              <li><Button type="button" variant="light">Sign in</Button></li>
            </ul>
          </nav>
        </div>
      </div>
    </Headroom>
  );
}

export default Navigation;
