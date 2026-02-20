import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { tournaments as PrismaTournaments } from '@prisma/client';
import { Box, Flex, Heading, Text, UnorderedList } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';

import { getBasePageProps } from 'modules/prismic';
import { EMT } from 'constants/scopes';
import { isScoped_ServerProps } from 'modules/auth';
import tournamentsService from 'services/tournaments';
import useCachedResponse from 'hooks/useCachedResponse';

import {
  List,
  Li,
  SidebarListItem,
  SkeletonList,
} from 'components/shared/List';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import Meta from 'components/shared/meta';
import PageBody from 'components/layout/PageBody';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import SkeletonLoaderWrapper from 'components/shared/SkeletonLoaderWrapper';
import { DateTime } from 'luxon';

const TournamentAdminDashboard = () => {
  const { data: tournaments = [], isLoading } = useCachedResponse<
    PrismaTournaments[]
  >({
    queryKey: '/tournaments/all',
    queryFn: tournamentsService.getAllTournaments,
  });

  const [pastTournaments, upcomingTournaments] = tournaments?.reduce(
    (result, tournament) => {
      result[tournament.end < DateTime.now().toJSDate() ? 0 : 1].push(
        tournament
      );
      return result;
    },
    [[], []]
  );

  const [timeFilter, setTimeFilter] = useState('UPCOMING');

  const viewTournaments =
    timeFilter === 'ALL'
      ? tournaments
      : timeFilter === 'UPCOMING'
      ? upcomingTournaments
      : pastTournaments;

  return (
    <>
      <Meta subTitle="Tournaments" title="Admin Dashboard" />
      <Slice>
        <HeadingWithBreadcrumbs
          breadcrumbs={[{ link: '/admin', title: 'Dashboard' }]}
          heading="Tournaments"
        />

        <Text mt={0}>Tournaments description TODO</Text>

        <PageBody>
          <Box gridArea="main">
            <SkeletonLoaderWrapper
              isLoading={isLoading}
              loaderComponent={<SkeletonList />}
            >
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
              <List>
                {viewTournaments?.map((tournament) => (
                  <Li
                    key={tournament.uuid}
                    href={`/admin/tournaments/${tournament.uuid}`}
                    icon={
                      <Box
                        height="3rem"
                        width="3rem"
                        borderRadius="full"
                        bg="gray.400"
                      />
                    }
                    name={
                      <Text color="qukBlue" fontWeight="bold" my={1}>
                        {tournament.name || 'Unnamed'}
                      </Text>
                    }
                    //QQ Add other params
                    subtitle={`Description: ${tournament.description}`}
                  />
                ))}
              </List>
            </SkeletonLoaderWrapper>
          </Box>

          <Box gridArea="sidebar">
            <Heading fontFamily="body" color="gray.600" fontSize="xl">
              Actions
            </Heading>

            <Box borderRadius="lg" bg="white" height="initial">
              <UnorderedList listStyleType="none" m={0} p={0}>
                <SidebarListItem href="/admin/tournaments/new">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [EMT]);
  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: await getBasePageProps(),
  };
};

export default TournamentAdminDashboard;

TournamentAdminDashboard.auth = {
  skeleton: <Box />,
};
