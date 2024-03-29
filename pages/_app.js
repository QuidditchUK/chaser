import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { PrismicProvider } from '@prismicio/react';
import { PrismicPreview } from '@prismicio/next';
import { linkResolver, repositoryName } from '../modules/prismic';
import Auth from '../components/auth';

import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';

import theme from 'styles/theme';
import GTag, { pageview } from 'modules/analytics';

const AppErrorBoundary = dynamic(() =>
  import('components/errorBoundaries/app')
);

const Layout = dynamic(() => import('components/layout'));
const queryClient = new QueryClient();

function App({ Component, pageProps: { session, ...pageProps } }) {
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
      <SessionProvider session={session}>
        <ChakraProvider theme={theme} resetCSS={false}>
          <GTag />
          <DocumentHead />
          <QueryClientProvider client={queryClient}>
            <PrismicProvider linkResolver={linkResolver}>
              <PrismicPreview repositoryName={repositoryName}>
                <Layout {...pageProps}>
                  {Component.auth ? (
                    <Auth skeleton={Component?.auth?.skeleton}>
                      <Component {...pageProps} />
                    </Auth>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </Layout>
              </PrismicPreview>
            </PrismicProvider>
          </QueryClientProvider>
        </ChakraProvider>
      </SessionProvider>
    </AppErrorBoundary>
  );
}

export default App;
