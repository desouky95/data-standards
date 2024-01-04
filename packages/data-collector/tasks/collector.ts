import collect from "./collectors/fifa_ioc.collector";
import getCurrencies from "./collectors/currency.collector";
import getCallingCodes from "./collectors/callingCodes.collector";
import getCapitals from "./collectors/capitals.collector";
import getCountries from "./collectors/countries.collector";
import getLanguages from "./collectors/languages.collector";
import { PersistCache, createTypescript } from "@desoukysvyc/data-utils";
import _ from "lodash";

type Unpack<T> = T extends Promise<infer U> ? U : T;

async function exec() {
  const data = await loadData();
  createFiles(data);
  const {
    fifaCodes,
    iocCodes,
    comparisonIso,
    countriesCurrencies,
    callingCodes,
    capitals,
    assigned,
  } = data;

  const entries: any[] = [];
  for (let index = 0; index < assigned.length; index++) {
    const country = assigned[index];

    let fifa = comparisonIso.find((_) => _.iso === country.alpha3)?.fifa;

    let ioc = comparisonIso.find((_) => _.iso === country.alpha3)?.ioc;
    if (!ioc)
      ioc = iocCodes.find(
        (_) => country.altNames.includes(_.country) || country.alpha3 === _.code
      )?.code;
    if (!fifa)
      fifa = fifaCodes.find(
        (_) => country.altNames.includes(_.country) || country.alpha3 === _.code
      )?.code;

    const capital = capitals.find((_) =>
      [...country.altNames, country.name, country.officialName].includes(
        _.country
      )
    )?.capital;

    const currencies = countriesCurrencies
      .filter((cc) =>
        _.map(
          [...country.altNames, country.name, country.officialName],
          (name) => _.deburr(_.toUpper(name))
        ).includes(
          _.deburr(_.toUpper(cc.country.replace(/\[.*?\]/gm, "")))
            .replace("’", "'")
            .trim()
        )
      )
      .map((_) => _.alpha3);

    const callingCode = callingCodes.find((_) =>
      [...country.altNames, country.name, country.officialName].includes(
        _.countryOrService
      )
    )?.code;

    const languages = data.countriesLanguages.find((_) =>
      country.altNames.includes(_.name)
    )?.languages;

    entries.push({
      ...country,
      fifa,
      ioc,
      capital,
      currencies,
      callingCode,
      languages,
    });
  }

  createTypescript({
    data: entries,
    filePath: "src/data/js",
    fileName: "countries",
    variableName: "countries",
  });
}

const loadData = async () => {
  const cache = new PersistCache();
  const { comparisonIso, iocCodes, fifaCodes } = await cache.cacheFn(
    collect,
    "sports"
  );
  const { countriesCurrencies, currencies } = await cache.cacheFn(
    getCurrencies,
    "currencies"
  );
  // const { countriesLanguages, iso6392, iso6393 } = await cache.cacheFn(getLanguages, 'languages');
  const { countriesLanguages, iso6392, iso6393 } = await cache.cacheFn(
    getLanguages,
    "languages"
  );
  const callingCodes = await cache.cacheFn(getCallingCodes, "calling_codes");
  const capitals = await cache.cacheFn(getCapitals, "capitals");
  const { assigned, iso31661, reserved } = await cache.cacheFn(
    getCountries,
    "countries"
  );

  return {
    fifaCodes,
    iocCodes,
    comparisonIso,
    countriesCurrencies,
    currencies,
    countriesLanguages,
    iso31661,
    iso6392,
    iso6393,
    assigned,
    reserved,
    callingCodes,
    capitals,
  };
};

const createFiles = (args: Unpack<ReturnType<typeof loadData>>) => {
  createTypescript({
    data: args.callingCodes,
    filePath: "src/data/js",
    variableName: "callingCodes",
    fileName: "calling_codes",
  });
  createTypescript({
    filePath: "src/data/js",
    variableName: "fifaCodes",
    fileName: "fifa",
    data: args.fifaCodes,
  });
  createTypescript({
    filePath: "src/data/js",
    variableName: "iocCodes",
    fileName: "olympic_codes",
    data: args.iocCodes,
  });
  createTypescript({
    data: args.currencies,
    filePath: "src/data/js",
    fileName: "currencies",
    type: "ts",
    variableName: "currencies",
  });
  createTypescript({
    data: args.capitals,
    variableName: "capitals",
    filePath: "src/data/js",
    fileName: "capitals",
  });
  createTypescript({
    data: args.reserved,
    filePath: "src/data/js",
    fileName: "isoReserved",
    variableName: "isoReserved",
  });

  createTypescript({
    data: args.iso31661,
    filePath: "src/data/js",
    fileName: "iso3166",
    variableName: "iso31661",
  });
  createTypescript({
    data: args.iso6392,
    filePath: "src/data/js",
    fileName: "iso6392",
    variableName: "iso6392",
  });
  createTypescript({
    data: args.iso6393,
    filePath: "src/data/js",
    fileName: "iso6393",
    variableName: "iso6393",
    inferredType: false,
  });
};

exec().then((v) => {
  console.log("Data Collected Successfully");
});
