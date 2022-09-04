import dynamic from 'next/dynamic';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { parseCookies } from 'modules/cookies';
import isAuthorized from 'modules/auth';
import { stripePromise } from 'modules/stripe';
import { getBasePageProps } from 'modules/prismic';
import generateServerSideHeaders from 'modules/headers';
import productsService from 'services/products';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));

const handleClick = async (price_id) => {
  const { data } = await productsService.getProductSession({ price_id });

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
        <Box maxWidth="768px">
          <Text>
            We offer two tiers of membership: <strong>Trial</strong> and{' '}
            <strong>Individual</strong>.
          </Text>
          <Text>
            <strong>Trial</strong> Membership covers the cost of the membership
            for the current season and a player fee for one QuidditchUK
            Tournament. People who have never played the sport before should
            purchase a Trial Membership.
          </Text>
          <Text>
            <strong>Individual</strong> Membership covers the cost of the
            membership for the current season. Seasoned players should purchase
            an Individual Membership.
          </Text>
        </Box>
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
  if (!isAuthorized(req, res)) {
    return { props: {} };
  }

  const { MEMBERSHIP_AGREED } = parseCookies(req);
  const headers = generateServerSideHeaders(req);

  if (!MEMBERSHIP_AGREED) {
    res.setHeader('location', '/dashboard/membership/manage');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const [{ data: products }, basePageProps] = await Promise.all([
    productsService.getProducts({ headers }),
    getBasePageProps(),
  ]);

  return {
    props: {
      products,
      ...basePageProps,
    },
  };
};

export default PurchaseMembership;
