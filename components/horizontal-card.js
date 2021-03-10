import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';
import { linkResolver } from 'modules/prismic';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
import Image from 'components/image';

import Content from 'components/content';
import { StyledLink } from 'components/latest-news';

const HorizontalCard = ({
  image,
  name,
  content,
  isImageLeft,
  ...cardProps
}) => {
  const clipPath = isImageLeft
    ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
    : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)';
  return (
    <Grid
      {...cardProps}
      gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
      gridGap={4}
      overflow="hidden"
      bg="white"
      color="qukBlue"
      transition="box-shadow 0.125s"
      borderRadius="lg"
      alignItems="center"
      _hover={{
        boxShadow: 'md',
      }}
    >
      <Box
        order={{ base: 1, md: `${isImageLeft ? 1 : 2}` }}
        as="section"
        position="relative"
        backgroundColor="white"
        minHeight="300px"
        height="100%"
        width="100%"
      >
        <Image
          layout="fill"
          height={image.height}
          width={image.width}
          alt={image.alt}
          src={image.url}
          borderRadius="0"
          clipPath={{ base: 'none', md: clipPath }}
        />
      </Box>

      <Flex
        flexDirection="column"
        order={{ base: 2, md: `${isImageLeft ? 2 : 1}` }}
      >
        <Content px={4} py={5}>
          {name && (
            <Heading as="h2" fontSize="xl" fontFamily="body">
              {name}
            </Heading>
          )}
          {content && <>{RichText.render(content, linkResolver)}</>}
        </Content>
      </Flex>
    </Grid>
  );
};

const HorizontalCardsSlice = (rawData) => {
  const title = get(rawData, 'primary.title');
  const content = get(rawData, 'primary.content');
  const variant = get(rawData, 'primary.variant');
  const items = get(rawData, 'items');

  return (
    <PrismicWrapper variant={variant} px={{ base: 4, sm: 8, md: 9 }}>
      {RichText.asText(title) && (
        <Heading
          as="h2"
          fontSize="3xl"
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

      {items.map((itemData, i) => {
        const item = {
          title: get(itemData, 'title'),
          content: get(itemData, 'content'),
          image: get(itemData, 'image'),
          layout: get(itemData, 'layout_content'),
          link: get(itemData, 'link'),
        };

        const isImageLeft = item.layout === 'image-left';

        return (
          <Flex
            flexDirection="column"
            key={`cards-${i}`}
            mb={5}
            px={{ base: 4, sm: 8, md: 0 }}
          >
            {Link.url(item.link, linkResolver) ? (
              <StyledLink
                href={Link.url(item.link, linkResolver)}
                target={item.link.target}
                aria-label={item.title}
              >
                <HorizontalCard
                  name={item.title}
                  content={item.content}
                  image={item.image}
                  isImageLeft={isImageLeft}
                />
              </StyledLink>
            ) : (
              <HorizontalCard
                name={item.title}
                content={item.content}
                image={item.image}
                isImageLeft={isImageLeft}
              />
            )}
          </Flex>
        );
      })}
    </PrismicWrapper>
  );
};

export default HorizontalCardsSlice;
