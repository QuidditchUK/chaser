import Link from 'next/link';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

import { getUserScopes, hasScope } from 'modules/scopes';
import { CLUBS_READ, CLUBS_WRITE } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import isAuthorized from 'modules/auth';
const Dashboard = ({ scopes, clubs }) => {
  const [activeClubs, inactiveClubs] = clubs.reduce(
    (result, club) => {
      result[club?.active ? 0 : 1].push(club);
      return result;
    },
    [[], []]
  );

  return (
    <Slice>
      <Flex
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading as="h3" fontFamily="body" color="qukBlue">
          <Link href="/admin">Dashboard</Link> / Clubs
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

      <Box bg="white" borderRadius="lg">
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>League</Th>
                <Th>Status</Th>
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
                  <Td>{club?.status}</Td>
                  <Td>{club?.email}</Td>
                  <Td>{club?._count?.users}</Td>
                  {hasScope([CLUBS_WRITE], scopes) && (
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
                <Th>Status</Th>
                <Th>Email</Th>
                <Th>Members</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {inactiveClubs.map((club) => (
                <Tr key={club?.uuid}>
                  <Td>{club?.name}</Td>
                  <Td>{club?.league}</Td>
                  <Td>{club?.status}</Td>
                  <Td>{club?.email}</Td>
                  <Td>{club?._count?.users}</Td>
                  {hasScope([CLUBS_WRITE], scopes) && (
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
    </Slice>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  if (!isAuthorized(req, res, [CLUBS_READ])) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  const scopes = getUserScopes(AUTHENTICATION_TOKEN);
  const { data: clubs } = await api.get('/clubs/all', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      scopes,
      clubs,
    },
  };
};

export default Dashboard;
