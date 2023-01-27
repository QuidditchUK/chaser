import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';

export const isManager = async (req: NextApiRequest) => {
  const token = await getToken({ req });

  if (!token || !token?.user) {
    return false;
  }

  const uuid = req.query.uuid as string;
  const club = await prisma?.clubs?.findUnique({
    where: { uuid },
  });

  return club?.managed_by === token.user.uuid;
};
