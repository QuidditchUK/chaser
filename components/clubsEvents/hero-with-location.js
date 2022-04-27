import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Image as ChakraImage,
  Link as ChakraLink,
} from '@chakra-ui/react';
import format from 'date-fns/format';
import dynamic from 'next/dynamic';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';
import { TYPES } from 'components/clubsEvents/league-type';
import { useBreakpoint } from 'hooks/media';
import base, { rem } from 'styles/theme';

const Type = dynamic(() => import('components/clubsEvents/league-type'));
const Image = dynamic(() => import('components/shared/image'));
const Carousel = dynamic(() => import('components/shared/carousel'));

const HeroWithLocation = ({
  images,
  leagues,
  featuredColor,
  icon,
  title,
  coordinates,
  venue,
  startDate,
  endDate,
}) => {
  const isDesktop = useBreakpoint(base.breakpoints.lg);
  return (
    <>
      <Box
        as="section"
        position="relative"
        bg="gray.800"
        minHeight={HERO_MIN_HEIGHTS}
      >
        {isDesktop && images.length > 1 && (
          <Grid
            templateColumns="2fr 1fr 1fr"
            templateRows="1fr 1fr"
            gap={4}
            p={4}
          >
            {images.map(({ image }, i) => {
              const isFirst = i === 0;
              const width = isFirst ? 1000 : 500;
              const height = isFirst ? 730 : 350;

              return (
                <Box
                  key={`hero-image-${image.url}-${i}`}
                  gridColumn={isFirst ? 1 : null}
                  gridRow={isFirst ? '1 / span 2' : null}
                >
                  <Image
                    priority={isFirst}
                    src={image.url}
                    fill="responsive"
                    width={width}
                    height={height}
                    alt={image.alt}
                  />
                </Box>
              );
            })}
          </Grid>
        )}

        {images.length <= 1 && (
          <Image
            src={images[0].image?.url}
            alt={images[0].image?.alt}
            layout="fill"
            objectPosition="center center"
            objectFit="cover"
            priority={true}
            borderRadius="0"
          />
        )}

        {!isDesktop && images.length > 1 && (
          <Carousel images={images} width="600" height="375" />
        )}

        <Box
          position="absolute"
          right="0"
          top="0"
          padding={{ base: 4, sm: 8, md: 9 }}
        >
          {leagues.map((league) => (
            <Type
              key={league}
              fontWeight="bold"
              fontSize={[rem(10), rem(16)]}
              bg={TYPES[league]}
              ml="1"
            >
              {league}
            </Type>
          ))}
        </Box>

        <Grid
          position="absolute"
          bottom="0"
          width="100%"
          as="section"
          bgGradient={`linear(to-t, ${featuredColor}, rgba(0, 0, 0, 0))`}
          color="white"
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          gridGap={{ base: 4, md: 8 }}
          gridTemplateColumns={{ base: '80px auto', md: '150px auto' }}
          alignItems="center"
        >
          <ChakraImage src={icon?.url} alt={`${title} logo`} width="100%" />

          <Flex flexDirection="column">
            <Heading
              as="h2"
              py="0"
              mt="0"
              mb="1"
              fontSize={{ base: '2xl', md: '5xl' }}
              textShadow="0 0 10px rgb(0,0,0)"
            >
              {title}
            </Heading>

            <Flex alignItems="center">
              <ChakraLink
                textDecoration="underline"
                textShadow="0 0 10px rgb(0,0,0)"
                color="white"
                href={`https://www.google.com/maps/search/?api=1&query=${coordinates?.latitude},${coordinates?.longitude}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {venue}
              </ChakraLink>
            </Flex>

            {startDate && (
              <Text
                as="span"
                fontWeight="bold"
                color="white"
                pt={2}
                textShadow="0 0 10px rgb(0,0,0)"
              >
                {!!startDate && (
                  <>{format(new Date(startDate), 'MMMM d, yyyy')} </>
                )}
                {startDate !== endDate && !!endDate && (
                  <> — {format(new Date(endDate), 'MMMM d, yyyy')}</>
                )}
              </Text>
            )}
          </Flex>
        </Grid>
      </Box>
    </>
  );
};

export default HeroWithLocation;
