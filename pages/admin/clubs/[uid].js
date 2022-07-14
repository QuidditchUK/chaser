import Link from 'next/link';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import {
  Heading,
  Grid,
  Flex,
  Tr,
  Td,
  Box,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import { ChevronRightIcon, DownloadIcon, SmallAddIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { getUserScopes } from 'modules/scopes';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import InputV2 from 'components/formControls/inputV2';
import Select from 'components/formControls/select';
import Switch from 'components/formControls/switch';
import Meta from 'components/shared/meta';
import Modal from 'components/shared/modal';
import Table from 'components/shared/table';

import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import useCSVDownload from 'hooks/useCSVDownload';
import { format, parse } from 'date-fns';
import PrismicClubCard from 'components/prismic/club-card';
import generateServerSideHeaders from 'modules/headers';
import clubsService from 'services/clubs';
import useTempPopup from 'hooks/useTempPopup';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import Card from 'components/shared/card';

const Button = dynamic(() => import('components/shared/button'));

const LEAGUES = ['Community', 'University'];

const EditClubSchema = object().shape({
  email: string()
    .nullable()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  name: string().nullable().required('Please enter a Club Name'),
  slug: string().nullable().required('Please enter the Prismic Club UID'),
  active: bool().required(),
  league: string()
    .nullable()
    .required('Please select the league the club plays in'),
});

const getLatestProduct = (member) =>
  member?.stripe_products[member?.stripe_products?.length - 1]?.products;
const getClubTeam = (teams, club_uuid) => {
  console.log(teams);
  return teams?.filter(({ teams }) => teams?.club_uuid === club_uuid)[0]?.teams;
};

const getProductName = (member) => {
  const product = getLatestProduct(member);
  return parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date()
    ? product?.description
    : 'Expired';
};

const handleEditSubmit = async (
  uuid,
  values,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await clubsService.updateClub({ club_uuid: uuid, data: values });

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};
const Dashboard = ({ club, members }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const { call, isLoading } = useCSVDownload({
    data: [
      ['first_name', 'last_name', 'membership'],
      ...members.map((member) => [
        member.first_name,
        member.last_name,
        getProductName(member),
      ]),
    ],
    filename: `${club?.name}-members-${format(new Date(), 'yyyy-MM-dd')}.csv`,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(EditClubSchema),
    defaultValues: {
      email: club?.email,
      name: club?.name,
      slug: club?.slug,
      active: club?.active || false,
      league: club?.league,
    },
  });

  const prismicClub = watch('slug');

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Meta subTitle={club?.name} title="Clubs Admin Dashboard" />
      <Slice>
        <Heading
          as="h3"
          fontFamily="body"
          color="qukBlue"
          display="flex"
          alignItems="center"
        >
          <Link href="/admin">Dashboard</Link> <ChevronRightIcon />{' '}
          <Link href="/admin/clubs/">Clubs</Link> <ChevronRightIcon />{' '}
          {club?.name}
        </Heading>
        <form
          onSubmit={handleSubmit((values) =>
            handleEditSubmit(
              club?.uuid,
              values,
              setServerError,
              setServerSuccess
            )
          )}
        >
          <Grid
            bg="gray.100"
            p={4}
            borderRadius="lg"
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            width="100%"
            gridColumnGap={4}
          >
            <Flex flexDirection="column" gridGap={3}>
              <InputV2
                label="Name"
                isRequired
                id="name"
                placeholder="Club name"
                error={errors?.name}
                {...register('name')}
              />

              <InputV2
                label="Email Address"
                isRequired
                id="email"
                placeholder="Club email address"
                error={errors?.email}
                {...register('email')}
              />

              <InputV2
                label="Prismic UID"
                isRequired
                id="slug"
                placeholder="Enter the Club Prismic UID e.g. london-quidditch-club"
                error={errors?.slug}
                {...register('slug')}
              />

              <Select
                label="League"
                isRequired
                id="league"
                placeholder="Select league the team plays in"
                options={LEAGUES.map((league) => ({
                  value: league,
                  label: league,
                }))}
                error={errors?.league}
                {...register('league')}
              />

              <Switch
                label="Is the club active?"
                id="active"
                size="lg"
                colorScheme="green"
                display="flex"
                alignItems="center"
                {...register('active')}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Update'}
              </Button>
              {serverError && <Error>{serverError}</Error>}
              {serverSuccess && <Success>Club updated</Success>}
            </Flex>

            <Flex flexDirection="column">
              <PrismicClubCard uid={prismicClub} />
            </Flex>
          </Grid>
        </form>

        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading as="h4" fontFamily="body" color="qukBlue">
            Teams
          </Heading>

          <HStack spacing={3}>
            <Button variant="green" onClick={onOpen}>
              Assign Players
            </Button>

            <Button
              variant="transparent"
              borderColor="qukBlue"
              color="qukBlue"
              _hover={{ bg: 'gray.300' }}
              rightIcon={<SmallAddIcon />}
              onClick={onOpen}
            >
              Add Team
            </Button>
          </HStack>
        </Flex>

        {club?.teams?.length !== 0 && (
          <Grid
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
            gridGap={4}
          >
            {club?.teams?.map((team) => (
              <Card title={team?.name} key={team?.uuid} />
            ))}
          </Grid>
        )}

        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading as="h4" fontFamily="body" color="qukBlue">
            Players
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
          >
            {members?.map((member) => {
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
      </Slice>

      <Modal
        title="Add Team"
        isOpen={isOpen}
        onClose={onClose}
        footerAction={() => {
          onClose();
        }}
        footerTitle="Add"
      ></Modal>
    </>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  const auth = await isAuthorized(req, res, [CLUBS_READ, CLUBS_WRITE, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const [
    scopes,
    { data: club },
    { data: members },
    basePageProps,
  ] = await Promise.all([
    getUserScopes(headers),
    clubsService.getClub({ club_uuid: params?.uid, headers }),
    clubsService.getClubMembers({ club_uuid: params?.uid, headers }),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      club,
      members,
      ...basePageProps,
    },
  };
};

export default Dashboard;
