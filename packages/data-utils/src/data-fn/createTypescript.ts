import { writeFileSync } from "fs";

/**
 * createTypescript function arguments
 * @param data - data to use in typescript file
 * @param variableName
 * @param filePath
 * @param type @defaultValue `.ts`
 * @param fileName @defaultValue `default`
 * @param defaultExport @defaultValue `false`
 * @type
 */
type CreateTypescriptArgs = {
  data: any;
  fileName?: string;
  filePath: string;
  type?: "ts" | "js";
  variableName: string;
  defaultExport?: boolean;
  inferredType?: boolean;
};

/**
 * createTypescript takes data and creates typescript or javascript file
 *
 * @remarks
 *
 * @param args - {@link CreateTypescriptArgs | CreateTypescriptArgs}
 * @returns
 */
export default function createTypescript({
  data,
  filePath,
  fileName = "default",
  type = "ts",
  variableName,
  defaultExport = false,
  inferredType = true,
}: CreateTypescriptArgs) {
  const $data = JSON.stringify(data, null, 2);
  const jsContent = `
  export ${defaultExport ? "default" : ""} const ${variableName} = ${$data} ${
    inferredType ? "as const" : ""
  }
  `;

  writeFileSync(`${filePath}/${fileName}.${type}`, jsContent);

  return data;
}
