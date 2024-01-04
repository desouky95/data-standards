import * as fsExtra from 'fs-extra'


export type CreateJSONArgs = {
  data: Array<any> | Object;
  fileName?: string;
  filePath: string;
};

/**
 * 
 * @param args 
 * @returns returns used as it 
 */
export default function createJSON({
  data,
  filePath,
  fileName = "default.json",
}: CreateJSONArgs) {
  const $data = JSON.stringify(data, null, 2);
  fsExtra.writeFileSync(`${filePath}/${fileName}`, $data);

  return data;
}
