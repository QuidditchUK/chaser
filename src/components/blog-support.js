import React from 'react';
import styled from 'styled-components';
import { typography, space } from 'styled-system';
import get from 'just-safe-get';
import { format } from 'date-fns';

import PrismicWrapper from './prismic-wrapper';
import { Flex } from './layout';
import renderAuthor from '../constants/authors';
import { ReactComponent as FacebookIcon } from '../images/facebook.svg';
import { ReactComponent as TwitterIcon } from '../images/twitter.svg';
import { ReactComponent as WhatsappIcon } from '../images/whatsapp.svg';

const SupportText = styled.p`
  ${typography};
  ${space};
  color: ${({ theme }) => theme.colors.primary};
`;

const Author = styled.img`
  ${space};
  border-radius: 50%;
  height: 80px;
  width: 80px;
`;

const Icon = styled.a`
  svg {
      color: ${({ theme }) => theme.colors.darkBlue};
      height: 30px;
      width: 30px;
    }

    &:hover {
      svg {
        color: ${({ theme }) => theme.colors.white};
      }
    }
`;

const BlogSupport = (rawData) => {
  const data = {
    author: get(rawData, 'author'),
    date: get(rawData, 'date'),
    title: get(rawData, 'title'),
  };

  return (
    <PrismicWrapper small>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Author src={renderAuthor(data.author)} alt={data.author} mr={5} />
          <SupportText fontSize={[1, 1, 2]} fontWeight="bold">By {data.author}<br />{format(new Date(data.date), 'MMMM d, yyyy')}</SupportText>
        </Flex>

        <Flex flexDirection="column">
          <SupportText mt={0} fontSize={[1, 1, 2]}>Share this article</SupportText>

          <Flex justifyContent="space-between">
            <Icon
              aria-label="Share this article on Facebook"
              href={`https://www.facebook.com/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </Icon>

            <Icon
              aria-label="Tweet this article"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `QuidditchUK: ${data.title} ${window.location.href}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon />
            </Icon>
            <Icon
              aria-label="Share this article on Whatsapp"
              href={`https://web.whatsapp.com/send?text=${encodeURIComponent(
                `QuidditchUK: ${data.title} ${window.location.href}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon />
            </Icon>
          </Flex>
        </Flex>
      </Flex>
    </PrismicWrapper>
  );
};

export default BlogSupport;