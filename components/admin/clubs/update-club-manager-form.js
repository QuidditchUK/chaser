import { Flex, Text, Divider } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useTempPopup from 'hooks/useTempPopup';
import clubsService from 'services/clubs';

import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import Select from 'components/formControls/select';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';
import Error from 'components/shared/errors';

const handleAssignManager = async ({
  values,
  club_uuid,
  callback,
  setServerError,
}) => {
  try {
    setServerError(null);
    await clubsService.assignClubManager({ club_uuid, data: values });
    callback();
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const UpdateClubManagerForm = ({ club, isOpen, onClose, members }) => {
  const [serverError, setServerError] = useTempPopup();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      managed_by: null,
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={club?.managed_by ? 'Update Club Manager' : 'Assign Club Manager'}
    >
      <Text fontSize="sm">
        The club manager can see their club&#39;s members and manage their club
        affairs on QUK. This should be our primary contact with the club and{' '}
        <strong>must</strong> be kept up to date.
      </Text>

      {club?.managed_by && (
        <>
          <DescriptionList>
            <Description
              term="Current Manager"
              description={`${club?.managedBy?.first_name} ${club?.managedBy?.last_name}`}
            ></Description>
          </DescriptionList>
          <Divider />
        </>
      )}

      <form
        onSubmit={handleSubmit((values) =>
          handleAssignManager({
            values,
            setServerError,
            club_uuid: club?.uuid,
            callback: () => {
              reset();
              onClose();
            },
          })
        )}
      >
        <Flex flexDirection="column" gridGap={3} mt={3}>
          <Select
            label="Select Manager"
            isRequired
            id="managed_by"
            placeholder="Select a manager"
            options={members?.map((member) => ({
              value: member.uuid,
              label: `${member?.first_name} ${member?.last_name}`,
            }))}
            {...register('managed_by')}
            error={errors.managed_by}
          />

          <Button type="submit" disabled={isSubmitting} variant="green">
            {isSubmitting
              ? 'Assigning'
              : club?.managed_by
              ? 'Update Club Manager'
              : 'Assign Club Manager'}
          </Button>
          {serverError && <Error>{serverError}</Error>}
        </Flex>
      </form>
    </Modal>
  );
};

export default UpdateClubManagerForm;
