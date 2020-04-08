import React from 'react';
import Headroom from 'react-headroom';
import logo from '../images/logo.png';

function Header() {
  return (
    <Headroom>
      <div className="headroom">
        <div className="container">
          <img src={logo} alt="Quidditch UK" className="logo" />
        </div>
      </div>
    </Headroom>
  );
}

export default Header;
