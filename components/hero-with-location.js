import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Flex,
  Grid,
  GridItem,
} from 'components/layout';
import styled from 'styled-components';
import { format } from 'date-fns';
import { parseTimestamptz } from 'modules/dates';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import Type, { TYPES } from 'components/club-type';
import Image from 'components/image';
import base, { rem } from 'styles/theme';
import { useBreakpoint } from 'hooks/media';
import Heading from 'components/heading';
import Carousel from 'components/carousel';
import PinIcon from 'public/images/location-pin.svg';

const IconContainer = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  z-index: 3;
`;

const Icon = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.box};

  @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 200px;
    width: 200px;
  }
`;

const LocationIcon = styled(PinIcon)`
  height: 15px;
  width: 15px;
`;

const LocationLink = styled.a`
  padding: ${({ theme }) => theme.space[1]};
  text-decoration: none;
  color: ${({ linkColor }) => linkColor};
  border-bottom: 2px dotted ${({ linkColor }) => linkColor};
`;

const HeroWithLocation = ({
  image,
  league,
  featuredColor,
  textColor,
  icon,
  name,
  location,
  venue,
  startTime,
}) => {
  const images = new Array(5).fill({ src: image });

  const isDesktop = useBreakpoint(base.breakpoints.l);
  return (
    <>
      <Box
        as="section"
        position="relative"
        backgroundColor="greyLight"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Box
          position="absolute"
          right="0"
          padding={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
          zIndex="10"
        >
          <Type fontWeight="bold" fontSize={[rem(10), rem(16)]} bg={TYPES[league]}>{league}</Type>
        </Box>

        {isDesktop && (
          <Grid
            gridTemplateColumns="2fr 1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gridGap={4}
            height="400px"
            p={4}
          >
            {images.map(({ src }, i) => {
              const isFirst = i === 0;
              const width = isFirst ? 1000 : 500;
              const height = isFirst ? 721 : 350;

              return (
                <GridItem
                  key={`hero-image-${src}-${i}`}
                  gridColumn={isFirst ? 1 : null}
                  gridRow={isFirst ? '1 / span 2' : null}
                >
                  <Image
                    src={src}
                    width={width}
                    height={height}
                  />
                </GridItem>
              );
            })}
          </Grid>
        )}

        {!isDesktop && <Carousel images={images} width="600" height="375" />}
      </Box>
      <Box
        as="section"
        position="relative"
        backgroundColor={featuredColor}
        color={textColor}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        py="0"
        height="130px"
      >
        <Flex justifyContent="flex-start" alignItems="center" top={{ _: 0, m: '-60px' }} position="relative">
          <IconContainer><Icon src={icon} alt={`${name} logo`} /></IconContainer>
          <Flex flexDirection="column">
            <Heading as="h2" fontSize={[3, 4, 5]} py="0" my="0">{name}</Heading>

            {startTime && (<Box>{' '}<strong>{format(parseTimestamptz(startTime), 'EEE, d LLL H:mm a')}</strong></Box>)}
            <Flex alignItems="center">
              <LocationIcon />{' '}
              <LocationLink
                href={`https://www.google.com/maps/search/?api=1&query=${location?.coordinates[1]},${location?.coordinates[0]}`}
                rel="noopener noreferrer"
                target="_blank"
                linkColor={textColor}
              >
                {venue}
              </LocationLink>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

HeroWithLocation.defaultProps = {
  image: null,
  venue: null,
  icon: null,
  featuredColor: null,
  textColor: null,
  league: null,
  name: null,
  location: null,
  startTime: null,
};

HeroWithLocation.propTypes = {
  image: PropTypes.string,
  venue: PropTypes.string,
  icon: PropTypes.string,
  featuredColor: PropTypes.string,
  textColor: PropTypes.string,
  league: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.shape,
  startTime: PropTypes.string,
};

export default HeroWithLocation;
