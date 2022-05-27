import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { object, string } from 'yup';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

import { getUserScopes, hasScope } from 'modules/scopes';
import { ADMIN, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import isAuthorized from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';

const handleDeleteClick = async ({ uuid, name, scope, refetch }) => {
  try {
    if (confirm(`Are you sure you want to delete ${name} as ${scope}?`)) {
      await api.delete(`/scopes/${scope}/user/${uuid}`);
      refetch();
    }
  } catch (error) {
    console.log(error);
  }
};

const FormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
});

const handleFormSubmit = async ({ values, reset, refetch }) => {
  try {
    await api.post('/scopes', values);
    reset({});
    refetch();
  } catch (err) {
    console.log(err);
  }
};

const Dashboard = ({ scopes, emt_members, admin_members }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(FormSchema),
    defaultValues: { email: '' },
  });

  const {
    control: controlAdmin,
    handleSubmit: handleSubmitAdmin,
    reset: resetAdmin,
    formState: { isSubmitting: isSubmittingAdmin },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(FormSchema),
    defaultValues: { email: '' },
  });

  const {
    data: queryEmtMembers,
    refetch: refetchEmt,
  } = useQuery(
    `/scopes/users/${EMT}`,
    () => api.get(`/scopes/users/${EMT}`).then(({ data }) => data),
    { initialData: emt_members, enabled: false }
  );

  const {
    data: queryAdminMembers,
    refetch: refetchAdmin,
  } = useQuery(
    `/scopes/users/${ADMIN}`,
    () => api.get(`/scopes/users/${ADMIN}`).then(({ data }) => data),
    { initialData: admin_members, enabled: false }
  );

  const { data: queryScopes, refetch: refetchScopes } = useQuery(
    `/users/me`,
    () =>
      api
        .get(`/users/me`)
        .then(({ data }) => data?.scopes?.map(({ scope }) => scope)),
    { initialData: scopes, enabled: false }
  );

  const refetchAll = () => {
    refetchScopes();
    refetchAdmin();
    refetchEmt();
  };

  return (
    <>
      <Meta subTitle="Volunteers Permissions" title="Admin Dashboard" />
      <Slice>
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading
            as="h3"
            fontFamily="body"
            color="qukBlue"
            display="flex"
            alignItems="center"
          >
            <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> Volunteer
            Permissions
          </Heading>
        </Flex>

        <Heading as="h4" fontFamily="body" color="qukBlue">
          EMT
        </Heading>

        <Box bg="white" borderRadius="lg">
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Scopes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {queryEmtMembers.map((user) => (
                  <Tr key={user?.uuid}>
                    <Td>
                      {user?.first_name} {user?.last_name}
                    </Td>
                    <Td>{user?.email}</Td>
                    <Td>{user?.scopes.map(({ scope }) => scope).join(', ')}</Td>
                    {hasScope([ADMIN], queryScopes) && (
                      <Td textAlign="right">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleDeleteClick({
                              name: user?.first_name,
                              uuid: user?.uuid,
                              scope: EMT,
                              refetch: refetchAll,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {hasScope([ADMIN], queryScopes) && (
          <form
            onSubmit={handleSubmit((values) =>
              handleFormSubmit({
                values: { scope: EMT, ...values },
                reset,
                refetch: refetchAll,
              })
            )}
          >
            <Flex flexDirection="row" mt={3}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email address"
                    id="email"
                  />
                )}
              />
              <Button type="submit" variant="primary" ml={2}>
                {isSubmitting ? 'Adding' : 'Add EMT'}
              </Button>
            </Flex>
          </form>
        )}

        <Heading as="h4" fontFamily="body" color="qukBlue">
          Admins
        </Heading>

        <Box bg="white" borderRadius="lg">
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Scopes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {queryAdminMembers.map((user) => (
                  <Tr key={user?.uuid}>
                    <Td>
                      {user?.first_name} {user?.last_name}
                    </Td>
                    <Td>{user?.email}</Td>
                    <Td>{user?.scopes.map(({ scope }) => scope).join(', ')}</Td>
                    {hasScope([ADMIN], queryScopes) && (
                      <Td textAlign="right">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleDeleteClick({
                              name: user?.first_name,
                              uuid: user?.uuid,
                              scope: ADMIN,
                              refetch: refetchAll,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {hasScope([ADMIN], queryScopes) && (
          <form
            onSubmit={handleSubmitAdmin((values) =>
              handleFormSubmit({
                values: { scope: ADMIN, ...values },
                reset: resetAdmin,
                refetch: refetchAll,
              })
            )}
          >
            <Flex flexDirection="row" mt={3}>
              <Controller
                control={controlAdmin}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email address"
                    id="email"
                  />
                )}
              />
              <Button type="submit" variant="primary" ml={2}>
                {isSubmittingAdmin ? 'Adding' : 'Add Admin'}
              </Button>
            </Flex>
          </form>
        )}
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [EMT]);
  if (!auth) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  const requestHeaders = {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  };

  const [
    scopes,
    { data: emt_members },
    { data: admin_members },
    basePageProps,
  ] = await Promise.all([
    getUserScopes(AUTHENTICATION_TOKEN),
    api.get(`/scopes/users/${EMT}`, requestHeaders),
    api.get(`/scopes/users/${ADMIN}`, requestHeaders),
    getBasePageProps(),
  ]);

  return {
    props: {
      emt_members,
      admin_members,
      scopes,
      ...basePageProps,
    },
  };
};

export default Dashboard;
