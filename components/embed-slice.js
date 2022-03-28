import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import dynamic from 'next/dynamic';
import { Box, Grid, Heading } from '@chakra-ui/react';

const Slice = dynamic(() => import('components/slice'));
const Content = dynamic(() => import('components/content'));

import { linkResolver } from 'modules/prismic';

export const Embed = ({ embed }) => {
  let url = null;

  // Oh, you better believe that is a-hackin'
  if (embed.provider_name === 'YouTube') {
    [url] = embed.html.split('src="')[1].split('"');
  }

  if (embed.provider_name === 'Facebook') {
    const timestamp = embed.href.split('t=')[1];
    url = `https://www.facebook.com/plugins/video.php?height=314&show_text=false&width=560&href=${
      embed.href
    }${timestamp ? `&t=${timestamp}` : ''}`;
  }

  return (
    <>
      {url ? (
        <Box position="relative" width="100%" pb="56.25%">
          <Box
            as="iframe"
            position="absolute"
            borderRadius="md"
            top="0"
            left="0"
            width="100%"
            height="100%"
            border="0"
            src={url}
            frameBorder="0"
            allowFullScreen
          />
        </Box>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: embed.html }} />
      )}
    </>
  );
};

export const Item = ({ embed, support }) => (
  <Box>
    <Embed embed={embed} />

    {support && (
      <Box textAlign="center" pt={2} fontStyle="italic">
        {support}
      </Box>
    )}
  </Box>
);

const EmbedSlice = (rawData) => {
  const title = get(rawData, 'primary.title');
  const content = get(rawData, 'primary.content');
  const items = get(rawData, 'items');
  const variant = get(rawData, 'primary.variant');

  const multipleEmbeds = items.length > 1;

  return (
    <Slice variant={variant} size={multipleEmbeds ? 'md' : 'sm'}>
      {RichText.asText(title) && (
        <Heading as="h2" fontSize="xl" mt={2} textAlign="center">
          {RichText.asText(title)}
        </Heading>
      )}

      {content && (
        <Content textAlign="center" pb={3}>
          <RichText render={content} linkResolver={linkResolver} />
        </Content>
      )}

      <Grid
        gridTemplateColumns={{
          base: '1fr',
          md: `${multipleEmbeds ? '1fr 1fr' : '1fr'}`,
        }}
        gridGap={{ base: 4, md: 9 }}
      >
        {items.map((itemData, i) => {
          const embed = get(itemData, 'embed');
          const support = get(itemData, 'support');

          return (
            <Item key={`embed-slice-${i}`} embed={embed} support={support} />
          );
        })}
      </Grid>
    </Slice>
  );
};

export default EmbedSlice;
