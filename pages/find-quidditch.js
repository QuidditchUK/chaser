import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import {
  Formik,
  Form,
  Field,
  useFormikContext,
} from 'formik';
import styled from 'styled-components';
import { space } from 'styled-system';
import debounce from 'just-debounce';
import Layout from 'containers/layout';
import { Box, Flex, Grid } from 'components/layout';
import { HeadingHero } from 'components/hero';
import Container from 'components/container';
import Heading from 'components/heading';
import ClubCard from 'components/club-card';
import Image from 'components/image';
// import { formatMetadata } from '../modules/prismic';
// import Meta from '../components/meta';

const MOCK_CLUBS = [{
  uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
  name: 'London Quidditch Club',
  slug: 'london-quidditch-club',
  type: 'Community',
  location: { type: 'POINT', coordinates: ['-0.150805', '51.460149'] },
  images: ['https://images.prismic.io/chaser/40bfbdca-e2e0-4273-85fd-3aaca8dfb09c_57246916_1980968082025155_3749381092197531648_o.jpg?auto=compress,format'],
  venue: 'Clapham Common, London',
  featuredColor: '#0e375f',
  textColor: '#ffffff',
},
{
  uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
  name: 'London Unspeakables Quidditch',
  slug: 'london-unspeakables-quidditch',
  type: 'Community',
  location: { type: 'POINT', coordinates: ['-0.148176', '51.453825'] },
  images: ['https://images.prismic.io/chaser/475578b7-a77c-4abc-90f2-de1547bbacf2_72886220_1438371239645635_5936997713475272704_o.jpg?auto=compress,format'],
  venue: 'Clapham Common, London',
  featuredColor: '#381e51',
  textColor: '#ffffff',
},
{
  uuid: '2d31f5d3-c265-4e5a-a973-5b77ab3218df',
  name: 'Werewolves of London Quidditch Club',
  slug: 'werewolves-of-london',
  type: 'Community',
  location: { type: 'POINT', coordinates: ['-0.157671', '51.558175'] },
  images: ['https://images.prismic.io/chaser/71dc92d4-5687-4814-933a-9fb1b92093dc_60423142_2303196516632278_4906127668908392448_n.jpg?auto=compress,format'],
  venue: 'Hampstead Heath, London',
  featuredColor: '#6a1713',
  textColor: '#ffffff',
},
{
  uuid: '36f03565-f622-43e6-90c5-fae022c5444c',
  name: 'St Andrews Snidgets Quidditch Club',
  slug: 'st-andrews-snidgets',
  type: 'University',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  images: ['https://images.prismic.io/chaser/879d8b2b-428d-4130-acba-509bc327e8f1_31265313_2077158405647076_3498501473933721600_o.jpg?auto=compress,format'],
  venue: 'North Haugh, St Andrews',
  featuredColor: '#0e375f',
  textColor: '#ffffff',
}];

const minHeight = { _: '250px', m: '400px' };

const Input = styled.input`
  background: transparent;
  border: 0;
  border-bottom: 3px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  outline: 0;
  ${space};

  &::placeholder {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
  }
`;

const fetchResults = (postcode) => console.log(postcode);
const fetchDebouncedResults = debounce(fetchResults, 1000);

const updatePostcode = (postcode) => {
  Router.push({
    pathname: Router.pathname,
    query: { postcode },
  }, {
    pathname: Router.pathname,
    query: { postcode },
  }, { shallow: true });

  fetchDebouncedResults(postcode);
};

const AutoValidatePostcode = () => {
  const { values } = useFormikContext();

  useEffect(() => {
    updatePostcode(values.postcode);
  }, [values.postcode]);

  return null;
};

const FindQuidditch = ({ clubs, events }) => {
  const { query: { postcode = '' } } = useRouter();
  const [showClubs, setShowClubs] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  console.log(events);

  return (
    <Layout>
      <Box
        as="section"
        position="relative"
        backgroundImage="url(https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959)"
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={minHeight}
      >
        <Flex
          position="absolute"
          minHeight={minHeight}
          zIndex={1}
          bg="primary"
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={minHeight}
          alignItems="center"
          zIndex={2}
        >
          <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
            <Formik
              initialValues={{ postcode }}
            >
              <Form>
                <HeadingHero fontSize={[4, 4, 6]} color="white" isBody>
                  Quidditch near
                  <Field
                    name="postcode"
                    placeholder="Postcode"
                    as={Input}
                    size="8"
                    marginLeft={[2, 4]}
                  />
                  <AutoValidatePostcode />
                </HeadingHero>
              </Form>
            </Formik>
          </Container>
        </Flex>
      </Box>
      <Box bg="white" py={5}>
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          <input type="checkbox" checked={showClubs} onChange={() => setShowClubs(!showClubs)} /> Clubs
          <input type="checkbox" checked={showEvents} onChange={() => setShowEvents(!showEvents)} /> Events
        </Container>
      </Box>

      <Box
        bg="greyLight"
        py={{ _: 6, l: 10 }}
      >
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          {showClubs
          && (
          <>
            <Heading as="h2" fontSize={4} mt={0} isBody color="primary">Clubs</Heading>

            <Grid
              gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))"
              gridGap={{ _: 'gutter._', m: 'gutter.m' }}
              pb={3}
            >
              {clubs.map((club) => (
                <Flex flexDirection="column" key={club.uuid}>
                  <ClubCard
                    backgroundColor={club.featuredColor}
                    color={club.textColor}
                    name={club.name}
                    type={club.type}
                    venue={club.venue}
                    image={club.images ? (
                      <Image
                        src={club.images[0]}
                        alt={club.name}
                        width={1600}
                        height={900}
                      />
                    ) : null}
                  />
                </Flex>
              ))}
            </Grid>
          </>
          )}

          {showEvents && <Heading as="h2" fontSize={4} isBody color="primary">Events</Heading>}
        </Container>
      </Box>
    </Layout>
  );
};

FindQuidditch.defaultProps = {
  clubs: MOCK_CLUBS,
  events: [],
};

FindQuidditch.propTypes = {
  clubs: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
};

export const getServerSideProps = async ({ query }) => {
  // get events and clubs
  const { postcode } = query;

  if (!postcode) {
    return {
      props: { clubs: MOCK_CLUBS, events: [] },
    };
  }

  return {
    props: { clubs: MOCK_CLUBS, events: [] },
  };
};

FindQuidditch.propTypes = {};

export default FindQuidditch;
