import { NextIncomingMessage } from 'next/dist/server/request-meta';

/**
 * Used to generate headers from req
 * required when calling axios requests from getServerSideProps that need authentication
 * @param req: NextIncomingMessage
 * @returns object
 * object.cookie
 */
export default function generateServerSideHeaders(req: NextIncomingMessage) {
  return { cookie: req.headers.cookie };
}
