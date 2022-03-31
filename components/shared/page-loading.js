import { Flex, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Container = dynamic(() => import('components/layout/container'));

export default function PageLoading() {
  return (
    <>
      <Container>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          py={10}
          px={5}
        >
          <Heading as="h1" textAlign="center" marginTop={0}>
            Loading...
          </Heading>
        </Flex>
      </Container>
    </>
  );
}
