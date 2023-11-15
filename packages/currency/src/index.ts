import { filter } from "lodash";
import currencies from "./data/data.json";

interface Currency {
  code: string;
  decimal: number | undefined;
  locations: Array<string>;
  name: string;
  num: string;
}

const data = currencies as any as Array<Currency>;

type QueryArgs<T> = { [key in keyof T]: any };

declare global {
  interface Array<T> {
    query: (args: QueryArgs<T>) => Array<T>;
  }
}

Array.prototype.query = function <T>(this: Array<T>, args: QueryArgs<T>) {
  return filter(this, args);
};
export { data as currencies };
