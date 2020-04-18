import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import metadataUpdate from '../actions/metadata';
import Meta from './meta';
import Navigation from './navigation';
import Footer from './footer';

import { usePageView } from '../hooks';

function Shell({
  children,
  metadataUpdate: setMetadata,
}) {
  usePageView(setMetadata);

  return (
    <>
      <Meta />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

Shell.propTypes = {
  children: PropTypes.node.isRequired,
  metadataUpdate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ metadataUpdate }, dispatch);

export default connect(null, mapDispatchToProps)(Shell);
