import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const ExternalLink = ({ href, children }) => {
  const regex = new RegExp('http', 'g');

  return regex.test(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <Link href={href} passHref><a>{children}</a></Link>;
};

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ExternalLink;
