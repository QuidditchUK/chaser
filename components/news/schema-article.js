import Head from 'next/head';
import formatISO from 'date-fns/formatISO';
import parseJSON from 'date-fns/parseJSON';

const SchemaArticle = ({ page }) => {
  const { data, first_publication_date, last_publication_date } = page;
  const { image } = data;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: data?.title,
            image: image?.url,
            datePublished: first_publication_date
              ? formatISO(parseJSON(first_publication_date))
              : null,
            dateModified: last_publication_date
              ? formatISO(parseJSON(last_publication_date))
              : null,
          }),
        }}
      />
    </Head>
  );
};

export default SchemaArticle;
