import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

const Layout = ({ dashboard, children }) => (
  <>
    <Navigation dashboard={dashboard} />
    {children}
    <Footer />
  </>
);

Layout.defaultProps = {
  dashboard: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  dashboard: PropTypes.bool,
};

export default Layout;
