import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import format from 'date-fns/format';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Flex,
  Heading,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { orderBy } from 'lodash';

import DescriptionList, {
  Description,
} from 'components/shared/description-list';
import { getUserScopes, hasScope } from 'modules/scopes';
import { TRANSFER_READ, EMT, TRANSFER_WRITE } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Button from 'components/shared/button';
import isAuthorized from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';

const handleConfirmClick = async ({ transfer_uuid, refetch, method }) => {
  try {
    await api.put(`/transfers/${transfer_uuid}/${method}`);
    refetch();
  } catch (error) {
    console.log(error);
  }
};

const STATUS = {
  APPROVED: 'Approved',
  DECLINED: 'Declined',
};

const Dashboard = ({ scopes, transfers, settings }) => {
  const {
    isOpen: isOpenApprove,
    onOpen: onOpenApprove,
    onClose: onCloseApprove,
  } = useDisclosure();
  const {
    isOpen: isOpenDecline,
    onOpen: onOpenDecline,
    onClose: onCloseDecline,
  } = useDisclosure();

  const [selectedTransfer, setSelectedTransfer] = useState();

  const { data: queryTransfers, refetch } = useQuery(
    '/transfers',
    () => api.get('/transfers').then(({ data }) => data),
    { initialData: transfers }
  );

  const { data: querySettings, refetch: refetchSettings } = useQuery(
    '/settings',
    () => api.get('/settings').then(({ data }) => data),
    {
      initialData: settings,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const [pendingTransfers, actionedTransfers] = queryTransfers?.reduce(
    (result, transfer) => {
      result[transfer?.status === 'PENDING' ? 0 : 1].push(transfer);
      return result;
    },
    [[], []]
  );

  const { control, watch } = useForm({
    defaultValues: {
      transfer_window: settings?.transfer_window,
    },
  });

  const watchTransfer = watch('transfer_window');

  useEffect(() => {
    const update = async () => {
      if (watchTransfer !== querySettings?.transfer_window) {
        await api.post('/settings', { transfer_window: watchTransfer });
        refetchSettings();
      }
    };

    update();
  }, [watchTransfer, querySettings, refetchSettings]);

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

        {pendingTransfers.length === 0 && (
          <Text fontSize="2xl" textAlign="center">
            No transfers currently pending
          </Text>
        )}

        <Grid gridGap={4} gridTemplateColumns="1fr">
          {pendingTransfers.map((transfer) => (
            <Grid
              bg="white"
              borderRadius="lg"
              key={transfer.uuid}
              gridColumnGap={4}
              gridRowGap={0}
              gridTemplateColumns="1fr 3fr 1fr"
              p={4}
            >
              <Text fontSize="sm" color="gray.600" mt={0} fontWeight="bold">
                Member
              </Text>
              <Text fontSize="sm" color="gray.600" mt={0} fontWeight="bold">
                Transfer
              </Text>
              <Text fontSize="sm" color="gray.600" mt={0} fontWeight="bold">
                Actions
              </Text>

              <Heading
                as="h5"
                fontSize="2xl"
                fontFamily="body"
                color="qukBlue"
                my={0}
                alignSelf="center"
              >
                {transfer?.user?.first_name} {transfer?.user?.last_name}
              </Heading>

              <Heading
                as="h5"
                fontSize="2xl"
                fontFamily="body"
                color="qukBlue"
                my={0}
                alignSelf="center"
              >
                <Box as="span" color="gray.500">
                  {transfer?.prevClub?.name}
                </Box>{' '}
                ⟶ {transfer?.newClub?.name}
              </Heading>

              <Box alignSelf="center">
                {hasScope([EMT, TRANSFER_WRITE], scopes) && (
                  <>
                    <Flex flexDirection="row">
                      <Button
                        variant="green"
                        onClick={() => {
                          setSelectedTransfer(transfer);
                          onOpenApprove();
                        }}
                        mr={2}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedTransfer(transfer);
                          onOpenDecline();
                        }}
                      >
                        Decline
                      </Button>
                    </Flex>
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Heading as="h4" fontFamily="body" color="qukBlue">
          Actioned Transfers
        </Heading>

        <Box bg="white" borderRadius="lg">
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Old Club</Th>
                  <Th>New Club</Th>
                  <Th>Status</Th>
                  <Th>Actioned By</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderBy(actionedTransfers, ['updated'], 'desc').map(
                  (transfer) => (
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
                        {format(
                          new Date(transfer?.updated),
                          'd/MM/yyyy h:mm a'
                        )}
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Slice>

      <Modal isOpen={isOpenApprove} onClose={onCloseApprove}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Transfer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              I confirm I am approving the following transfer. Once approved a
              transfer is <strong>final</strong> and the player & clubs will be
              notified of the transfer.
            </Text>
            <DescriptionList>
              <Description
                term="Member"
                description={`${selectedTransfer?.user?.first_name} ${selectedTransfer?.user?.last_name}`}
              />
              <Description
                term="Old Club"
                description={selectedTransfer?.prevClub.name}
              />
              <Description
                term="New Club"
                description={selectedTransfer?.newClub.name}
              />
            </DescriptionList>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="green"
              onClick={() => {
                handleConfirmClick({
                  transfer_uuid: selectedTransfer?.uuid,
                  refetch,
                  method: 'approve',
                });
                onCloseApprove();
              }}
            >
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDecline} onClose={onCloseDecline}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Decline Transfer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              I confirm I am declining the following transfer. Once declined a
              transfer is <strong>final</strong> and the player will be notified
              the transfer has been declined.
            </Text>
            <DescriptionList>
              <Description
                term="Member"
                description={`${selectedTransfer?.user?.first_name} ${selectedTransfer?.user?.last_name}`}
              />
              <Description
                term="Old Club"
                description={selectedTransfer?.prevClub.name}
              />
              <Description
                term="New Club"
                description={selectedTransfer?.newClub.name}
              />
            </DescriptionList>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => {
                handleConfirmClick({
                  transfer_uuid: selectedTransfer?.uuid,
                  refetch,
                  method: 'decline',
                });
                onCloseDecline();
              }}
            >
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [TRANSFER_READ, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  const [
    scopes,
    { data: transfers },
    { data: settings },
    basePageProps,
  ] = await Promise.all([
    getUserScopes(AUTHENTICATION_TOKEN),
    api.get('/transfers', {
      headers: {
        Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
      },
    }),
    api.get('/settings'),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      transfers,
      settings,
      ...basePageProps,
    },
  };
};

export default Dashboard;
