const XLSX = require("xlsx");
const path = require("path");

export const excelToJson = async (filename): Promise<string> => {
  let workbook = await XLSX.readFile(path.join(__dirname, filename));
  let sheet = await workbook.Sheets[workbook.SheetNames[0]];
  let jsonData = await XLSX.utils.sheet_to_json(sheet);
  return jsonData;
};
