import dynamic from 'next/dynamic';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Box, Flex } from '@chakra-ui/react';
import { Table, TableRow, TableHead, TableDataBorder } from 'components/table';

const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Button = dynamic(() => import('components/button'));

const Dashboard = ({ clubs }) => (
  <>
    <Box bg="greyLight" py={{ base: 4, lg: 10 }} px={{ base: 4, sm: 8, md: 9 }}>
      <Container>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Heading as="h1" fontFamily="body" color="qukBlue" my="3">
            Clubs
          </Heading>
          <Button variant="qukBlue" my="3">
            Add Club
          </Button>
        </Flex>

        <Table fontSize="3">
          <thead>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </thead>

          <tbody>
            {clubs.map((club) => (
              <TableRow key={club.uuid}>
                <TableDataBorder>{club.name}</TableDataBorder>
                <TableDataBorder>{club.status}</TableDataBorder>
                <TableDataBorder>
                  <Button variant="qukBlue" my="0">
                    Edit
                  </Button>
                </TableDataBorder>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Container>
    </Box>
  </>
);

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  try {
    await api.get('/users/admin', {
      headers: {
        Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
      },
    });

    const { data: clubs } = await api.get('/clubs/search');

    return {
      props: {
        clubs,
      },
    };
  } catch (err) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
};

Dashboard.defaultProps = {
  clubs: [],
};

export default Dashboard;
