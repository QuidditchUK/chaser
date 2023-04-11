import Link from 'next/link';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface Breadcrumb {
  link: string;
  title: string;
}

export default function HeadingWithBreadcrumbs({
  breadcrumbs,
  heading,
}: {
  breadcrumbs: Breadcrumb[];
  heading: string;
}) {
  return (
    <Box mt={4}>
      <Flex alignItems="center">
        {breadcrumbs.map((breadcrumb) => (
          <>
            <Link href={breadcrumb.link}>{breadcrumb.title}</Link>{' '}
            <ChevronRightIcon />
          </>
        ))}
      </Flex>
      <Heading
        as="h3"
        mt={1}
        fontFamily="body"
        color="qukBlue"
        display="flex"
        alignItems="center"
      >
        {heading}
      </Heading>
    </Box>
  );
}
