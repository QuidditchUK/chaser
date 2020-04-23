const SamInstone = '../images/authors/sam-instone.jpeg';
const MattBateman = '../images/authors/matt-bateman.jpg';
const AbbyWhiteley = '../images/authors/abby-whiteley.jpg';
const Logo = '../images/logo.png';

const authors = {
  'Sam Instone': SamInstone,
  'Abby Whiteley': AbbyWhiteley,
  'Matt Bateman': MattBateman,
};

export default function (author) {
  return authors[author] || Logo;
}
