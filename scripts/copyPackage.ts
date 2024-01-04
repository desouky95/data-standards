import fse from "fs-extra";
import { PackageJson, PartialDeep, TsConfigJson } from "type-fest";
import path from "path";
import yargs from "yargs";
import Module from "node:module";

function require(id: string) {
  return Module.createRequire(import.meta.url)(id);
}
function joinWithLeading(...args: string[]) {
  return `./${path.posix.join(...args)}`;
}

async function copyPackage({
  cjsDir,
  outDir,
  typesIndex,
  index,
  dualSupport,
}: Args) {
  const mainPackageJSON = require("../package.json") as PackageJson;
  const packageJSON = require(process.cwd() + "/package.json") as PackageJson;
  const tsconfigJSON = require(process.cwd() +
    "/tsconfig.json") as TsConfigJson;

  if (fse.existsSync(process.cwd() + "/README.md")) {
    fse.copySync(
      path.join(process.cwd(), "README.md"),
      path.join(process.cwd(), "dist", "README.md")
    );
  }

  const typesRoot =
    tsconfigJSON.compilerOptions?.outDir?.replace(outDir, "") ??
    joinWithLeading("types");
  let packageExports: PackageJson["exports"] = {
    ".": {
      types: joinWithLeading(typesIndex),
      require: joinWithLeading(`${cjsDir}/${index}`),
      import: joinWithLeading(index),
    },
    "./package.json": "./package.json",
  };
  let rewittenJSON: PartialDeep<PackageJson> = {
    ...packageJSON,
    main: joinWithLeading(cjsDir + "/" + index),
    module: "index.js",

    types: joinWithLeading(typesRoot, "/", typesIndex),
    scripts: {},
    repository: mainPackageJSON.repository as any,
    author: mainPackageJSON.author,
    homepage: mainPackageJSON.homepage,
    license: mainPackageJSON.license,
  };


  rewittenJSON.exports = packageExports;

  fse.outputFile(
    path.join(process.cwd(), outDir, "package.json"),
    JSON.stringify(rewittenJSON, null, 4)
  );
  if (dualSupport) {
    let cjsPackage = { ...rewittenJSON };
    delete cjsPackage.type;

    fse.outputFile(
      path.join(process.cwd(), outDir, cjsDir, "package.json"),
      JSON.stringify(cjsPackage, null, 4)
    );
  }
}

type Args = {
  esm: boolean;
  cjsDir: string;
  index: string;
  outDir: string;
  typesIndex: string;
  dualSupport: boolean;
};
const args = yargs(process.argv.slice(2))
  .options({
    esm: { boolean: true, default: true },
    cjsDir: { string: true, default: "cjs" },
    index: { string: true, default: "index.js" },
    typesIndex: { string: true, default: "index.d.ts" },
    outDir: { string: true, default: "dist" },
    dualSupport: { boolean: true, default: true },
  })
  .command<Args>("copying package", "copying package...")
  .parseSync();

copyPackage(args);
