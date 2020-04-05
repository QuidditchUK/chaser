import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';

function Shell({
  location,
  children,
}) {
  return (
    <>
      <Header location={location} />
      {children}
    </>
  );
}

Shell.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  children: PropTypes.node.isRequired,
};

export default Shell;
