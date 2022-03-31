import Link from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';

const ExternalLink = ({ href, children, ...props }) => {
  const regex = new RegExp('(http)|(mailto)', 'g');

  return regex.test(href) ? (
    <ChakraLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </ChakraLink>
  ) : (
    <Link href={href} passHref>
      <ChakraLink {...props}>{children}</ChakraLink>
    </Link>
  );
};

export default ExternalLink;
