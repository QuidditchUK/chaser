import GSheetsReader from 'g-sheets-api';

export default async function getSheet(
  sheetId,
  sheetName = 'Footage',
  options = {}
) {
  let result;

  await GSheetsReader(
    {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      sheetId,
      sheetName,
      ...options,
    },
    (results) => {
      result = results;
    }
  );

  return result;
}
