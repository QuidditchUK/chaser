import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { clubs as PrismaClubs } from '@prisma/client';
import { Box, Flex, Heading, Text, UnorderedList } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';

import { getBasePageProps } from 'modules/prismic';
import { CLUBS_READ, EMT } from 'constants/scopes';
import { isScoped_ServerProps } from 'modules/auth';
import clubsService from 'services/clubs';
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

const ClubAdminDashboard = () => {
  const { data: clubs = [], isLoading } = useCachedResponse<PrismaClubs[]>({
    queryKey: '/clubs/all',
    queryFn: clubsService.getAllClubs,
  });

  const [activeClubs, inactiveClubs] = clubs?.reduce(
    (result, club) => {
      result[club?.active ? 0 : 1].push(club);
      return result;
    },
    [[], []]
  );

  const [activeFilter, setActiveFilter] = useState('ACTIVE');

  const viewClubs =
    activeFilter === 'ALL'
      ? clubs
      : activeFilter === 'ACTIVE'
      ? activeClubs
      : inactiveClubs;

  return (
    <>
      <Meta subTitle="Clubs" title="Admin Dashboard" />
      <Slice>
        <HeadingWithBreadcrumbs
          breadcrumbs={[{ link: '/admin', title: 'Dashboard' }]}
          heading="Clubs"
        />

        <Text mt={0}>
          These are our internal record of clubs that allow players to select
          which club they are registered to play with. They are not to confused
          with club profiles, which are powered by our Content Management System{' '}
          <strong>Prismic</strong> and have to be set up and maintained
          separately. Members will only be able to select from active clubs when
          choosing their clubs.
        </Text>

        <PageBody>
          <Box gridArea="main">
            <SkeletonLoaderWrapper
              isLoading={isLoading}
              loaderComponent={<SkeletonList />}
            >
              <Flex flexDirection="row" alignItems="center" gridGap={3} mb={5}>
                <Button
                  variant={activeFilter === 'ALL' ? 'primary' : 'light'}
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={() => setActiveFilter('ALL')}
                >
                  All ({clubs.length})
                </Button>

                <Button
                  variant={activeFilter === 'ACTIVE' ? 'primary' : 'light'}
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={() => setActiveFilter('ACTIVE')}
                >
                  Active ({activeClubs.length})
                </Button>

                <Button
                  variant={activeFilter === 'INACTIVE' ? 'primary' : 'light'}
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={() => setActiveFilter('INACTIVE')}
                >
                  Inactive ({inactiveClubs.length})
                </Button>
              </Flex>
              <List>
                {viewClubs?.map((club) => (
                  <Li
                    key={club.uuid}
                    href={`/admin/clubs/${club.uuid}`}
                    icon={
                      <Box
                        height="3rem"
                        width="3rem"
                        borderRadius="full"
                        bg="gray.400"
                      />
                    }
                    active={club.active}
                    name={
                      <Text color="qukBlue" fontWeight="bold" my={1}>
                        {club.name}
                      </Text>
                    }
                    subtitle={
                      <Text fontWeight="normal" my={1}>
                        Active Members: {club.activeMemberCount}
                      </Text>
                    }
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
                <SidebarListItem href="/admin/clubs/new">
                  <PlusSquareIcon />
                  <Text fontWeight="bold" my={1}>
                    Create New Club
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
  const auth = await isScoped_ServerProps(context, [CLUBS_READ, EMT]);
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

export default ClubAdminDashboard;

ClubAdminDashboard.auth = {
  skeleton: <Box />,
};
