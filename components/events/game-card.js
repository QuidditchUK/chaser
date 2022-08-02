import Link from 'next/link';
import { DateTime } from 'luxon';
import {
  Grid,
  Text,
  Box,
  Flex,
  GridItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Image from 'components/shared/image';

const PITCH_COLOR = [
  'northernMagenta',
  'tornadoOrange',
  'southernBlue',
  'pink.500',
  'keeperGreen',
  'monarchRed',
  'northernMagenta',
  'tornadoOrange',
  'southernBlue',
  'pink.500',
  'keeperGreen',
  'monarchRed',
];

const LinkWrapper = ({ href, ...props }) => (
  <Link href={href} passHref>
    <GridItem
      as={ChakraLink}
      cursor="pointer"
      boxShadow="md"
      transition="all 0.2s ease"
      fontWeight="normal !important"
      _hover={{
        transform: 'scale(1.03)',
        boxShadow: 'lg',
        textDecoration: 'none !important',
      }}
      _focus={{
        transform: 'scale(1.03)',
        boxShadow: 'lg',
        textDecoration: 'none',
        ringWidth: '2px',
        ringColor: 'monarchRed',
      }}
      _active={{ transform: 'scale(1)' }}
      borderRadius="2xl"
      flexGrow={1}
      display="flex"
      {...props}
    />
  </Link>
);

function GameCard({ game, size = 'md', index }) {
  return (
    <LinkWrapper
      href={`https://www.quidditchscheduler.com/tournaments/${game?.timeslot?.tournament?.id}/games/${game?.id}`}
    >
      <Flex
        borderRadius="lg"
        bg="white"
        flexDirection="column"
        alignContent="center"
        width="100%"
        height="100%"
        textDecoration="none"
        _hover={{ textDecoration: 'none' }}
        lineHeight="24px"
        position="relative"
      >
        <Grid
          bg="qukBlue"
          width="100%"
          height="100%"
          gridTemplateColumns="1fr 1fr"
          position="absolute"
          borderRadius="lg"
        >
          <Box
            display="block"
            height="100%"
            overflow="hidden"
            position="relative"
            opacity={0.8}
          >
            {game?.teamA?.logoUrl && (
              <Image
                layout="fill"
                objectPosition="center center"
                objectFit="cover"
                src={game?.teamA?.logoUrl}
                alt={game?.teamA?.name}
                gridArea="teamA"
                borderRadius="lg"
              />
            )}
          </Box>
          <Box
            position="absolute"
            width="50%"
            bgGradient="linear(to-l, qukBlue, rgba(0, 0, 0, 0))"
            height="100%"
          />

          <Box
            display="block"
            height="100%"
            overflow="hidden"
            position="relative"
            opacity={0.8}
          >
            {game?.teamB?.logoUrl && (
              <Image
                layout="fill"
                src={game?.teamB?.logoUrl}
                alt={game?.teamB?.name}
                borderRadius="lg"
              />
            )}
          </Box>
          <Box
            position="absolute"
            right="0"
            width="50%"
            bgGradient="linear(to-r, qukBlue, rgba(0, 0, 0, 0))"
            height="100%"
          />
        </Grid>

        <Box
          width="100%"
          height="100%"
          position="absolute"
          bgGradient={`linear(to-t, ${
            PITCH_COLOR[index % PITCH_COLOR.length]
          }, rgba(0, 0, 0, 0))`}
          borderRadius="lg"
        />

        <Flex alignItems="center" justifyContent="center" pt={4} zIndex={1}>
          <Grid gridTemplateColumns="1fr auto 1fr" gridGap={2}>
            <Text
              my={0}
              fontSize="xs"
              justifySelf="end"
              color="white"
              textShadow="0 0 5px rgb(0,0,0)"
            >
              Pitch {game?.pitch}
            </Text>
            <Text
              my={0}
              fontSize="xs"
              justifySelf="center"
              color="white"
              textShadow="0 0 5px rgb(0,0,0)"
            >
              |
            </Text>
            <Text
              my={0}
              fontSize="xs"
              justifySelf="start"
              color="white"
              textShadow="0 0 5px rgb(0,0,0)"
            >
              {DateTime.fromISO(game?.timeslot?.time).toFormat('h:mm a')}
            </Text>
          </Grid>
        </Flex>

        <Grid
          gridTemplateColumns="1fr 1fr 1fr"
          gridGap={4}
          px={4}
          pb={4}
          zIndex={1}
        >
          <Grid
            gridTemplateColumns={
              size === 'sm' ? '1fr' : { base: '1fr', md: '50px auto' }
            }
            gridTemplateRows={
              size === 'sm' ? '50px auto' : { base: '50px auto', md: 'auto' }
            }
            gridGap={2}
            alignItems="center"
          >
            <Box h="50px" w="50px">
              {game?.teamA?.logoUrl && (
                <Image
                  src={game?.teamA?.logoUrl}
                  alt={game?.teamA?.name}
                  height="50px"
                  width="50px"
                  layout="responsive"
                />
              )}
            </Box>
            <Text
              fontWeight="bold"
              fontSize={{ base: 'sm', md: 'md' }}
              color="white"
              textShadow="0 0 5px rgb(0,0,0)"
            >
              {game?.teamA?.name}
            </Text>
          </Grid>

          {game?.status === 'FINISHED' ? (
            <Flex alignItems="center" justifyContent="center">
              <Grid gridTemplateColumns="1fr auto 1fr" gridGap={2}>
                <Text
                  fontWeight="bold"
                  fontSize={size === 'sm' ? '2xl' : { base: '2xl', md: '4xl' }}
                  justifySelf="end"
                  color="white"
                  textShadow="0 0 5px rgb(0,0,0)"
                >
                  {game?.teamAScore}
                  {game?.snitchCaughtBy === 'TEAM_A' && <>*</>}
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize={size === 'sm' ? '2xl' : { base: '2xl', md: '4xl' }}
                  justifySelf="center"
                  color="white"
                  textShadow="0 0 5px rgb(0,0,0)"
                >
                  —
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize={size === 'sm' ? '2xl' : { base: '2xl', md: '4xl' }}
                  justifySelf="start"
                  color="white"
                  textShadow="0 0 5px rgb(0,0,0)"
                >
                  {game?.teamBScore}
                  {game?.snitchCaughtBy === 'TEAM_B' && <>*</>}
                </Text>
              </Grid>
            </Flex>
          ) : (
            <Box />
          )}

          <Grid
            gridTemplateColumns={
              size === 'sm' ? '1fr' : { base: '1fr', md: 'auto 50px' }
            }
            gridTemplateRows={
              size === 'sm' ? '50px auto' : { base: '50px auto', md: 'auto' }
            }
            gridGap={2}
            gridTemplateAreas={
              size === 'sm'
                ? "'logo' 'name'"
                : {
                    base: "'logo' 'name'",
                    md: "'name logo'",
                  }
            }
            alignItems="center"
          >
            <Text
              fontWeight="bold"
              color="white"
              textShadow="0 0 5px rgb(0,0,0)"
              fontSize={size === 'sm' ? 'sm' : { base: 'sm', md: 'md' }}
              gridArea="name"
              textAlign="right"
            >
              {game?.teamB?.name}
            </Text>
            <Flex
              h="50px"
              w="50px"
              gridArea="logo"
              flexDirection="column"
              justifySelf="flex-end"
            >
              {game?.teamB?.logoUrl && (
                <Image
                  src={game?.teamB?.logoUrl}
                  alt={game?.teamB?.name}
                  height="50px"
                  width="50px"
                  layout="responsive"
                />
              )}
            </Flex>
          </Grid>
        </Grid>
      </Flex>
    </LinkWrapper>
  );
}

export default GameCard;
