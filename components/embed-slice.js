import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import styled from 'styled-components';
import { typography, space } from 'styled-system';
import PrismicWrapper from 'components/prismic-wrapper';
import { Box, Grid } from 'components/layout';
import Heading from 'components/heading';
import Content from 'components/content';
import { linkResolver } from 'modules/prismic';

const Support = styled.div`
${typography};
${space};
`;

const VideoContainer = styled(Box)`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
`;

const Video = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

export const Embed = ({ embed }) => {
  let url = null;

  // Oh, you better believe that is a-hackin'
  if (embed.provider_name === 'YouTube') {
    [url] = embed.html
      .split('src="')[1]
      .split('"');
  }

  return (
    <>
      {url
        ? (
          <VideoContainer>
            <Video src={url} frameborder="0" allowfullscreen />
          </VideoContainer>
        )
        : (<div dangerouslySetInnerHTML={{ __html: embed.html }} />)}
    </>
  );
};

Embed.propTypes = {
  embed: PropTypes.shape({
    html: PropTypes.string.isRequired,
    provider_name: PropTypes.string,
  }).isRequired,
};

export const Item = ({ item }) => (
  <Box>
    <Embed embed={item.embed} />

    {item.support && (<Support textAlign="center" pt={2} fontStyle="italic">{item.support}</Support>)}
  </Box>
);

Item.propTypes = {
  item: PropTypes.shape({
    embed: PropTypes.shape({
      html: PropTypes.string.isRequired,
      provider_name: PropTypes.string,
    }),
    support: PropTypes.string,
  }).isRequired,
};

const EmbedSlice = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    items: get(rawData, 'items'),
    variant: get(rawData, 'primary.variant'),
  };

  const multipleEmbeds = data.items.length > 1;

  return (
    <PrismicWrapper variant={data.variant} small={!multipleEmbeds}>
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2} textAlign="center">
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content textAlign="center" pb={3}>{RichText.render(data.content, linkResolver)}</Content>}

      <Grid
        gridTemplateColumns={{ _: '1fr', m: `${(multipleEmbeds ? '1fr 1fr' : '1fr')}` }}
        gridGap={{ _: 'gutter._', m: 'gutter.m' }}
      >
        {data.items.map((itemData, i) => {
          const item = {
            embed: get(itemData, 'embed'),
            support: get(itemData, 'support'),
          };

          return (<Item key={`embed-slice-${i}`} item={item} />);
        })}
      </Grid>
    </PrismicWrapper>
  );
};

export default EmbedSlice;
