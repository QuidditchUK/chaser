import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { tournaments as PrismaTournaments } from '@prisma/client';
import { Box, Flex, Heading, Link, Td, Text, Tr, UnorderedList } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';

import { getBasePageProps } from 'modules/prismic';
import tournamentsService from 'services/tournaments';
import useCachedResponse from 'hooks/useCachedResponse';

import { SidebarListItem, SkeletonList } from 'components/shared/List';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import Meta from 'components/shared/meta';
import PageBody from 'components/layout/PageBody';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import SkeletonLoaderWrapper from 'components/shared/SkeletonLoaderWrapper';
import { DateTime } from 'luxon';
import Table from 'components/shared/table';

const TournamentDashboard = () => {
  const { data: tournaments = [], isLoading } = useCachedResponse<PrismaTournaments[]>({
    queryKey: '/tournaments/all',
    queryFn: tournamentsService.getAllTournaments,
  });

  const [pastTournaments, upcomingTournaments] = tournaments?.reduce(
    (result, tournament) => {
      result[tournament.end < DateTime.now().toJSDate() ? 0 : 1].push(tournament);
      return result;
    },
    [[], []]
  );

  const [timeFilter, setTimeFilter] = useState('UPCOMING');

  const viewTournaments =
    timeFilter === 'ALL' ? tournaments : timeFilter === 'UPCOMING' ? upcomingTournaments : pastTournaments;

  return (
    <>
      <Meta subTitle="Tournaments" title="Admin Dashboard" />
      <Slice>
        <HeadingWithBreadcrumbs breadcrumbs={[{ link: '/events', title: 'Events' }]} heading="Tournaments" />

        <Text mt={0}>
          This is a place to create, edit and view tournaments. EMT members can create tournaments and manage all
          aspects of them. Club presidents can manage their own teams and players, but not the tournament itself.
          Players can view the tournaments they are registered in and leave teams they are in.
        </Text>

        <Text mt={0}>
          Players need to pay the registration fee. An EMT member can mark them as paid in case of bugs or
          complications. You can pay someone else{"'"}s fee.
        </Text>

        <PageBody>
          <Box gridArea="main">
            <SkeletonLoaderWrapper isLoading={isLoading} loaderComponent={<SkeletonList />}>
              <Flex flexDirection="row" alignItems="center" gridGap={3} mb={5}>
                <Button
                  variant={timeFilter === 'ALL' ? 'primary' : 'light'}
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={() => setTimeFilter('ALL')}
                >
                  All ({tournaments.length})
                </Button>

                <Button
                  variant={timeFilter === 'UPCOMING' ? 'primary' : 'light'}
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={() => setTimeFilter('UPCOMING')}
                >
                  Upcoming ({upcomingTournaments.length})
                </Button>

                <Button
                  variant={timeFilter === 'PAST' ? 'primary' : 'light'}
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={() => setTimeFilter('PAST')}
                >
                  Past ({pastTournaments.length})
                </Button>
              </Flex>
              <Box borderRadius="lg" bg="white">
                <Table
                  columns={['Name', 'location', 'description', 'Dates', 'Registration Dates']}
                  isLoading={isLoading}
                  skeletonRows={10}
                >
                  {viewTournaments?.map((tournament) => {
                    return (
                      <Tr key={tournament.uuid}>
                        <Td>
                          <Link href={`/events/tournaments/${tournament.uuid}`}>{tournament.name}</Link>
                        </Td>
                        <Td>{tournament.location}</Td>
                        <Td>
                          {tournament.description.length > 100
                            ? `${tournament.description.substring(0, 50)}...`
                            : tournament.description}
                        </Td>
                        <Td>
                          {tournament.startDate} - {tournament.endDate}
                        </Td>
                        <Td>
                          {tournament.registrationStartDate} - {tournament.registrationEndDate}
                        </Td>
                      </Tr>
                    );
                  })}
                </Table>
              </Box>
            </SkeletonLoaderWrapper>
          </Box>

          <Box gridArea="sidebar">
            <Heading fontFamily="body" color="gray.600" fontSize="xl">
              Actions
            </Heading>

            <Box borderRadius="lg" bg="white" height="initial">
              <UnorderedList listStyleType="none" m={0} p={0}>
                <SidebarListItem href="/events/tournaments/new">
                  <PlusSquareIcon />
                  <Text fontWeight="bold" my={1}>
                    Create New Tournament
                  </Text>
                </SidebarListItem>
              </UnorderedList>
            </Box>
          </Box>
        </PageBody>
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: await getBasePageProps(),
  };
};

export default TournamentDashboard;

TournamentDashboard.auth = {
  skeleton: <Box />,
};
