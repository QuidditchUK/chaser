import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children, as }) => {
  const { asPath } = useRouter();

  let className = children.props.className || '';
  const regexAs = RegExp(as.replace(/\//g, '\\/'), 'g');

  if (regexAs.test(asPath)) {
    className = `${className} active`;
  }

  return (
    <Link href={href} as={as} passHref>
      <a>{React.cloneElement(children, { className })}</a>
    </Link>
  );
};

export const ParentWrapper = ({ path, paths = [], children }) => {
  const { asPath } = useRouter();

  let className = children.props.className || '';
  const regexAs = RegExp(path.replace(/\//g, '\\/'), 'g');
  const foundPath = paths?.find((item) => item === asPath);

  if (regexAs.test(asPath) || foundPath) {
    className = `${className} active`;
  }

  return React.cloneElement(children, { className });
};

export const ExactActiveLink = ({ href, children, as }) => {
  const { asPath } = useRouter();
  let className = children.props.className || '';

  if (as === asPath) {
    className = `${className} active`;
  }

  return (
    <Link href={href} as={as} passHref>
      <a>{React.cloneElement(children, { className })}</a>
    </Link>
  );
};

export default ActiveLink;
