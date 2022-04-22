import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';

import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';

import theme from 'styles/theme';
import GTag, { pageview } from 'modules/analytics';

const AppErrorBoundary = dynamic(() =>
  import('components/errorBoundaries/app')
);

const Layout = dynamic(() => import('components/layout'));
const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = async (url) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <AppErrorBoundary>
      <ChakraProvider theme={theme} resetCSS={false}>
        <GTag />
        <DocumentHead />
        <QueryClientProvider client={queryClient}>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </ChakraProvider>
    </AppErrorBoundary>
  );
}

export default App;
