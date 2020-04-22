import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children }) => {
  const router = useRouter();

  let className = children.props.className || '';
  if (router.asPath === href) {
    className = `${className} active`;
  }

  return (<Link href={href}><a href={href}>{React.cloneElement(children, { className })}</a></Link>);
};

ActiveLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ActiveLink;
