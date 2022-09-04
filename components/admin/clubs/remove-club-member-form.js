import Modal from 'components/shared/modal';
import { Text } from '@chakra-ui/react';
import clubsService from 'services/clubs';

const handleRemoveClick = async ({ club_uuid, user_uuid }) => {
  try {
    await clubsService.removeMember({ club_uuid, user_uuid });
  } catch (error) {
    console.log(error);
  }
};

const RemoveClubMemberForm = ({ isOpen, member, club, onClose }) => (
  <Modal
    title="Remove Member"
    isOpen={isOpen}
    onClose={onClose}
    footerAction={() => {
      handleRemoveClick({
        club_uuid: club?.uuid,
        user_uuid: member?.uuid,
      });
      onClose();
    }}
    footerTitle="Remove"
    footerButtonProps={{ variant: 'secondary' }}
  >
    <Text>
      Are you sure you want to remove{' '}
      <strong>
        {member?.first_name} {member?.last_name}
      </strong>{' '}
      from {club?.name}?
    </Text>
  </Modal>
);

export default RemoveClubMemberForm;
