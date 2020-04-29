/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children, as }) => {
  const { asPath } = useRouter();

  let className = children.props.className || '';
  const regexHref = RegExp(href.replace(/\//g, '\\/'), 'g');

  if (regexHref.test(asPath)) {
    className = `${className} active`;
  }

  return (<Link href={href} as={as} passHref><a>{React.cloneElement(children, { className })}</a></Link>);
};

ActiveLink.propTypes = {
  as: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const ExactActiveLink = ({ href, children, as }) => {
  const { asPath } = useRouter();
  let className = children.props.className || '';

  if (href === asPath) {
    className = `${className} active`;
  }

  return (<Link href={href} as={as} passHref><a>{React.cloneElement(children, { className })}</a></Link>);
};

ExactActiveLink.propTypes = {
  as: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ActiveLink;
