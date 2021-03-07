import Link from 'next/link';

const ExternalLink = ({ href, children }) => {
  const regex = new RegExp('(http)|(mailto)', 'g');

  return regex.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} passHref>
      <a>{children}</a>
    </Link>
  );
};

export default ExternalLink;
