import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';

import { Flex, Heading, Box } from '@chakra-ui/react';

import { getPrismicDocByUid, linkResolver } from 'modules/prismic';
import { useEffect, useState } from 'react';

const Slice = dynamic(() => import('components/shared/slice'));
const Card = dynamic(() => import('components/shared/card'));
const EventCard = dynamic(() => import('components/clubsEvents/event-card'));

const PrismicEventCard = ({ event }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data && event?.uid) {
      const getEvent = async () => {
        const { data } = await getPrismicDocByUid('events', event?.uid);

        setData(data);
      };

      getEvent();
    }
  }, [data, setData, event?.uid]);

  if (!data) {
    return (
      <Flex flexDirection="column" mb={5}>
        <Card />
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" mb={5}>
      <EventCard
        title={data?.event_name}
        href={`/events/${event?.uid}`}
        leagues={data?.leagues}
        venue={data?.venue}
        icon={data?.icon?.url}
        startDate={data?.event_start_date}
        endDate={data?.event_end_date}
        image={{
          url: data?.images?.[0].image?.url,
          alt: data?.name,
        }}
      />
    </Flex>
  );
};

const EventsCardSlice = ({ primary, items }) => {
  const { title, content, variant } = primary;

  return (
    <Slice variant={variant}>
      {RichText.asText(title) && (
        <Heading
          as="h2"
          mt={2}
          textAlign="center"
          px={{ base: 0, md: 9 }}
          fontFamily="body"
        >
          {RichText.asText(title)}
        </Heading>
      )}

      {content && (
        <Box textAlign="center" pb={3} px={{ base: 0, md: 9 }}>
          <RichText render={content} linkResolver={linkResolver} />
        </Box>
      )}

      {items.map(({ event }, i) => (
        <PrismicEventCard event={event} key={`event-card-${i}-${event?.uid}`} />
      ))}
    </Slice>
  );
};

export default EventsCardSlice;
