import Modal from 'components/shared/modal';
import { Text, UseModalProps } from '@chakra-ui/react';
import clubsService from 'services/clubs';
import { SafeUserWithScopes } from 'types/user';
import { clubs as Club } from '@prisma/client';

const handleRemoveClick = async ({ club_uuid, user_uuid, onClose }) => {
  try {
    await clubsService.removeMember({ club_uuid, user_uuid });
    onClose();
  } catch (error) {
    console.log(error);
  }
};

type RemoveClubMemberFormProps = Pick<UseModalProps, 'isOpen' | 'onClose'> & {
  member: SafeUserWithScopes;
  club: Club;
};

const RemoveClubMemberForm = ({
  isOpen,
  member,
  club,
  onClose,
}: RemoveClubMemberFormProps) => (
  <Modal
    title="Remove Member"
    isOpen={isOpen}
    onClose={onClose}
    footerAction={() => {
      handleRemoveClick({
        club_uuid: club?.uuid,
        user_uuid: member?.uuid,
        onClose,
      });
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
