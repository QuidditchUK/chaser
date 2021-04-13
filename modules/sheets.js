import GSheetsReader from 'g-sheets-api';

export default async function getSheet(sheetId, sheetNumber = 1, options = {}) {
  let result;

  await GSheetsReader(
    {
      sheetId,
      sheetNumber,

      ...options,
    },
    (results) => {
      result = results;
    }
  );

  return result;
}
