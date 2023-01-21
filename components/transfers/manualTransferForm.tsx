import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import useCachedResponse from 'hooks/useCachedResponse';
import clubsService from 'services/clubs';
import usersService from 'services/users';
import Modal from 'components/shared/modal';
import Button from 'components/shared/button';
import InputV2 from 'components/formControls/inputV2';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';
import transfersService from 'services/transfers';
import Error from 'components/shared/errors';
import Select from 'components/formControls/select';
import { clubs as Club, users as User } from '@prisma/client';

const UserLookupSchema = object().shape({
  uuid: string().nullable().uuid().required('Please enter a UUID'),
});

const ManualTransferSchema = object().shape({
  club_uuid: string().nullable().required('Required'),
});

const handleManualTransferSubmit = async ({
  values,
  callback,
  setServerError,
}) => {
  try {
    setServerError(null);
    await transfersService.manualTransfer({ data: values });

    callback();
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ManualTransferForm = ({ onClose, isOpen, refetchActioned }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [serverError, setServerError] = useState(null);

  const { data: queryClubs = [] } = useCachedResponse<Club[]>({
    queryKey: '/clubs/all',
    queryFn: clubsService.getAllClubs,
    selector: (res) => res.data.clubs,
  });

  const activeClubs = queryClubs?.filter((club) => club.active);

  const { data: user } = useCachedResponse<User>({
    queryKey: ['/users/', selectedUser],
    queryFn: () => usersService.getAdminUser({ uuid: selectedUser }),
    enabled: Boolean(selectedUser),
    selector: (res) => res.data.user,
  });

  const {
    register: userLookupRegister,
    handleSubmit: userLookupSubmit,
    formState: { isSubmitting: userLookupSubmitting, errors: userLookupErrors },
    reset: userLookupReset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(UserLookupSchema),
    defaultValues: {
      uuid: '',
    },
  });

  const {
    register: manualTransferRegister,
    handleSubmit: manualTransferSubmit,
    formState: {
      isSubmitting: manualTransferSubmitting,
      errors: manualTransferErrors,
    },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ManualTransferSchema),
    defaultValues: {
      club_uuid: null,
    },
  });

  return (
    <Modal
      title="Manual Transfer"
      isOpen={isOpen}
      onClose={() => {
        setSelectedUser(null);
        onClose();
      }}
    >
      {!user && (
        <form
          onSubmit={userLookupSubmit((values) => {
            setSelectedUser(values.uuid);
            userLookupReset();
          })}
        >
          <Flex flexDirection="column" gridGap={3}>
            <InputV2
              label="UUID"
              isRequired
              id="uuid"
              placeholder="User uuid"
              error={userLookupErrors?.uuid}
              {...userLookupRegister('uuid')}
            />

            <Button
              type="submit"
              disabled={userLookupSubmitting}
              variant="green"
            >
              {userLookupSubmitting ? 'Finding' : 'Find User'}
            </Button>
          </Flex>
        </form>
      )}

      {user && (
        <>
          <DescriptionList mb={4}>
            <Description
              term="User"
              description={`${user?.first_name} ${user?.last_name}`}
            />
            <Description
              term="Current Team"
              description={
                queryClubs?.find((club) => club.uuid === user?.club_uuid).name
              }
            />
          </DescriptionList>

          <form
            onSubmit={manualTransferSubmit((values) =>
              handleManualTransferSubmit({
                values: { user_uuid: user?.uuid, club_uuid: values?.club_uuid },
                setServerError,
                callback: () => {
                  refetchActioned();
                  setSelectedUser(null);
                  onClose();
                },
              })
            )}
          >
            <Flex flexDirection="column" gridGap={3}>
              <Select
                label="Select new club"
                isRequired
                id="club_uuid"
                placeholder="Select a club"
                options={activeClubs
                  .filter(({ uuid }) => uuid !== user?.club_uuid)
                  .map((club) => ({ value: club.uuid, label: club.name }))}
                {...manualTransferRegister('club_uuid')}
                error={manualTransferErrors.club_uuid}
              />

              <Button
                type="submit"
                disabled={manualTransferSubmitting}
                variant="green"
              >
                {manualTransferSubmitting ? 'Transferring' : 'Manual Transfer'}
              </Button>
            </Flex>
          </form>
          {serverError && <Error>{serverError}</Error>}
        </>
      )}
    </Modal>
  );
};

export default ManualTransferForm;
