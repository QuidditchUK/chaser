import { parse } from 'date-fns';
import { SafeUser } from 'types/user';

export const getLatestProduct = (member: SafeUser) =>
  member?.stripe_products[member?.stripe_products?.length - 1]?.products;

export const isActive = (member: SafeUser) => {
  const product = getLatestProduct(member);
  return parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date();
};

export const groupByActive = (
  members: SafeUser[]
): { active: SafeUser[]; inactive: SafeUser[] } => {
  const [active, inactive] = members?.reduce(
    (result, member) => {
      result[isActive(member) ? 0 : 1].push(member);
      return result;
    },
    [[], []]
  );
  return { active, inactive };
};

export const getProductName = (member: SafeUser) => {
  const product = getLatestProduct(member);
  return parse(product?.expires, 'dd-MM-yyyy', new Date()) > new Date()
    ? product?.description
    : 'Expired';
};
