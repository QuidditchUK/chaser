import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './navigation';
import Footer from './footer';

function Shell({ children }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

Shell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Shell;
