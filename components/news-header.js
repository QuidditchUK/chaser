import { forwardRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Link, Flex, ListItem, UnorderedList } from 'components';
import Container from './container';

const ChakraLink = forwardRef(function ChakraLink(props, ref) {
  return (
    <Link
      textDecoration="none"
      _hover={{ color: 'qukBlue' }}
      ref={ref}
      {...props}
    />
  );
});

const Item = (props) => (
  <ListItem fontWeight="bold" color="greyDark" py={0} px={3} {...props} />
);

export default function NewsHeader() {
  const { asPath } = useRouter();

  return (
    <Flex
      align="center"
      overflowX="scroll"
      overflowY="hidden"
      borderTop="1px solid"
      borderColor="greyLight"
      w="100%"
      h="60px"
      bg="white"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}
    >
      <Container px={6} maxWidth={{ base: '100%', md: '700px' }}>
        <UnorderedList
          display="flex"
          alignItems="center"
          listStyleType="none"
          pl={0}
          justifyContent="space-between"
        >
          <Item>
            <NextLink href="/news" passHref>
              <ChakraLink color={asPath === '/news' ? 'qukBlue' : 'greyDark'}>
                All
              </ChakraLink>
            </NextLink>
          </Item>
          <Item>
            <NextLink href="/news/announcements" passHref>
              <ChakraLink
                color={
                  asPath === '/news/announcements' ? 'qukBlue' : 'greyDark'
                }
              >
                Announcements
              </ChakraLink>
            </NextLink>
          </Item>
          <Item>
            <NextLink href="/news/community" passHref>
              <ChakraLink
                color={asPath === '/news/community' ? 'qukBlue' : 'greyDark'}
              >
                Community
              </ChakraLink>
            </NextLink>
          </Item>
          <Item>
            <NextLink href="/news/leagues" passHref>
              <ChakraLink
                color={asPath === '/news/leagues' ? 'qukBlue' : 'greyDark'}
              >
                Leagues
              </ChakraLink>
            </NextLink>
          </Item>
          <Item>
            <NextLink href="/news/executive" passHref>
              <ChakraLink
                color={asPath === '/news/executive' ? 'qukBlue' : 'greyDark'}
              >
                Executive
              </ChakraLink>
            </NextLink>
          </Item>
          <Item>
            <NextLink href="/news/international" passHref>
              <ChakraLink
                color={
                  asPath === '/news/international' ? 'qukBlue' : 'greyDark'
                }
              >
                International
              </ChakraLink>
            </NextLink>
          </Item>
        </UnorderedList>
      </Container>
    </Flex>
  );
}
