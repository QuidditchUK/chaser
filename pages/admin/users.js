import { useState } from 'react';
import Link from 'next/link';
import generateServerSideHeaders from 'modules/headers';
import { Box, Flex, Heading, Tr, Td } from '@chakra-ui/react';
import { parse } from 'date-fns';
import { getUserScopes, hasScope } from 'modules/scopes';
import { USERS_READ, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import isAuthorized from 'modules/auth';
import { ChevronRightIcon, CopyIcon } from '@chakra-ui/icons';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';
import Table from 'components/shared/table';
import useCachedResponse from 'hooks/useCachedResponse';
import Pagination from 'components/shared/pagination';
import { getLatestProduct } from 'components/admin/clubs/club-members';

import usersService from 'services/users';
import CopyValueButton from 'components/shared/copy-value-button';

const Users = ({ scopes }) => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useCachedResponse({
    queryKey: ['/users/all', page],
    queryFn: () => usersService.getUsers({ page }),
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
                  <Td>{user?.email}</Td>
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

                  <Td
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {user?.uuid}
                    <CopyValueButton copyableValue={user?.uuid} />
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

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [USERS_READ, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const [scopes, basePageProps] = await Promise.all([
    getUserScopes(headers),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      ...basePageProps,
    },
  };
};

export default Users;
