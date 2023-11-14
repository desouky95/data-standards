import { parse, stringify } from "csv";
import {
  readFile,
  createReadStream,
  mkdirSync,
  writeFileSync,
  openSync,
} from "fs";
import _ from "lodash";

const parser = parse({
  columns: true,
});

var firstHeader = process.argv[2];
var fileToRead = process.argv[3];

const fileName = fileToRead.split("/").pop() ?? "";
const newName = fileName.replace(/.csv/gm, ".new.csv");
const newPath = fileToRead.replace(/(?<=\/(?!.*\/)).*/gm, newName);
openSync(newPath, "a");

var output: any[] = [];

const fileStream = createReadStream(fileToRead);

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

  stringify(output, { header: true, columns }, function (err, output) {
    writeFileSync(newPath, output);
    
    // process.stdout.write(output);
  });
});

fileStream.pipe(parser);
