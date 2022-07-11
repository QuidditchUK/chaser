import { parseCookies } from 'modules/cookies';

export default function generateServerSideHeaders(req) {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);
  return { Authorization: `Bearer ${AUTHENTICATION_TOKEN}` };
}
