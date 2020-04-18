import React from 'react';

import withShell from '../../components/shell';
import LatestNews from '../../components/latest-news';

import Layout from '../../containers/layout';
import Meta from '../../components/meta';

const Page = () => (
  <Layout>
    <Meta />
    <LatestNews count={18} />
  </Layout>
);

export default withShell(Page);
