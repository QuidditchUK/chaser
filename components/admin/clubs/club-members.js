import { useState } from 'react';
import { Heading, Flex, Tr, Td, Box, useDisclosure } from '@chakra-ui/react';
import { CheckCircleIcon, DownloadIcon } from '@chakra-ui/icons';
import { format, parse } from 'date-fns';
import Link from 'next/link';
import useCSVDownload from 'hooks/useCSVDownload';
import useCachedResponse from 'hooks/useCachedResponse';
import clubsService from 'services/clubs';
import Table from 'components/shared/table';
import Button from 'components/shared/button';
import UpdateClubManagerForm from './update-club-manager-form';
import RemoveClubMemberForm from './remove-club-member-form';
import { hasScope } from 'modules/scopes';
import { DASHBOARD_SCOPES } from 'constants/scopes';

export const getLatestProduct = (member) =>
  member?.stripe_products[member?.stripe_products?.length - 1]?.products;

// const getClubTeam = (teams, club_uuid) => {
//   return teams?.filter(({ teams }) => teams?.club_uuid === club_uuid)[0]?.teams;
// };

const getProductName = (member) => {
  const product = getLatestProduct(member);
  return parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date()
    ? product?.description
    : 'Expired';
};

const CSVMemberRows = (members) => {
  if (!members) {
    return [];
  }
  return members.map((member) => [
    member.first_name,
    member.last_name,
    getProductName(member),
    member.is_student,
    member.university,
  ]);
};

const ClubMembers = ({ club, refetch, scopes }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const membersRes = useCachedResponse({
    queryKey: ['/clubs', club?.uuid, '/members'],
    queryFn: () => clubsService.getClubMembers({ club_uuid: club?.uuid }),
    enabled: Boolean(club?.uuid),
  });

  const [activeMembers, inactiveMembers] = membersRes?.data?.reduce(
    (result, member) => {
      const product = getLatestProduct(member);
      const isActive =
        parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date();

      result[isActive ? 0 : 1].push(club);
      return result;
    },
    [[], []]
  );

  const { call, isLoading } = useCSVDownload({
    data: [
      ['first_name', 'last_name', 'membership', 'is_student', 'university'],
      ...CSVMemberRows(membersRes?.data),
    ],
    filename: `${club?.name}-members-${format(new Date(), 'yyyy-MM-dd')}.csv`,
  });

  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
    isOpen: isOpenRemove,
  } = useDisclosure();

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

        <Flex gap={2} justifyContent="flex-end">
          {hasScope(DASHBOARD_SCOPES, scopes) && (
            <Button variant="green" onClick={onOpen}>
              {club?.managed_by ? 'Update Club Manager' : 'Assign Club Manager'}
            </Button>
          )}
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
      </Flex>

      <Box bg="white" borderRadius="lg">
        <Table
          name="members"
          columns={[
            'Name (Tick indicates Manager)',
            'Email',
            // 'Team',
            'Has Membership',
            'Member Type',
            '',
          ]}
          isLoading={membersRes?.isLoading}
        >
          {activeMembers?.map((member) => {
            const product = getLatestProduct(member);
            return (
              <Tr key={member?.email}>
                <Td>
                  <Flex alignItems="center" gap={3}>
                    {member?.first_name} {member?.last_name}{' '}
                    {club?.managed_by === member?.uuid && (
                      <CheckCircleIcon color="keeperGreen" />
                    )}
                  </Flex>
                </Td>
                <Td>
                  {member?.email && (
                    <Link href={`mailto:${member?.email}`}>
                      {member?.email}
                    </Link>
                  )}
                </Td>
                {/* <Td>{getClubTeam(member?.teams, club?.uuid)?.name}</Td> */}
                <Td fontWeight="bold">
                  {parse(product?.expires, 'dd-MM-yyyy', new Date()) >
                  new Date() ? (
                    <Box as="span" color="qukBlue">
                      Yes
                    </Box>
                  ) : (
                    <Box as="span" color="monarchRed">
                      No
                    </Box>
                  )}
                </Td>

                <Td>
                  {member?.is_student ? (
                    <Flex alignItems="center" gap={3}>
                      Student at {member?.university}
                    </Flex>
                  ) : (
                    <>Community member</>
                  )}
                </Td>
                <Td>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedMember(member);
                      onOpenRemove();
                    }}
                  >
                    Remove Member
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Box>

      <Heading as="h4" fontFamily="body" color="qukBlue">
        Inactive Members
      </Heading>

      <Box bg="white" borderRadius="lg">
        <Table
          name="members"
          columns={[
            'Name (Tick indicates Manager)',
            'Email',
            // 'Team',
            'Has Membership',
            'Member Type',
            '',
          ]}
          isLoading={membersRes?.isLoading}
        >
          {inactiveMembers?.map((member) => {
            const product = getLatestProduct(member);
            return (
              <Tr key={member?.email}>
                <Td>
                  <Flex alignItems="center" gap={3}>
                    {member?.first_name} {member?.last_name}{' '}
                    {club?.managed_by === member?.uuid && (
                      <CheckCircleIcon color="keeperGreen" />
                    )}
                  </Flex>
                </Td>
                <Td>
                  {member?.email && (
                    <Link href={`mailto:${member?.email}`}>
                      {member?.email}
                    </Link>
                  )}
                </Td>
                {/* <Td>{getClubTeam(member?.teams, club?.uuid)?.name}</Td> */}
                <Td fontWeight="bold">
                  {parse(product?.expires, 'dd-MM-yyyy', new Date()) >
                  new Date() ? (
                    <Box as="span" color="qukBlue">
                      Yes
                    </Box>
                  ) : (
                    <Box as="span" color="monarchRed">
                      No
                    </Box>
                  )}
                </Td>

                <Td>
                  {member?.is_student ? (
                    <Flex alignItems="center" gap={3}>
                      Student at {member?.university}
                    </Flex>
                  ) : (
                    <>Community member</>
                  )}
                </Td>
                <Td>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedMember(member);
                      onOpenRemove();
                    }}
                  >
                    Remove Member
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Box>

      <UpdateClubManagerForm
        club={club}
        members={membersRes?.data}
        isOpen={isOpen}
        onClose={() => {
          refetch();
          membersRes.refetch();
          onClose();
        }}
      />

      <RemoveClubMemberForm
        club={club}
        member={selectedMember}
        isOpen={isOpenRemove}
        onClose={() => {
          setSelectedMember();
          refetch();
          membersRes.refetch();
          onCloseRemove();
        }}
      />
    </>
  );
};

export default ClubMembers;
