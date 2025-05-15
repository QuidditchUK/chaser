const SamInstone = '/images/authors/sam-instone.jpeg';
const MattBateman = '/images/authors/matt-bateman.jpg';
const AbbyWhiteley = '/images/authors/abby-whiteley.jpg';
const KirstyScheiby = '/images/authors/kirsty-scheiby.jpg';
const DeclanRamsay = '/images/authors/declan-ramsay.jpg';
const JasmineLowen = '/images/authors/jasmine-lowen.jpg';
const GeorgiaChallinor = '/images/authors/georgia-challinor.jpg';
const BeckThroup = '/images/authors/beck-throup.jpg';
const JoshFogg = '/images/authors/josh-fogg.jpg';
const Logo = '/images/authors/quk-logo.png';
const GioForino = '/images/authors/gio-forino.jpg';
const AlexHarrison = '/images/authors/alex-harrison.jpg';
const FraserPosford = '/images/authors/fraser-posford.jpg';

const authors = {
  'Sam Instone': SamInstone,
  'Abby Whiteley': AbbyWhiteley,
  'Matt Bateman': MattBateman,
  'Kirsty Scheiby': KirstyScheiby,
  'Declan Ramsay': DeclanRamsay,
  'Jasmine Lowen': JasmineLowen,
  'Georgia Challinor': GeorgiaChallinor,
  'Beck Throup': BeckThroup,
  'Josh Fogg': JoshFogg,
  'Gio Forino': GioForino,
  'Alex Harrison': AlexHarrison,
  'Fraser Posford': FraserPosford,
};

export default function Authors(author) {
  return authors[author] || Logo;
}
