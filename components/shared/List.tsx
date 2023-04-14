import { ReactNode, Fragment } from 'react';
import {
  UnorderedList,
  ListItem,
  ListProps,
  ListItemProps,
  Box,
  Flex,
  Text,
  Link,
  Skeleton,
  SkeletonCircle,
  Grid,
} from '@chakra-ui/react';
import Button from './button';

export const List = (props: ListProps) => (
  <UnorderedList
    listStyleType="none"
    m={0}
    p={0}
    bg="white"
    borderRadius="lg"
    {...props}
  />
);

type LiProps = ListItemProps & {
  icon?: ReactNode;
  name?: ReactNode | string;
  subtitle?: ReactNode | string;
  active?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  href?: string;
};

export const Li = ({
  name,
  icon,
  subtitle,
  active,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  href,
  ...props
}: LiProps) => {
  const Wrapper = href ? Link : Fragment;
  return (
    <Wrapper {...(href ? { href } : {})}>
      <ListItem
        _hover={{ bg: 'gray.100' }}
        cursor="pointer"
        display="grid"
        gridTemplateColumns="auto 1fr auto"
        alignItems="center"
        p={3}
        gridColumnGap={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        {...props}
      >
        <Box color="gray.400">{icon}</Box>
        <Box>
          <Flex alignItems="center" direction="row" gridGap={2}>
            {name}
          </Flex>
          <Text mt={0} mb={1} fontSize="sm" color="gray.500">
            {subtitle}
          </Text>
        </Box>

        <Text color={active ? 'keeperGreen' : 'monarchRed'} fontWeight="bold">
          {active ? activeLabel : inactiveLabel}
        </Text>
      </ListItem>
    </Wrapper>
  );
};

type SidebarListItemProps = ListItemProps & {
  href?: string;
};

export const SidebarListItem = ({ href, ...props }: SidebarListItemProps) => {
  const Wrapper = href ? Link : Fragment;
  return (
    <Wrapper {...(href ? { href } : {})}>
      <ListItem
        borderBottom="1px solid"
        borderColor="gray.100"
        _hover={{ bg: 'gray.100' }}
        display="grid"
        alignItems="center"
        color="qukBlue"
        gridTemplateColumns="auto 1fr"
        cursor="pointer"
        p={4}
        gridGap={3}
        {...props}
      />
    </Wrapper>
  );
};

export const SkeletonList = () => (
  <>
    <Flex direction="row" gridGap={3} mb={5}>
      <Skeleton>
        <Button>All</Button>
      </Skeleton>
      <Skeleton>
        <Button>Active</Button>
      </Skeleton>
      <Skeleton>
        <Button>Inactive</Button>
      </Skeleton>
    </Flex>
    <Box borderRadius="lg" bg="white" p={3}>
      <Grid gridTemplateColumns="auto 1fr auto" alignItems="center" gridGap={3}>
        <SkeletonCircle h="3rem" width="3rem" />
        <Box>
          <Skeleton mb={2}>
            <Text>John Smith</Text>
          </Skeleton>
          <Skeleton>
            <Text>Utility | Community</Text>
          </Skeleton>
        </Box>
        <Skeleton>
          <Text m={0}>Active</Text>
        </Skeleton>
      </Grid>
    </Box>
  </>
);
