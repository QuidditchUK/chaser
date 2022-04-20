import { RichText } from 'prismic-reactjs';
import { Flex, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));

import { buttonVariants } from 'components/shared/slice';
import { linkResolver } from 'modules/prismic';

const HeaderAndParagraph = ({ primary }) => {
  const { title, center_title, content, variant, cta_text, cta_url } = primary;

  return (
    <Slice variant={variant} size="sm">
      {RichText.asText(title) && (
        <Heading
          as="h2"
          fontSize="3xl"
          mt={2}
          textAlign={center_title ? 'center' : 'left'}
        >
          {RichText.asText(title)}
        </Heading>
      )}

      {RichText.asText(content) && (
        <Content>
          <RichText render={content} linkResolver={linkResolver} />
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
