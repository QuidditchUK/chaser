import {
  Box,
  Image as ChakraImage,
  Flex,
  Text,
  Heading,
  usePrefersReducedMotion,
  Tooltip,
} from '@chakra-ui/react';
import Type, { TYPES } from 'components/club-type';
import { rem } from 'styles/theme';
import { formatOrdinals } from 'modules/numbers';

export const ACTIVE_STATUS = 'active';

const ClubCard = ({
  image,
  name,
  league,
  icon,
  venue,
  status,
  tournament_results = [],
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

      <Flex py={5} px={4} alignItems="center" justifyContent="space-between">
        <Box>
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
          <Text>{venue}</Text>
        </Box>

        <Flex flexDirection="row" justifyContent="flex-end">
          {tournament_results.map((result) => (
            <>
              {result.medal_icon.url && (
                <Box
                  key={`${name}_${result.team_name}_${result.tournament_name}_${result.season}`}
                  ml={3}
                >
                  <Tooltip
                    placement="bottom"
                    label={`${result.tournament_name} - ${
                      result.position
                    }${formatOrdinals(result.position)}`}
                  >
                    <ChakraImage
                      src={result.medal_icon.url}
                      alt={`${result.tournament_name}`}
                      height="30px"
                      width="30px"
                    />
                  </Tooltip>
                </Box>
              )}
            </>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ClubCard;
