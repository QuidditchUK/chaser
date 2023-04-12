import { useState } from 'react';
import {
  Heading,
  Flex,
  Grid,
  Box,
  useDisclosure,
  Text,
  UnorderedList,
  ListItem,
  ListProps,
  ListItemProps,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { CheckCircleIcon, DownloadIcon } from '@chakra-ui/icons';
import { format, parse } from 'date-fns';
import { clubs as Club } from '@prisma/client';

import useCSVDownload from 'hooks/useCSVDownload';
import useCachedResponse from 'hooks/useCachedResponse';
import clubsService from 'services/clubs';
import { hasScope } from 'modules/scopes';
import { SafeUserWithScopes } from 'types/user';
import { CLUBS_WRITE, CLUB_MANAGEMENT, EMT } from 'constants/scopes';

import Button from 'components/shared/button';
import UpdateClubManagerForm from './update-club-manager-form';
import RemoveClubMemberForm from './remove-club-member-form';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';

import PersonIcon from 'public/images/person.svg';

export const getLatestProduct = (member) =>
  member?.stripe_products[member?.stripe_products?.length - 1]?.products;

const isActive = (member: SafeUserWithScopes) => {
  const product = getLatestProduct(member);
  return parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date();
};

export const groupByActive = (
  members: any[]
): { active: any[]; inactive: any[] } => {
  const [active, inactive] = members?.reduce(
    (result, member) => {
      result[isActive(member) ? 0 : 1].push(member);
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

const List = (props: ListProps) => (
  <UnorderedList
    listStyleType="none"
    m={0}
    p={0}
    bg="white"
    borderRadius="lg"
    {...props}
  />
);

const Li = (props: ListItemProps) => (
  <ListItem
    _hover={{ bg: 'gray.100' }}
    cursor="pointer"
    display="grid"
    gridTemplateColumns="auto 1fr auto"
    alignItems="center"
    p={3}
    gridColumnGap={3}
    borderBottom="1px solid"
    borderColor="gray.100"
    {...props}
  />
);

const MembersTable = ({
  members,
  scopes,
  refetch,
  membersRefetch,
  club,
}: {
  members: SafeUserWithScopes[];
  scopes: any[];
  refetch: () => void;
  membersRefetch: () => void;
  club: Club;
}) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onRemoveOpen,
    onClose: onRemoveClose,
    isOpen: isRemoveOpen,
  } = useDisclosure();

  const { active, inactive } = groupByActive(members);

  const [activeFilter, setActiveFilter] = useState('ALL');

  const viewMembers =
    activeFilter === 'ALL'
      ? members
      : activeFilter === 'ACTIVE'
      ? active
      : inactive;

  return (
    <>
      <Flex flexDirection="row" alignItems="center" gridGap={3} mb={5}>
        <Button
          variant={activeFilter === 'ALL' ? 'primary' : 'light'}
          fontSize={{ base: 'xs', md: 'md' }}
          onClick={() => setActiveFilter('ALL')}
        >
          All ({members.length})
        </Button>

        <Button
          variant={activeFilter === 'ACTIVE' ? 'primary' : 'light'}
          fontSize={{ base: 'xs', md: 'md' }}
          onClick={() => setActiveFilter('ACTIVE')}
        >
          Active ({active.length})
        </Button>

        <Button
          variant={activeFilter === 'INACTIVE' ? 'primary' : 'light'}
          fontSize={{ base: 'xs', md: 'md' }}
          onClick={() => setActiveFilter('INACTIVE')}
        >
          Inactive ({inactive.length})
        </Button>

        <Button fontSize={{ base: 'xs', md: 'md' }} variant="light" isDisabled>
          Student Summer Pass
        </Button>
      </Flex>

      {viewMembers.length > 0 ? (
        <List>
          {viewMembers?.map((member) => {
            const active = isActive(member);
            return (
              <Li
                key={member?.email}
                onClick={() => {
                  setSelectedMember(member);
                  onOpen();
                }}
              >
                <Box color="gray.400">
                  <PersonIcon height="3rem" width="3rem" />
                </Box>
                <Box>
                  <Flex alignItems="center" direction="row" gridGap={2}>
                    <Text fontWeight="bold" alignItems="center" my={1}>
                      {member?.first_name} {member?.last_name}
                    </Text>{' '}
                    {club?.managed_by === member?.uuid && (
                      <CheckCircleIcon color="keeperGreen" />
                    )}
                  </Flex>
                  <Text mt={0} mb={1} fontSize="sm" color="gray.500">
                    {member?.position ?? 'Utility'} |{' '}
                    {member?.is_student ? 'Student' : 'Community'}
                  </Text>
                </Box>

                <Text
                  color={active ? 'keeperGreen' : 'monarchRed'}
                  fontWeight="bold"
                >
                  {active ? 'Active' : 'Expired'}
                </Text>
              </Li>
            );
          })}
        </List>
      ) : (
        <Box
          p={4}
          borderRadius="lg"
          bg="white"
          textAlign="center"
          color="qukBlue"
        >
          <Heading fontFamily="body" fontSize="2xl" mb={1}>
            No members
          </Heading>
          <Text mt={2}>No members matched your selection</Text>
        </Box>
      )}

      <Drawer
        placement="right"
        isOpen={isOpen}
        onClose={() => onClose()}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg="white" px={8} pt={3}>
          <DrawerCloseButton />

          <DrawerHeader px={0}>
            {selectedMember?.first_name} {selectedMember?.last_name}
          </DrawerHeader>

          <DescriptionList>
            <Description
              term="Membership"
              description={
                <Text
                  color={
                    isActive(selectedMember) ? 'keeperGreen' : 'monarchRed'
                  }
                  fontWeight="bold"
                  m={0}
                >
                  {active ? 'Active' : 'Expired'}
                </Text>
              }
            />
            <Description
              term="Position"
              description={selectedMember?.position ?? 'Utility'}
            />
            <Description
              term="Student/Community Member"
              description={selectedMember?.is_student ? 'Student' : 'Community'}
            />
          </DescriptionList>

          {hasScope([EMT, CLUBS_WRITE, CLUB_MANAGEMENT], scopes) && (
            <Button
              mt={3}
              variant="secondary"
              onClick={() => {
                onRemoveOpen();
              }}
            >
              Remove Member
            </Button>
          )}
        </DrawerContent>
      </Drawer>
      <RemoveClubMemberForm
        club={club}
        member={selectedMember}
        isOpen={isRemoveOpen}
        onClose={() => {
          setSelectedMember(null);
          refetch();
          membersRefetch();
          onRemoveClose();
          onClose();
        }}
      />
    </>
  );
};

const SidebarListItem = (props: ListItemProps) => (
  <ListItem
    borderBottom="1px solid"
    borderColor="gray.100"
    _hover={{ bg: 'gray.100' }}
    display="grid"
    alignItems="center"
    color="qukBlue"
    gridTemplateColumns="auto 1fr"
    cursor="pointer"
    p={4}
    gridGap={3}
    {...props}
  />
);

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

  const allMembers = members.concat(studentSummerPassMembers);

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
      <Grid
        gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
        gridGap={4}
        gridTemplateAreas={{
          base: "'actions' 'members'",
          lg: "'members actions'",
        }}
      >
        <Box gridArea="members">
          {membersIsLoading ? (
            <>
              <Flex direction="row" gridGap={3} mb={5}>
                <Skeleton>
                  <Button>All</Button>
                </Skeleton>
                <Skeleton>
                  <Button>Active</Button>
                </Skeleton>
                <Skeleton>
                  <Button>Inactive</Button>
                </Skeleton>
                <Skeleton>
                  <Button>Student Summer Pass</Button>
                </Skeleton>
              </Flex>
              <Box borderRadius="lg" bg="white" p={3}>
                <Grid
                  gridTemplateColumns="auto 1fr auto"
                  alignItems="center"
                  gridGap={3}
                >
                  <SkeletonCircle h="3rem" width="3rem" />
                  <Box>
                    <Skeleton mb={2}>
                      <Text>John Smith</Text>
                    </Skeleton>
                    <Skeleton>
                      <Text>Utility | Community</Text>
                    </Skeleton>
                  </Box>
                  <Skeleton>
                    <Text m={0}>Active</Text>
                  </Skeleton>
                </Grid>
              </Box>
            </>
          ) : (
            <MembersTable
              scopes={scopes}
              members={allMembers}
              refetch={refetch}
              membersRefetch={membersRefetch}
              club={club}
            />
          )}
        </Box>

        <Box gridArea="actions">
          <Heading fontFamily="body" color="gray.600" fontSize="xl">
            Actions
          </Heading>
          <Box borderRadius="lg" bg="white" height="initial">
            <UnorderedList listStyleType="none" m={0} p={0}>
              {hasScope([EMT, CLUBS_WRITE, CLUB_MANAGEMENT], scopes) && (
                <SidebarListItem onClick={onOpen}>
                  <CheckCircleIcon />
                  <Text fontWeight="bold" my={1}>
                    {club?.managed_by
                      ? 'Update Club Manager'
                      : 'Assign Club Manager'}
                  </Text>
                </SidebarListItem>
              )}
              <SidebarListItem onClick={call}>
                <DownloadIcon />
                <Text fontWeight="bold" my={1}>
                  {isLoading ? 'Downloading...' : 'Download CSV'}
                </Text>
              </SidebarListItem>
            </UnorderedList>
          </Box>
        </Box>
      </Grid>
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
