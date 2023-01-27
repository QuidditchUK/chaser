import {
  users as PrismaUser,
  scopes as PrismaScope,
  Prisma,
} from '@prisma/client';

export type SafeUser = Omit<PrismaUser, 'hashed_password' | 'salt'>;
export type SafeUserWithScopes = SafeUser & { scopes: PrismaScope[] };

interface CreateUserProps {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm: string;
}

type StudentProps =
  | { is_student?: false; university?: never }
  | { is_student: true; university?: string };

export type JoinFormProps = CreateUserProps & StudentProps;

type SafeTransfersWithRelations = Prisma.transfersGetPayload<{
  include: {
    prevClub: { select: { name: true } };
    newClub: { select: { name: true } };
  };
}>;

export type SafeTransfer = Omit<
  SafeTransfersWithRelations,
  'actioned_by' | 'reason' | 'prev_club_uuid' | 'new_club_uuid' | 'user_uuid'
>;

export type SafeUserWithTransfersAndScopes = SafeUserWithScopes & {
  transfers: SafeTransfer[];
};

export type AdminUserWithRelations = Prisma.usersGetPayload<{
  include: {
    clubs: true;
  };
}>;
