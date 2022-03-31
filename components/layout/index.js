import dynamic from 'next/dynamic';
import { Flex, Link, Box, Text } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'styles/theme';

const Navigation = dynamic(() => import('components/layout/navigation'));
const Footer = dynamic(() => import('components/layout/footer'));
const PageErrorBoundary = dynamic(() =>
  import('components/errorBoundaries/page')
);

const Layout = ({ children, preview = false }) => {
  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <Flex
        color="gray.800"
        width="100%"
        bg="greyLight"
        height="100%"
        direction="column"
        minHeight="100%"
      >
        {preview && (
          <Flex
            bg="monarchRed"
            color="white"
            alignItems="center"
            justifyContent="center"
          >
            <Text>
              This page is a preview.{' '}
              <Link
                fontWeight="bold"
                color="white"
                textDecoration="none"
                href="/api/exit-preview"
                _hover={{ textDecoration: 'underline' }}
              >
                Click here
              </Link>{' '}
              to exit preview mode.
            </Text>
          </Flex>
        )}
        <Navigation />
        <PageErrorBoundary>
          <Box as="main" display="flex" flexDirection="column" flexGrow="1">
            {children}
          </Box>
        </PageErrorBoundary>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
};

export default Layout;
