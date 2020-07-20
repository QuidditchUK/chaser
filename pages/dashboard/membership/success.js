import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Meta from 'components/meta';
import { parseCookies } from 'modules/cookies';
import { Box, Grid, Flex } from 'components/layout';
import Heading from 'components/heading';
import Container from 'components/container';
import { api } from 'modules/api';
import ProductCard from 'components/product-card';
import Content from 'components/content';
import Button from 'components/button';
import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';

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
      <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Manage" />
      <Box
        bg="greyLight"
        py={{ _: 4, l: 10 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container>
          <Heading as="h2" isBody textAlign="center">Membership Purchased</Heading>
          <Content textAlign="center" py="4">Thank you for purchasing the following QuidditchUK Membership.<br /> A receipt has been emailed to you.</Content>

          <Grid
            gridTemplateColumns="1fr"
            gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
          >
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

          <Flex alignItems="center" justifyContent="center" flexDirection="column" pt="5">
            <Link href="/dashboard" passHref><a><Button type="button" variant="secondary">Back to Dashboard</Button></a></Link>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

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
