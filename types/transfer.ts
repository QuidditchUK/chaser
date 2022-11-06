import {
  users as PrismaUser,
  scopes as PrismaScope,
  Prisma,
} from '@prisma/client';

export type AdminTransferWithRelations = Prisma.transfersGetPayload<{
  include: {
    prevClub: true;
    newClub: true;
    user: true;
    actionedBy: true;
  };
}>;
