import { useEffect, useState } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';
import generateServerSideHeaders from 'modules/headers';
import {
  Box,
  Flex,
  Heading,
  Grid,
  Text,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { orderBy } from 'lodash';

import transfersService from 'services/transfers';
import settingsService from 'services/settings';

import { getUserScopes, hasScope } from 'modules/scopes';
import { TRANSFER_READ, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import isAuthorized from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';
import Table from 'components/shared/table';
import useCachedResponse from 'hooks/useCachedResponse';
import Pagination from 'components/shared/pagination';
import TransferCard from 'components/transfers/transferCard';

const STATUS = {
  APPROVED: 'Approved',
  DECLINED: 'Declined',
};

const Transfers = ({
  scopes,
  actionedTransfers,
  pendingTransfers,
  settings,
  pages,
}) => {
  const [page, setPage] = useState(0);

  const {
    data: queryPendingTransfers,
    refetch: refetchPending,
  } = useCachedResponse({
    queryKey: '/transfers/pending',
    queryFn: transfersService.getPendingTransfers,
    initialData: pendingTransfers,
    keepPreviousData: true,
  });

  const {
    data: queryActionedTransfers,
    refetch: refetchActioned,
  } = useCachedResponse({
    queryKey: ['/transfers/actioned', page],
    queryFn: () => transfersService.getActionedTransfers({ page }),
    selector: (res) => res?.data?.transfers,
    initialData: actionedTransfers,
    keepPreviousData: true,
  });

  const { data: querySettings, refetch: refetchSettings } = useCachedResponse({
    queryKey: '/settings',
    queryFn: settingsService?.getSettings,
    initialData: settings,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { control, watch } = useForm({
    defaultValues: {
      transfer_window: settings?.transfer_window,
    },
  });

  const watchTransfer = watch('transfer_window');

  useEffect(() => {
    const update = async () => {
      if (watchTransfer !== querySettings?.transfer_window) {
        await settingsService.updateSettings({
          data: { transfer_window: watchTransfer },
        });
        refetchSettings();
      }
    };

    update();
  }, [watchTransfer, querySettings, refetchSettings]);

  const refetchAll = () => {
    refetchPending();
    refetchActioned();
  };

  const actionedTransfersTableData = orderBy(
    queryActionedTransfers,
    ['updated'],
    'desc'
  ).map((transfer) => ({
    key: transfer?.uuid,
    data: [
      {
        key: 'name',
        children: (
          <>
            {transfer?.user?.first_name} {transfer?.user?.last_name}
          </>
        ),
      },
      {
        key: 'prevClub',
        children: <>{transfer?.prevClub?.name}</>,
      },
      {
        key: 'newClub',
        children: <>{transfer?.newClub?.name}</>,
      },
      {
        key: 'status',
        color: transfer.status === 'APPROVED' ? 'keeperGreen' : 'monarchRed',
        fontWeight: 'bold',
        children: <>{STATUS[transfer.status]}</>,
      },
      {
        key: 'actionedBy',
        children: (
          <>
            {transfer?.actioned_by && (
              <>
                {transfer.actionedBy.first_name} {transfer.actionedBy.last_name}
              </>
            )}
          </>
        ),
      },
      {
        key: 'date',
        children: (
          <>{format(new Date(transfer?.updated), 'd/MM/yyyy h:mm a')}</>
        ),
      },
    ],
  }));

  return (
    <>
      <Meta subTitle="Transfers" title="Admin Dashboard" />
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
            <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> Transfers
          </Heading>

          <form>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="end"
            >
              <FormLabel htmlFor="transfer_window" mb="0">
                <Heading
                  as="h4"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="lg"
                >
                  Accepting Transfers
                </Heading>
              </FormLabel>
              <Controller
                control={control}
                name="transfer_window"
                render={({ field }) => (
                  <Switch
                    {...field}
                    isChecked={field.value}
                    isDisabled={!hasScope([EMT], scopes)}
                    id="transfer_window"
                    colorScheme="green"
                    size="lg"
                  />
                )}
              />
            </FormControl>
          </form>
        </Flex>

        <Heading as="h4" fontFamily="body" color="qukBlue">
          Pending Transfers
        </Heading>

        {queryPendingTransfers?.length === 0 && (
          <Text fontSize="2xl" textAlign="center">
            No transfers currently pending
          </Text>
        )}

        <Grid gridGap={4} gridTemplateColumns="1fr">
          {queryPendingTransfers?.map((transfer) => (
            <TransferCard
              transfer={transfer}
              key={transfer?.uuid}
              scopes={scopes}
              refetchAll={refetchAll}
            />
          ))}
        </Grid>

        <Heading as="h4" fontFamily="body" color="qukBlue">
          Actioned Transfers
        </Heading>

        <Box bg="white" borderRadius="lg">
          <Table
            columns={[
              'Name',
              'Old Club',
              'New Club',
              'Status',
              'Actioned By',
              'Date',
            ]}
            rows={actionedTransfersTableData}
          />
        </Box>

        <Pagination pages={pages} page={page} setPage={setPage} />
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [TRANSFER_READ, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const [
    scopes,
    { data: pendingTransfers },
    { data: actionedTransfers },
    { data: settings },
    basePageProps,
  ] = await Promise.all([
    getUserScopes(headers),
    transfersService.getPendingTransfers({ headers }),
    transfersService.getActionedTransfers({ page: 0, headers }),
    settingsService.getSettings(),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      pendingTransfers,
      actionedTransfers: actionedTransfers?.transfers,
      pages: actionedTransfers?.pages,
      settings,
      ...basePageProps,
    },
  };
};

export default Transfers;
