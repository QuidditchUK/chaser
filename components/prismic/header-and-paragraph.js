import { PrismicRichText, PrismicText } from '@prismicio/react';
import * as prismicH from '@prismicio/helpers';
import { Flex, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));

import { buttonVariants } from 'components/shared/slice';

const HeaderAndParagraph = ({ primary }) => {
  const { title, center_title, content, variant, cta_text, cta_url } = primary;

  return (
    <Slice variant={variant} size="sm">
      {prismicH.asText(title) && (
        <Heading
          as="h2"
          fontSize="3xl"
          mt={2}
          textAlign={center_title ? 'center' : 'left'}
        >
          <PrismicText field={title} />
        </Heading>
      )}

      {prismicH.asText(content) && (
        <Content>
          <PrismicRichText field={content} />
        </Content>
      )}

      {cta_text && cta_url && (
        <Flex justifyContent="center">
          <Button
            type="button"
            variant={buttonVariants[variant]}
            ml={2}
            href={cta_url}
          >
            {cta_text}
          </Button>
        </Flex>
      )}
    </Slice>
  );
};

export default HeaderAndParagraph;
