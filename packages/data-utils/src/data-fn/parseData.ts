import { parse } from "csv";
import { createReadStream } from "fs";
import { outputFile } from "fs-extra";
import { join } from "path";

export type ParseDataArgs = {
  filePath: string;
  onFinish?: (output: Array<any>) => any;
  outDir?: string;
};

function parseData({
  filePath,
  onFinish,
  outDir = "src/data/data.json",
}: ParseDataArgs) {
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

  parser.on("finish", function () {
    const dataToWrite = onFinish?.(output);
    outputFile(outDir, JSON.stringify(dataToWrite, null, 4), {}, (err) => {
      console.error(err);
    });
  });

  input.pipe(parser);
}

export default parseData;
