import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import { outputFile } from "fs-extra";

type AnyFunc = (...args: any[]) => any;
type GetDataArgsWithWriting = {
  filePath: string;
};
type GetOnlyData = {
  filePath?: never;
};

type Callback<T> = (cheerio: CheerioAPI) => T;
type GetDataArgs<T> = { url: string } & (
  | GetDataArgsWithWriting
  | GetOnlyData
) & { cb: Callback<T> };

function getData<T extends AnyFunc>(args: GetDataArgs<string>): ReturnType<T>;
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
