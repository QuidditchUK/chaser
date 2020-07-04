import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Navigation from 'components/navigation';
import Footer from 'components/footer';

const Layout = ({ children }) => {
  const { asPath } = useRouter();
  const dashboard = RegExp(/\/dashboard/, 'g').test(asPath);

  return (
    <>
      <Navigation dashboard={dashboard} />
      {children}
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
