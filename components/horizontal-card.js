import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';
import { linkResolver } from 'modules/prismic';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';

import Content from 'components/content';
import { StyledLink } from 'components/latest-news';

const HorizontalCard = ({
  image,
  name,
  content,
  isImageLeft,
  ...cardProps
}) => (
  <Grid
    {...cardProps}
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={4}
    overflow="hidden"
    bg="white"
    color="qukBlue"
    transition="box-shadow 0.125s"
    borderRadius="lg"
    _hover={{
      boxShadow: 'md',
    }}
  >
    <Box
      order={{ base: 1, md: `${isImageLeft ? 1 : 2}` }}
      as="section"
      position="relative"
      backgroundImage={`url(${image})`}
      backgroundColor="qukBlue"
      backgroundSize="cover"
      backgroundPosition="center"
      minHeight="300px"
      height="100%"
      width="100%"
    />

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

const HorizontalCardsSlice = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
    items: get(rawData, 'items'),
  };

  return (
    <PrismicWrapper variant={data.variant} px={{ base: 4, sm: 8, md: 9 }}>
      {RichText.asText(data.title) && (
        <Heading
          as="h2"
          fontSize="3xl"
          mt={2}
          textAlign="center"
          px={{ base: 4, sm: 8, md: 9 }}
        >
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && (
        <Content textAlign="center" pb={3} px={{ base: 4, sm: 8, md: 9 }}>
          {RichText.render(data.content, linkResolver)}
        </Content>
      )}

      {data.items.map((itemData, i) => {
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
                  image={item.image.url}
                  isImageLeft={isImageLeft}
                />
              </StyledLink>
            ) : (
              <HorizontalCard
                name={item.title}
                content={item.content}
                image={item.image.url}
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
