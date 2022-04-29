import { parseCookies } from 'modules/cookies';
import { getUserScopes, hasScope } from 'modules/scopes';

const isAuthorized = (token, pageScopes) => {
  if (!token) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return false;
  }

  if (pageScopes) {
    const userScopes = getUserScopes(token);

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
