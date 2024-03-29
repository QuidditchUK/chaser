import { useState } from 'react';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Flex, Heading, Tr, Td, useDisclosure } from '@chakra-ui/react';

import { hasScope } from 'modules/scopes';
import InputV2 from 'components/formControls/inputV2';
import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import Table from 'components/shared/table';

import scopesService from 'services/scopes';
import useCachedResponse from 'hooks/useCachedResponse';
import { SafeUserWithScopes } from 'types/user';
import EditPermissions from './edit-permissions';

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
    reset();
    refetch();
  } catch (err) {
    console.log(err);
  }
};

const PermissionBlock = ({
  label,
  scope,
  userScopes,
  actionScopes,
  allowEditing,
}: {
  label: string;
  scope: string;
  userScopes: string[];
  actionScopes: string[]; // scope with permission to add/remove
  allowEditing: boolean; // whether the block allows editing scopes
}) => {
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

  const { data, refetch, isLoading } = useCachedResponse<SafeUserWithScopes[]>({
    queryKey: ['/scopes/', scope],
    queryFn: () => scopesService.getUsersByScope({ scope }),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<SafeUserWithScopes | null>(
    null
  );
  const [editPermissions, setEditPermissions] = useState(false);

  return (
    <>
      <Heading as="h4" fontFamily="body" color="qukBlue">
        {label}
      </Heading>

      <Box bg="white" borderRadius="lg">
        <Table
          name={scope}
          columns={
            allowEditing ? ['Name', 'Scopes', 'Actions'] : ['Name', 'Scopes']
          }
          isLoading={isLoading}
          tableProps={{
            sx: {
              'th, td': {
                '&:last-of-type': {
                  textAlign: 'right',
                },
              },
            },
          }}
        >
          {data?.map((user) => (
            <Tr key={user?.uuid}>
              <Td>
                {user?.first_name} {user?.last_name}
              </Td>
              <Td>{user?.scopes.map(({ scope }) => scope).join(', ')}</Td>
              {hasScope(actionScopes, userScopes) && allowEditing && (
                <Td textAlign="right">
                  <Flex direction="row" justifyContent="flex-end" gap={3}>
                    <Button
                      variant="green"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditPermissions(true);
                      }}
                    >
                      Edit Permissions
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        onOpen();
                        setSelectedUser(user);
                      }}
                    >
                      Remove
                    </Button>
                  </Flex>
                </Td>
              )}
            </Tr>
          ))}
        </Table>
      </Box>

      {hasScope(actionScopes, userScopes) && (
        <form
          onSubmit={handleSubmit((values) =>
            handleFormSubmit({
              values: { scope, ...values },
              reset,
              refetch,
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
            uuid: selectedUser?.uuid,
            scope,
            refetch,
          });
          setSelectedUser(null);
          onClose();
        }}
        footerButtonProps={{ variant: 'secondary' }}
        footerTitle="Remove"
      >
        Are you sure you want to delete {selectedUser?.first_name} as {scope}?
      </Modal>

      {editPermissions && (
        <EditPermissions
          user={selectedUser}
          onClose={() => {
            refetch();
            setEditPermissions(false);
          }}
        />
      )}
    </>
  );
};

export default PermissionBlock;
