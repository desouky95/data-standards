import { parse } from "csv";
import { createReadStream } from "fs";
import { join } from "path";
import { createWriteStream, existsSync, mkdirSync } from "fs-extra";

type ParseCsvToJSArgs = {
  filePath: string;
  onFinish: (output: Array<any>) => any;
  outDir: string;
  fileName: string;
  variableName: string;
  fileType: "ts" | "js";
};
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
