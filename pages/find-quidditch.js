import React, { useEffect } from 'react';
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
import Layout from '~/containers/layout';
import { Box, Flex } from '~/components/layout';
import { HeadingHero } from '~/components/hero';
import Container from '~/components/container';
import Heading from '~/components/heading';
// import { formatMetadata } from '../modules/prismic';
// import Meta from '../components/meta';

const minHeight = { _: '250px', m: '400px' };

const Input = styled.input`
  background: transparent;
  border: 0;
  border-bottom: 3px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  outline: 0;
  ${space};
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

      <Box
        bg="greyLight"
        py={{ _: 6, l: 10 }}
      >
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          <Heading as="h2" fontSize={[3, 3, 4]} mt={0} isBody color="primary">Clubs</Heading>
          <Heading as="h2" fontSize={[3, 3, 4]} mt={0} isBody color="primary">Events</Heading>
        </Container>
        {clubs}
        {events}
      </Box>
    </Layout>
  );
};

FindQuidditch.defaultProps = {
  clubs: [],
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
      props: { clubs: [], events: [] },
    };
  }

  return {
    props: { clubs: [], events: [] },
  };
};

FindQuidditch.propTypes = {};

export default FindQuidditch;
