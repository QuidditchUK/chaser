import React from 'react';

import LatestNews from '../../components/latest-news';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';

const Page = () => (
  <Layout>
    <Meta />
    <LatestNews count={18} />
  </Layout>
);

export default Page;
