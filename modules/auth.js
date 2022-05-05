import { parseCookies } from 'modules/cookies';
import { getUserScopes, hasScope } from 'modules/scopes';

const isAuthorized = async (req, res, pageScopes) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return false;
  }

  if (pageScopes) {
    const userScopes = await getUserScopes(AUTHENTICATION_TOKEN);

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
