import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';

import { Flex, Heading, Box } from '@chakra-ui/react';
import Card from 'components/card';
import Image from 'components/image';
import HorizontalScrollWrapper from 'components/horizontal-scroll-wrapper';
import { StyledLink } from 'components/latest-news';

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
                    image={
                      image.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={1600}
                          height={900}
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
                        width={1600}
                        height={900}
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
