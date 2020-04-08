import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './navigation';

function Shell({ children }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

Shell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Shell;
