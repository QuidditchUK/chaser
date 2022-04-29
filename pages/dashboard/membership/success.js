import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parseCookies } from 'modules/cookies';
import { Box, Grid, Flex, Heading } from '@chakra-ui/react';
import isAuthorized from 'modules/auth';
import { api } from 'modules/api';
import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));
const Content = dynamic(() => import('components/shared/content'));
const Button = dynamic(() => import('components/shared/button'));

const SuccessMembership = ({ product }) => {
  useEffect(() => {
    event({
      action: 'Purchased',
      category: CATEGORIES.MEMBERSHIP,
      label: product.name,
    });
  }, [product]);

  return (
    <>
      <Meta
        description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
        <Container>
          <Heading as="h2" fontFamily="body" textAlign="center">
            Membership Purchased
          </Heading>
          <Content textAlign="center" py="4">
            Thank you for purchasing the following QuidditchUK Membership.
            <br /> A receipt has been emailed to you.
          </Content>

          <Grid gridTemplateColumns="1fr" gridGap={{ base: 4, sm: 8, md: 9 }}>
            {product?.id && (
              <ProductCard
                id={product.id}
                image={product.images[0]}
                description={product.description}
                name={product.name}
                price={product.price}
              />
            )}
          </Grid>

          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            pt="5"
          >
            <Button type="button" variant="secondary" href="/dashboard">
              Back to Dashboard
            </Button>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);
  if (!isAuthorized(AUTHENTICATION_TOKEN)) {
    return { props: {} };
  }

  const { data } = await api.get('/products/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      product: data[0],
    },
  };
};

export default SuccessMembership;
