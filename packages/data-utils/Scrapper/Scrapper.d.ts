import { CheerioAPI } from "cheerio";
type GetDataArgs = {
    url: string;
    cb: (cheerio: CheerioAPI) => void;
};
export default class Scrapper {
    constructor();
    getData({ cb, url }: GetDataArgs): Promise<void>;
}
export {};
//# sourceMappingURL=Scrapper.d.ts.map