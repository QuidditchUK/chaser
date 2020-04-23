import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import Link from 'next/link';
import ActiveLink from './active-link';
import {
  Box, Grid, GridItem, Flex,
} from './layout';
import { Logo, LogoLink } from './logo';
import Container from './container';
import Heading from './heading';
import Input from './input';
import Button from './button';
import { rem } from '../styles/theme';
import FacebookIcon from '../public/images/facebook.svg';
import TwitterIcon from '../public/images/twitter.svg';
import InstagramIcon from '../public/images/instagram.svg';

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';


const year = new Date().getFullYear();

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const Item = styled.li`
  line-height: ${rem(28)};

  a { 
    text-decoration: none;
  }

  span {
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      border-bottom: 2px solid ${({ theme }) => theme.colors.white};
    }

    &.active {
      font-weight: 700;
    }
  }
`;

const Support = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
`;

const Icon = styled.a`
  ${space};

  svg {
      color: ${({ theme }) => theme.colors.greyLight};
      height: 30px;
      width: 30px;
    }

    &:hover {
      svg {
        color: ${({ theme }) => theme.colors.secondary};
      }
    }
`;
export const Footer = () => (
  <footer>
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
              <Item><ActiveLink href="/about/what-is-quidditch"><span>What is Quidditch</span></ActiveLink></Item>
              <Item><ActiveLink href="/about/history"><span>History</span></ActiveLink></Item>
              <Item><ActiveLink href="/team-uk"><span>Team UK</span></ActiveLink></Item>
              <Item><ActiveLink href="/about/meet-the-executive"><span>Executive</span></ActiveLink></Item>
            </List>
          </GridItem>

          <GridItem>
            <Heading as="h3" color="white">
            Get Involved
            </Heading>

            <List>
              <Item>Find Quidditch</Item>
              <Item><ActiveLink href="/get-involved/refereeing"><span>Refereeing</span></ActiveLink></Item>
              <Item><ActiveLink href="/get-involved/coaching"><span>Coaching</span></ActiveLink></Item>
              <Item><ActiveLink href="/get-involved/volunteering"><span>Volunteering</span></ActiveLink></Item>
              <Item><ActiveLink href="/news"><span>News</span></ActiveLink></Item>
            </List>
          </GridItem>

          <GridItem>
            <Heading as="h3" color="white">
            Info
            </Heading>

            <List>
              <Item><ActiveLink href="/info/contact-us"><span>Contact Us</span></ActiveLink></Item>
              <Item><ActiveLink href="/info/faqs"><span>FAQs</span></ActiveLink></Item>
              <Item><ActiveLink href="/info/rule-book"><span>Rule Book</span></ActiveLink></Item>
              <Item><ActiveLink href="/info/key-documents"><span>Key Documents</span></ActiveLink></Item>
              <Item><ActiveLink href="/info/policies"><span>Policies</span></ActiveLink></Item>
            </List>
          </GridItem>

          <GridItem>
            <Heading as="h3" color="white">
              Disclaimer
            </Heading>

            <Support>
              QuidditchUK and its activities are not licensed by, sponsored by or associated with Warner Bros., J.K. Rowling or their affiliates.  ‘Quidditch,’ ‘Harry Potter’ and all related names, characters and indicia are trademarks of and &copy; Warner Bros. – Harry Potter publishing rights &copy; J.K. Rowling.
            </Support>

            <Support>
              QuidditchUK is a Non-Profit Company Registered in England and Wales, Company Registration No. 12178866
            </Support>
          </GridItem>
        </Grid>
      </Container>

      <Container borderTop="3px solid white" py={5} textAlign={{ _: 'center', m: 'left' }}>
        <Grid
          gridTemplateColumns={{ _: '1fr', m: '4fr 2fr' }}
          gridGap={{ _: 'gutter._', m: 'gutter.m' }}
        >
          <Flex flexDirection="column" order={{ _: 2, m: 1 }}>
            <Link href="/" passHref>
              <LogoLink>
                <>
                  <Logo src={logo} alt="Quidditch UK" white />
                  <Logo src={logoText} alt="Quidditch UK" white />
                </>
              </LogoLink>
            </Link>

            <Support>All Rights Reserved &copy; {year} QuidditchUK</Support>
          </Flex>

          <Flex flexDirection="column" order={{ _: 1, m: 2 }}>
            <Flex>
              <Input type="text" placeholder="Enter email to join our newsletter" width={1} /><Button variant="secondary" ml={2}>Submit</Button>
            </Flex>

            <Flex justifyContent={{ _: 'center', m: 'flex-end' }} mt={5}>
              <Icon
                aria-label="Like us on Facebook"
                href="https://www.facebook.com/QuidditchUK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </Icon>

              <Icon
                aria-label="Follow us on Twitter"
                href="https://twitter.com/QuidditchUK"
                target="_blank"
                rel="noopener noreferrer"
                pl={{ _: 5, m: 3 }}
              >
                <TwitterIcon />
              </Icon>

              <Icon
                aria-label="Follow us on Instagram"
                href="https://instagram.com/ukquidditch"
                target="_blank"
                rel="noopener noreferrer"
                pl={{ _: 5, m: 3 }}
              >
                <InstagramIcon />
              </Icon>
            </Flex>
          </Flex>

        </Grid>
      </Container>
    </Box>
  </footer>
);

export default Footer;
