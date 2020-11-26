import React from 'react';
import redirect from 'nextjs-redirect';
import dynamic from 'next/dynamic';

const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Redirect = redirect('https://www.utilityapparel.com/quidditch-uk/');

export default function Merch() {
  return (
    <Redirect>
      <Meta
        title="Merch"
        description="Purchase your official QuidditchUK merch from Utility Apparel"
      />
      <Container>
        <Heading textAlign="center">Redirecting to Utility Apparel...</Heading>
      </Container>
    </Redirect>
  );
}
