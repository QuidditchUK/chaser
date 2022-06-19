import { useState, useEffect } from 'react';
import Link from 'next/link';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import {
  Heading,
  Grid,
  Flex,
  Switch,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
} from '@chakra-ui/react';
import { CheckIcon, ChevronRightIcon, DownloadIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { getUserScopes } from 'modules/scopes';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Meta from 'components/shared/meta';

import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import useCSVDownload from 'hooks/useCSVDownload';
import { format, parse } from 'date-fns';

const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Required = dynamic(() => import('components/formControls/required'));
const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

const LEAGUES = ['Community', 'University'];

const EditClubSchema = object().shape({
  email: string()
    .nullable()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  name: string().nullable().required('Please enter a Club Name'),
  slug: string().nullable().required('Please enter the Prismic Club UID'),
  active: bool().required(),
  league: string()
    .nullable()
    .required('Please select the league the club plays in'),
});

const getProductName = (member) => {
  return parse(
    member?.stripe_products[member?.stripe_products?.length - 1]?.products
      ?.expires,
    'dd-MM-yyyy',
    new Date()
  ) > new Date()
    ? member?.stripe_products[member?.stripe_products?.length - 1]?.products
        ?.description
    : 'Expired';
};

const handleEditSubmit = async (
  uuid,
  values,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put(`clubs/${uuid}`, values);

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};
const Dashboard = ({ club, members }) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [serverSuccess]);

  const { call, isLoading } = useCSVDownload({
    data: [
      ['first_name', 'last_name', 'membership'],
      ...members.map((member) => [
        member.first_name,
        member.last_name,
        getProductName(member),
      ]),
    ],
    filename: `${club?.name}-members-${format(new Date(), 'yyyy-MM-dd')}.csv`,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(EditClubSchema),
    defaultValues: {
      email: club?.email,
      name: club?.name,
      slug: club?.slug,
      active: club?.active || false,
      league: club?.league,
    },
  });

  return (
    <>
      <Meta subTitle={club?.name} title="Clubs Admin Dashboard" />
      <Slice>
        <Heading
          as="h3"
          fontFamily="body"
          color="qukBlue"
          display="flex"
          alignItems="center"
        >
          <Link href="/admin">Dashboard</Link> <ChevronRightIcon />{' '}
          <Link href="/admin/clubs/">Clubs</Link> <ChevronRightIcon />{' '}
          {club?.name}
        </Heading>
        <form
          onSubmit={handleSubmit((values) =>
            handleEditSubmit(
              club?.uuid,
              values,
              setServerError,
              setServerSuccess
            )
          )}
        >
          <Grid
            bg="gray.100"
            p={4}
            borderRadius="lg"
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            width="100%"
          >
            <Flex direction="column">
              <Label htmlFor="name">
                Name <Required />
              </Label>

              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Club name"
                    my={3}
                    error={errors.name}
                  />
                )}
              />

              {errors.name && (
                <InlineError marginBottom={3}>
                  {errors.name.message}
                </InlineError>
              )}

              <Label htmlFor="email">
                Email Address <Required />
              </Label>

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    placeholder="Club email address"
                    my={3}
                    error={errors.email}
                  />
                )}
              />

              {errors.email && (
                <InlineError marginBottom={3}>
                  {errors.email.message}
                </InlineError>
              )}

              <Label htmlFor="slug">
                Prismic UID <Required />
              </Label>

              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="slug"
                    placeholder="Enter the Club Prismic UID e.g. london-quidditch-club"
                    my={3}
                    error={errors.slug}
                  />
                )}
              />

              {errors.slug && (
                <InlineError marginBottom={3}>
                  {errors.slug.message}
                </InlineError>
              )}

              <Label htmlFor="email">
                League <Required />
              </Label>

              <Controller
                control={control}
                name="league"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="league"
                    my={3}
                    placeholder="Select league the team plays in"
                    bg="white"
                    color="qukBlue"
                  >
                    {LEAGUES.map((league) => (
                      <option key={league} value={league}>
                        {league}
                      </option>
                    ))}
                  </Select>
                )}
              />

              {errors.league && (
                <InlineError marginBottom={3}>
                  {errors.league.message}
                </InlineError>
              )}

              <Label htmlFor="active">
                Is the club active? <Required />
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <Switch
                      {...field}
                      isChecked={field.value}
                      id="active"
                      colorScheme="green"
                      ml={3}
                      my={3}
                      size="lg"
                    />
                  )}
                />
              </Label>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Update'}
              </Button>
            </Flex>
          </Grid>
        </form>

        {serverError && (
          <>
            <InlineError my={3}>{serverError}</InlineError>
          </>
        )}

        {serverSuccess && (
          <Flex
            alignItems="center"
            bg="keeperGreen"
            px={4}
            py={1}
            mt={6}
            borderColor="keeperGreen"
            borderWidth="1px"
            borderStyle="solid"
            color="white"
            borderRadius="md"
          >
            <CheckIcon mr={3} /> <Text fontWeight="bold">Club updated</Text>
          </Flex>
        )}

        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading as="h4" fontFamily="body" color="qukBlue">
            Players
          </Heading>

          <Button
            variant="transparent"
            borderColor="qukBlue"
            color="qukBlue"
            _hover={{ bg: 'gray.300' }}
            rightIcon={<DownloadIcon />}
            onClick={call}
            disabled={isLoading}
          >
            {isLoading ? 'Downloading...' : 'Download CSV'}
          </Button>
        </Flex>

        <Box bg="white" borderRadius="lg">
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Membership</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members?.map((member) => (
                  <Tr key={member?.email}>
                    <Td>
                      {member?.first_name} {member?.last_name}
                    </Td>
                    <Td>{member?.email}</Td>
                    <Td fontWeight="bold">
                      {parse(
                        member?.stripe_products[
                          member?.stripe_products.length - 1
                        ]?.products?.expires,
                        'dd-MM-yyyy',
                        new Date()
                      ) > new Date() ? (
                        <Text color="qukBlue">
                          {
                            member?.stripe_products[
                              member?.stripe_products.length - 1
                            ]?.products?.description
                          }
                        </Text>
                      ) : (
                        <Text color="monarchRed">Expired</Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  const auth = await isAuthorized(req, res, [CLUBS_READ, CLUBS_WRITE, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);
  const [
    scopes,
    { data: club },
    { data: members },
    basePageProps,
  ] = await Promise.all([
    getUserScopes(AUTHENTICATION_TOKEN),
    api.get(`/clubs/${params?.uid}`, {
      headers: { Authorization: `Bearer ${AUTHENTICATION_TOKEN}` },
    }),
    api.get(`/clubs/${params?.uid}/members`, {
      headers: { Authorization: `Bearer ${AUTHENTICATION_TOKEN}` },
    }),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      club,
      members,
      ...basePageProps,
    },
  };
};

export default Dashboard;
