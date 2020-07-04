import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Navigation from 'components/navigation';
import Footer from 'components/footer';

const Layout = ({ loggedIn, children }) => {
  const { asPath } = useRouter();
  const dashboard = RegExp(/\/dashboard/, 'g').test(asPath);

  return (
    <>
      <Navigation dashboard={dashboard} loggedIn={loggedIn} />
      {children}
      <Footer />
    </>
  );
};

Layout.defaultProps = {
  loggedIn: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  loggedIn: PropTypes.bool,
};

export default Layout;
