const SamInstone = '../images/authors/sam-instone.jpeg';
const Logo = '../images/logo.png';

const authors = {
  'Sam Instone': SamInstone,
};

export default function (author) {
  return authors[author] || Logo;
}
