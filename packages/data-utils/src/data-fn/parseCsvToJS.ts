import { parse } from "csv";
import { createReadStream } from "fs";
import { join } from "path";
import * as fsExtra from 'fs-extra'
const { createWriteStream, existsSync, mkdirSync } = fsExtra

/**
 * @param filePath
 * @param onFinish
 * @param outDir
 * @param fileName
 * @param variableName
 * @param fileType
 * @type
 */
export type ParseCsvToJSArgs = {
  filePath: string;
  onFinish: (output: Array<any>) => any;
  outDir: string;
  fileName: string;
  variableName: string;
  fileType: "ts" | "js";
};

/**
 * parseCsvToJS parse csv to js or ts file
 * @deprecated
 * @param args
 */
async function parseCsvToJS({
  filePath,
  onFinish,
  outDir,
  variableName,
  fileType,
  fileName,
}: ParseCsvToJSArgs) {
  var csvFile = join(process.cwd(), filePath);
  var input = createReadStream(csvFile);

  const parser = parse({
    columns: true,
  });

  var output: any[] = [];

  parser.on("readable", function () {
    var record = null;
    while ((record = parser.read())) {
      output.push(record);
    }
  });

  parser.on("finish", async function () {
    const dataToWrite = onFinish?.(output);

    if (!existsSync(outDir)) mkdirSync(outDir);
    const file = createWriteStream(`${outDir}/${fileName}.${fileType}`);
    file.write(
      `export const ${variableName} = ${JSON.stringify(
        dataToWrite,
        null,
        4
      )} as const`
    );
    file.end();
  });

  input.pipe(parser);
}

export default parseCsvToJS;
