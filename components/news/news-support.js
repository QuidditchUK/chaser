import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import format from 'date-fns/format';
import { Box, Flex, Text, Link as ChakraLink } from '@chakra-ui/react';
import CATEGORIES from 'constants/categories';

const Image = dynamic(() => import('components/shared/image'));
const Slice = dynamic(() => import('components/shared/slice'));
const Container = dynamic(() => import('components/layout/container'));
const FacebookIcon = dynamic(() => import('public/images/facebook.svg'));
const TwitterIcon = dynamic(() => import('public/images/twitter.svg'));
const WhatsappIcon = dynamic(() => import('public/images/whatsapp.svg'));

import renderAuthor from 'constants/authors';
import { rem } from 'styles/theme';

const dasherizeTag = (tag) => tag.replace(/\s+/g, '--').replace(/\//g, '__');

const IconWrapper = (props) => (
  <ChakraLink height="30px" width="30px" {...props} />
);

const Icon = (props) => (
  <Box color="white" _hover={{ color: 'monarchRed' }} {...props} />
);

const NewsSupport = ({ author, date, title, tags, category }) => {
  const SITE_URL = 'https://quidditchuk.org';

  const router = useRouter();
  const url = `${SITE_URL}${router.asPath}`;

  return (
    <>
      {tags?.length > 0 && (
        <Box py={2} bg="white" px={{ base: 4, sm: 8, md: 9 }}>
          <Container maxWidth={rem(960)}>
            <Box fontWeight="bold" fontStyle="italic" color="black">
              #{' '}
              {tags.map((tag, i) => (
                <Link
                  href={`/news/tagged/${dasherizeTag(tag)}`}
                  key={`${tag}-${i}`}
                  passHref
                >
                  <ChakraLink color="black" mx={4}>
                    {tag}
                  </ChakraLink>
                </Link>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      <Box bg="gray.800" py={{ base: 4, lg: 5 }} px={{ base: 4, sm: 8, md: 9 }}>
        <Container>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Image
                src={renderAuthor(author)}
                alt={author}
                borderRadius="full"
                height="80px"
                width="80px"
              />

              <Text
                size="sm"
                fontWeight="bold"
                color="white"
                lineHeight="1.3rem"
                ml={5}
              >
                By {author}
                <br />
                {format(new Date(date), 'MMMM d, yyyy')}
              </Text>
            </Flex>

            <Flex flexDirection="column">
              <Text mt={0} size="sm" color="white">
                Share this article
              </Text>

              <Flex justifyContent="space-between">
                <IconWrapper
                  aria-label="Share this article on Facebook"
                  href={`https://www.facebook.com/sharer.php?u=${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={FacebookIcon} />
                </IconWrapper>

                <IconWrapper
                  aria-label="Tweet this article"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `QuidditchUK: ${title} ${url}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={TwitterIcon} />
                </IconWrapper>
                <IconWrapper
                  aria-label="Share this article on Whatsapp"
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `QuidditchUK: ${title} ${url}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={WhatsappIcon} />
                </IconWrapper>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default NewsSupport;
