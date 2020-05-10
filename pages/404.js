/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import Layout from '~/containers/layout';
import Container from '~/components/container';
import { Flex, Box } from '~/components/layout';
import Heading from '~/components/heading';
import Content from '~/components/content';
import Image from '~/components/image';
import Meta from '../components/meta';

export default function Custom404() {
  return (
    <Layout>
      <Box bg="greyLight">
        <Container>
          <Meta subTitle="Page Not Found" />
          <Flex alignItems="center" justifyContent="center" flexDirection="column" py={10} px={5}>
            <Heading as="h1" textAlign="center" marginTop={0}>Page Not Found</Heading>
            <Image src="/images/404.gif" alt="404" height={208} width={500} />
            <Content paddingTop={3} textAlign="center">Don&#39;t worry, it happens to the best of us.<br />
              <Link as="/" href="/" passHref><a>Return to the Homepage</a></Link>
            </Content>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
}
