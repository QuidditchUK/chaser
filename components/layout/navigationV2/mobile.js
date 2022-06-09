import { Link as PrismicLink } from 'prismic-reactjs';
import { linkResolver } from 'modules/prismic';

import {
  Flex,
  ListItem,
  HStack,
  UnorderedList,
  Box,
  Link as ChakraLink,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import Link from 'next/link';
import { useRouter } from 'next/router';

import FacebookIcon from 'public/images/facebook.svg';
import YoutubeIcon from 'public/images/youtube.svg';
import TwitterIcon from 'public/images/twitter.svg';
import InstagramIcon from 'public/images/instagram.svg';

const IconWrapper = (props) => (
  <ChakraLink height="20px" width="20px" {...props} />
);

const Icon = (props) => (
  <Box color="monarchRed" _hover={{ color: 'qukBlue' }} {...props} />
);

const ActiveLink = ({ href, wrapperProps, onClick, children }) => {
  const { asPath } = useRouter();
  const regexAs = RegExp(href.replace(/\//g, '\\/'), 'g');

  const isActive = regexAs.test(asPath);

  return (
    <ListItem {...wrapperProps}>
      <Link href={href} passHref>
        <ChakraLink
          pb={1}
          alignItems="center"
          textDecoration="none"
          color="qukBlue"
          borderBottom="2px solid"
          borderColor={isActive ? 'qukBlue' : 'transparent'}
          fontWeight={600}
          textTransform="uppercase"
          _hover={{ borderColor: 'qukBlue' }}
          fontSize="1rem"
          onClick={onClick}
        >
          {children}
        </ChakraLink>
      </Link>
    </ListItem>
  );
};

const MenuItem = ({ wrapperProps, data, onClose }) => {
  const { link, link_label } = data?.primary;

  return (
    <ActiveLink
      href={PrismicLink.url(link, linkResolver)}
      wrapperProps={wrapperProps}
      onClick={onClose}
    >
      {link_label}
    </ActiveLink>
  );
};

const MenuList = ({ wrapperProps, data, onClose }) => {
  const { items } = data;
  const { label } = data?.primary;
  const { asPath } = useRouter();

  return (
    <ListItem {...wrapperProps}>
      <Text
        fontWeight={600}
        color="monarchRed"
        textTransform="uppercase"
        fontSize="1rem"
        display="grid"
        gridTemplateColumns="1fr 10px"
        alignItems="center"
        gridGap={2}
        pb={1}
      >
        {label}
      </Text>

      <UnorderedList listStyleType="none" pl={0} ml={0} spacing={3}>
        {items.map((item) => {
          const regexAs = RegExp(
            PrismicLink.url(item?.link, linkResolver),
            'g'
          );

          const isActive = regexAs.test(asPath);
          const isExternal = item?.link?.link_type === 'Web';

          return (
            <ListItem key={item?.link_label} tabIndex={0}>
              <Link href={PrismicLink.url(item?.link, linkResolver)} passHref>
                <ChakraLink
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  alignItems="center"
                  textDecoration="none"
                  color="qukBlue"
                  borderBottom="2px solid"
                  borderColor={isActive ? 'qukBlue' : 'transparent'}
                  fontWeight={600}
                  _hover={{ borderColor: 'qukBlue' }}
                  _active={{ borderColor: 'qukBlue' }}
                  fontSize="1rem"
                  onClick={onClose}
                >
                  {item?.link_label}
                  {isExternal && <ExternalLinkIcon ml={2} />}
                </ChakraLink>
              </Link>
            </ListItem>
          );
        })}
      </UnorderedList>
    </ListItem>
  );
};

const menuSlices = {
  menu_item: MenuItem,
  menu_list: MenuList,
};

export default function MobileNavigation({
  onClose,
  top_level_navigation,
  data,
}) {
  const { asPath } = useRouter();
  return (
    <>
      <Flex justifyContent="flex-end" alignItems="center" h="70px">
        <IconButton
          color="qukBlue"
          aria-label="Close"
          border={0}
          bg="white"
          _hover={{
            bg: 'white',
            color: 'qukBlue',
          }}
          p={0}
          icon={<CloseIcon w={4} h={4} />}
          onClick={onClose}
        />
      </Flex>

      <UnorderedList listStyleType="none" ml={0} pl={0}>
        {data?.map((slice, i) => {
          const Component = menuSlices[slice?.slice_type];

          return (
            <Component
              key={`menu-${slice?.slice_type}-${i}`}
              onClose={onClose}
              wrapperProps={{
                tabIndex: 0,
                mt: 8,
                _first: { mt: 0 },
              }}
              data={slice}
            />
          );
        })}
      </UnorderedList>

      <Text
        fontWeight={600}
        color="monarchRed"
        textTransform="uppercase"
        fontSize="1rem"
        alignItems="center"
        pb={1}
      >
        Quick Links
      </Text>

      <UnorderedList listStyleType="none" p={0} ml={0} mt={0} spacing={3}>
        {top_level_navigation?.map(({ link_label, link }) => {
          const regexAs = RegExp(PrismicLink.url(link, linkResolver), 'g');

          const isActive = regexAs.test(asPath);
          const isExternal = link?.link_type === 'Web';
          return (
            <ListItem key={link_label} tabIndex={0}>
              <Link href={PrismicLink.url(link, linkResolver)} passHref>
                <ChakraLink
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  alignItems="center"
                  textDecoration="none"
                  color="qukBlue"
                  borderBottom="2px solid"
                  borderColor={isActive ? 'qukBlue' : 'transparent'}
                  fontWeight={600}
                  _hover={{ borderColor: 'qukBlue' }}
                  _active={{ borderColor: 'qukBlue' }}
                  fontSize="1rem"
                  onClick={onClose}
                >
                  {link_label}
                  {isExternal && <ExternalLinkIcon ml={2} />}
                </ChakraLink>
              </Link>
            </ListItem>
          );
        })}
      </UnorderedList>

      <Text
        fontWeight={600}
        color="monarchRed"
        textTransform="uppercase"
        fontSize="1rem"
        alignItems="center"
      >
        Social
      </Text>

      <HStack spacing={5} mt={1} mb={2}>
        <IconWrapper
          aria-label="Like us on Facebook"
          href="https://www.facebook.com/QuidditchUK"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon as={FacebookIcon} />
        </IconWrapper>

        <IconWrapper
          aria-label="Follow us on Twitter"
          href="https://twitter.com/QuidditchUK"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon as={TwitterIcon} />
        </IconWrapper>

        <IconWrapper
          aria-label="Follow us on Instagram"
          href="https://instagram.com/ukquidditch"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon as={InstagramIcon} />
        </IconWrapper>

        <IconWrapper
          aria-label="Subscribe to our Youtube Channel"
          href="https://www.youtube.com/channel/UCef5ZmqGJvff6RIqA0KS0wQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon as={YoutubeIcon} />
        </IconWrapper>
      </HStack>
    </>
  );
}
