import dynamic from 'next/dynamic';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import Select from 'components/formControls/select';
import Error from 'components/shared/errors';
import { parseCookies } from 'modules/cookies';
import { getBasePageProps } from 'modules/prismic';
import clubsService from 'services/clubs';
import productsService from 'services/products';
import { GetServerSideProps } from 'next';
import generateServerSideHeaders from 'modules/headers';
import useCachedResponse from 'hooks/useCachedResponse';
import { clubs as Club } from '@prisma/client';
import useMe from 'hooks/useMe';
import { useState, useEffect } from 'react';
import transfersService from 'services/transfers';
import SkeletonLoaderWrapper from 'components/shared/SkeletonLoaderWrapper';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));

const handleClick = async (price_id, user, selectedClubUid, setServerError) => {
  try {
    setServerError(null);

    // Create an automatic transfer to the selected club
    // It will get confirmed in stripe webhook
    if (user?.club_uuid !== selectedClubUid) {
      await transfersService.automaticTransfer({
        data: { new_club_uuid: selectedClubUid },
      });
    }

    const { data } = await productsService.getProductSession({ price_id });

    // redirect to checkout
    window.location = data.url;
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const PurchaseMembership = ({ products }: { products: any }) => {
  const [serverError, setServerError] = useState(null);
  const { data: user, isLoading: userLoading } = useMe();
  const [selectedClubUuid, setSelectedClubUuid] = useState(user?.club_uuid);
  const { data: queryClubs = [], isLoading: clubsLoading } = useCachedResponse<
    Club[]
  >({
    queryKey: '/clubs/all',
    queryFn: clubsService.getPublicClubs,
  });
  const activeClubs = queryClubs?.filter((club) => club.active);

  useEffect(() => {
    setSelectedClubUuid(user?.club_uuid);
  }, [user?.club_uuid]);

  return (
    <SkeletonLoaderWrapper
      isLoading={userLoading || clubsLoading}
      loaderComponent={<Box />}
    >
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
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
              <strong>Trial</strong> Membership covers the cost of the
              membership for the current season and a player fee for one
              QuadballUK Tournament. People who have never played the sport
              before should purchase a Trial Membership.
            </Text>
            <Text>
              <strong>Individual</strong> Membership covers the cost of the
              membership for the current season. Seasoned players should
              purchase an Individual Membership.
            </Text>
            <Text>
              Please select the club you plan to play with during the season
              covered by the membership from the dropdown below.
            </Text>
          </Box>

          <Grid gridTemplateColumns="1fr" gridGap={{ base: 4, sm: 8, md: 9 }}>
            {serverError && <Error>{serverError}</Error>}
            <Box>
              <Select
                onChange={(event) => {
                  setSelectedClubUuid(event.target.value);
                }}
                label="Select your club"
                id="club_uuid"
                placeholder="Select a club"
                options={activeClubs.map((club) => ({
                  value: club.uuid,
                  label: club.name,
                }))}
                value={selectedClubUuid}
              />
            </Box>
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.images[0]}
                description={product.description}
                name={product.name}
                price={product.price}
                onClick={() =>
                  handleClick(
                    product.price?.id,
                    user,
                    selectedClubUuid,
                    setServerError
                  )
                }
              />
            ))}
          </Grid>
        </Container>
      </Box>
    </SkeletonLoaderWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { MEMBERSHIP_AGREED } = parseCookies(req);
  const headers = generateServerSideHeaders(req);

  if (!MEMBERSHIP_AGREED) {
    return {
      redirect: {
        destination: '/dashboard/membership/manage',
        permanent: false,
      },
    };
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

PurchaseMembership.auth = {
  skeleton: <Box />,
};
