import Link from 'next/link';
import { useQuery } from 'react-query';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

import { getUserScopes, hasScope } from 'modules/scopes';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import isAuthorized from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';

const handleDeleteClick = async ({ uuid, name, refetch }) => {
  try {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await api.delete(`/clubs/${uuid}`);
      refetch();
    }
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
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>League</Th>
                  <Th>Email</Th>
                  <Th>Members</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {activeClubs.map((club) => (
                  <Tr key={club?.uuid}>
                    <Td>{club?.name}</Td>
                    <Td>{club?.league}</Td>
                    <Td>
                      {club?.email && (
                        <Link href={`mailto:${club?.email}`}>
                          {club?.email}
                        </Link>
                      )}
                    </Td>
                    <Td>{club?._count?.users}</Td>
                    {hasScope([CLUBS_WRITE, EMT], scopes) && (
                      <Td>
                        <Button href={`/admin/clubs/${club.uuid}`}>Edit</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Heading as="h4" fontFamily="body" color="qukBlue">
          Inactive Clubs
        </Heading>

        <Box bg="white" borderRadius="lg">
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>League</Th>
                  <Th>Email</Th>
                  <Th>Members</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {inactiveClubs.map((club) => (
                  <Tr key={club?.uuid}>
                    <Td>{club?.name}</Td>
                    <Td>{club?.league}</Td>
                    <Td>
                      {club?.email && (
                        <Link href={`mailto:${club?.email}`}>
                          {club?.email}
                        </Link>
                      )}
                    </Td>
                    <Td>{club?._count?.users}</Td>
                    {hasScope([CLUBS_WRITE, EMT], scopes) && (
                      <>
                        <Td>
                          <Button href={`/admin/clubs/${club.uuid}`}>
                            Edit
                          </Button>
                        </Td>
                        <Td>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleDeleteClick({
                                name: club?.name,
                                uuid: club.uuid,
                                refetch,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </Td>
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [CLUBS_READ, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  const [scopes, { data: clubs }, basePageProps] = await Promise.all([
    getUserScopes(AUTHENTICATION_TOKEN),
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
