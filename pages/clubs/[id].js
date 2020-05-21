import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useRouter } from 'next/router';
import Page404 from 'pages/404';
import PageLoading from 'components/page-loading';
import Heading from 'components/heading';

import Layout from 'containers/layout';
import Meta from 'components/meta';
import { Box, Flex } from 'components/layout';
import Type, { TYPES } from 'components/club-type';
import { rem } from 'styles/theme';

const minHeight = { _: '250px', m: '400px' };

const IconContainer = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  z-index: 3;
`;

const Icon = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;

  background: ${({ theme }) => theme.colors.white};
  @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 200px;
    width: 200px;
  }
`;

const UNSPEAKABLES = {
  uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
  name: 'London Unspeakables Quidditch',
  slug: 'london-unspeakables-quidditch',
  type: 'Community',
  location: { type: 'POINT', coordinates: ['-0.148176', '51.453825'] },
  images: ['https://images.prismic.io/chaser/475578b7-a77c-4abc-90f2-de1547bbacf2_72886220_1438371239645635_5936997713475272704_o.jpg?auto=compress,format'],
  venue: 'Clapham Common, London',
  featuredColor: '#381e51',
  textColor: '#ffffff',
  icon: 'https://images.prismic.io/chaser/98cc10fb-4840-40ac-a973-1bc54e7d86c5_unspeakables.png?auto=compress,format',
};

const ClubPage = ({ club }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (<PageLoading />);
  }

  if (!club) {
    return <Page404 />;
  }

  return (
    <Layout>
      <Meta
        description={`Club page of ${club.name} with all their latest news, results and details`}
        subTitle={club.name}
        image={club.images[0]}
      />
      <Box
        as="section"
        position="relative"
        backgroundImage={`url(${club.images[0]})`}
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        minHeight={minHeight}
      >
        <Box
          position="absolute"
          right="0"
          padding={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        >
          <Type fontWeight="bold" fontSize={[rem(10), rem(16)]} bg={TYPES[club.type]}>{club.type}</Type>
        </Box>
      </Box>
      <Box
        as="section"
        position="relative"
        backgroundColor={club.featuredColor}
        color={club.textColor}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        py="0"
        height="130px"
      >
        <Flex justifyContent="flex-start" alignItems="center" top={{ _: 0, m: '-50px' }} position="relative">
          <IconContainer><Icon src={club.icon} alt={`${name} logo`} /></IconContainer>
          <Flex flexDirection="column">
            <Heading as="h2" fontSize={[3, 4, 5]} py="0" my="0">{club.name}</Heading>
            <p>{club.venue}</p>
          </Flex>
        </Flex>
      </Box>

    </Layout>
  );
};

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = async ({ params: { id } }) => {
  const club = UNSPEAKABLES;

  return {
    props: { club },
  };
};

ClubPage.propTypes = {
  club: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    venue: PropTypes.string,
    icon: PropTypes.string,
    featuredColor: PropTypes.string,
    textColor: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default ClubPage;
