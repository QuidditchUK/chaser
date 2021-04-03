import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import { cardVariants } from 'components/prismic-wrapper';
import dynamic from 'next/dynamic';

import { Flex, Heading, Box } from '@chakra-ui/react';

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));
const Card = dynamic(() => import('components/card'));
const Image = dynamic(() => import('components/image'));
const HorizontalScrollWrapper = dynamic(() =>
  import('components/horizontal-scroll-wrapper')
);
const StyledLink = dynamic(() =>
  import('components/latest-news').then(({ StyledLink }) => StyledLink)
);

import { linkResolver } from 'modules/prismic';

const CardsSlice = (rawData) => {
  const title = get(rawData, 'primary.title');
  const content = get(rawData, 'primary.content');
  const variant = get(rawData, 'primary.variant');
  const items = get(rawData, 'items') || [];
  const horizontalScroll = get(rawData, 'primary.horizontalScroll');

  return (
    <PrismicWrapper
      variant={variant}
      px={horizontalScroll ? { base: 0, md: 9 } : { base: 4, sm: 8, md: 9 }}
    >
      {RichText.asText(title) && (
        <Heading
          as="h2"
          mt={2}
          textAlign="center"
          px={horizontalScroll ? { base: 4, sm: 8, md: 9 } : { base: 0, md: 9 }}
        >
          {RichText.asText(title)}
        </Heading>
      )}

      {content && (
        <Box
          textAlign="center"
          pb={3}
          px={horizontalScroll ? { base: 4, sm: 8, md: 9 } : { base: 0, md: 9 }}
        >
          {RichText.render(content, linkResolver)}
        </Box>
      )}

      <HorizontalScrollWrapper
        horizontalScroll={horizontalScroll}
        itemsCount={items?.length}
      >
        {items.map((item, i) => {
          const title = get(item, 'title');
          const content = get(item, 'content');
          const image = get(item, 'image');
          const link = get(item, 'link');

          return (
            <Flex flexDirection="column" key={`cards-${i}`}>
              {Link.url(link, linkResolver) ? (
                <StyledLink
                  href={Link.url(link, linkResolver)}
                  target={link.target}
                  aria-label={title}
                >
                  <Card
                    name={title}
                    content={content}
                    variant={cardVariants[variant]}
                    image={
                      image.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt}
                          layout="responsive"
                          width={640}
                          height={360}
                          borderRadius="0px"
                        />
                      ) : null
                    }
                  />
                </StyledLink>
              ) : (
                <Card
                  name={title}
                  content={content}
                  image={
                    image.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt}
                        layout="responsive"
                        width={640}
                        height={360}
                        borderRadius="0px"
                      />
                    ) : null
                  }
                />
              )}
            </Flex>
          );
        })}
      </HorizontalScrollWrapper>
    </PrismicWrapper>
  );
};

export default CardsSlice;
