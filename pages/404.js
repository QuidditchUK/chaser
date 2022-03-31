import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Flex, Box, Heading } from '@chakra-ui/react';

const Image = dynamic(() => import('components/shared/image'));
const Container = dynamic(() => import('components/layout/container'));
const Content = dynamic(() => import('components/shared/content'));
const Meta = dynamic(() => import('components/shared/meta'));

export default function Custom404() {
  return (
    <>
      <Box bg="greyLight" color="qukBlue">
        <Container>
          <Meta subTitle="Page Not Found" />
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            py={10}
            px={5}
          >
            <Heading as="h1" textAlign="center" marginTop={0}>
              Page Not Found
            </Heading>
            <Image src="/images/404.gif" alt="404" height={208} width={500} />
            <Content paddingTop={3} textAlign="center">
              Don&#39;t worry, it happens to the best of us.
              <br />
              <Link as="/" href="/" passHref>
                <a>Return to the Homepage</a>
              </Link>
            </Content>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
