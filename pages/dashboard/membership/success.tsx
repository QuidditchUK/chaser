import dynamic from 'next/dynamic';
import { Grid, Flex, Heading, Box } from '@chakra-ui/react';

import { getBasePageProps } from 'modules/prismic';

import productsService from 'services/products';
import Slice from 'components/shared/slice';
import { GetServerSideProps } from 'next';

const Meta = dynamic(() => import('components/shared/meta'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));
const Content = dynamic(() => import('components/shared/content'));
const Button = dynamic(() => import('components/shared/button'));

const SuccessMembership = ({ product }) => {
  return (
    <>
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Slice>
        <Heading as="h2" fontFamily="body" textAlign="center">
          Membership Purchased
        </Heading>
        <Content textAlign="center" py="4">
          Thank you for purchasing the following QuadballUK Membership.
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
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [{ data: products }, basePageProps] = await Promise.all([
    productsService.getUserProducts(),
    getBasePageProps(),
  ]);

  return {
    props: {
      product: products[0],
      ...basePageProps,
    },
  };
};

export default SuccessMembership;

SuccessMembership.auth = {
  skeleton: <Box />,
};
