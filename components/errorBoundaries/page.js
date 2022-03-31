import ErrorBoundary from 'components/errorBoundaries';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Flex, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';

const Container = dynamic(() => import('components/layout/container'));

const PageErrorBoundary = ({ children }) => (
  <ErrorBoundary
    renderError={
      <Flex bg="greyLight" minHeight="500px" alignItems="center">
        <Container>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            py={10}
            px={5}
          >
            <Heading as="h2" fontSize="8xl" textAlign="center" my={0}>
              Error
            </Heading>

            <Text textAlign="center">
              We are sorry an error has occured. Please refresh the page.
              <br /> If the error persists contact{' '}
              <Link href="mailto:technology@quidditchuk.org" passHref>
                <ChakraLink fontWeight="bold" color="black">
                  our Technology Team
                </ChakraLink>
              </Link>
            </Text>
          </Flex>
        </Container>
      </Flex>
    }
  >
    {children}
  </ErrorBoundary>
);

export default PageErrorBoundary;
