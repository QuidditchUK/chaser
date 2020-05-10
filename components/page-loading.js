import React from 'react';
import Layout from '~/containers/layout';
import Container from '~/components/container';
import { Flex } from '~/components/layout';
import Heading from '~/components/heading';

export default function PageLoading() {
  return (
    <Layout>
      <Container>
        <Flex alignItems="center" justifyContent="center" flexDirection="column" py={10} px={5}>
          <Heading as="h1" textAlign="center" marginTop={0}>Loading...</Heading>
        </Flex>
      </Container>
    </Layout>
  );
}
