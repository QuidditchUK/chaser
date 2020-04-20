import React from 'react';
import dynamic from 'next/dynamic';
import DocumentHead from '../document/head';

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

export default (Page) => (
  <>
    <DocumentHead />
    <Scripts />
    <Page />
  </>
);
