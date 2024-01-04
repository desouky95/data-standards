#!/usr/bin/env node

import { transformFileSync, Config, Options, TransformConfig } from "@swc/core";
import typescript from "typescript";
import { exec } from "child_process";
import chroma from "chroma-js";
import fs, { fstatSync } from "fs";
import fse from "fs-extra";
import path from "path";
import yargs from "yargs";
import { glob } from "glob";

export const esmConfig: Options = {
  module: {
    type: "es6",
    strict: false,
    strictMode: true,
    lazy: false,
    noInterop: false,
    ignoreDynamic: true,
  },
  isModule: true,
  env: {},
  jsc: {
    experimental: {
      plugins: [
        [
          "@swc/plugin-transform-imports",
          {
            "./data/js/(.*)": {
              skipDefaultConversion: true,
              transform: "./data/js/{{matches.[1]}}.js",
            },
          },
        ],
      ],
    },
    // target: "es2020",
    parser: {
      syntax: "typescript",
    },
    baseUrl: ".",
  },
};
export const cjsConfig: Options = {
  module: {
    type: "commonjs",
    strict: false,
    strictMode: true,
    lazy: false,
    noInterop: false,
  },
  jsc: {
    parser: {
      syntax: "typescript",
    },
    baseUrl: ".",
  },
};

function setupOutputDirectory(outDir: string) {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir);
}
async function getFiles(source: string, { exts }: { exts?: string[] } = {}) {
  const files = await glob(source + "/**/*.{ts,js}");
  return files;
}

type TranspileTypescriptArgs = {
  source: string;
  outDir: string;
  config: Config;
  files: string[];
  esm?: boolean;
  engine?: "swc" | "tsc";
};
function transpileTypescript({
  source,
  outDir,
  config,
  files,
  engine = "swc",
}: TranspileTypescriptArgs) {
  setupOutputDirectory(path.join(process.cwd(), outDir));

  files.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (
      fs.statSync(filePath).isFile() &&
      [".ts", ".js"].includes(path.extname(filePath))
    ) {
      let output;
      if (engine === "swc") {
        const { code } = transformFileSync(filePath, config);
        output = code;
      }
      if (engine === "tsc") {
        const content = fs.readFileSync(filePath, "utf8");
        output = typescript.transpileModule(content, {
          compilerOptions: { target: typescript.ScriptTarget.ESNext },
        }).outputText;
        console.log(output);
      }

      const outputPath = path.join(
        process.cwd(),
        path
          .relative(process.cwd(), filePath)
          .replace(source, outDir)
          .replace(".ts", ".js")
      );

      fse.outputFileSync(outputPath, output);
    }
  });
}

function generateTypes() {
  const hasTSconfig = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
  let tsconfigPath = hasTSconfig
    ? path.join(process.cwd(), "tsconfig.json")
    : path.join(__dirname, "tsconfig.json");

  const command = `tsc -p ${tsconfigPath}`;
  exec(command);
}

type Args = {
  esm: boolean;
  srcDir: string;
  outDir: string;
  dualSupport: boolean;
};

async function build({ esm, outDir, srcDir, dualSupport }: Args) {
  const source = path.join(process.cwd(), srcDir);

  const files = (await getFiles(source)) as string[];
  transpileTypescript({
    source: srcDir,
    outDir,
    config: esmConfig,
    files,
    esm: true,
  });
  if (dualSupport) {
    transpileTypescript({
      source: srcDir,
      outDir: `${outDir}/cjs`,
      config: cjsConfig,
      files,
      esm: false,
    });
  }

  generateTypes();
}

const args = yargs(process.argv.slice(2))
  .options({
    esm: { boolean: true, default: true },
    srcDir: { string: true, default: "src" },
    outDir: { string: true, default: "dist" },
    dualSupport: { boolean: true, default: true },
  })
  .command<Args>("build package", "building package...", () => {})
  .parseSync();

build(args);
