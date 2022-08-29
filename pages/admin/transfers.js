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
  Tr,
  Td,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { orderBy } from 'lodash';
import Switch from 'components/formControls/switch';

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
import ManualTransferForm from 'components/transfers/manualTransferForm';
import Button from 'components/shared/button';

const STATUS = {
  APPROVED: 'Approved',
  DECLINED: 'Declined',
};

const Transfers = ({ scopes, settings }) => {
  const [page, setPage] = useState(0);

  const pendingTransfersRes = useCachedResponse({
    queryKey: '/transfers/pending',
    queryFn: transfersService.getPendingTransfers,
    keepPreviousData: true,
  });

  const actionedTransfersRes = useCachedResponse({
    queryKey: ['/transfers/actioned', page],
    queryFn: () => transfersService.getActionedTransfers({ page }),
    keepPreviousData: true,
  });

  const { data: queryPendingTransfers, refetch: refetchPending } =
    pendingTransfersRes;
  const { data: queryActionedTransfers, refetch: refetchActioned } =
    actionedTransfersRes;

  const { data: querySettings, refetch: refetchSettings } = useCachedResponse({
    queryKey: '/settings',
    queryFn: settingsService?.getSettings,
    initialData: settings,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { register, watch } = useForm({
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Meta subTitle="Transfers" title="Admin Dashboard" />
      <Slice>
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
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
            <Switch
              label="Accepting Transfers"
              id="transfer_window"
              colorScheme="green"
              size="lg"
              display="flex"
              alignItems="center"
              justifyContent="end"
              color="qukBlue"
              fontSize="lg"
              fontWeight="bold"
              isDisabled={!hasScope([EMT], scopes)}
              {...register('transfer_window')}
            />
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

        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Heading as="h4" fontFamily="body" color="qukBlue">
            Actioned Transfers
          </Heading>

          <Button variant="green" onClick={onOpen}>
            Manual Transfer
          </Button>
        </Flex>

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
            isLoading={actionedTransfersRes?.isLoading}
            skeletonRows={10}
          >
            {orderBy(
              queryActionedTransfers?.transfers,
              ['updated'],
              'desc'
            ).map((transfer) => (
              <Tr key={transfer?.uuid}>
                <Td>
                  {transfer?.user?.first_name} {transfer?.user?.last_name}
                </Td>
                <Td>{transfer?.prevClub?.name}</Td>
                <Td>{transfer?.newClub?.name}</Td>
                <Td
                  color={
                    transfer.status === 'APPROVED'
                      ? 'keeperGreen'
                      : 'monarchRed'
                  }
                  fontWeight="bold"
                >
                  {STATUS[transfer.status]}
                </Td>

                <Td>
                  {transfer?.actioned_by && (
                    <>
                      {transfer.actionedBy.first_name}{' '}
                      {transfer.actionedBy.last_name}
                    </>
                  )}
                </Td>

                <Td>
                  {format(new Date(transfer?.updated), 'd/MM/yyyy h:mm a')}
                </Td>
              </Tr>
            ))}
          </Table>
        </Box>

        <Pagination
          pages={queryActionedTransfers?.pages}
          page={page}
          setPage={setPage}
        />
      </Slice>

      <ManualTransferForm
        isOpen={isOpen}
        onClose={onClose}
        refetchActioned={refetchActioned}
      />
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [TRANSFER_READ, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const [scopes, { data: settings }, basePageProps] = await Promise.all([
    getUserScopes(headers),
    settingsService.getSettings(),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      settings,
      ...basePageProps,
    },
  };
};

export default Transfers;
