import useCachedResponse from 'hooks/useCachedResponse';
import Link from 'next/link';
import scoutingService from 'services/scouting';
import {
  Heading,
  Tr,
  Td,
  Box,
  OrderedList,
  Flex,
  Text,
} from '@chakra-ui/react';
import Table from 'components/shared/table';
import Button from 'components/shared/button';
import { hasScope } from 'modules/scopes';
import { HEAD_SCOUT, EMT } from 'constants/scopes';

const PendingScoutingRequests = ({ scopes }) => {
  const pending = useCachedResponse({
    queryKey: '/scouting/pending',
    queryFn: scoutingService.getPendingScoutingRequests,
  });

  return (
    <>
      <Heading as="h4" fontFamily="body" color="qukBlue">
        Pending Scouting Requests
      </Heading>

      {pending?.data?.length === 0 && (
        <Text fontSize="2xl" textAlign="center">
          No scouting requests currently pending
        </Text>
      )}

      {pending?.data?.length !== 0 && (
        <Box bg="white" borderRadius="lg">
          <Table
            columns={[
              'Request Details',
              'Playstyle',
              'National Team Preference',
              'Experience',
              'Actions',
            ]}
            isLoading={pending.isLoading}
          >
            {pending?.data?.map((request) => (
              <Tr key={request?.uuid} verticalAlign="top">
                <Td>
                  <strong>Player:</strong> {request?.user?.first_name}{' '}
                  {request?.user?.last_name}
                  <br />
                  <strong>Email:</strong>{' '}
                  {request.user?.email && (
                    <Link href={`mailto:${request?.user?.email}`}>
                      {request?.user?.email}
                    </Link>
                  )}
                  <br />
                  <strong>Pronouns:</strong> {request.pronouns}
                  <br />
                  <strong>Years playing:</strong> {request?.user?.years}
                  <br />
                  <strong>Position:</strong> {request?.user?.position}
                  <br />
                  <br />
                  <strong>Club:</strong> {request?.user?.clubs?.name}
                  <br />
                  <br />
                  <strong>Event:</strong> {request?.event}
                  <br />
                  <strong>Team:</strong> {request?.team}
                  <br />
                  <strong>Number:</strong> {request?.number}
                  <br />
                </Td>

                <Td whiteSpace="normal">{request?.user?.playstyle}</Td>
                <Td>
                  <OrderedList m={0} pl={3}>
                    <li>{request?.user?.first_team}</li>
                    {request?.user?.second_team && (
                      <li>{request?.user?.second_team}</li>
                    )}
                    {request?.user?.third_team && (
                      <li>{request?.user?.third_team}</li>
                    )}
                  </OrderedList>
                </Td>
                <Td whiteSpace="normal">{request?.user?.experience}</Td>

                {hasScope([HEAD_SCOUT, EMT], scopes) && (
                  <Td>
                    <Flex flexDirection="column" gridGap={2}>
                      <Button variant="green">Approve</Button>
                      <Button variant="secondary">Decline</Button>
                    </Flex>
                  </Td>
                )}
              </Tr>
            ))}
          </Table>
        </Box>
      )}
    </>
  );
};

export default PendingScoutingRequests;
