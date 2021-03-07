import {
  Box,
  Flex,
  Grid,
  Heading,
  Image as ChakraImage,
  Link as ChakraLink,
} from 'components';
import dynamic from 'next/dynamic';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import Type, { TYPES } from 'components/club-type';
import { useBreakpoint } from 'hooks/media';
import base, { rem } from 'styles/theme';

const Image = dynamic(() => import('components/image'));
const Carousel = dynamic(() => import('components/carousel'));
const PinIcon = dynamic(() => import('public/images/location-pin.svg'));

const HeroWithLocation = ({
  images,
  league,
  featuredColor,
  textColor,
  icon,
  club_name,
  coordinates,
  venue,
}) => {
  const isDesktop = useBreakpoint(base.breakpoints.lg);
  return (
    <>
      <Box
        as="section"
        position="relative"
        bg="greyLight"
        bgSize="cover"
        bgPositon="center"
        minHeight={BLOG_MIN_HEIGHTS}
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
              const height = isFirst ? 721 : 350;

              return (
                <Box
                  key={`hero-image-${image.url}-${i}`}
                  gridColumn={isFirst ? 1 : null}
                  gridRow={isFirst ? '1 / span 2' : null}
                >
                  <Image
                    src={image.url}
                    width={width}
                    height={height}
                    alt={image.alt}
                  />
                </Box>
              );
            })}
          </Grid>
        )}

        {isDesktop && images.length <= 1 && (
          <Carousel images={images} width="600" height="175" />
        )}
        {!isDesktop && <Carousel images={images} width="600" height="375" />}

        <Box
          position="absolute"
          right="0"
          top="0"
          padding={{ base: 4, sm: 8, md: 9 }}
        >
          <Type
            fontWeight="bold"
            fontSize={[rem(10), rem(16)]}
            bg={TYPES[league]}
          >
            {league}
          </Type>
        </Box>
      </Box>
      <Box
        as="section"
        position="relative"
        bg={featuredColor}
        color={textColor}
        px={{ base: 4, sm: 8, md: 9 }}
        py="0"
        height="130px"
      >
        <Flex
          justifyContent="flex-start"
          alignItems="center"
          top={{ base: 0, md: '-60px' }}
          position="relative"
        >
          <Box p={4}>
            <ChakraImage
              borderRadius="full"
              height={{ base: '100px', md: '200px' }}
              width={{ base: '100px', md: '200px' }}
              bg="white"
              boxShadow="md"
              src={icon?.url}
              alt={`${club_name} logo`}
            />
          </Box>
          <Flex flexDirection="column">
            <Heading as="h2" py="0" my="0">
              {club_name}
            </Heading>

            <Flex alignItems="center">
              <ChakraImage as={PinIcon} height="15px" width="15px" />{' '}
              <ChakraLink
                p={1}
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                color={textColor}
                borderBottom={`2px dotted ${textColor}`}
                href={`https://www.google.com/maps/search/?api=1&query=${coordinates?.latitude},${coordinates?.longitude}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {venue}
              </ChakraLink>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default HeroWithLocation;
