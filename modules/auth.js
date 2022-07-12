import { parseCookies } from 'modules/cookies';
import { getUserScopes, hasScope } from 'modules/scopes';
import generateServerSideHeaders from './headers';

const isAuthorized = async (req, res, pageScopes) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return false;
  }

  const headers = generateServerSideHeaders(req);
  if (pageScopes) {
    const userScopes = await getUserScopes(headers);

    if (!hasScope(pageScopes, userScopes)) {
      res.setHeader('location', '/');
      res.statusCode = 302;
      res.end();
      return false;
    }
  }

  return true;
};

export default isAuthorized;
