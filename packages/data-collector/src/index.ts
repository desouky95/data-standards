import { iso31661 } from "./data/js/iso3166";
import { fifaCodes } from "./data/js/fifa";
import { countries } from "./data/js/countries";
import { iocCodes } from "./data/js/olympic_codes";
import { iso6392 } from "./data/js/iso6392";
import { iso6393 } from "./data/js/iso6393";
import { currencies } from "./data/js/currencies";
import { callingCodes } from "./data/js/calling_codes";
import { capitals } from "./data/js/capitals";
import _ from "lodash";
// Countries
export type IsoCodeState = (typeof iso31661)[number]["state"];
export type CountrySovereignty = (typeof countries)[number]["sovereignty"];
export type Alpha2 = (typeof countries)[number]["alpha2"] | (string & {});
export type Alpha3 = (typeof countries)[number]["alpha3"] | (string & {});
export type TLD = (typeof countries)[number]["ccTLD"][number] | (string & {});
export type CountryNumericCode =
  | (typeof countries)[number]["numeric"]
  | (string & {});

export type FifaCode = (typeof fifaCodes)[number]["code"] | (string & {});
export type OlympicCode = (typeof iocCodes)[number]["code"] | (string & {});
export type IsoCountry = {
  name: string;
  alpha2: Alpha2;
  alpha3: Alpha3;
  numeric: string;
  independent: boolean;
  status: IsoCodeState;
  altNames: Array<string>;
  officialName: string;
  ccTLD: Array<string>;
  sovereignty: CountrySovereignty;
  fifa: FifaCode;
  ioc: OlympicCode;
  capital: string;
  currencies: Array<string>;
  callingCode: string;
  languages: Array<LanguageAlpha2B>;
};

// Languages
export type LanguageAlpha2B =
  | (typeof iso6392)[number]["iso639_2"]
  | (string & {});
export type LanguageAlpha3 = string;

export type Iso2Language = {
  iso639_2: string;
  ios639_1: string;
  name: string;
};
export type LanguageScope = (typeof iso6393)[number]["scope"];
export type LanguageType = (typeof iso6393)[number]["type"];
export type Iso3Language = {
  iso639_3: "aaa";
  iso639_2B: string;
  ios639_2T: string;
  ios639_1T: string;
  scope: LanguageScope;
  type: LanguageType;
  name: string;
  note: string;
};
export type IsoLanguage = {
  name: string;
  alpha2: LanguageAlpha2B;
  alpha3: string;
  type: LanguageType;
  scope: LanguageScope;
};

// Currency
export type CurrencyCode =
  | (typeof currencies)[number]["alpha3"]
  | (string & {});
export type CurrencyNum =
  | (typeof currencies)[number]["numeric"]
  | (string & {});

export type Currency = {
  name: string | { IsFund: boolean; $t: string };
  alpha3: CurrencyCode;
  numeric: CurrencyNum;
  units: number;
};

// Calling Codes
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

Array.prototype.query = function <T>(this: Array<T>, args: QueryArgs<T>) {
  return _.filter(this, args);
};

// EXPORTS

export {
  countries,
  currencies,
  fifaCodes,
  iocCodes,
  iso31661,
  iso6392,
  iso6393,
  callingCodes,
  capitals,
};
