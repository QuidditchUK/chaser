import React from 'react';
import PropTypes from 'prop-types';
import Meta from 'components/meta';
import { parseCookies } from 'modules/cookies';
import { Box, Grid } from 'components/layout';
import Heading from 'components/heading';
import Container from 'components/container';
import { api } from 'modules/api';
import ProductCard from 'components/product-card';
import Content from 'components/content';

const SuccessMembership = ({ product }) => (
  <>
    <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Manage" />
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container>
        <Heading as="h2" isBody textAlign="center">Membership Purchased</Heading>
        <Content textAlign="center" py="4">Thank you for purchasing the following QuidditchUK Membership</Content>

        <Grid
          gridTemplateColumns="1fr"
          gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        >
          <ProductCard
            id={product.id}
            image={product.images[0]}
            description={product.description}
            name={product.name}
            price={product.price}
          />
        </Grid>
      </Container>
    </Box>
  </>
);

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
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

SuccessMembership.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    id: PropTypes.string,
    price: PropTypes.shape({}),
  }).isRequired,
};

export default SuccessMembership;
