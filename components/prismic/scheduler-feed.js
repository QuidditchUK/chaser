import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import Link from 'next/link';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';

import {
  Heading,
  Grid,
  Text,
  Box,
  Flex,
  GridItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Image from 'components/shared/image';
import axios from 'axios';

const Slice = dynamic(() => import('components/shared/slice'));

const clipPathLeft = 'polygon(0 0, 100% 0, 90% 100%, 0 100%)';
const clipPathRight = 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)';

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

const SchedulerFeed = ({ primary }) => {
  const { scheduler_url } = primary;

  const { data } = useQuery(
    scheduler_url?.url,
    () => axios.get(scheduler_url?.url),
    {
      refetchInterval: 300000, // 5 minute refetch
    }
  );

  const grouped = groupBy(data?.data, (game) => game?.timeslot?.time);
  const groupedOrder = orderBy(Object.keys(grouped), (group) => group);

  return (
    <Slice variant="light" size="sm">
      {groupedOrder.map((k) => {
        const items = grouped[k];

        const orderedByPitch = orderBy(items, ({ pitch }) => pitch);

        return (
          <Grid
            gridGap={4}
            gridTemplateColumns="1fr"
            key={k}
            mb={2}
            sx={{
              '& a': {
                textDecoration: 'none',
                color: 'black',
                '&:hover': {
                  textDecoration: 'none',
                  color: 'black',
                },
              },
            }}
          >
            <Heading fontSize="xl" fontFamily="body" textAlign="center">
              {DateTime.fromISO(k).toFormat('h:mm a')}
            </Heading>

            {orderedByPitch.map((game, i) => (
              <LinkWrapper
                href={`https://www.quidditchscheduler.com/tournaments/${game?.timeslot?.tournament?.id}/games/${game?.id}`}
                key={game?.id}
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
                          borderRadius={0}
                          clipPath={clipPathLeft}
                          filter="blur(3px)"
                        />
                      )}
                    </Box>

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
                          borderRadius={0}
                          clipPath={clipPathRight}
                          filter="blur(3px)"
                        />
                      )}
                    </Box>
                  </Grid>

                  <Box
                    width="100%"
                    height="100%"
                    position="absolute"
                    bgGradient={`linear(to-t, ${PITCH_COLOR[i]}, rgba(0, 0, 0, 0))`}
                    borderRadius="lg"
                  />

                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    pt={4}
                    zIndex={1}
                  >
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
                        {DateTime.fromISO(game?.timeslot?.time).toFormat(
                          'h:mm a'
                        )}
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
                      gridTemplateColumns={{ base: '1fr', md: '50px auto' }}
                      gridTemplateRows={{ base: '50px auto', md: 'auto' }}
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
                            fontSize="4xl"
                            justifySelf="end"
                            color="white"
                            textShadow="0 0 5px rgb(0,0,0)"
                          >
                            {game?.teamAScore}
                            {game?.snitchCaughtBy === 'TEAM_A' && <>*</>}
                          </Text>
                          <Text
                            fontWeight="bold"
                            fontSize="4xl"
                            justifySelf="center"
                            color="white"
                            textShadow="0 0 5px rgb(0,0,0)"
                          >
                            —
                          </Text>
                          <Text
                            fontWeight="bold"
                            fontSize="4xl"
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
                      gridTemplateColumns={{ base: '1fr', md: 'auto 50px' }}
                      gridTemplateRows={{ base: '50px auto', md: 'auto' }}
                      gridGap={2}
                      gridTemplateAreas={{
                        base: "'logo' 'name'",
                        md: "'name logo'",
                      }}
                      alignItems="center"
                    >
                      <Text
                        fontWeight="bold"
                        color="white"
                        textShadow="0 0 5px rgb(0,0,0)"
                        fontSize={{ base: 'sm', md: 'md' }}
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
            ))}
          </Grid>
        );
      })}
    </Slice>
  );
};

export default SchedulerFeed;
