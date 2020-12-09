import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useCapeMode from 'hooks/useCapeMode';

const Navigation = dynamic(() => import('components/navigation'));
const Footer = dynamic(() => import('components/footer'));
const Alert = dynamic(() => import('components/alert'));
const Cape = dynamic(() => import('components/cape'));

const Layout = ({ children, preview }) => {
  const { asPath } = useRouter();
  const dashboard = RegExp(/\/dashboard/, 'g').test(asPath);
  const [theme] = useCapeMode();

  return (
    <>
      {preview && (
        <Alert>
          <span>This page is a preview. <a href="/api/exit-preview">Click here</a> to exit preview mode.</span>
        </Alert>
      )}

      {theme === 'cape' && (<Cape />)}

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
