import {
  Heading,
  Flex,
  Tr,
  Td,
  Box,
  useDisclosure,
  Text,
  Divider,
} from '@chakra-ui/react';
import { CheckIcon, DownloadIcon } from '@chakra-ui/icons';
import { format, parse } from 'date-fns';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import useCSVDownload from 'hooks/useCSVDownload';
import useCachedResponse from 'hooks/useCachedResponse';
import useTempPopup from 'hooks/useTempPopup';
import clubsService from 'services/clubs';
import Table from 'components/shared/table';
import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import Select from 'components/formControls/select';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';
import Error from 'components/shared/errors';

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
  ]);
};

const handleAssignManager = async ({
  values,
  club_uuid,
  callback,
  setServerError,
}) => {
  try {
    setServerError(null);
    await clubsService.assignClubManager({ club_uuid, data: values });
    callback();
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ClubMembers = ({ club }) => {
  const [serverError, setServerError] = useTempPopup();
  const membersRes = useCachedResponse({
    queryKey: ['/clubs', club?.uuid, '/members'],
    queryFn: () => clubsService.getClubMembers({ club_uuid: club?.uuid }),
  });

  const { call, isLoading } = useCSVDownload({
    data: [
      ['first_name', 'last_name', 'membership'],
      ...CSVMemberRows(membersRes?.data),
    ],
    filename: `${club?.name}-members-${format(new Date(), 'yyyy-MM-dd')}.csv`,
  });

  const { onOpen, onClose, isOpen } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      managed_by: null,
    },
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

        <Flex gap={2} justifyContent="flex-end">
          <Button variant="green" onClick={onOpen}>
            {club?.managed_by ? 'Update Club Manager' : 'Assign Club Manager'}
          </Button>
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
            'Name',
            'Email',
            // 'Team',
            'Has Membership',
            'Club Manager',
          ]}
          isLoading={membersRes?.isLoading}
        >
          {membersRes?.data?.map((member) => {
            const product = getLatestProduct(member);
            return (
              <Tr key={member?.email}>
                <Td>
                  {member?.first_name} {member?.last_name}
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
                <Td>{club?.managed_by === member?.uuid && <CheckIcon />}</Td>
              </Tr>
            );
          })}
        </Table>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={club?.managed_by ? 'Update Club Manager' : 'Assign Club Manager'}
      >
        <Text fontSize="sm">
          The club manager can see their club&#39;s members and manage their
          club affairs on QUK. This should be our primary contact with the club
          and <strong>must</strong> be kept up to date.
        </Text>

        {club?.managed_by && (
          <>
            <DescriptionList>
              <Description
                term="Current Manager"
                description={`${club?.managedBy?.first_name} ${club?.managedBy?.last_name}`}
              ></Description>
            </DescriptionList>
            <Divider />
          </>
        )}

        <form
          onSubmit={handleSubmit((values) =>
            handleAssignManager({
              values,
              setServerError,
              club_uuid: club?.uuid,
              callback: () => {
                reset();
                membersRes?.refetch();
                onClose();
              },
            })
          )}
        >
          <Flex flexDirection="column" gridGap={3} mt={3}>
            <Select
              label="Select Manager"
              isRequired
              id="managed_by"
              placeholder="Select a manager"
              options={membersRes?.data?.map((member) => ({
                value: member.uuid,
                label: `${member?.first_name} ${member?.last_name}`,
              }))}
              {...register('managed_by')}
              error={errors.managed_by}
            />

            <Button type="submit" disabled={isSubmitting} variant="green">
              {isSubmitting
                ? 'Assigning'
                : club?.managed_by
                ? 'Update Club Manager'
                : 'Assign Club Manager'}
            </Button>
            {serverError && <Error>{serverError}</Error>}
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default ClubMembers;
