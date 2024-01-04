import {
  CurrencyCode,
  currencies,
  Currency as IsoCurrency,
  countries,
  CurrencyNum,
  Alpha3,
} from "@desoukysvyc/data-collector";

export default class Currency {
  private currency: IsoCurrency;

  readonly "name": string;
  readonly "alpha3": CurrencyCode;
  readonly "numeric": CurrencyNum;
  readonly "units": number;

  constructor(code: CurrencyCode) {
    const currency = currencies.find((_) => _.alpha3 === code);
    if (!currency) throw new Error("Currency not found");
    this.currency = currency as any as IsoCurrency;
    for (const key in this.currency) {
      Object.defineProperty(this, key, { get: () => this.currency[key] });
    }
  }

  get formatted_name() {
    return typeof this.currency.name === "object"
      ? this.currency.name.$t
      : this.currency.name;
  }

  static all = currencies.map((_) => new Currency(_.alpha3));

  get usage() {
    return countries
      .filter((_) =>
        (_.currencies as any as Array<CurrencyCode>).includes(this.alpha3)
      )
      .map((_) => _.alpha3);
  }
}
