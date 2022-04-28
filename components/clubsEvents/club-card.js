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

const Medals = ({ tournament_results }) => {
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
    <>
      {medals.map((medal) => (
        <Box
          key={`${medal.tournament_name}_${medal.position}`}
          ml={3}
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
    </>
  );
};

const ClubCard = ({
  image,
  title,
  league,
  icon,
  venue,
  status,
  tournament_results = [],
  href,
  ...cardProps
}) => {
  const Wrapper = href ? LinkWrapper : PlainWrapper;
  const styles = useStyleConfig('Card');

  return (
    <Wrapper href={href} aria-label={title} display="initial" {...cardProps}>
      <Box as="article" __css={styles} position="relative" {...cardProps}>
        {image?.src && (
          <Image
            src={image?.src}
            alt={image?.alt}
            layout="responsive"
            objectFit="cover"
            width={640}
            height={360}
          />
        )}
        <Box p={4} position="absolute" right="0">
          <ChakraImage
            id="icon"
            h="50px"
            w="50px"
            src={icon}
            alt={`${title} logo`}
          />
        </Box>

        <Box py={5} px={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex direction="row">
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
            </Flex>

            <Flex flexDirection="row" justifyContent="flex-end">
              <Medals tournament_results={tournament_results} />
            </Flex>
          </Flex>

          <Heading as="h2" fontSize="xl" fontFamily="body">
            {title}
          </Heading>
          <Text>{venue}</Text>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default ClubCard;
