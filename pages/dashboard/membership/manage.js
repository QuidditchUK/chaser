import { useMemo } from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { parse } from 'date-fns';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { parseCookies, setCookies } from 'modules/cookies';
import { api } from 'modules/api';
import {
  Box,
  Flex,
  Grid,
  Heading,
  UnorderedList,
  Link,
} from '@chakra-ui/react';
import { InlineError } from 'components/errors';

const Meta = dynamic(() => import('components/meta'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const Label = dynamic(() => import('components/label'));
const Container = dynamic(() => import('components/container'));
const ProductCard = dynamic(() => import('components/product-card'));

const Benefits = (props) => <Content fontSize="md" p={4} {...props} />;
const List = (props) => <UnorderedList p={0} pl={4} {...props} />;

const MembershipFormSchema = Yup.object({
  checkboxOne: Yup.boolean()
    .oneOf([true], 'You must agree to the Individual Membership Policy')
    .required(),
  checkboxTwo: Yup.boolean()
    .oneOf([true], 'You must agree to the  QuidditchUK Media Usage Policy')
    .required(),
  checkboxThree: Yup.boolean()
    .oneOf(
      [true],
      'You must agree to the QuidditchUK membership and gameplay policies'
    )
    .required(),
});

const membershipFormSubmit = () => {
  setCookies('MEMBERSHIP_AGREED', true);
  Router.push('/dashboard/membership/purchase');
};

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

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(MembershipFormSchema),
    mode: 'onBlur',
    defaultValues: {
      checkboxOne: false,
      checkboxTwo: false,
      checkboxThree: false,
    },
  });

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
          {!currentProducts.length && (
            <Grid
              gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
              gridGap={{ base: 4, md: 9 }}
              borderRadius={1}
              bg="white"
              overflow="hidden"
            >
              <Box py={4} px={{ base: 4, sm: 8, md: 9 }}>
                <Heading px={4} as="h2" mb={0} fontFamily="body">
                  Membership Benefits
                </Heading>
                <Benefits>
                  <p>QuidditchUK Membership entitles a member to:</p>

                  <List>
                    <li>
                      <strong>
                        Eligibility to register for and compete at QuidditchUK
                        official events and QuidditchUK affiliated events.
                      </strong>
                    </li>
                    <li>
                      Eligibility to qualify for and compete in the European
                      Quidditch Cup.
                    </li>
                    <li>
                      Included under QuidditchUK Public Liability insurance
                      whenever training or competing with official QuidditchUK
                      clubs or events.
                    </li>
                    <li>
                      Access to coaching, refereeing, and snitching resources
                      and training provided by QuidditchUK.
                    </li>
                    <li>
                      Access to QuidditchUK grants and funding provided via your
                      club.
                    </li>
                    <li>
                      Eligibility to be scouted and selected for QuidditchUK
                      recognised national training squads.
                    </li>
                    <li>
                      Eligibility to be selected to compete at International
                      Quidditch Association competitions.
                    </li>
                    <li>
                      Coverage and regulation of transfers within European clubs
                      overseen by Quidditch Europe.
                    </li>
                    <li>Transfer between QuidditchUK Clubs.</li>
                    <li>
                      Access to discounts and perks from QuidditchUK through our
                      affiliated partners.
                    </li>
                    <li>Register under a single QuidditchUK Club.</li>
                  </List>
                </Benefits>

                <Flex
                  flexDirection="column"
                  alignItems="center"
                  py="5"
                  borderTopWidth="1px"
                  borderTopStyle="solid"
                  borderTopColor="qukBlue"
                >
                  <form onSubmit={handleSubmit(membershipFormSubmit)}>
                    <Box my="3">
                      <Label>
                        <input
                          type="checkbox"
                          name="checkboxOne"
                          ref={register}
                        />{' '}
                        I acknowledge that I have read, understood, and agree to
                        the{' '}
                        <a
                          href="https://prismic-io.s3.amazonaws.com/chaser/7a339771-8248-4244-b141-cd2eb39a0028_QuidditchUK+Individual+Membership+Policy+2020_2021.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Individual Membership Policy
                        </a>
                      </Label>

                      {errors.checkboxOne && (
                        <InlineError my="3">
                          {errors.checkboxOne.message}
                        </InlineError>
                      )}
                    </Box>

                    <Box my="3">
                      <Label>
                        <input
                          type="checkbox"
                          name="checkboxTwo"
                          ref={register}
                        />{' '}
                        I acknowledge that I have read, understood, and agree to
                        the{' '}
                        <a
                          href="https://prismic-io.s3.amazonaws.com/chaser/680b0ecd-ed85-487d-a727-3f5731f78bca_Media+Usage+Policy.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          QuidditchUK Media Usage Policy
                        </a>
                      </Label>

                      {errors.checkboxTwo && (
                        <InlineError my="3">
                          {errors.checkboxTwo.message}
                        </InlineError>
                      )}
                    </Box>

                    <Box my="3">
                      <Label>
                        <input
                          type="checkbox"
                          name="checkboxThree"
                          ref={register}
                        />{' '}
                        I agree to abide by the{' '}
                        <NextLink href="/about/documents-and-policies" passHref>
                          <Link color="monarchRed">
                            membership and gameplay policies
                          </Link>
                        </NextLink>{' '}
                        set out by QuidditchUK, and will uphold their values as
                        a member of the quidditch community.
                      </Label>

                      {errors.checkboxThree && (
                        <InlineError my="3">
                          {errors.checkboxThree.message}
                        </InlineError>
                      )}
                    </Box>

                    <Button type="submit" variant="qukBlue">
                      Purchase Membership
                    </Button>
                  </form>
                </Flex>
              </Box>

              <Box
                position="relative"
                backgroundImage={
                  'url("https://images.prismic.io/chaser/e8e1b385-cd00-469d-aa67-f66dca0d5491_trev_member_editQUK.jpg?auto=compress,format")'
                }
                backgroundColor="qukBlue"
                backgroundSize="cover"
                backgroundPosition="center"
                height="100%"
                width="100%"
                minHeight="300px"
              />
            </Grid>
          )}
          {!!currentProducts.length && (
            <>
              <Heading as="h2" fontFamily="body">
                Current Membership
              </Heading>
              <Grid
                gridTemplateColumns="1fr"
                gridGap={{ base: 4, sm: 8, md: 9 }}
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
              <Heading as="h2" fontFamily="body" pt="5">
                Past Memberships
              </Heading>
              <Grid
                gridTemplateColumns="1fr"
                gridGap={{ base: 4, sm: 8, md: 9 }}
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

export default ManageMembership;
