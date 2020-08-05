import React from 'react';
import PropTypes from 'prop-types';
import Meta from 'components/meta';
import { parseCookies } from 'modules/cookies';
import { Box, Grid } from 'components/layout';
import Heading from 'components/heading';
import Container from 'components/container';
import { api } from 'modules/api';
import ProductCard from 'components/product-card';
import { stripePromise } from 'modules/stripe';

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
    <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Manage" />
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container>
        <Heading as="h2" isBody>Purchase Membership</Heading>
        <Grid
          gridTemplateColumns="1fr"
          gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        >
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

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
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

PurchaseMembership.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PurchaseMembership;
