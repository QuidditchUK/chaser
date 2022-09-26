import { useState, useEffect } from 'react';
import {
  Popover,
  Link as ChakraLink,
  ListItem,
  UnorderedList,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverBody,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import * as prismicH from '@prismicio/helpers';

import { useRouter } from 'next/router';
import { linkResolver } from '../../../modules/prismic';

const MenuItem = ({ wrapperProps, data }) => {
  const { asPath } = useRouter();
  const { link_label, link } = data.primary;
  const href = prismicH.asLink(link, linkResolver);

  const regexAs = RegExp(href.replace(/\//g, '\\/'), 'g');

  const isActive = regexAs.test(asPath);

  return (
    <ListItem role="none" {...wrapperProps}>
      <Link href={href} passHref>
        <ChakraLink
          display="grid"
          gridTemplateColumns="1fr"
          alignItems="center"
          textDecoration="none"
          color={isActive ? 'monarchRed' : 'gray.600'}
          fontWeight={600}
          _hover={{ color: 'monarchRed' }}
          fontSize="0.925rem"
        >
          {link_label}
        </ChakraLink>
      </Link>
    </ListItem>
  );
};

const MenuList = ({ wrapperProps, data }) => {
  const { asPath } = useRouter();
  const [childActive, setChildActive] = useState(false);

  useEffect(() => {
    const childrenActive = data?.items?.map(({ link }) => {
      const regexAs = RegExp(prismicH.asLink(link, linkResolver), 'g');

      return regexAs.test(asPath);
    });

    setChildActive(childrenActive.some((v) => v));
  }, [setChildActive, data?.items, asPath]);

  return (
    <ListItem role="listitem" {...wrapperProps}>
      <Popover>
        <PopoverTrigger>
          <ChakraButton
            bg="transparent"
            border={0}
            padding={0}
            margin={0}
            height="initial"
            position="relative"
            fontWeight={600}
            color={childActive ? 'monarchRed' : 'gray.600'}
            textDecoration="none"
            _hover={{ color: 'monarchRed' }}
            fontSize="0.925rem"
            display="grid"
            gridTemplateColumns="1fr 10px"
            alignItems="center"
            gridGap={2}
            _after={{
              content: '""',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid',
              borderTopColor: childActive ? 'monarchRed' : 'gray.600',
            }}
            sx={{
              '&:hover::after': {
                transition: 'all 0.2s ease',
                borderTopColor: 'monarchRed',
              },
            }}
          >
            {data?.primary?.label}
          </ChakraButton>
        </PopoverTrigger>
        <PopoverContent bg="qukBlue" color="white" borderColor="qukBlue">
          <PopoverArrow bg="qukBlue" />
          <PopoverBody as="nav" py={4} px={3}>
            <UnorderedList listStyleType="none" pl={0} ml={0} spacing={3}>
              {data?.items.map((item) => {
                const regexAs = RegExp(
                  prismicH.asLink(item?.link, linkResolver),
                  'g'
                );

                const isActive = regexAs.test(asPath);
                const isExternal = item?.link?.link_type === 'Web';

                return (
                  <ListItem key={item?.link_label} tabIndex={0}>
                    <Link
                      href={prismicH.asLink(item?.link, linkResolver)}
                      passHref
                    >
                      <ChakraLink
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        display="grid"
                        gridTemplateColumns="1fr 10px"
                        p={2}
                        px={4}
                        alignItems="center"
                        textDecoration="none"
                        color="white"
                        fontWeight={600}
                        _hover={{ bg: 'blue.600' }}
                        _active={{ bg: 'blue.600' }}
                        borderRadius="md"
                        bg={isActive ? 'blue.600' : 'transparent'}
                        fontSize="0.875rem"
                      >
                        {item?.link_label}
                        {isExternal && <ExternalLinkIcon />}
                      </ChakraLink>
                    </Link>
                  </ListItem>
                );
              })}
            </UnorderedList>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </ListItem>
  );
};

const menuSlices = {
  menu_item: MenuItem,
  menu_list: MenuList,
};

export default function Navigation({ data }) {
  return (
    <UnorderedList
      display={{ base: 'none', lg: 'flex' }}
      flexDirection="row"
      listStyleType="none"
      role="list"
      ml={0}
      pl={2}
    >
      {data?.map((slice, i) => {
        const Component = menuSlices[slice?.slice_type];

        return (
          <Component
            key={`menu-${slice?.slice_type}-${i}`}
            wrapperProps={{
              ml: 8,
              _first: { ml: 2 },
            }}
            data={slice}
          />
        );
      })}
    </UnorderedList>
  );
}
