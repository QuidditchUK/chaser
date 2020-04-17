import SamInstone from '../images/authors/sam-instone.jpeg';
import Logo from '../images/logo.png';

const authors = {
  'Sam Instone': SamInstone,
};

export default function (author) {
  return authors[author] || Logo;
}
