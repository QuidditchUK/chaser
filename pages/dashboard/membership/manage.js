import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { parse } from 'date-fns';
import styled from 'styled-components';
import Meta from 'components/meta';
import { parseCookies } from 'modules/cookies';
import { Box, Flex, Grid } from 'components/layout';
import Heading from 'components/heading';
import Content from 'components/content';
import Button from 'components/button';
import Container from 'components/container';
import ProductCard from 'components/product-card';
import { api } from 'modules/api';
import { CenterJustify } from 'components/image-and-content';
import Image from 'components/image';

const Benefits = styled(Content)`
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  padding: ${({ theme }) => theme.space[4]};
`;

const List = styled.ul`
  padding: 0;
  padding-left: 1rem;
`;

const ManageMembership = ({ products }) => {
  const currentProducts = useMemo(() => products.filter((product) => new Date() < parse(product.metadata.expires, 'dd-MM-yyyy', new Date())), [products]);
  const expiredProducts = useMemo(() => products.filter((product) => new Date() >= parse(product.metadata.expires, 'dd-MM-yyyy', new Date())), [products]);

  return (
    <>
      <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Manage" />
      <Box
        bg="greyLight"
        py={{ _: 4, l: 10 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container>
          {!currentProducts.length && (
            <Grid
              gridTemplateColumns={{ _: '1fr', m: '2fr 1fr' }}
              gridGap={{ _: 'gutter._', m: 'gutter.m' }}
              bg="white"
              color="primary"
              borderRadius={1}
              overflow="hidden"
            >
              <CenterJustify order={{ _: 2, m: 1 }}>
                <Heading px={4} as="h2" mb={0} isBody>Membership Benefits</Heading>
                <Benefits>
                  <p>QuidditchUK Membership entitles a member to:</p>

                  <List>
                    <li><strong>Eligibility to register for and compete at QuidditchUK official events and QuidditchUK affiliated events.</strong></li>
                    <li>Access to coaching, refereeing, and snitching resources provided by QuidditchUK.</li>
                    <li>Eligibility to be selected for National Teams, and compete with National Teams in international tournaments.</li>
                    <li>Coverage and regulation of transfers within European clubs overseen by Quidditch Europe.</li>
                    <li>Access to discounts and perks from QuidditchUK through our affiliated partners.</li>
                    <li>Register under a single QuidditchUK Club.</li>
                    <li>Transfer between QuidditchUK Clubs.</li>
                  </List>
                </Benefits>

                <Flex flexDirection="column" alignItems="center" py="5">
                  <Link as="/dashboard/membership/purchase" href="/dashboard/membership/purchase"><a><Button type="button" variant="primary">Purchase Membership</Button></a></Link>
                </Flex>
              </CenterJustify>
              <CenterJustify order={{ _: 1, m: 2 }}>
                <Image
                  alt="Benefits of QUK Membership"
                  src="https://images.prismic.io/chaser/e8e1b385-cd00-469d-aa67-f66dca0d5491_trev_member_editQUK.jpg?auto=compress,format"
                  height={900}
                  width={900}
                />
              </CenterJustify>
            </Grid>
          )}
          {!!currentProducts.length && (
            <>
              <Heading as="h2" isBody>Current Membership</Heading>
              <Grid
                gridTemplateColumns="1fr"
                gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
              >
                {currentProducts.map((product) => (
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

          {!!expiredProducts.length && (
            <>
              <Heading as="h2" isBody pt="5">Past Memberships</Heading>
              <Grid
                gridTemplateColumns="1fr"
                gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
              >
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
      products: data,
    },
  };
};

ManageMembership.defaultProps = {
  products: [],
};

ManageMembership.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ManageMembership;
