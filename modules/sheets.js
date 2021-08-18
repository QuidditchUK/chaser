import GSheetsReader from 'g-sheets-api';

export default async function getSheet(sheetId, sheetNumber = 1, options = {}) {
  let result;

  await GSheetsReader(
    {
      sheetId,
      sheetNumber,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      ...options,
    },
    (results) => {
      result = results;
    }
  );

  return result;
}
