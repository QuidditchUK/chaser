import axios from 'axios';

// export default async function getSheet(sheetId, sheetName, options = {}) {
export default async function getSheet(sheetId, sheetName) {
  const { data } = await axios(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=AIzaSyBBXBSVcXfPZjPXF5JCpY6nghR3ORoigDo`
  );
  // seperate key row from content rows
  const [keys, ...rows] = data.values;

  const videos = rows.map((row) => {
    if (!Array.isArray(row)) {
      return row;
    }

    // construct keypairs e.g. [{ 'Team 1': 'Steelfins' },...]
    const keyPairs = row.map((value, i) => {
      const key = keys[i];
      return { [key]: value };
    });

    return keyPairs.reduce((result, item) => {
      const key = Object.keys(item)[0]; //first property: 'Team 1', 'Team 2', 'Date'
      result[key] = item[key];
      return result;
    });
  });

  return videos;
}
