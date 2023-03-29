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
              zIndex={3}
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
  isStudentSummerPass,
  ...cardProps
}) => {
  const Wrapper = href ? LinkWrapper : PlainWrapper;
  const styles = useStyleConfig('Card');
  return (
    <Wrapper
      href={href}
      flexDirection="column"
      bg={bg}
      sx={isStudentSummerPass && Sparkles}
      position={isStudentSummerPass && 'relative'}
      borderRadius="xl"
      {...cardProps}
    >
      <Box
        __css={styles}
        as="article"
        bg={bg}
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
          py={4}
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Box px={{ base: 4, sm: 8, md: 9 }}>
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
          </Box>
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
      {isStudentSummerPass && (
        <Box width="100%" bg="white" borderRadius="xl" borderTopRadius={0}>
          <Text
            fontFamily="body"
            fontWeight="bold"
            fontSize="md"
            textAlign="center"
            color={bg}
            my={2}
          >
            Student Summer Pass
          </Text>
        </Box>
      )}
    </Wrapper>
  );
};

const color1 = '#ec9bb6';
const color2 = '#ccac6f';
const color3 = '#69e4a5';
const color4 = '#8ec5d6';
const color5 = '#b98cce';

const Sparkles = {
  '&:before,&:after': {
    content: '""',
    position: 'absolute',
    left: '0',
    right: '0',
    bottom: '0',
    top: '0',
    backgroundRepeat: 'no-repeat',
    opacity: 0.5,
    mixBlendMode: 'color-dodge',
    transition: 'all .33s ease',
    borderRadius: 'xl',
  },
  '&:before': {
    backgroundPosition: '50% 50%',
    backgroundSize: '300% 300%',
    backgroundImage: `linear-gradient(
    115deg,
    transparent 0%,
    ${color1} 25%,
    transparent 47%,
    transparent 53%,
    ${color2} 75%,
    transparent 100%
  )`,
    opacity: 0.5,
    filter: 'brightness(.5) contrast(1)',
    zIndex: 1,
  },

  '&:after': {
    opacity: 1,
    backgroundImage:
      'url("/images/sparkles.gif"), url(/images/holo.webp), linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%)',
    backgroundPosition: '50% 50%',
    backgroundSize: '160%',
    backgroundBlendMode: 'overlay',
    zIndex: 2,
    filter: 'brightness(1) contrast(1)',
    transition: 'all .33s ease',
    mixBlendMode: 'color-dodge',
    opacity: 0.75,
  },

  '&:hover:after': {
    filter: 'brightness(1) contrast(1)',
    opacity: 1,
    borderRadius: 'xl',
  },
  '&:hover:before': {
    backgroundImage: `linear-gradient(
      115deg,
      transparent 20%,
      ${color1} 36%,
      ${color2} 43%,
      ${color3} 50%,
      ${color4} 57%,
      ${color5} 64%,
      transparent 80%
    )`,
    animation: 'holoGradient 24s ease 0s infinite',
    borderRadius: 'xl',
  },

  '@keyframes holoGradient': {
    '0%, 100%': {
      opacity: 0.5,
      backgroundPosition: '50% 50%',
      filter: 'brightness(.5) contrast(1)',
    },
    '5%, 9%': {
      opacity: 1,
      backgroundPosition: '100% 100%',
      filter: 'brightness(.75) contrast(1.25)',
    },
    '13%, 17%': { opacity: 0.88, backgroundPosition: '0% 0%' },
    '35%, 39%': {
      opacity: 1,
      backgroundPosition: '100% 100%',
      filter: 'brightness(.5) contrast(1)',
    },
    '55%': {
      opacity: 1,
      backgroundPosition: '0% 0%',
      filter: 'brightness(.75) contrast(1.25)',
    },
  },
};
