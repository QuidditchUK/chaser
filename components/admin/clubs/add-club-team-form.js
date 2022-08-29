import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Flex } from '@chakra-ui/react';
import Modal from 'components/shared/modal';
import Button from 'components/shared/button';
import InputV2 from 'components/formControls/inputV2';
import useTempPopup from 'hooks/useTempPopup';
import Error from 'components/shared/errors';
import clubsService from 'services/clubs';

const handleCreateSubmit = async ({
  values,
  onClose,
  setServerError,
  club_uuid,
  reset,
}) => {
  try {
    setServerError(null);

    await clubsService.createClubTeam({ club_uuid, data: values });
    onClose();
    reset({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const CreateClubTeamSchema = object().shape({
  name: string().nullable().required('Please enter a Team Name'),
});

export default function AddClubTeamForm({ isOpen, onClose, club_uuid }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(CreateClubTeamSchema),
    defaultValues: {
      name: '',
    },
  });

  const [serverError, setServerError] = useTempPopup();
  return (
    <Modal title="Add Team" isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) =>
          handleCreateSubmit({
            values,
            onClose,
            setServerError,
            club_uuid,
            reset,
          })
        )}
      >
        <Flex flexDirection="column" gridGap={3}>
          <InputV2
            label="Name"
            isRequired
            id="name"
            placeholder="Team name"
            error={errors?.name}
            {...register('name')}
          />

          <Button type="submit" disabled={isSubmitting} variant="green">
            {isSubmitting ? 'Submitting' : 'Add Team'}
          </Button>
          {serverError && <Error>{serverError}</Error>}
        </Flex>
      </form>
    </Modal>
  );
}
