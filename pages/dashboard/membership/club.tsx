import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import parse from 'date-fns/parse';
import { orderBy } from 'lodash';
import Router from 'next/router';
import { object, string, bool } from 'yup';

import { Box, Grid, Flex, Heading, Link, Tr, Td } from '@chakra-ui/react';
import TransferRequestForm from 'components/dashboard/transfer-request-form';
import settingsService from 'services/settings';
import Select from 'components/formControls/select';

import PrismicClubCard from 'components/prismic/club-card';
import { getBasePageProps } from 'modules/prismic';
import usersService from 'services/users';
import clubsService from 'services/clubs';
import productsService from 'services/products';
import Checkbox from 'components/formControls/checkbox';
import Slice from 'components/shared/slice';
import Table from 'components/shared/table';
import Error from 'components/shared/errors';
import { GetServerSideProps } from 'next';
import generateServerSideHeaders from 'modules/headers';
import useMe from 'hooks/useMe';

const Meta = dynamic(() => import('components/shared/meta'));
const Content = dynamic(() => import('components/shared/content'));
const Button = dynamic(() => import('components/shared/button'));

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
    await usersService.updateUser({ data: { club_uuid } });

    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ManageClub = ({ clubs = [], settings }) => {
  const { data: user, refetch } = useMe();

  const [selectedClub, setSelectedClub] = useState(
    clubs.find(({ uuid }) => uuid === user?.club_uuid)
  );
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SelectClubSchema),
    defaultValues: {
      club_uuid: user?.club_uuid,
      confirm: false,
    },
  });

  const hasPendingTransfer = user?.transfers?.some(
    (transfer) => transfer?.status === 'PENDING'
  );
  const canTransfer =
    settings?.transfer_window && !hasPendingTransfer && user?.club_uuid;

  const currentSelectedClubUuid = watch('club_uuid', user?.club_uuid);

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
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Slice>
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
              {user?.club_uuid ? 'Your club' : 'Select your club'}
            </Heading>

            <Content>
              {user?.club_uuid ? (
                <>
                  <p>
                    You have selected <strong>{selectedClub?.name}</strong> as
                    your QuadballUK Club.
                  </p>
                  <p>
                    If you need to change your club, you must submit a transfer
                    request to QuadballUK to request any changes.
                  </p>
                  <p>
                    The transfer window is currently{' '}
                    <strong>
                      {settings.transfer_window ? 'Open' : 'Closed'}.
                    </strong>
                  </p>
                  <p>
                    {user?.transfers.some(
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
                    selected the correct club and they know you are joining them
                    this competitive season.
                  </p>
                  <p>
                    Please note that once you have chosen and locked in your
                    club you will not be able to undo it, and any changes will
                    have to be requested via a Transfer Request to QuadballUK.
                  </p>
                </>
              )}
            </Content>

            {!user?.club_uuid && (
              <form
                onSubmit={handleSubmit((values) =>
                  handleClubSubmit(values, setServerError)
                )}
              >
                <Grid gridTemplateColumns="1fr" mt={5} gridGap={3}>
                  <Select
                    label="Select your club"
                    isRequired={true}
                    id="club_uuid"
                    placeholder="Select a club"
                    options={clubs?.map((club) => ({
                      value: club.uuid,
                      label: club.name,
                    }))}
                    error={errors.club_uuid}
                    {...register('club_uuid')}
                  />

                  <Checkbox
                    id="confirm"
                    {...register('confirm')}
                    size="md"
                    error={errors?.confirm}
                    isRequired={true}
                  >
                    By checking this box I acknowledge that I have read the
                    above disclaimer and I intend for{' '}
                    <strong>{selectedClub?.name}</strong> to be my QuadballUK
                    club for the 2022/2023 Season.
                  </Checkbox>

                  <Button
                    mt="2"
                    type="submit"
                    variant="green"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting' : 'Select my club'}
                  </Button>
                </Grid>
              </form>
            )}

            {serverError && <Error>{serverError}</Error>}
          </Box>
          {selectedClub && (
            <Flex flexDirection="column" key={selectedClub?.uuid}>
              <PrismicClubCard uid={selectedClub?.slug} />
            </Flex>
          )}
        </Grid>

        {canTransfer && (
          <Grid gridTemplateColumns="1fr">
            <TransferRequestForm
              currentClub={user?.club_uuid}
              clubs={clubs}
              callback={refetch}
            />
          </Grid>
        )}

        {user?.transfers?.length > 0 && (
          <>
            <Heading fontFamily="body" color="qukBlue">
              Transfer History
            </Heading>

            <Box bg="white" borderRadius="lg">
              <Table columns={['Old Club', 'New Club', 'Status']}>
                {orderBy(user?.transfers, ['updated'], 'desc').map(
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
              </Table>
            </Box>
          </>
        )}
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const headers = generateServerSideHeaders(req);
  const { data } = await productsService.getUserProducts({ headers });
  const { products } = data;

  if (
    !products.length ||
    !products.filter(
      (product) =>
        new Date() < parse(product?.metadata?.expires, 'dd-MM-yyyy', new Date())
    ).length
  ) {
    return {
      redirect: {
        destination: '/dashboard/membership/manage',
        permanent: false,
      },
    };
  }

  const [{ data: clubsData }, { data: settingsData }, basePageProps] =
    await Promise.all([
      clubsService.getPublicClubs(),
      settingsService.getSettings(),
      getBasePageProps(),
    ]);

  return {
    props: {
      clubs: clubsData.clubs,
      settings: settingsData.settings,
      ...basePageProps,
    },
  };
};

export default ManageClub;

ManageClub.auth = {
  skeleton: <Box />,
};
