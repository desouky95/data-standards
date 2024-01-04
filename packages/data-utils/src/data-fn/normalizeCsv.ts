import { parse, stringify } from "csv";
import { createReadStream } from "fs";
import { openSync, outputFile, writeFileSync } from "fs-extra";
import * as _ from "lodash";

/**
 * @param firstHeader - header to sort and normalize csv file
 * @param filePath 
 * @param normalizedPrefix @defaultValue `new`
 * @param outDir @defaultValue `data/csv`
 */
export type NormalizeCsvArgs = {
  firstHeader: string;
  filePath: string;
  normalizedPrefix?: string;
  outDir?: string;
};

/**
 * normalizeCsv takes a csv file and normalize it by sorting it by specific header
 * @param args 
 */
function normalizeCsv({
  normalizedPrefix = "new",
  outDir = "data/csv",
  filePath,
  firstHeader,
}: NormalizeCsvArgs) {
  try {
    var output: any[] = [];
    const fileStream = createReadStream(filePath);
    const parser = parse({
      columns: true,
    });

    parser.on("readable", function () {
      var record = null;
      while ((record = parser.read())) {
        output.push(record);
      }
    });

    parser.on("error", (err) => {
      console.error(err);
    });

    parser.on("finish", function () {
      output = _.sortBy(output, function (i) {
        return i[firstHeader]?.toLowerCase();
      });
      var headers = _.keys(output[0]);
      var remaining = _.without(headers, firstHeader);
      var columns = _.flatten([firstHeader, remaining.sort()]);

      const fileName = filePath.split("/").pop() ?? "";
      const newName = fileName.replace(/.csv/gm, `.${normalizedPrefix}.csv`);

      stringify(output, { header: true, columns }, function (err, output) {
        outputFile(`${outDir}/${newName}`, output);

      });
    });

    fileStream.pipe(parser);
  } catch (error) {
    throw new Error(`Error in File: ${filePath} ${(error as any).message}`);
  }
}

export default normalizeCsv;
