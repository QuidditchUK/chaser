import { useRouter } from 'next/router';
import Link from 'next/link';

import get from 'just-safe-get';
import { format } from 'date-fns';

import PrismicWrapper from 'components/prismic-wrapper';
import Container from 'components/container';

import { Box, Flex, Text, Link as ChakraLink, Image } from 'components';
import renderAuthor from 'constants/authors';
import { rem } from 'styles/theme';
import FacebookIcon from 'public/images/facebook.svg';
import TwitterIcon from 'public/images/twitter.svg';
import WhatsappIcon from 'public/images/whatsapp.svg';

const dasherizeTag = (tag) => tag.replace(/\s+/g, '--').replace(/\//g, '__');

const IconWrapper = (props) => (
  <ChakraLink height="30px" width="30px" {...props} />
);

const Icon = (props) => (
  <Box color="greyDark" _hover={{ color: 'qukBlue' }} {...props} />
);

const BlogSupport = (rawData) => {
  const SITE_URL = 'https://quidditchuk.org';

  const router = useRouter();
  const url = `${SITE_URL}${router.asPath}`;

  const author = get(rawData, 'author');
  const date = get(rawData, 'date');
  const title = get(rawData, 'title');
  const tags = get(rawData, 'tags');

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

      <PrismicWrapper small>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Image
              src={renderAuthor(author)}
              alt={author}
              mr={5}
              borderRadius="full"
              height="80px"
              width="80px"
            />

            <Text size="sm" fontWeight="bold" color="qukBlue" lineHeight="body">
              By {author}
              <br />
              {format(new Date(date), 'MMMM d, yyyy')}
            </Text>
          </Flex>

          <Flex flexDirection="column">
            <Text mt={0} size="sm" color="qukBlue">
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
      </PrismicWrapper>
    </>
  );
};

export default BlogSupport;
