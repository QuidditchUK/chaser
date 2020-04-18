import React, { Component } from 'react';

import DocumentHead from '../document/head';
import Scripts from '../document/scripts';

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
