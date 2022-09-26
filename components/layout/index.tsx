import dynamic from 'next/dynamic';
import { Flex, Box } from '@chakra-ui/react';
import { NextComponentType } from 'next';

const Navigation = dynamic(() => import('./navigationV2'));
const Footer = dynamic(() => import('./footer'));
const PageErrorBoundary = dynamic(() => import('../errorBoundaries/page'));

const Layout = ({
  header,
  footer,
  children,
}: {
  children: NextComponentType | Element;
  header: any;
  footer: any;
}) => {
  return (
    <Flex
      color="gray.800"
      width="100%"
      bg="greyLight"
      height="100%"
      direction="column"
      minHeight="100%"
    >
      <Navigation data={header} />
      <PageErrorBoundary>
        <Box as="main" display="flex" flexDirection="column" flexGrow={1}>
          {children}
        </Box>
      </PageErrorBoundary>
      <Footer data={footer} />
    </Flex>
  );
};

export default Layout;
