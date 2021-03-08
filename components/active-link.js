import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children }) => {
  const { asPath } = useRouter();

  let className = children.props.className || '';
  const regexAs = RegExp(href.replace(/\//g, '\\/'), 'g');

  if (regexAs.test(asPath)) {
    className = `${className} active`;
  }

  return (
    <Link href={href} passHref>
      <a>{React.cloneElement(children, { className })}</a>
    </Link>
  );
};

export default ActiveLink;
