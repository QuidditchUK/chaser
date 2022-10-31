import * as prismic from '@prismicio/client';
import { client, linkResolver } from 'modules/prismic';

const getPages = async (page, documents = []) => {
  const res = await client().get({
    predicates: prismic.predicates.any('document.type', [
      'pages',
      'post',
      'volunteer',
      'about',
      'play',
      'programmes',
      'clubs',
      'youth',
      'events',
    ]),
    page,
    pageSize: 100,
    fetch: [],
  });
  if (res.next_page !== null) {
    return getPages(page + 1, documents.concat(res.results));
  }

  return documents.concat(res.results);
};

const createSitemap = ({ documents }) => `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${documents
      .map(
        (document) => `
      <url>
        <loc>https://quadballuk.org${linkResolver(document)}</loc>
        <lastmod>${new Date(
          document.last_publication_date
        ).toISOString()}</lastmod>
      </url>
    `
      )
      .join('')}
  </urlset>
`;

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const documents = await getPages(1, []);

  res.setHeader('Content-Type', 'text/xml');
  res.write(createSitemap({ documents }));
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
