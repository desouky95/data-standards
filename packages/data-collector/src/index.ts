import { callingCodes } from "./data/js/calling_codes";
import { countries } from "./data/js/countries";
import { currencies } from "./data/js/currencies";
import { fifaCodes } from "./data/js/fifa";
import { languages } from "./data/js/languages";
import { iocCodes } from "./data/js/olympics";
import { regions } from "./data/js/regions";

export * from "./data/js/countries";
export * from "./data/js/currencies";
export * from "./data/js/fifa";
export * from "./data/js/olympics";
export * from "./data/js/regions";
export * from "./data/js/countries_meta";
export * from "./data/js/countries_codes_meta";
export * from "./data/js/currencies_meta";
export * from "./data/js/languages";
export * from "./data/js/calling_codes";
export * from "./data/js/capitals";

export type Alpha2 = (typeof countries)[number]["alpha2"] | (string & {});
export type Alpha3 = (typeof countries)[number]["alpha3"] | (string & {});
export type TLD =
  | (typeof countries)[number]["internetTld"][number]
  | (string & {});
export type CountryNumericCode =
  | (typeof countries)[number]["numericCode"]
  | (string & {});

export type FifaCode = (typeof fifaCodes)[number]["code"] | (string & {});
export type OlympicCode = (typeof iocCodes)[number]["code"] | (string & {});
export type Continent = keyof typeof regions;
export type CurrencyCode = (typeof currencies)[number]["code"] | (string & {});
export type CurrencyNum = (typeof currencies)[number]["num"] | (string & {});

export type LanguageAlpha2 =
  | (typeof languages)[number]["alpha2"]
  | (string & {});
export type LanguageAlpha3 =
  | (typeof languages)[number]["alpha3"]
  | (string & {});

export type Currency = {
  code: CurrencyCode;
  decimal?: number;
  name: string;
  num: CurrencyNum;
  symbol: string;
};
export type Language = {
  name: string;
  alpha2: LanguageAlpha2;
  alpha3: LanguageAlpha3;
};

export type CallingCode = {
  countryService: string;
  code: (typeof callingCodes)[number]["code"];
};

export type QueryArgs<T> = { [key in keyof T]?: T[key] };

declare global {
  interface Array<T> {
    query: (args: QueryArgs<T>) => Array<T>;
  }
}
