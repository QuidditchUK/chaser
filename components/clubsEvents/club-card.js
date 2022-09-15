import {
  Box,
  Image as ChakraImage,
  Flex,
  Text,
  Heading,
  IconButton,
  Tooltip,
  useStyleConfig,
} from '@chakra-ui/react';
import { TYPES } from 'components/clubsEvents/league-type';
import { LinkWrapper, PlainWrapper } from 'components/shared/card';
import Image from 'next/image';

import { rem } from 'styles/theme';
import dynamic from 'next/dynamic';
const Type = dynamic(() => import('components/clubsEvents/league-type'));

export const ACTIVE_STATUS = 'active';

const MEDAL_WORDING = {
  1: 'Champions',
  2: 'Silver Medalists',
  3: 'Bronze Medalists',
};

const Medals = ({ tournament_results, bg }) => {
  const resultsWithMedals = tournament_results.filter(
    ({ medal_icon }) => medal_icon?.url
  );

  const medals = resultsWithMedals
    .reduce((acc, curr) => {
      const alreadyFound = acc.find(
        ({ tournament_name }) => tournament_name === curr.tournament_name
      );
      if (alreadyFound) return acc;
      const sameTournamentResults = resultsWithMedals.filter(
        ({ tournament_name }) => tournament_name === curr.tournament_name
      );
      const bestResult = sameTournamentResults.reduce(
        (prevTournament, currentTournament) =>
          prevTournament.position <= currentTournament.position
            ? prevTournament
            : currentTournament
      );
      return acc.concat(bestResult);
    }, [])
    .sort((a, b) => {
      if (a.position !== b.position) return a.position - b.position;
      return a.tournament_name > b.tournament_name ? 1 : -1;
    })
    .map((result) => {
      return {
        name: `${result.tournament_name} ${MEDAL_WORDING[result.position]}`,
        ...result,
      };
    });

  return (
    <Flex
      flexDirection="row"
      gap={3}
      justifyContent="flex-start"
      borderRadius="xl"
      py={2}
      px={{ base: 4, sm: 8, md: 9 }}
      bg={bg}
    >
      {medals.map((medal) => (
        <Box
          key={`${medal.tournament_name}_${medal.position}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Tooltip
            placement="bottom"
            hasArrow
            fontSize="md"
            bg="gray.200"
            color="qukBlue"
            label={medal.name}
          >
            <IconButton
              variant="unstyled"
              border={0}
              p={0}
              icon={
                <Image
                  src={medal.medal_icon.url}
                  alt={medal.name}
                  height="30px"
                  width="30px"
                  sx={{
                    svg: {
                      height: '30px',
                      width: '30px',
                    },
                  }}
                />
              }
            />
          </Tooltip>
        </Box>
      ))}
    </Flex>
  );
};

export const ClubCardV2 = ({
  image,
  title,
  league,
  icon,
  venue,
  status,
  href,
  tournament_results = [],
  bg,
  ...cardProps
}) => {
  const Wrapper = href ? LinkWrapper : PlainWrapper;
  const styles = useStyleConfig('Card');
  return (
    <Wrapper href={href} flexDirection="column" bg={bg} {...cardProps}>
      <Box
        __css={styles}
        as="article"
        bg={bg}
        height="100%"
        width="100%"
        overflow="hidden"
        position="relative"
        borderRadius="xl"
        {...cardProps}
      >
        <Image
          src={image?.src ?? '/images/1x1.png'}
          alt={image?.alt}
          layout="responsive"
          objectFit="cover"
          width={640}
          height={700}
        />

        <Flex
          position="absolute"
          bottom="0"
          width="100%"
          height="70%"
          bgGradient={`linear(to-t, ${bg}, rgba(0, 0, 0, 0))`}
          color="white"
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          flexDirection="column"
          justifyContent="flex-end"
        >
          {title && (
            <Heading
              as="h2"
              fontSize="2xl"
              fontFamily="body"
              textShadow="0 0 4px rgb(0,0,0)"
              mb={0}
            >
              {title}
            </Heading>
          )}

          {venue && (
            <Text
              fontSize="sm"
              fontWeight="bold"
              textShadow="0 0 2px rgb(0,0,0)"
              mt={2}
              mb={0}
            >
              {venue}
            </Text>
          )}
        </Flex>

        <Flex
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          position="absolute"
          top="0"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Flex flexDirection="row" gap={3}>
            {!status && (
              <Type fontWeight="bold" fontSize={rem(12)} bg="greyDark" pt={2}>
                Hiatus
              </Type>
            )}
            {league && (
              <Type
                fontWeight="bold"
                fontSize={rem(12)}
                bg={TYPES[league]}
                pt={2}
              >
                {league}
              </Type>
            )}
          </Flex>
          <ChakraImage
            id="icon"
            h="50px"
            w="50px"
            src={icon}
            alt={`${title} logo`}
          />
        </Flex>
      </Box>
      <Flex h="75px">
        <Medals tournament_results={tournament_results} bg={bg} />
      </Flex>
    </Wrapper>
  );
};
