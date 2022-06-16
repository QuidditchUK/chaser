import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import parse from 'date-fns/parse';
import { orderBy } from 'lodash';
import Router from 'next/router';
import format from 'date-fns/format';
import { object, string, bool } from 'yup';
import { useQuery } from 'react-query';

import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import isAuthorized from 'modules/auth';
import {
  Box,
  Grid,
  Flex,
  Heading,
  Select,
  Checkbox,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import TransferRequestForm from 'components/dashboard/transfer-request-form';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const Content = dynamic(() => import('components/shared/content'));
const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Required = dynamic(() => import('components/formControls/required'));

const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

const STATUS = {
  APPROVED: {
    label: 'Approved',
    color: 'keeperGreen',
  },
  DECLINED: {
    label: 'Declined',
    color: 'monarchRed',
  },
  PENDING: {
    label: 'Pending',
    color: 'qukBlue',
  },
};

import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';
import PrismicClubCard from 'components/prismic/club-card';
import { getBasePageProps } from 'modules/prismic';

const SelectClubSchema = object().shape({
  club_uuid: string().nullable().required('Required'),
  confirm: bool().oneOf(
    [true],
    'Please confirm that you have read the disclaimer'
  ),
});

const handleClubSubmit = async ({ club_uuid }, setServerError) => {
  try {
    setServerError(null);

    await api.put('/users/me', { club_uuid });

    event({
      category: CATEGORIES.MEMBERSHIP,
      action: 'Club selected',
    });

    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ManageClub = ({ user, clubs = [], settings }) => {
  const { data: queryUser, refetch } = useQuery(
    '/users/me',
    () => api.get('/users/me').then(({ data }) => data),
    { initialData: user }
  );

  const [selectedClub, setSelectedClub] = useState(
    clubs.find(({ uuid }) => uuid === queryUser?.club_uuid)
  );
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SelectClubSchema),
    defaultValues: {
      club_uuid: queryUser?.club_uuid,
      confirm: false,
    },
  });

  const currentSelectedClubUuid = watch('club_uuid', queryUser?.club_uuid);

  useEffect(() => {
    if (selectedClub?.uuid !== currentSelectedClubUuid) {
      setSelectedClub(
        clubs.find(({ uuid }) => uuid === currentSelectedClubUuid)
      );
    }
  }, [selectedClub, setSelectedClub, currentSelectedClubUuid, clubs]);

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
          <Grid
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gridGap={{ base: 4, md: 9 }}
          >
            <Box
              bg="white"
              py={4}
              px={{ base: 4, sm: 8, md: 9 }}
              borderRadius="md"
            >
              <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="3xl">
                {queryUser?.club_uuid ? 'Your club' : 'Select your club'}
              </Heading>

              <Content>
                {queryUser?.club_uuid ? (
                  <>
                    <p>
                      You have selected <strong>{selectedClub?.name}</strong> as
                      your QuidditchUK Club.
                    </p>
                    <p>
                      If you need to change your club, you must submit a
                      transfer request to QuidditchUK to request any changes.
                    </p>
                    <p>
                      The transfer window is currently{' '}
                      <strong>
                        {settings.transfer_window ? 'Open' : 'Closed'}.
                      </strong>
                    </p>
                    <p>
                      {queryUser?.transfers.some(
                        (transfer) => transfer.status === 'PENDING'
                      )
                        ? 'Your transfer request is currently being reviewed.'
                        : settings.transfer_window
                        ? 'You can submit a Transfer request using the form below.'
                        : ''}{' '}
                      {settings?.transfer_window ? (
                        'Transfer requests are subject to review to ensure all relevant gameplay policies are adhered to.'
                      ) : (
                        <>
                          Any transfer requests outside the transfer window must
                          be emailed to{' '}
                          <Link
                            href="mailto:clubs@quidditchuk.org"
                            color="monarchRed"
                            fontWeight="bold"
                          >
                            clubs@quidditchuk.org
                          </Link>
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Before confirming, please double check that you have
                      selected the correct club and they know you are joining
                      them this competitive season.
                    </p>
                    <p>
                      Please note that once you have chosen and locked in your
                      club you will not be able to undo it, and any changes will
                      have to be requested via a Transfer Request to
                      QuidditchUK.
                    </p>
                  </>
                )}
              </Content>

              {!queryUser?.club_uuid && (
                <form
                  onSubmit={handleSubmit((values) =>
                    handleClubSubmit(values, setServerError)
                  )}
                >
                  <Grid gridTemplateColumns="1fr" mt={5}>
                    <Label htmlFor="club_uuid" mb="2">
                      Select your club <Required />
                    </Label>

                    <Controller
                      control={control}
                      name="club_uuid"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="club_uuid"
                          as="select"
                          placeholder="Select a club"
                          bg="white"
                          color="qukBlue"
                          mb={3}
                        >
                          {clubs.map((club) => (
                            <option key={club.uuid} value={club.uuid}>
                              {club.name}
                            </option>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.club_uuid && (
                      <InlineError mb={3}>
                        {errors.club_uuid.message}
                      </InlineError>
                    )}
                    <Label mt="3">
                      <Controller
                        control={control}
                        name="confirm"
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            id="confirm"
                            spacing={3}
                            isChecked={field.value}
                          >
                            By checking this box I acknowledge that I have read
                            the above disclaimer and I intend for{' '}
                            <strong>{selectedClub?.name}</strong> to be my
                            QuidditchUK club for the 2022/2023 Season.
                          </Checkbox>
                        )}
                      />
                    </Label>

                    {errors.confirm && (
                      <InlineError mb={3}>{errors.confirm.message}</InlineError>
                    )}
                  </Grid>

                  <Button
                    mt="2"
                    type="submit"
                    variant="green"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting' : 'Select my club'}
                  </Button>
                </form>
              )}

              {serverError && <InlineError my={3}>{serverError}</InlineError>}
            </Box>
            {selectedClub && (
              <Flex flexDirection="column" key={selectedClub?.uuid}>
                <PrismicClubCard uid={selectedClub?.slug} />
              </Flex>
            )}
          </Grid>

          {settings?.transfer_window &&
            queryUser?.transfers?.every(
              (transfer) => transfer?.status !== 'PENDING'
            ) && (
              <Grid gridTemplateColumns="1fr">
                <TransferRequestForm
                  currentClub={queryUser?.club_uuid}
                  clubs={clubs}
                  callback={refetch}
                />
              </Grid>
            )}

          {queryUser?.transfers?.length > 0 && (
            <>
              <Heading fontFamily="body" color="qukBlue">
                Transfer History
              </Heading>

              <Box bg="white" borderRadius="lg">
                <TableContainer>
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Old Club</Th>
                        <Th>New Club</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orderBy(queryUser?.transfers, ['updated'], 'desc').map(
                        (transfer) => (
                          <Tr key={transfer?.uuid}>
                            <Td>{transfer?.prevClub?.name}</Td>
                            <Td>{transfer?.newClub?.name}</Td>
                            <Td
                              color={STATUS[transfer.status].color}
                              fontWeight="bold"
                            >
                              {STATUS[transfer.status].label}
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  if (!isAuthorized(req, res)) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  const requestHeaders = {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  };

  const [
    { data: clubs },
    { data: user },
    { data: products },
    { data: settings },
    basePageProps,
  ] = await Promise.all([
    api.get('/clubs/search'),
    api.get('/users/me', requestHeaders),
    api.get('/products/me', requestHeaders),
    api.get('/settings'),
    getBasePageProps(),
  ]);

  if (
    !products.length ||
    !products.filter(
      (product) =>
        new Date() < parse(product?.metadata?.expires, 'dd-MM-yyyy', new Date())
    ).length
  ) {
    res.setHeader('location', '/dashboard/membership/manage');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: {
      clubs,
      user,
      settings,
      ...basePageProps,
    },
  };
};

export default ManageClub;
