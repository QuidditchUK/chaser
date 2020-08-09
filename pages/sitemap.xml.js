import Prismic from 'prismic-javascript';
import { Client, linkResolver } from 'modules/prismic';

const getPages = async (page, documents = []) => {
  const res = await Client().query(Prismic.Predicates.any('document.type', ['pages', 'post', 'volunteer', 'about', 'play', 'programmes']), { page, pageSize: 100, fetch: [] });
  if (res.next_page !== null) {
    return getPages(page + 1, documents.concat(res.results));
  }

  return documents.concat(res.results);
};

const createSitemap = (documents) => `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${documents.map((document) => `
      <url>
        <loc>https://quidditchuk.org${linkResolver(document)}</loc>
        <lastmod>${new Date(document.last_publication_date).toISOString()}</lastmod>
      </url>
    `).join('')}
  </urlset>
`;

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const documents = await getPages(1, []);

  res.setHeader('Content-Type', 'text/xml');
  res.write(createSitemap(documents));
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;