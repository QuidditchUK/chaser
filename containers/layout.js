import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

const Layout = ({ children }) => (
  <>
    <Navigation />
    {children}
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
