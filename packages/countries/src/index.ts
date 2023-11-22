import {
  Alpha2,
  Alpha3,
  CallingCode,
  CountryNumericCode,
  Currency,
  CurrencyCode,
  FifaCode,
  OlympicCode,
  QueryArgs,
  TLD,
  callingCodes,
  capitals,
  countries,
  currencies,
  fifaCodes,
  iocCodes,
  languages,
  LanguageAlpha3,
} from "@desoukysvyc/data-collector";
import {
  filter,
  find,
  intersectionBy,
  keyBy,
  map,
  merge,
  omit,
  unionBy,
  split,
  unionWith,
  values,
} from "lodash";
import { LiteralToPrimitiveDeep, WritableDeep } from "type-fest";

Array.prototype.query = function <T>(this: Array<T>, args: QueryArgs<T>) {
  return filter(this, args);
};

export type Country = Omit<
  LiteralToPrimitiveDeep<WritableDeep<(typeof countries)[number]>>,
  "alpha2" | "alpha3" | "internetTld" | "numericCode"
> & {
  alpha2: Alpha2;
  alpha3: Alpha3;
  internetTld: TLD[];
  numericCode: CountryNumericCode;
};

export type ExtendedCountry = Country & {
  fifaCode: FifaCode;
  iocCode: OlympicCode;
  callingCode: string;
  currencies: Array<CurrencyCode>;
  capital: string;
  languages: Array<LanguageAlpha3>;
};

var _countries = map(countries, (c) => {
  const fifaCode = find(fifaCodes, (_) => _.country === c.name)?.code;
  const iocCode = find(iocCodes, (_) => _.country === c.name)?.code;

  return {
    ...c,
    fifaCode,
    iocCode,
  };
}) as any as Array<ExtendedCountry>;

export type FifaWCountry = {
  name?: string;
  alpha2?: string;
  alpha3?: string;
  internetTld?: string[];
  numericCode?: string;
  officialName?: string;
  country: string;
  code: FifaCode;
  federation: string;
};

var fifaWithCountry = values(
  merge(keyBy(countries, "name"), keyBy(fifaCodes, "country"))
) as any as Array<FifaWCountry>;

export {
  _countries as countries,
  fifaWithCountry as countriesFootballFederations,
};
