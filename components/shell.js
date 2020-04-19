import React, { Component } from 'react';
import dynamic from 'next/dynamic';

import DocumentHead from '../document/head';
const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

export default (Page) => class Template extends Component {
  static async getInitialProps(context) {
    const pageProperties = (await Page.getInitialProps) && (await Page.getInitialProps(context));

    return { ...pageProperties };
  }

  render() {
    return (
      <>
        <DocumentHead />

        <Scripts />

        <Page {...this.props} />

      </>
    );
  }
};
