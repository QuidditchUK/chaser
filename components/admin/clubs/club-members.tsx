import { useState, ReactNode } from 'react';
import {
  Heading,
  Flex,
  Tr,
  Td,
  Box,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
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
import { CLUBS_WRITE, CLUB_MANAGEMENT, EMT } from 'constants/scopes';
import { SafeUserWithScopes } from 'types/user';
import { clubs as Club } from '@prisma/client';

export const getLatestProduct = (member) =>
  member?.stripe_products[member?.stripe_products?.length - 1]?.products;

export const groupByActive = (
  members: any[]
): { active: any[]; inactive: any[] } => {
  const [active, inactive] = members?.reduce(
    (result, member) => {
      const product = getLatestProduct(member);
      const isActive =
        parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date();

      result[isActive ? 0 : 1].push(member);
      return result;
    },
    [[], []]
  );
  return { active, inactive };
};

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

const MembersTable = ({
  members,
  title,
  supportText,
  name,
  scopes,
  refetch,
  membersRefetch,
  isLoading,
  club,
}: {
  members: SafeUserWithScopes[];
  title?: ReactNode;
  name: string;
  supportText?: ReactNode;
  scopes: any[];
  refetch: () => void;
  membersRefetch: () => void;
  isLoading: boolean;
  club: Club;
}) => {
  const [selectedMember, setSelectedMember] = useState(null);

  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      {title}
      {supportText}

      <Box bg="white" borderRadius="lg">
        <Table
          name={name}
          columns={[
            'Name (Tick indicates Manager)',
            'Email',
            // 'Team',
            'Student/Community',
            '',
          ]}
          isLoading={isLoading}
        >
          {members?.map((member) => {
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

                <Td>{member?.is_student ? <>Student</> : <>Community</>}</Td>
                {hasScope([EMT, CLUBS_WRITE, CLUB_MANAGEMENT], scopes) && (
                  <Td>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedMember(member);
                        onOpen();
                      }}
                    >
                      Remove Member
                    </Button>
                  </Td>
                )}
              </Tr>
            );
          })}
        </Table>
      </Box>

      <RemoveClubMemberForm
        club={club}
        member={selectedMember}
        isOpen={isOpen}
        onClose={() => {
          setSelectedMember(null);
          refetch();
          membersRefetch();
          onClose();
        }}
      />
    </>
  );
};

const ClubMembers = ({ club, refetch, scopes }) => {
  const {
    data: clubMembers = { studentSummerPassMembers: [], members: [] },
    isLoading: membersIsLoading,
    refetch: membersRefetch,
  } = useCachedResponse<{
    members: SafeUserWithScopes[];
    studentSummerPassMembers: SafeUserWithScopes[];
  }>({
    queryKey: ['/clubs', club?.uuid, '/members'],
    queryFn: () => clubsService.getClubMembers({ club_uuid: club?.uuid }),
    enabled: Boolean(club?.uuid),
  });

  const { members, studentSummerPassMembers } = clubMembers;

  const {
    active: activeStudentPassMembers,
    inactive: inactiveStudentPassMembers,
  } = groupByActive(studentSummerPassMembers);

  const { active: activeMembers, inactive: inactiveMembers } =
    groupByActive(members);

  const inactive = inactiveMembers.concat(inactiveStudentPassMembers);

  const { call, isLoading } = useCSVDownload({
    data: [
      ['first_name', 'last_name', 'membership', 'is_student', 'university'],
      ...CSVMemberRows(members),
      ...CSVMemberRows(studentSummerPassMembers),
    ],
    filename: `${club?.name}-members-${format(new Date(), 'yyyy-MM-dd')}.csv`,
  });

  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      <Flex
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading as="h4" fontFamily="body" color="qukBlue">
          Active Members ({activeMembers?.length})
        </Heading>

        <Flex gap={2} justifyContent="flex-end">
          {hasScope([EMT, CLUBS_WRITE, CLUB_MANAGEMENT], scopes) && (
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

      <MembersTable
        name="members"
        scopes={scopes}
        members={activeMembers}
        refetch={refetch}
        membersRefetch={membersRefetch}
        isLoading={membersIsLoading}
        club={club}
      />

      <MembersTable
        name="studentSummerPass"
        scopes={scopes}
        members={activeStudentPassMembers}
        refetch={refetch}
        membersRefetch={membersRefetch}
        isLoading={membersIsLoading}
        club={club}
        title={
          <Heading as="h4" fontFamily="body" color="qukBlue" mb={0}>
            Student Summer Pass Members ({activeStudentPassMembers?.length})
          </Heading>
        }
        supportText={
          <Text>
            Student Summer Pass members are club members who have joined using
            the Student Summer Pass scheme for the duration of the current
            Community League. They will automatically be removed from the club
            when the Community League ends.
          </Text>
        }
      />

      <MembersTable
        name="inactiveMembers"
        scopes={scopes}
        members={inactive}
        refetch={refetch}
        membersRefetch={membersRefetch}
        isLoading={membersIsLoading}
        club={club}
        title={
          <Heading as="h4" fontFamily="body" color="qukBlue" mb={0}>
            Inactive Members ({inactive?.length})
          </Heading>
        }
        supportText={
          <Text>
            Inactive members are club members who <strong>do not</strong> have a
            current QUK Membership, and are therefore ineligible for roster
            selection. Players are responsible for maintaining their QUK
            membership via the QUK website.
          </Text>
        }
      />

      <UpdateClubManagerForm
        club={club}
        members={members}
        isOpen={isOpen}
        onClose={() => {
          refetch();
          membersRefetch();
          onClose();
        }}
      />
    </>
  );
};

export default ClubMembers;
