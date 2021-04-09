import GSheetsReader from 'g-sheets-api';

export default async function getSheet(sheetId, sheetNumber = 1) {
  let result;

  await GSheetsReader(
    {
      sheetId,
      sheetNumber,
      returnAllResults: true,
    },
    (results) => {
      result = results;
    }
  );

  return result;
}
