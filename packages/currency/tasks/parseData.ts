import { parse } from "csv";
import { createReadStream } from "fs";
import { outputFile } from "fs-extra";
import _, { map, mapKeys, sortBy } from "lodash";
import { join } from "path";

var csvFile = join(process.cwd(), "src/data/fetched_data.new.csv");
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
  output = map(output, (item) => {
    const withMappedKeys = mapKeys(item, (v, k) => _.camelCase(k));
    const locations = withMappedKeys.locations.split(",");
    return { ...withMappedKeys, locations };
  });
  // sort by alpha3
  output = sortBy(output, function (i) {
    return i.alpha3;
  });

  // print out results to stdout
  outputFile("src/data/data.json", JSON.stringify(output, null, 4), {}, (err) => {
    console.error(err);
  });
  //   console.log(canonicalJSON(output, null, 2));
});

input.pipe(parser);
