import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Navigation from 'components/navigation';
import Footer from 'components/footer';
import Alert from 'components/alert';

const Layout = ({ children, preview }) => {
  const { asPath } = useRouter();
  const dashboard = RegExp(/\/dashboard/, 'g').test(asPath);

  return (
    <>
      {preview && (
        <Alert>
          <span>This page is a preview. <a href="/api/exit-preview">Click here</a> to exit preview mode.</span>
        </Alert>
      )}

      <Navigation dashboard={dashboard} />
      {children}
      <Footer />
    </>
  );
};

Layout.defaultProps = {
  preview: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  preview: PropTypes.bool,
};

export default Layout;
