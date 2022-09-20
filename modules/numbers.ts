// Adds ordinals to Numbers e.g. 1 => '1st', 2 => '2nd' etc
// eslint-disable-next-line no-mixed-operators
export const formatOrdinals = (n: number) =>
  ['st', 'nd', 'rd'][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] || 'th';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

export const minorUnitsToMajor = (minorUnits: number) => minorUnits / 100;

export const formatMinorUnitsToCurrency = (minorUnits: number) =>
  currencyFormatter.format(minorUnitsToMajor(minorUnits));
