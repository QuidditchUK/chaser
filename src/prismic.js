import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { usePrismicFetch } from './hooks';
import renderPrismicSections from './containers/prismic';

function Prismic() {
  const { uid = 'home' } = useParams();
  const [page, loadingPageData] = usePrismicFetch('pages', uid);

  return (
    <>
      {loadingPageData
        ? <Skeleton count={5} />
        : <>{renderPrismicSections(page.data.body)}</>}
    </>
  );
}

export default Prismic;
