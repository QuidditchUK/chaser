const SamInstone = '../images/authors/sam-instone.jpeg';
const MattBateman = '../images/authors/matt-bateman.jpg';
const AbbyWhiteley = '../images/authors/abby-whiteley.jpg';
const KirstyScheiby = '../images/authors/kirsty-scheiby.jpg';
const DeclanRamsay = '../images/authors/declan-ramsay.jpg';
const JasmineLowen = '../images/author/jasmine-lowen';

const Logo = '../images/logo.png';

const authors = {
  'Sam Instone': SamInstone,
  'Abby Whiteley': AbbyWhiteley,
  'Matt Bateman': MattBateman,
  'Kirsty Scheiby': KirstyScheiby,
  'Declan Ramsay': DeclanRamsay,
  'Jasmine Lowen': JasmineLowen,
};

export default function (author) {
  return authors[author] || Logo;
}
