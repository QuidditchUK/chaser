import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Box, Flex } from 'components/layout';
import {
  Table,
  TableRow,
  TableHead,
  TableDataBorder,
} from 'components/table';

const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Button = dynamic(() => import('components/button'));

const Dashboard = ({ clubs }) => (
  <>
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Heading as="h1" isBody color="primary" my="3">Clubs</Heading>
          <Button variant="primary" my="3">Add Club</Button>
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
                <TableDataBorder><Button variant="primary" my="0">Edit</Button></TableDataBorder>
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

  const { data: admin } = await api.get('/users/admin', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  if (!admin || !admin.isAdmin) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data: clubs } = await api.get('/clubs/search');

  return {
    props: {
      clubs,
    },
  };
};

Dashboard.defaultProps = {
  clubs: [],
};

Dashboard.propTypes = {
  clubs: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Dashboard;
