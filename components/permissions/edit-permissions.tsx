import Modal from 'components/shared/modal';
import { SafeUserWithScopes } from 'types/user';
import { VOLUNTEER_SCOPES } from 'constants/scopes';
import { FormControl, FormLabel, Flex } from '@chakra-ui/react';
import Checkbox from 'components/formControls/checkbox';
import { useForm } from 'react-hook-form';
import { getPlainScopes } from 'modules/scopes';
import Button from 'components/shared/button';
import scopesService from 'services/scopes';

export default function EditPermissions({
  user,
  onClose,
}: {
  user: SafeUserWithScopes;
  onClose: () => void;
}) {
  const defaultValues = VOLUNTEER_SCOPES.reduce((acc, currentValue) => {
    acc[currentValue] = getPlainScopes(user.scopes).includes(currentValue);
    return acc;
  }, {});

  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<{ [k: string]: boolean }>({
    defaultValues,
  });

  const handleScopeSubmit = async (values) => {
    await scopesService.updateVolunteerScopes({
      user_uuid: user.uuid,
      data: values,
    });
    onClose();
  };

  return (
    <Modal title="Edit Permissions" isOpen={true} onClose={onClose}>
      <form onSubmit={handleSubmit((values) => handleScopeSubmit(values))}>
        <FormControl as="fieldset" border={0}>
          <FormLabel fontSize="sm" color="qukBlue">
            Permissions
          </FormLabel>
          <Flex
            borderRadius="sm"
            bg="gray.50"
            p={4}
            flexDirection="column"
            gap={3}
          >
            {VOLUNTEER_SCOPES.map((scope) => (
              <Checkbox size="lg" key={scope} id={scope} {...register(scope)}>
                {scope}
              </Checkbox>
            ))}
          </Flex>
        </FormControl>
        <Button mt="2" type="submit" variant="green" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting' : 'Update scopes'}
        </Button>
      </form>
    </Modal>
  );
}
