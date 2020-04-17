import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { usePrismicFetch } from './hooks';
import renderPrismicSections from './constants/prismic';
import BlogHero from './components/blog-hero';

function Prismic() {
  const { uid = 'home' } = useParams();
  const [page, loadingPageData] = usePrismicFetch('post', uid);

  return (
    <>
      {loadingPageData
        ? <Skeleton count={5} />
        : (
          <article>
            <BlogHero {...page.data} />
            {renderPrismicSections(page.data.body)}
          </article>
        )}
    </>
  );
}

export default Prismic;
