import _, { filter } from "lodash";
import {
  currencies,
  countries,
  CurrencyCode,
  QueryArgs,
  Currency,
  currenciesMeta,
} from "@desoukysvyc/data-collector";

let data = _.map(currencies, (c) => ({
  ...c,
  decimal: Number(c.decimal),
})) as any as Array<Currency>;

Array.prototype.query = function <T>(this: Array<T>, args: QueryArgs<T>) {
  return filter(this, args);
};

export { data as currencies, currenciesMeta };
