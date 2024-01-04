import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import * as fsExtra from "fs-extra";
const { outputFile } = fsExtra
type AnyFunc = (...args: any[]) => any;
type GetDataArgsWithWriting = {
  filePath: string;
};

type GetOnlyData = {
  filePath?: never;
};

/**
 * @typeParam T 
 * @param cheerio - {@link https://cheerio.js.org/docs/api/interfaces/CheerioAPI | CheerioAPI}
 */
export type Callback<T> = (cheerio: CheerioAPI) => T;
/**
 * @typeParam T - return type of {@link Callback | Callback}
 */
export type GetDataArgs<T> = { url: string } & (
  | GetDataArgsWithWriting
  | GetOnlyData
) & { cb: Callback<T> };


/** 
 * getData takes a url and return a {@link https://cheerio.js.org/docs/api/interfaces/CheerioAPI | CheerioAPI}
 * then output callback output into a file 
 * @param args
 * @returns returns data with return type of {@link Callback | Callback}
*/
function getData<T extends AnyFunc>(args: GetDataArgs<string>): ReturnType<T>;
/**
 * getData takes a url and return a {@link https://cheerio.js.org/docs/api/interfaces/CheerioAPI | CheerioAPI}
 * then output callback output into a file 
 * @param args
 * @returns returns a promise with return type of {@link Callback | Callback}
 */
function getData<T extends AnyFunc>(
  args: GetDataArgs<Promise<string>>
): Promise<ReturnType<T>>;

async function getData({ cb, filePath, url }: GetDataArgs<any>) {
  const response = await axios.get(url);
  const $ = load(response.data);
  Promise.resolve(cb($)).then((dataToWrite) => {
    if (filePath && dataToWrite) {
      outputFile(filePath, dataToWrite, {}, (err) => {
        console.error(err);
      });
    }
  });
}

export default getData;
