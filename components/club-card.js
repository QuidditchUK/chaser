import {
  Box,
  Image as ChakraImage,
  Heading,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import Type, { TYPES } from 'components/club-type';
import { rem } from 'styles/theme';

export const ACTIVE_STATUS = 'active';

const ClubCard = ({
  image,
  name,
  league,
  icon,
  venue,
  status,
  ...cardProps
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scale = prefersReducedMotion ? '1.0' : '1.1';

  return (
    <Box
      as="article"
      display="flex"
      flexDirection="column"
      flexGrow="1"
      overflow="hidden"
      position="relative"
      borderRadius="lg"
      transition="box-shadow 0.125s"
      _hover={{
        boxShadow: 'md',
        'img:not(#icon)': {
          scale,
        },
      }}
      sx={{
        img: {
          transition: 'scale 1s',
        },
      }}
      {...cardProps}
    >
      {image ? <Box position="relative">{image}</Box> : null}
      <Box p={4} position="absolute" right="0">
        <ChakraImage
          id="icon"
          h="75px"
          w="75px"
          borderRadius="full"
          src={icon}
          alt={`${name} logo`}
        />
      </Box>

      <Box py={5} px={4}>
        <Type fontWeight="bold" fontSize={rem(10)} bg={TYPES[league]}>
          {league}
        </Type>
        {!status && (
          <Type
            fontWeight="bold"
            fontSize={rem(10)}
            bg="greyDark"
            marginLeft="1"
          >
            Hiatus
          </Type>
        )}
        <Heading as="h2" fontSize="xl" fontFamily="body">
          {name}
        </Heading>
        <p>{venue}</p>
      </Box>
    </Box>
  );
};

export default ClubCard;
