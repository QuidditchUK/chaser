// Adds ordinals to Numbers e.g. 1 => '1st', 2 => '2nd' etc
// eslint-disable-next-line no-mixed-operators
export const formatOrdinals = (n) => ['st', 'nd', 'rd'][(((n < 0 ? -n : n) + 90) % 100 - 10) % 10 - 1] || 'th';
