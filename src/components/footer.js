import React from 'react';
import styled from 'styled-components';
import {
  Box, Grid, GridItem,
} from './layout';
import { Logo, LogoLink } from './logo';
import Container from './container';
import Heading from './heading';

import logo from '../images/logo.png';
import logoText from '../images/logo-text.png';
import { rem } from '../styles/theme';

const year = new Date().getFullYear();

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const Item = styled.li`
  line-height: ${rem(28)};
`;

const Support = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
`;
export const Footer = () => (
  <>
    <Box
      bg="primary"
      color="white"
      py={{ _: 2, l: 5 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container pb={3}>
        <Grid
          gridTemplateColumns={{ _: '1fr 1fr', m: '1fr 1fr 1fr 1fr' }}
          gridGap={{ _: 'gutter._', m: 'gutter.m' }}
        >
          <GridItem>
            <Heading as="h3" color="white">
            About
            </Heading>

            <List>
              <Item>What is Quidditch</Item>
              <Item>History</Item>
              <Item>Team UK</Item>
              <Item>Executive</Item>
            </List>
          </GridItem>

          <GridItem>
            <Heading as="h3" color="white">
            Get Involved
            </Heading>

            <List>
              <Item>Find Quidditch</Item>
              <Item>Refereeing</Item>
              <Item>Coaching</Item>
              <Item>Volunteering</Item>
              <Item>News</Item>
            </List>
          </GridItem>

          <GridItem>
            <Heading as="h3" color="white">
            Info
            </Heading>

            <List>
              <Item>Contact Us</Item>
              <Item>FAQ</Item>
              <Item>Rule Book</Item>
              <Item>Policies</Item>
            </List>
          </GridItem>

          <GridItem>
            <Heading as="h3" color="white">
              Disclaimer
            </Heading>

            <Support>
              QuidditchUK and its activities are not licensed by, sponsored by or associated with Warner Bros., J.K. Rowling or their affiliates.  ‘Quidditch,’ ‘Harry Potter’ and all related names, characters and indicia are trademarks of and © Warner Bros. – Harry Potter publishing rights © J.K. Rowling.
            </Support>

            <Support>
              QuidditchUK is a Non-Profit Company Registered in England and Wales, Company Registration No. 12178866
            </Support>
          </GridItem>
        </Grid>
      </Container>

      <Container borderTop="3px solid white" py={5} textAlign={{ _: 'center', m: 'left' }}>
        <>
          <LogoLink to="/">
            <Logo src={logo} alt="Quidditch UK" white />
            <Logo src={logoText} alt="Quidditch UK" white />
          </LogoLink>

          <Support>All Rights Reserved © {year} QuidditchUK</Support>
        </>

      </Container>
    </Box>
  </>
);

export default Footer;
