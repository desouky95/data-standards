import { Language, QueryArgs, languages } from "@desoukysvyc/data-collector";
import _ = require("lodash");

var data = languages as any as Array<Language>;

Array.prototype.query = function <T>(this: Array<T>, args: QueryArgs<T>) {
  return _.filter(this, args);
};

export { data as languages };
