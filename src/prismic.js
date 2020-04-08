import React from 'react';
import { useParams } from 'react-router-dom';
import { usePrismicFetch } from './hooks';
import renderPrismicSections from './containers/prismic';

function Prismic() {
  const { uid } = useParams();
  const [page, loadingPageData] = usePrismicFetch('pages', uid);

  return (
    <>
      {loadingPageData
        ? <> Loading...</>
        : <>{renderPrismicSections(page.data.body)}</>}
    </>
  );
}

export default Prismic;
