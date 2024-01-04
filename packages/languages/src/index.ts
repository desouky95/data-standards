import {
  LanguageAlpha2B,
  LanguageAlpha3,
  IsoLanguage,
  iso6392,
  iso6393,
  Iso3Language,
  Iso2Language,
} from "@desoukysvyc/data-collector";

export class Language {
  private language: IsoLanguage;
  constructor(code: any);
  constructor(code: any, _: any);
  constructor(
    code: LanguageAlpha2B | LanguageAlpha3,
    _: LanguageAlpha2B = null
  ) {
    if (_ === null) {
      const lang = (iso6393 as any as Array<Iso3Language>).find(
        (_) => _.iso639_3 === code
      );
      const iso6392Language = (iso6392 as any as Array<Iso2Language>).find(
        (_) => _.iso639_2 === lang.iso639_2B
      );
      this.language = {
        alpha3: lang.iso639_3,
        name: lang.name,
        alpha2: iso6392Language.iso639_2,
        scope: lang.scope,
        type: lang.type,
      };
    } else {
      const lang = (iso6392 as any as Array<Iso2Language>).find(
        (_) => _.iso639_2 === code
      );
      const iso6393Language = (iso6393 as any as Array<Iso3Language>).find(
        (_) => _.iso639_2B === lang.iso639_2
      );
      this.language = {
        alpha3: iso6393Language.iso639_3,
        name: lang.name,
        alpha2: lang.iso639_2,
        scope: iso6393Language.scope,
        type: iso6393Language.type,
      };
    }
  }
  static fromAlpha2(code: LanguageAlpha2B) {
    return new Language(code);
  }
  static fromAlpha3(code: LanguageAlpha3) {
    return new Language(code, null);
  }

  get name() {
    return this.language.name;
  }
  get alpha2() {
    return this.language.alpha2;
  }

  get alpha3() {
    return this.language.alpha3;
  }
}
