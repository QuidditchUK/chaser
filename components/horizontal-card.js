import dynamic from 'next/dynamic';
import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import { cardVariants } from 'components/card';

import { Heading, Box, useStyleConfig, Flex } from '@chakra-ui/react';
import { linkResolver } from 'modules/prismic';

import { ContentBox, LinkWrapper, PlainWrapper } from 'components/card';

const Slice = dynamic(() => import('components/slice'));
const Image = dynamic(() => import('components/image'));
const Content = dynamic(() => import('components/content'));

export const HorizontalCardStyles = {
  baseStyle: {
    borderRadius: 'lg',
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
    gridGap: 4,
    gridTemplateAreas: { base: "'image' 'content'", md: "'image content'" },
    overflow: 'hidden',
    alignItems: 'center',
  },
  variants: {
    white: {
      bg: 'gray.50',
      color: 'gray.800',
    },
    primary: {
      bg: 'gray.50',
      color: 'gray.800',
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

const HorizontalCard = ({
  image,
  title,
  href,
  target,
  ariaLabel,
  content,
  isImageLeft,
  variant,
  ...cardProps
}) => {
  const styles = useStyleConfig('HorizontalCard', { variant });
  const gridAreas = isImageLeft
    ? {}
    : {
        gridTemplateAreas: image?.src
          ? { base: "'image' 'content'", md: "'content image'" }
          : { base: "'content'", md: "'content content'" },
      };

  const clipPath = isImageLeft
    ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
    : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)';

  const Wrapper = href ? LinkWrapper : PlainWrapper;

  return (
    <Wrapper
      href={href}
      target={target}
      aria-label={ariaLabel}
      display="initial"
      {...cardProps}
    >
      <Box __css={styles} as="article" {...gridAreas}>
        <Box
          position="relative"
          bg="grey.100"
          minHeight={image?.src ? '300px' : 'initial'}
          display={image?.src ? 'block' : 'none'}
          height="100%"
          width="100%"
          overflow="hidden"
          gridArea="image"
        >
          {image?.src && (
            <Image
              layout="fill"
              height={image?.height}
              width={image?.width}
              alt={image?.alt}
              src={image?.src}
              borderRadius={0}
              clipPath={{ base: 'none', md: clipPath }}
            />
          )}
        </Box>
        <ContentBox
          py={5}
          pl={isImageLeft ? 4 : 8}
          pr={isImageLeft ? 8 : 4}
          gridArea="content"
          minHeight={image?.src ? 'initial' : '300px'}
          color="qukBlue"
          sx={{
            '& a': {
              fontWeight: 'bold',
              color: 'qukBlue',
              textDecoration: 'none',
              _hover: {
                textDecoration: 'none',
              },
            },
          }}
        >
          {title && (
            <Heading as="h2" fontSize="xl" fontFamily="body">
              {title}
            </Heading>
          )}
          {content && <RichText render={content} linkResolver={linkResolver} />}
        </ContentBox>
      </Box>
    </Wrapper>
  );
};

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
