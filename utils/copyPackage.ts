import { copy, outputFile, writeFile } from "fs-extra";

const packageJSON = require(process.cwd() + "/package.json");

const rewittenJSON = { ...packageJSON, main: "index.js", scripts: {} };

outputFile(
  `${process.cwd()}/dist/package.json`,
  JSON.stringify(rewittenJSON, null, 4)
);
