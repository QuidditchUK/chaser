import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Box, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

import { getUserScopes, hasScope } from 'modules/scopes';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import isAuthorized from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';
import Table from 'components/shared/table';
import Modal from 'components/shared/modal';
import generateServerSideHeaders from 'modules/headers';

const handleDeleteClick = async ({ uuid, refetch }) => {
  try {
    await api.delete(`/clubs/${uuid}`);
    refetch();
  } catch (error) {
    console.log(error);
  }
};

const Dashboard = ({ scopes, clubs }) => {
  const { data: queryClubs, refetch } = useQuery(
    '/clubs/all',
    () => api.get('/clubs/all').then(({ data }) => data),
    { initialData: clubs }
  );

  const [activeClubs, inactiveClubs] = queryClubs?.reduce(
    (result, club) => {
      result[club?.active ? 0 : 1].push(club);
      return result;
    },
    [[], []]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClub, setSelectedClub] = useState();

  return (
    <>
      <Meta subTitle="Clubs" title="Admin Dashboard" />
      <Slice>
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading
            as="h3"
            fontFamily="body"
            color="qukBlue"
            display="flex"
            alignItems="center"
          >
            <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> Clubs
          </Heading>

          <Button
            variant="transparent"
            borderColor="qukBlue"
            color="qukBlue"
            _hover={{ bg: 'gray.300' }}
            rightIcon={<SmallAddIcon />}
            href="/admin/clubs/new"
          >
            Create new
          </Button>
        </Flex>

        <Text>
          These are our internal record of clubs that allow players to select
          which club they are registered to play with. They are not to confused
          with club profiles, which are powered by our CMS Prismic and have to
          be set up separately. Members will only be able to select from active
          clubs when choosing their clubs.
        </Text>

        <Box bg="white" borderRadius="lg">
          <Table
            name="Clubs"
            columns={['Name', 'League', 'Email', 'Members', '']}
            rows={activeClubs.map((club) => ({
              key: club?.uuid,
              data: [
                { key: 'name', children: <>{club?.name}</> },
                { key: 'league', children: <>{club?.league}</> },
                {
                  key: 'email',
                  children: (
                    <>
                      {club?.email && (
                        <Link href={`mailto:${club?.email}`}>
                          {club?.email}
                        </Link>
                      )}
                    </>
                  ),
                },
                { key: 'count', children: <>{club?._count?.users}</> },
                ...(hasScope([CLUBS_WRITE, EMT], scopes) && [
                  {
                    key: 'edit',
                    children: (
                      <Button href={`/admin/clubs/${club.uuid}`}>
                        Details
                      </Button>
                    ),
                  },
                ]),
              ],
            }))}
          />
        </Box>

        <Heading as="h4" fontFamily="body" color="qukBlue">
          Inactive Clubs
        </Heading>

        <Box bg="white" borderRadius="lg">
          <Table
            name="Inactive Clubs"
            columns={['Name', 'League', 'Email', 'Members', '', '']}
            rows={inactiveClubs.map((club) => ({
              key: club?.uuid,
              data: [
                { key: 'name', children: <>{club?.name}</> },
                { key: 'league', children: <>{club?.league}</> },
                {
                  key: 'email',
                  children: (
                    <>
                      {club?.email && (
                        <Link href={`mailto:${club?.email}`}>
                          {club?.email}
                        </Link>
                      )}
                    </>
                  ),
                },
                { key: 'count', children: <>{club?._count?.users}</> },
                ...(hasScope([CLUBS_WRITE, EMT], scopes) && [
                  {
                    key: 'edit',
                    children: (
                      <Button href={`/admin/clubs/${club.uuid}`}>Edit</Button>
                    ),
                  },
                  {
                    key: 'delete',
                    children: (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedClub(club);
                          onOpen();
                        }}
                      >
                        Delete
                      </Button>
                    ),
                  },
                ]),
              ],
            }))}
          />
        </Box>
      </Slice>

      <Modal
        title="Delete Club"
        isOpen={isOpen}
        onClose={onClose}
        footerAction={() => {
          handleDeleteClick({
            uuid: selectedClub?.uuid,
            refetch,
          });
          onClose();
          setSelectedClub();
        }}
        footerTitle="Delete"
        footerButtonProps={{ variant: 'secondary' }}
      >
        <Text>Are you sure you want to delete {selectedClub?.name}?</Text>
      </Modal>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [CLUBS_READ, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);
  const headers = generateServerSideHeaders(req);

  const [scopes, { data: clubs }, basePageProps] = await Promise.all([
    getUserScopes(headers),
    api.get('/clubs/all', {
      headers: {
        Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
      },
    }),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      clubs,
      ...basePageProps,
    },
  };
};

export default Dashboard;
