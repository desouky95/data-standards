"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_1 = require("csv");
const fs_1 = require("fs");
const lodash_1 = __importDefault(require("lodash"));
const parser = (0, csv_1.parse)({
    columns: true,
});
var firstHeader = process.argv[2];
var fileToRead = process.argv[3];
const fileName = fileToRead.split("/").pop() ?? "";
const newName = fileName.replace(/.csv/gm, ".new.csv");
const newPath = fileToRead.replace(/(?<=\/(?!.*\/)).*/gm, newName);
(0, fs_1.openSync)(newPath, "a");
var output = [];
const fileStream = (0, fs_1.createReadStream)(fileToRead);
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
    output = lodash_1.default.sortBy(output, function (i) {
        return i[firstHeader]?.toLowerCase();
    });
    var headers = lodash_1.default.keys(output[0]);
    var remaining = lodash_1.default.without(headers, firstHeader);
    var columns = lodash_1.default.flatten([firstHeader, remaining.sort()]);
    (0, csv_1.stringify)(output, { header: true, columns }, function (err, output) {
        (0, fs_1.writeFileSync)(newPath, output);
        // process.stdout.write(output);
    });
});
fileStream.pipe(parser);
