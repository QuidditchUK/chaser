import React from 'react';
import PropTypes from 'prop-types';
import Headroom from 'react-headroom';

function Header() {
  return (
    <Headroom>
      <div className="headroom">
        <div className="container">
          <img src="quk-logo.png" alt="Quidditch UK" className="logo" />
        </div>
      </div>
    </Headroom>
  );
}

Header.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

export default Header;
