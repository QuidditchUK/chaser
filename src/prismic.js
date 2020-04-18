import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { useParams } from 'react-router-dom';
import { usePrismicFetch, usePrismicMeta } from './hooks';
import renderPrismicSections from './constants/prismic';
import metadataUpdate from './actions/metadata';

function Prismic({
  metadataUpdate: setMetadata,
}) {
  const { uid = 'home' } = useParams();
  const [page, loadingPageData] = usePrismicFetch('pages', uid);

  usePrismicMeta(setMetadata, page.data);

  return (
    <>
      {loadingPageData
        ? <Skeleton count={5} />
        : <>{renderPrismicSections(page.data.body)}</>}
    </>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ metadataUpdate }, dispatch);

Prismic.propTypes = {
  metadataUpdate: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Prismic);
