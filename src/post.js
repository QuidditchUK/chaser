import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import { usePrismicFetch, usePrismicMeta } from './hooks';
import renderPrismicSections from './constants/prismic';
import BlogHero from './components/blog-hero';
import BlogSupport from './components/blog-support';
import metadataUpdate from './actions/metadata';

function Prismic({
  metadataUpdate: setMetadata,
}) {
  const { uid = 'home' } = useParams();
  const [page, loadingPageData] = usePrismicFetch('post', uid);

  usePrismicMeta(setMetadata, page.data);

  return (
    <>
      {loadingPageData
        ? <Skeleton count={5} />
        : (
          <article>
            <BlogHero {...page.data} />
            {renderPrismicSections(page.data.body)}
            <BlogSupport {...page.data} />
          </article>
        )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ metadataUpdate }, dispatch);

Prismic.propTypes = {
  metadataUpdate: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Prismic);
