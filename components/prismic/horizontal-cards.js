import dynamic from 'next/dynamic';
import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import { cardVariants } from 'components/shared/slice';

import { Heading, Flex } from '@chakra-ui/react';
import { linkResolver } from 'modules/prismic';

const HorizontalCard = dynamic(() =>
  import('components/shared/horizontal-card')
);
const Slice = dynamic(() => import('components/shared/slice'));
const Content = dynamic(() => import('components/shared/content'));

const HorizontalCardsSlice = (rawData) => {
  const title = get(rawData, 'primary.title');
  const content = get(rawData, 'primary.content');
  const variant = get(rawData, 'primary.variant');
  const items = get(rawData, 'items');

  return (
    <Slice variant={variant} px={{ base: 4, sm: 8, md: 9 }}>
      {RichText.asText(title) && (
        <Heading
          as="h2"
          mt={2}
          textAlign="center"
          px={{ base: 4, sm: 8, md: 9 }}
        >
          {RichText.asText(title)}
        </Heading>
      )}

      {content && (
        <Content textAlign="center" pb={3} px={{ base: 4, sm: 8, md: 9 }}>
          {RichText.render(content, linkResolver)}
        </Content>
      )}

      {items.map(({ title, content, image, layout_content, link }, i) => {
        const linkProps = Link.url(link, linkResolver)
          ? {
              href: Link.url(link, linkResolver),
              target: link.target,
              ariaLabel: title,
              ...(link.target === '_blank' && {
                rel: 'noopener noreferrer',
              }),
            }
          : null;

        const isImageLeft = layout_content === 'image-left';

        return (
          <Flex
            flexDirection="column"
            key={`horizontal-cards-${i}-${title}-${content}`}
            mb={5}
            px={{ base: 4, sm: 8, md: 0 }}
          >
            <HorizontalCard
              {...linkProps}
              aria-label={title}
              title={title}
              content={content}
              variant={cardVariants[variant]}
              image={{
                src: image.url,
                alt: image.alt,
                height: image.height,
                width: image.width,
              }}
              isImageLeft={isImageLeft}
            />
          </Flex>
        );
      })}
    </Slice>
  );
};

export default HorizontalCardsSlice;
