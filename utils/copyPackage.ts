import {
  copy,
  outputFile,
  writeFile,
  exists,
  copySync,
  existsSync,
} from "fs-extra";

import mainPackageJSON from "../package.json";
const dualExports = process.argv[2]


const packageJSON = require(process.cwd() + "/package.json");
if (existsSync(process.cwd() + "/README.md")) {
  copySync(process.cwd() + "/README.md", process.cwd() + "/dist/README.md");
}

let rewittenJSON = {
  ...packageJSON,
  main: "index.js",
  scripts: {},
  repository: mainPackageJSON.repository,
  author: mainPackageJSON.author,
  homepage: mainPackageJSON.homepage,
  license: mainPackageJSON.license,

};
dualExports === 'true' ? rewittenJSON = {
  ...rewittenJSON, exports: {
    ".": {
      "import": "./esm/index.js",
      "require": "./index.js",
      "types": "./types"

    },
    "./package.json": "./package.json"
  }
} : rewittenJSON

outputFile(
  `${process.cwd()}/dist/package.json`,
  JSON.stringify(rewittenJSON, null, 4)
);
