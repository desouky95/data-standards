// import { getData } from "@desoukysvyc/data-utils";
// import getCurrencySymbol from "currency-symbol-map";
// getData({
//   filePath: "src/data/csv/currencies.csv",
//   url: "https://en.wikipedia.org/wiki/ISO_4217",
//   cb($) {
//     const currencies: Map<string, Array<string>> = new Map();

import axios from "axios";
import { clean, urls } from "../../utils/urls";
import { toJson } from "xml2json";
import { createTypescript } from "@desoukysvyc/data-utils";
import _ from "lodash";

export default async function collect() {
  const response = await axios.get(urls.isoCurrencies);
  const parsed = (
    (toJson(response.data, { object: true }) as any).ISO_4217.CcyTbl
      .CcyNtry as Array<any>
  ).map((_) => ({
    country: _.CtryNm,
    name: _.CcyNm,
    alpha3: _.Ccy,
    numeric: _.CcyNbr,
    units: _.CcyMnrUnts?.match("N.A.") ? undefined : Number(_.CcyMnrUnts),
  }));

  const countriesCurrencies = _.sortBy(parsed, "alpha3");
  const currencies = _.sortBy(
    _.map(
      _.uniqBy(
        _.filter(parsed, (c) => !!c.alpha3),
        "alpha3"
      ),
      (c) => _.omit(c, "country")
    ),
    "alpha3"
  );

  return { currencies, countriesCurrencies };
}
