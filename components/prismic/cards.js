import { PrismicRichText, PrismicText } from '@prismicio/react';
import * as prismicH from '@prismicio/helpers';
import { cardVariants } from 'components/shared/slice';
import dynamic from 'next/dynamic';

import { Flex, Heading, Box } from '@chakra-ui/react';

const Slice = dynamic(() => import('components/shared/slice'));
const Card = dynamic(() => import('components/shared/card'));
const HorizontalScrollWrapper = dynamic(() =>
  import('components/shared/horizontal-scroll-wrapper')
);

import { linkResolver } from 'modules/prismic';

const CardsSlice = ({ slice }) => {
  const { primary = {}, items = [] } = slice;
  const { title, content, variant, horizontalScroll } = primary;

  return (
    <Slice
      variant={variant}
      px={horizontalScroll ? { base: 0, md: 9 } : { base: 4, sm: 8, md: 9 }}
    >
      {prismicH.asText(title) && (
        <Heading
          as="h2"
          mt={2}
          textAlign="center"
          fontSize={{ base: '2xl', md: '3xl' }}
          px={horizontalScroll ? { base: 4, sm: 8, md: 9 } : { base: 0, md: 9 }}
        >
          <PrismicText field={title} />
        </Heading>
      )}

      {content && (
        <Box
          textAlign="center"
          pb={3}
          px={horizontalScroll ? { base: 4, sm: 8, md: 9 } : { base: 0, md: 9 }}
        >
          <PrismicRichText field={content} />
        </Box>
      )}

      <HorizontalScrollWrapper
        horizontalScroll={horizontalScroll}
        itemsCount={items?.length}
      >
        {items.map((item, i) => {
          const { title, content, image, link } = item;

          const linkProps = prismicH.asLink(link, linkResolver)
            ? {
                href: prismicH.asLink(link, linkResolver),
                target: link.target,
                ariaLabel: title,
                ...(link.target === '_blank' && {
                  rel: 'noopener noreferrer',
                }),
              }
            : null;

          return (
            <Flex
              flexDirection="column"
              key={`cards-${i}-${item?.title}-${item?.content}`}
            >
              <Card
                {...linkProps}
                title={title}
                content={content}
                variant={cardVariants[variant]}
                image={{
                  src: image.url,
                  alt: image.alt,
                  height: image.height,
                  width: image.width,
                }}
              />
            </Flex>
          );
        })}
      </HorizontalScrollWrapper>
    </Slice>
  );
};

export default CardsSlice;
