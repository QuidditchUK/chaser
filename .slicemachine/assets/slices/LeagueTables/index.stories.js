import MyComponent from '../../../../slices/LeagueTables';

export default {
  title: 'slices/LeagueTables',
};

export const _Default = () => (
  <MyComponent
    slice={{
      variation: 'default',
      version: 'sktwi1xtmkfgx8626',
      items: [
        {
          table: {
            id: 'mock_document_id',
            link_type: 'Document',
            type: 'league_table',
            tags: [],
            lang: 'en-us',
            slug: null,
            first_publication_date: '1970-01-01T00:00:01+0000',
            last_publication_date: '1970-01-01T01:00:00+0000',
          },
        },
      ],
      primary: {
        title: 'QuadballUK Community League',
        content: [
          {
            type: 'paragraph',
            text: 'Nostrud consequat ullamco incididunt qui consequat consectetur.',
            spans: [],
          },
        ],
        variant: 'primary',
      },
      slice_type: 'league_table',
      id: '_Default',
    }}
  />
);
_Default.storyName = '';
