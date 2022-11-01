import { users as PrismaUser, scopes as PrismaScope } from '@prisma/client';

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
