import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Meta = ({ metadata }) => {
  const {
    url,
    subTitle,
    description,
    title,
    image,
    type,
  } = metadata;

  return (
    <Helmet titleTemplate={`%s – ${subTitle}`}>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:title" content={`${subTitle} | ${title}`} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};


Meta.propTypes = {
  metadata: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ metadata }) => ({ metadata });

export default connect(mapStateToProps)(Meta);
