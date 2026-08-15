import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';
import { Box, Flex, Heading, HStack, Select, Text, useDisclosure } from '@chakra-ui/react';
import productsService from 'services/products';
import Error from 'components/shared/errors';
import Link from 'next/link';

import type { tournaments as PrismaTournament } from '@prisma/client';
import type { tournament_team_player_registrations as PlayerRegistration } from '@prisma/client';
import type { users as PrismaUser } from '@prisma/client';

import generateServerSideHeaders from 'modules/headers';

import { EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';
import Modal from 'components/shared/modal';
import Button from 'components/shared/button';

import { getBasePageProps } from 'modules/prismic';

import tournamentsService from 'services/tournaments';

import useCachedResponse from 'hooks/useCachedResponse';
import { getPlainScopes, hasScope } from 'modules/scopes';
import useMe from 'hooks/useMe';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import TournamentTeamPlayers from 'components/events/tournaments/tournament-team-players';
import { SmallAddIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const ProductCard = dynamic(() => import('components/dashboard/product-card'));

// QQQQ add team details here
const TeamPlayerPage = ({ tournament, products }) => {
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const [serverError, setServerError] = useState(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure({ id: 'delete-registration' });
  const {
    isOpen: isMarkAsPaidModalOpen,
    onOpen: onOpenMarkAsPaidModal,
    onClose: onCloseMarkAsPaidModal,
  } = useDisclosure({ id: 'mark-as-paid' });

  const tournament_uuid = router.query.uuid;
  const team_uuid = router.query.team_uuid;
  const user_uuid = router.query.user_uuid;

  const {
    data: player_info,
    isLoading,
    isError,
  } = useCachedResponse<{
    registration: PlayerRegistration;
    is_active: boolean;
    user: PrismaUser;
  }>({
    queryKey: ['/tournaments/', tournament_uuid, '/teams/', team_uuid, '/players/', user_uuid],
    queryFn: () =>
      tournamentsService.getTournamentPlayerRegistration({
        tournament_uuid: tournament_uuid,
        team_uuid: team_uuid,
        user_uuid: user_uuid,
      }),
  });

  // QQQQ refetch the registration details after marking as paid or deleting
  const adminDeletePlayerRegistration = async () => {
    await tournamentsService.adminDeletePlayerRegistration({
      tournament_uuid,
      team_uuid: team_uuid,
      user_uuid: user_uuid,
    });
  };

  const adminCreatePlayerRegistration = async () => {
    await tournamentsService.adminCreatePlayerRegistration({
      tournament_uuid,
      team_uuid: team_uuid,
      user_uuid: user_uuid,
      data: {},
    });
  };

  const goToStripeSession = async (price_id) => {
    try {
      setServerError(null);

      const { data } = await tournamentsService.getStripeSessionForPlayerRegistration({
        price_id,
        tournament_uuid,
        team_uuid,
        user_uuid,
      });

      // redirect to checkout
      window.location = data.url;
    } catch (err) {
      setServerError(err?.response?.data?.error?.message);
    }
  };

  if (isLoading || isError || !player_info) {
    return null;
  }

  const manually_added = player_info.registration?.registered_by_admin;
  const registered = !!player_info.registration;

  const active = player_info.is_active;

  const product = products[0];

  return (
    <>
      <Meta subTitle={tournament.name} title="Tournament Player Registration" />
      <Slice>
        <Flex flexDirection="row" width="100%" alignItems="center" justifyContent="space-between" gap={2}>
          <HeadingWithBreadcrumbs
            breadcrumbs={[
              { link: '/events', title: 'Events' },
              { link: '/events/tournaments', title: 'Tournaments' },
              {
                link: `/events/tournaments/${tournament_uuid}`,
                title: tournament.name,
              },
            ]}
            heading={`Player Registration for ${player_info.user.first_name} ${player_info.user.last_name}`}
          />
        </Flex>
      </Slice>

      <Box bg="white" marginBottom={4} borderRadius="lg">
        <Slice>
          {serverError && <Error>{serverError}</Error>}

          {active ? (
            <>
              {!registered && (
                <>
                  <Text>
                    Not paid yet - QUK website has not record of payment. If you believe this is an error, please
                    contact QUK support. You can pay the tournament registration fee for the player (even if they are
                    not you!) by clicking a card below.
                  </Text>
                  {product ? (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      image={product.images[0]}
                      description={`Tournament fee for ${tournament.name}, for player: ${player_info.user.first_name} ${player_info.user.last_name}`}
                      name={product.name}
                      price={product.price}
                      onClick={() => goToStripeSession(product.price?.id)}
                    />
                  ) : (
                    <Text>Tournament registration fee has not been configured. Contact QUK support.</Text>
                  )}

                  {hasScope([EMT], userScopes) && !registered && (
                    <>
                      <Text>
                        As an admin, you can also manually mark the player as paid if they have paid outside of the
                        system. This will allow them to be registered for the tournament.
                      </Text>
                      <Button variant="secondary" onClick={onOpenMarkAsPaidModal}>
                        Manually mark as paid
                      </Button>
                    </>
                  )}
                </>
              )}

              {manually_added && (
                <Text>
                  Manually marked as paid by admin. This likely means the player paid and the system did not record it -
                  or they had their entry costs covered by QUK.
                </Text>
              )}
              {registered && !manually_added && (
                <>
                  <Text>
                    Tournament registration fee for {player_info.user.first_name} {player_info.user.last_name} has been
                    paid.
                  </Text>
                </>
              )}

              {hasScope([EMT], userScopes) && registered && (
                <>
                  <Text>
                    As an admin, you can delete player registration from the tournament. This will not refund them if
                    they have paid, so please ensure they have been refunded before deleting their registration.
                  </Text>
                  <Button variant="secondary" onClick={onOpenDeleteModal}>
                    Delete registration
                  </Button>
                </>
              )}
            </>
          ) : (
            <Text>
              {player_info.user.first_name} {player_info.user.last_name} does not have an active QUK membership. Please
              ensure they purchase a membership before registering them for the tournament. A user can purchase their
              membership by logging into QUK website and going to <Link href="/dashboard">the dashboard</Link>
            </Text>
          )}
        </Slice>
      </Box>

      <Modal
        title="Delete Player Registration"
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        footerAction={() => adminDeletePlayerRegistration()}
        footerTitle="Delete"
        footerButtonProps={{ variant: 'secondary' }}
      >
        <Text>
          Are you sure you want to delete the registration for {player_info.user.first_name}{' '}
          {player_info.user.last_name}?
        </Text>
        <Text fontWeight="bold">
          This action cannot be undone. If the player has paid, you will need to ensure they were refunded, or manually
          registered to another team.
        </Text>
      </Modal>

      <Modal
        title="Mark Player as Paid"
        isOpen={isMarkAsPaidModalOpen}
        onClose={onCloseMarkAsPaidModal}
        footerAction={() => adminCreatePlayerRegistration()}
        footerTitle="Mark as Paid"
        footerButtonProps={{ variant: 'secondary' }}
      >
        <Text>
          Are you sure you want to mark the registration for {player_info.user.first_name} {player_info.user.last_name}{' '}
          as paid?
        </Text>
        <Text fontWeight="bold">
          This action can be undone. If the player has not paid, you will need to ensure they pay, or QUK is happy with
          waving their registration fee.
        </Text>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = generateServerSideHeaders(context.req);

  // QQQQ get base player info - name, club?
  const [{ data: tournament }, { data: products }, basePageProps] = await Promise.all([
    tournamentsService.getTournament({
      tournament_uuid: context.params?.uuid,
      headers,
    }),
    productsService.getProducts({ headers }),
    getBasePageProps(),
  ]);

  return {
    props: {
      tournament,
      products: products.filter((product) => product.metadata.type === 'TOURNAMENT_MEMBERSHIP'),
      ...basePageProps,
    },
  };
};

export default TeamPlayerPage;

TeamPlayerPage.auth = {
  skeleton: <Box />,
};
