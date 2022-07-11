import {
  Box,
  Flex,
  Heading,
  Grid,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { hasScope } from 'modules/scopes';
import { EMT, TRANSFER_WRITE } from 'constants/scopes';
import transfersService from 'services/transfers';

import Modal from 'components/shared/modal';
import Button from 'components/shared/button';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';

const handleConfirmClick = async ({ transfer_uuid, method, refetch }) => {
  try {
    await transfersService.updateTransfer({ transfer_uuid, method });
    refetch();
  } catch (error) {
    console.log(error);
  }
};

const TransferCard = ({ transfer, scopes, refetchAll }) => {
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

  return (
    <>
      <Grid
        bg="white"
        borderRadius="lg"
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
                <Button variant="green" onClick={onOpenApprove} mr={2}>
                  Approve
                </Button>
                <Button variant="secondary" onClick={onOpenDecline}>
                  Decline
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Grid>

      <Modal
        title="Approve Transfer"
        isOpen={isOpenApprove}
        onClose={onCloseApprove}
        footerAction={() => {
          handleConfirmClick({
            transfer_uuid: transfer?.uuid,
            refetch: refetchAll,
            method: 'approve',
          });
          onCloseApprove();
        }}
        footerTitle="Approve"
      >
        <Text>
          I confirm I am approving the following transfer. Once approved a
          transfer is <strong>final</strong> and the player & clubs will be
          notified of the transfer.
        </Text>
        <DescriptionList>
          <Description
            term="Member"
            description={`${transfer?.user?.first_name} ${transfer?.user?.last_name}`}
          />
          <Description term="Old Club" description={transfer?.prevClub.name} />
          <Description term="New Club" description={transfer?.newClub.name} />
        </DescriptionList>
      </Modal>

      <Modal
        title="Decline Transfer"
        isOpen={isOpenDecline}
        onClose={onCloseDecline}
        footerAction={() => {
          handleConfirmClick({
            transfer_uuid: transfer?.uuid,
            refetch: refetchAll,
            method: 'decline',
          });
          onCloseDecline();
        }}
        footerButtonProps={{ variant: 'secondary' }}
        footerTitle="Decline"
      >
        <Text>
          I confirm I am declining the following transfer. Once declined a
          transfer is <strong>final</strong> and the player will be notified the
          transfer has been declined.
        </Text>
        <DescriptionList>
          <Description
            term="Member"
            description={`${transfer?.user?.first_name} ${transfer?.user?.last_name}`}
          />
          <Description term="Old Club" description={transfer?.prevClub.name} />
          <Description term="New Club" description={transfer?.newClub.name} />
        </DescriptionList>
      </Modal>
    </>
  );
};

export default TransferCard;
