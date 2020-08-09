import Prismic from 'prismic-javascript';
import { Client, linkResolver } from 'modules/prismic';
import { api } from 'modules/api';

const getPages = async (page, documents = []) => {
  const res = await Client().query(Prismic.Predicates.any('document.type', ['pages', 'post', 'volunteer', 'about', 'play', 'programmes']), { page, pageSize: 100, fetch: [] });
  if (res.next_page !== null) {
    return getPages(page + 1, documents.concat(res.results));
  }

  return documents.concat(res.results);
};

const createSitemap = ({ documents, clubs, events }) => `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${clubs.map((club) => `
      <url>
        <loc>https://quidditchuk.org/clubs/${club.slug}</loc>
        <lastmod>${club.updated}</lastmod>
      </url>
    `).join('')}

    ${events.map((event) => `
      <url>
        <loc>https://quidditchuk.org/events/${event.slug}</loc>
        <lastmod>${event.updated}</lastmod>
      </url>
    `).join('')}
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
  const { data: clubs } = await api.get('/clubs/search');
  const { data: events } = await api.get('/events/search');

  res.setHeader('Content-Type', 'text/xml');
  res.write(createSitemap({ documents, clubs, events }));
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
