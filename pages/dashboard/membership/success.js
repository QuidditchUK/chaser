import { useEffect } from 'react';
import Link from 'next/link';
import Meta from 'components/meta';
import { parseCookies } from 'modules/cookies';
import { Box, Grid, Flex } from '@chakra-ui/react';
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
            <Link href="/dashboard" passHref>
              <a>
                <Button type="button" variant="secondary">
                  Back to Dashboard
                </Button>
              </a>
            </Link>
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

export default SuccessMembership;
