import { useEffect, useState } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';

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

import { getPlainScopes, hasScope } from 'modules/scopes';
import { TRANSFER_READ, EMT, TRANSFER_WRITE } from 'constants/scopes';
import Slice from 'components/shared/slice';
import { isScoped_ServerProps } from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';
import Table from 'components/shared/table';
import useCachedResponse from 'hooks/useCachedResponse';
import Pagination from 'components/shared/pagination';
import TransferCard from 'components/transfers/transferCard';
import ManualTransferForm from 'components/transfers/manualTransferForm';
import Button from 'components/shared/button';
import { GetServerSideProps } from 'next';
import {
  system_settings as PrismaSystemSetting,
  transfers as PrismaTransfer,
} from '@prisma/client';
import { AdminTransferWithRelations } from 'types/transfer';
import useMe from 'hooks/useMe';

const STATUS = {
  APPROVED: 'Approved',
  DECLINED: 'Declined',
};

const Transfers = ({ settings }: { settings: PrismaSystemSetting }) => {
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const [page, setPage] = useState(0);

  const pendingTransfersRes = useCachedResponse<PrismaTransfer[]>({
    queryKey: '/transfers/pending',
    queryFn: transfersService.getPendingTransfers,
    keepPreviousData: true,
  });

  const actionedTransfersRes = useCachedResponse<{
    transfers: AdminTransferWithRelations[];
    pages: number;
  }>({
    queryKey: ['/transfers/actioned', page],
    queryFn: () => transfersService.getActionedTransfers({ page }),
    keepPreviousData: true,
  });

  const { data: queryPendingTransfers, refetch: refetchPending } =
    pendingTransfersRes;
  const { data: queryActionedTransfers, refetch: refetchActioned } =
    actionedTransfersRes;

  const { data: querySettings, refetch: refetchSettings } =
    useCachedResponse<PrismaSystemSetting>({
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
              isDisabled={!hasScope([EMT], userScopes)}
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
              scopes={userScopes}
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

          {hasScope([EMT, TRANSFER_WRITE], userScopes) && (
            <Button variant="green" onClick={onOpen}>
              Manual Transfer
            </Button>
          )}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [TRANSFER_READ, EMT]);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const [{ data: settings }, basePageProps] = await Promise.all([
    settingsService.getSettings(),
    getBasePageProps(),
  ]);

  return {
    props: {
      settings,
      ...basePageProps,
    },
  };
};

export default Transfers;

Transfers.auth = {
  skeleton: <Box />,
};
