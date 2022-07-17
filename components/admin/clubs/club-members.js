import { Heading, Flex, Tr, Td, Box } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { format, parse } from 'date-fns';
import useCSVDownload from 'hooks/useCSVDownload';
import useCachedResponse from 'hooks/useCachedResponse';
import clubsService from 'services/clubs';
import Table from 'components/shared/table';
import Button from 'components/shared/button';

const getLatestProduct = (member) =>
  member?.stripe_products[member?.stripe_products?.length - 1]?.products;

const getClubTeam = (teams, club_uuid) => {
  return teams?.filter(({ teams }) => teams?.club_uuid === club_uuid)[0]?.teams;
};

const getProductName = (member) => {
  const product = getLatestProduct(member);
  return parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date()
    ? product?.description
    : 'Expired';
};

const ClubMembers = ({ club }) => {
  const membersRes = useCachedResponse({
    queryKey: ['/clubs', club?.uuid, '/members'],
    queryFn: () => clubsService.getClubMembers({ club_uuid: club?.uuid }),
  });

  const { call, isLoading } = useCSVDownload({
    data: [
      ['first_name', 'last_name', 'membership'],
      {
        ...(membersRes?.data &&
          membersRes?.data?.map((member) => [
            member.first_name,
            member.last_name,
            getProductName(member),
          ])),
      },
    ],
    filename: `${club?.name}-members-${format(new Date(), 'yyyy-MM-dd')}.csv`,
  });
  return (
    <>
      <Flex
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading as="h4" fontFamily="body" color="qukBlue">
          Members
        </Heading>

        <Button
          variant="transparent"
          borderColor="qukBlue"
          color="qukBlue"
          _hover={{ bg: 'gray.300' }}
          rightIcon={<DownloadIcon />}
          onClick={call}
          disabled={isLoading}
        >
          {isLoading ? 'Downloading...' : 'Download CSV'}
        </Button>
      </Flex>

      <Box bg="white" borderRadius="lg">
        <Table
          name="members"
          columns={['Name', 'Email', 'Team', 'Membership']}
          isLoading={membersRes?.isLoading}
        >
          {membersRes?.data?.map((member) => {
            const product = getLatestProduct(member);
            return (
              <Tr key={member?.email}>
                <Td>
                  {member?.first_name} {member?.last_name}
                </Td>
                <Td>{member?.email}</Td>
                <Td>{getClubTeam(member?.teams, club?.uuid)?.name}</Td>
                <Td fontWeight="bold">
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
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Box>
    </>
  );
};

export default ClubMembers;
