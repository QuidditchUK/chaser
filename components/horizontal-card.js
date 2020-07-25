import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, grid } from 'styled-system';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';
import { linkResolver } from 'modules/prismic';
import { Box, Flex, Grid } from 'components/layout';
import Heading from 'components/heading';

const StyledCard = styled(Grid)`
  border-radius: ${({ theme }) => theme.radii[1]};
  overflow: hidden;
  transition: box-shadow 0.125s;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};

  ${space};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.box};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.secondary};

    &:hover {
      text-decoration: underline;
    }
  }
  ${grid};
`;

const HorizontalCard = ({
  image,
  name,
  content,
  isImageLeft,
  ...cardProps
}) => (
  <StyledCard
    {...cardProps}
    gridTemplateColumns={{ _: '1fr', m: '1fr 1fr' }}
    gridGap="gutter._"
  >
    <Flex flexDirection="column" order={{ _: 1, m: `${(isImageLeft ? 1 : 2)}` }}>
      <Box
        order={{ _: 1, m: `${(isImageLeft ? 1 : 2)}` }}
        as="section"
        position="relative"
        backgroundImage={`url(${image})`}
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight="300px"
      />
    </Flex>

    <Flex flexDirection="column" order={{ _: 2, m: `${(isImageLeft ? 2 : 1)}` }}>
      <Content>
        {name && <Heading as="h2" fontSize={3} isBody>{name}</Heading>}
        {content && <>{RichText.render(content, linkResolver)}</>}
      </Content>
    </Flex>

  </StyledCard>
);

HorizontalCard.defaultProps = {
  name: null,
  image: null,
  content: null,
  isImageLeft: true,
};

HorizontalCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape({})),
  isImageLeft: PropTypes.bool,
};

const HorizontalCardsSlice = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
    items: get(rawData, 'items'),
  };

  return (
    <PrismicWrapper
      variant={data.variant}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2} textAlign="center" px={{ _: 0, m: 'gutter.m' }}>
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content textAlign="center" pb={3} px={{ _: 0, m: 'gutter.m' }}>{RichText.render(data.content, linkResolver)}</Content>}

      {data.items.map((itemData, i) => {
        const item = {
          title: get(itemData, 'title'),
          content: get(itemData, 'content'),
          image: get(itemData, 'image'),
          layout: get(itemData, 'layout_content'),
        };

        const isImageLeft = item.layout === 'image-left';

        return (
          <Flex flexDirection="column" key={`cards-${i}`}>
            <HorizontalCard
              name={item.title}
              content={item.content}
              image={item.image.url}
              isImageLeft={isImageLeft}
            />
          </Flex>
        );
      })}
    </PrismicWrapper>
  );
};

export default HorizontalCardsSlice;
