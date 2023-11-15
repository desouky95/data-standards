import axios from "axios";
import { CheerioAPI, load } from "cheerio";

type GetDataArgs = {
  url: string;
  cb: (cheerio: CheerioAPI) => void;
};

export default class Scrapper {
  constructor() {}

  async getData({ cb, url }: GetDataArgs) {
    const response = await axios.get(url);
    const $ = load(response.data);
    cb($);
  }
}
