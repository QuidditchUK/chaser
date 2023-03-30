import * as prismicH from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import dynamic from 'next/dynamic';
import { Box, Grid, Heading } from '@chakra-ui/react';

const Slice = dynamic(() => import('components/shared/slice'));
const Content = dynamic(() => import('components/shared/content'));

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

const EmbedSlice = ({ slice }) => {
  const { primary, items } = slice;
  const { title, content, variant, size = 'sm' } = primary;

  return (
    <Slice variant={variant} size={size}>
      {prismicH.asText(title) && (
        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl' }}
          mt={2}
          textAlign="center"
        >
          {prismicH.asText(title)}
        </Heading>
      )}

      {content && (
        <Content textAlign="center" pb={3}>
          <PrismicRichText field={content} linkResolver={linkResolver} />
        </Content>
      )}

      <Grid
        gridTemplateColumns={{
          base: '1fr',
          md: `${size === 'md' ? '1fr 1fr' : '1fr'}`,
        }}
        gridGap={{ base: 4, md: 9 }}
      >
        {items.map((item, i) => {
          return (
            <Item
              key={`embed-slice-${i}`}
              embed={item?.embed}
              support={item?.support}
            />
          );
        })}
      </Grid>
    </Slice>
  );
};

export default EmbedSlice;
