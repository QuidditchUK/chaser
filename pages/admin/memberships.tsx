import { Box, Flex, Tr, Td } from '@chakra-ui/react';

import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';
import Table from 'components/shared/table';
import useCachedResponse from 'hooks/useCachedResponse';

import productsService from 'services/products';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import { Membership } from 'types/membership';

const Memberships = () => {
  const { data: memberships, isLoading } = useCachedResponse<Membership[]>({
    queryKey: '/products/membership',
    queryFn: productsService.getProductsMemberships,
  });

  return (
    <>
      <Meta subTitle="Memberships" title="Admin Dashboard" />
      <Slice>
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <HeadingWithBreadcrumbs
            breadcrumbs={[{ link: '/admin', title: 'Dashboard' }]}
            heading="Memberships"
          />
        </Flex>

        <Box bg="white" borderRadius="lg">
          <Table
            columns={['Product name', 'Purchases count']}
            isLoading={isLoading}
            skeletonRows={10}
          >
            {memberships?.map((memberships) => {
              return (
                memberships && (
                  <Tr key={memberships.product.id}>
                    <Td>{memberships.product.name}</Td>
                    <Td>{memberships.membershipCount}</Td>
                  </Tr>
                )
              );
            })}
          </Table>
        </Box>
      </Slice>
    </>
  );
};

export default Memberships;
