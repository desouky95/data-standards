import {
  Alpha2,
  Alpha3,
  CountrySovereignty,
  Currency,
  CurrencyCode,
  FifaCode,
  IsoCodeState,
  IsoCountry,
  OlympicCode,
  countries,
  currencies,
} from "@desoukysvyc/data-collector";

export default class Country {
  private country!: IsoCountry;
  private name!: string;
  private alpha2!: Alpha2;
  private alpha3!: Alpha3;
  private numeric!: string;
  private independent!: boolean;
  private status!: IsoCodeState;
  private altNames!: Array<string>;
  private callingCode!: string;
  private "officialName"!: string;
  private "ccTLD"!: Array<string>;
  private "sovereignty"!: CountrySovereignty;
  private "fifa"?: FifaCode;
  private "ioc"?: OlympicCode;
  private "capital"!: string;
  private "currencies"!: Array<CurrencyCode>;

  constructor(code: string) {
    if (code.length === 3)
      this.country = countries.find((_) => _.alpha3 === code) as any;
    if (code.length === 2)
      this.country = countries.find((_) => _.alpha2 === code) as any;

    if (!this.country) throw new Error("Country not found");
    for (const key in this.country) {
      Object.defineProperty(this, key, {
        get: () => this.country[key as unknown as any],
      });
    }
  }

  static fromAlpha3(code: Alpha3) {
    return new Country(code);
  }
  static fromAlpha2(code: Alpha2) {
    return new Country(code);
  }

  static all = countries.map((_) => Country.fromAlpha2(_.alpha2).country);

  static expanded = countries.map((_) => {
    const country = Country.fromAlpha2(_.alpha2);
    const _currencies = currencies.filter((_) =>
      country.country.currencies.includes(_.alpha3)
    ) as any as Array<Currency>;
    return { ...country.country, currencies: _currencies } as Omit<
      IsoCountry,
      "currencies"
    > & { currencies: Array<Currency> };
  });

  get expandCurrencies() {
    return currencies.filter((_) =>
      this.country.currencies.includes(_.alpha3)
    ) as Array<Currency>;
  }
}
