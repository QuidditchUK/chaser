import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import parse from 'date-fns/parse';
import { Grid, Heading, Box } from '@chakra-ui/react';
import productsService from 'services/products';
import Slice from 'components/shared/slice';
import { getBasePageProps } from 'modules/prismic';
import { GetServerSideProps } from 'next';

const Meta = dynamic(() => import('components/shared/meta'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));
const MembershipForm = dynamic(
  () => import('components/dashboard/membership-form')
);

const ManageMembership = ({ products = [] }) => {
  const currentProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          new Date() < parse(product.metadata.expires, 'dd-MM-yyyy', new Date())
      ),
    [products]
  );
  const expiredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          new Date() >=
          parse(product.metadata.expires, 'dd-MM-yyyy', new Date())
      ),
    [products]
  );

  return (
    <>
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Slice>
        {!currentProducts.length && <MembershipForm />}
        {!!currentProducts.length && (
          <>
            <Heading as="h2" fontFamily="body">
              Current Membership
            </Heading>
            <Grid gridTemplateColumns="1fr" gridGap={{ base: 4, sm: 8, md: 9 }}>
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product?.images?.[0]}
                  description={product.description}
                  name={product.name}
                  expires={product.metadata.expires}
                />
              ))}
            </Grid>
          </>
        )}

        {!!expiredProducts.length && (
          <>
            <Heading as="h2" fontFamily="body" pt="5">
              Past Memberships
            </Heading>
            <Grid gridTemplateColumns="1fr" gridGap={{ base: 4, sm: 8, md: 9 }}>
              {expiredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images[0]}
                  description={product.description}
                  name={product.name}
                  expires={product.metadata.expires}
                />
              ))}
            </Grid>
          </>
        )}
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
      products,
      ...basePageProps,
    },
  };
};

export default ManageMembership;

ManageMembership.auth = {
  skeleton: <Box />,
};
