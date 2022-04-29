import dynamic from 'next/dynamic';
import { Box, Grid, Heading } from '@chakra-ui/react';
import { parseCookies } from 'modules/cookies';
import { api } from 'modules/api';
import isAuthorized from 'modules/auth';
import { stripePromise } from 'modules/stripe';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));

const handleClick = async (id) => {
  const { data } = await api.get(`/products/session?price_id=${id}`);

  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({
    sessionId: data.id,
  });

  // TODO HANDLE REDIRECT ERROR
  console.log(error.message);
};

const PurchaseMembership = ({ products }) => (
  <>
    <Meta
      description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
      subTitle="Manage"
    />
    <Box bg="greyLight" py={{ base: 4, lg: 10 }} px={{ base: 4, sm: 8, md: 9 }}>
      <Container>
        <Heading as="h2" fontFamily="body">
          Purchase Membership
        </Heading>
        <Grid gridTemplateColumns="1fr" gridGap={{ base: 4, sm: 8, md: 9 }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.images[0]}
              description={product.description}
              name={product.name}
              price={product.price}
              onClick={() => handleClick(product.price?.id)}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  </>
);

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN, MEMBERSHIP_AGREED } = parseCookies(req);

  if (!isAuthorized(AUTHENTICATION_TOKEN)) {
    return { props: {} };
  }

  if (!MEMBERSHIP_AGREED) {
    res.setHeader('location', '/dashboard/membership/manage');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data } = await api.get('/products', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      products: data,
    },
  };
};

export default PurchaseMembership;
