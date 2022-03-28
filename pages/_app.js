import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClientProvider, QueryClient } from 'react-query';

import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';

import GTag, { pageview } from 'modules/analytics';

const AppErrorBoundary = dynamic(() =>
  import('components/errorBoundaries/app')
);

const Layout = dynamic(() => import('containers/layout'));
const queryClient = new QueryClient();

function App({ Component, pageProps, err }) {
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
      <GTag />
      <DocumentHead />
      <QueryClientProvider client={queryClient}>
        <Layout {...pageProps}>
          <Component {...pageProps} err={err} />
        </Layout>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
