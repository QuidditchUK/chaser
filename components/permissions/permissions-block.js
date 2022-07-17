import { useState } from 'react';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Flex, Heading, Tr, Td, useDisclosure } from '@chakra-ui/react';

import { hasScope } from 'modules/scopes';
import { ADMIN } from 'constants/scopes';
import InputV2 from 'components/formControls/inputV2';
import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import Table from 'components/shared/table';

import scopesService from 'services/scopes';
import useCachedResponse from 'hooks/useCachedResponse';
import usersService from 'services/users';

const handleDeleteClick = async ({ uuid, scope, refetch }) => {
  try {
    await scopesService.removeScope({ user_uuid: uuid, scope });
    refetch();
  } catch (error) {
    console.log(error);
  }
};

const FormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
});

const handleFormSubmit = async ({ values, reset, refetch }) => {
  try {
    await scopesService.addScope({ data: values });
    reset({});
    refetch();
  } catch (err) {
    console.log(err);
  }
};

const PermissionBlock = ({ label, scope, scopes }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(FormSchema),
    defaultValues: { email: '' },
  });

  const { data, refetch, isLoading } = useCachedResponse({
    queryKey: ['/scopes/users/', scope],
    queryFn: () => scopesService.getUsersByScope({ scope }),
  });

  const { data: queryScopes, refetchScopes } = useCachedResponse({
    queryKey: '/users/me',
    queryFn: usersService.getUser,
    selector: (res) => res?.data?.scopes?.map(({ scope }) => scope),
    initialData: scopes,
    enabled: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const refetchAll = () => {
    refetchScopes();
    refetch();
  };

  return (
    <>
      <Heading as="h4" fontFamily="body" color="qukBlue">
        {label}
      </Heading>

      <Box bg="white" borderRadius="lg">
        <Table
          name={scope}
          columns={['Name', 'Email', 'Scopes']}
          isLoading={isLoading}
        >
          {data?.map((user) => (
            <Tr key={user?.uuid}>
              <Td>
                {user?.first_name} {user?.last_name}
              </Td>
              <Td>{user?.email}</Td>
              <Td>{user?.scopes.map(({ scope }) => scope).join(', ')}</Td>
              {hasScope([ADMIN], queryScopes) && (
                <Td textAlign="right">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      onOpen();
                      setSelectedUser(user);
                    }}
                  >
                    Remove
                  </Button>
                </Td>
              )}
            </Tr>
          ))}
        </Table>
      </Box>

      {hasScope([ADMIN], queryScopes) && (
        <form
          onSubmit={handleSubmit((values) =>
            handleFormSubmit({
              values: { scope, ...values },
              reset,
              refetch: refetchAll,
            })
          )}
        >
          <Flex flexDirection="row" mt={3}>
            <InputV2
              label="Email address"
              hideLabel
              id="email"
              placeholder="Enter email address"
              width="initial"
              {...register('email')}
            />

            <Button type="submit" variant="primary" ml={2}>
              {isSubmitting ? 'Adding' : `Add ${label}`}
            </Button>
          </Flex>
        </form>
      )}

      <Modal
        title="Remove Scope"
        isOpen={isOpen}
        onClose={onClose}
        footerAction={() => {
          handleDeleteClick({
            uuid: user?.uuid,
            scope,
            refetch: refetchAll,
          });
          onClose();
        }}
        footerButtonProps={{ variant: 'secondary' }}
        footerTitle="Remove"
      >
        Are you sure you want to delete {selectedUser?.first_name} as {scope}?
      </Modal>
    </>
  );
};

export default PermissionBlock;
