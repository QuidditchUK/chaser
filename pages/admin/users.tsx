import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Box, Flex, Heading, Tr, Td, Grid, Text } from '@chakra-ui/react';
import { parse } from 'date-fns';
import { useForm } from 'react-hook-form';

import { USERS_READ, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import { isScoped_ServerProps } from 'modules/auth';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';
import Table from 'components/shared/table';
import useCachedResponse from 'hooks/useCachedResponse';
import Pagination from 'components/shared/pagination';
import { getLatestProduct } from 'components/admin/clubs/club-members';
import InputV2 from 'components/formControls/inputV2';

import usersService from 'services/users';
import CopyValueButton from 'components/shared/copy-value-button';
import { GetServerSideProps } from 'next';

import { AdminUserWithRelations } from 'types/user';

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

const Users = () => {
  const [page, setPage] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      term: '',
    },
  });

  const watchTerm = watch('term');
  const [searchTerm, setSearchTerm] = useState(null);

  const debouncedTerm = useDebounce(watchTerm, 500);

  useEffect(() => {
    if (debouncedTerm !== searchTerm) {
      setSearchTerm(debouncedTerm);
      setPage(0);
    }
  }, [debouncedTerm, searchTerm]);

  const { data, isLoading } = useCachedResponse<{
    users: AdminUserWithRelations[];
    pages: number;
  }>({
    queryKey: ['/users/', page, searchTerm],
    queryFn: () => {
      return Boolean(searchTerm)
        ? usersService.getSearchUsers({ term: searchTerm, page })
        : usersService.getUsers({ page });
    },
    keepPreviousData: true,
  });

  return (
    <>
      <Meta subTitle="Users" title="Admin Dashboard" />
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
            <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> Users
          </Heading>
        </Flex>

        <form onSubmit={handleSubmit(() => {})}>
          <Grid
            flexDirection="row"
            gridGap={3}
            gridTemplateColumns="auto"
            mb={3}
            width="100%"
          >
            <InputV2
              label="Search"
              id="term"
              hideLabel
              placeholder="Search by name or email"
              error={errors?.term}
              {...register('term')}
            />
          </Grid>
        </form>

        <Box bg="white" borderRadius="lg">
          <Table
            columns={['Name', 'Email', 'Club', 'Membership', 'UUID']}
            isLoading={isLoading}
            skeletonRows={10}
          >
            {data?.users.map((user) => {
              const product = getLatestProduct(user);
              return (
                <Tr key={user?.uuid}>
                  <Td>
                    {user?.first_name} {user?.last_name}
                  </Td>
                  <Td>
                    {user?.email && (
                      <Link href={`mailto:${user?.email}`}>{user?.email}</Link>
                    )}
                  </Td>
                  <Td>{user?.clubs?.name}</Td>

                  <Td fontWeight="bold">
                    {product ? (
                      <>
                        {parse(product?.expires, 'dd-MM-yyyy', new Date()) >
                        new Date() ? (
                          <Box as="span" color="qukBlue">
                            {product?.description}
                          </Box>
                        ) : (
                          <Box as="span" color="monarchRed">
                            Expired
                          </Box>
                        )}
                      </>
                    ) : (
                      <>None</>
                    )}
                  </Td>

                  <Td>
                    <Grid
                      background="gray.50"
                      borderRadius="md"
                      px={2}
                      width="100%"
                      alignItems="center"
                      gridTemplateColumns="auto min-content"
                    >
                      <Text as="code" fontSize="xs">
                        {user?.uuid}
                      </Text>
                      <CopyValueButton copyableValue={user?.uuid} />
                    </Grid>
                  </Td>
                </Tr>
              );
            })}
          </Table>
        </Box>

        <Pagination pages={data?.pages} page={page} setPage={setPage} />
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = isScoped_ServerProps(context, [USERS_READ, EMT]);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: await getBasePageProps(),
  };
};

export default Users;

Users.auth = {
  skeleton: <Box />,
};
