import { parseCsvToJS, parseData } from "@desoukysvyc/data-utils";
import { camelCase, groupBy, map, mapKeys, reduce, sortBy } from "lodash";

parseCsvToJS({
  fileName: "currencies",
  filePath: "src/data/normalized/currencies.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "currencies",
  onFinish(output) {
    output = map(output, (item) => {
      return mapKeys(item, (v, k) => camelCase(k));
    });

    return output;
  },
});

parseCsvToJS({
  fileName: "countries",
  filePath: "src/data/normalized/countries.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "countries",
  onFinish(output) {
    output = map(output, (item) => {
      const withMappedKeys = mapKeys(item, (v, k) => camelCase(k));
      const internetTld = withMappedKeys.internetTld
        .split(",")
        .filter((_) => _ !== "");
      const currencies = withMappedKeys.currencies
        .split(",")
        .filter((_) => _ !== "");
      const languages = withMappedKeys.languages
        .split(",")
        .filter((_) => _ !== "");
      return { ...withMappedKeys, internetTld, currencies, languages };
    });
    return output;
  },
});

parseCsvToJS({
  fileName: "calling_codes",
  filePath: "src/data/normalized/calling_codes.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "callingCodes",
  onFinish(output) {
    output = map(output, (item) => {
      const withMappedKeys = mapKeys(item, (v, k) => camelCase(k));
      return withMappedKeys;
    });
    return output;
  },
});

parseCsvToJS({
  fileName: "fifa",
  filePath: "src/data/normalized/fifa.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "fifaCodes",
  onFinish(output) {
    output = map(output, (item) => {
      const withMappedKeys = mapKeys(item, (v, k) => camelCase(k));
      return withMappedKeys;
    });
    return output;
  },
});

parseCsvToJS({
  fileName: "olympics",
  filePath: "src/data/normalized/olympic_codes.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "iocCodes",
  onFinish(output) {
    output = map(output, (item) => {
      const withMappedKeys = mapKeys(item, (v, k) => camelCase(k));
      return withMappedKeys;
    });
    return output;
  },
});

parseCsvToJS({
  fileName: "capitals",
  filePath: "src/data/normalized/capitals.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "capitals",
  onFinish(output) {
    output = map(output, (item) => {
      const withMappedKeys = mapKeys(item, (v, k) => camelCase(k));
      return withMappedKeys;
    });
    return output;
  },
});

parseCsvToJS({
  fileName: "regions",
  filePath: "src/data/normalized/country_regions.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "regions",
  onFinish(output) {
    output = map(output, (item) => {
      const withMappedKeys = mapKeys(item, (v, k) => camelCase(k));
      return withMappedKeys;
    });
    const grouped_ = groupBy(output, (_) => _.continent);
    const grouped = reduce(
      grouped_,
      (prev, curr) => {
        return {
          ...prev,
          [camelCase(curr[0].continent)]: mapKeys(
            groupBy(curr, (_) => _.region),
            (_, k) => camelCase(k)
          ),
        };
      },
      {}
    );
    return grouped;
  },
});

parseCsvToJS({
  fileName: "countries_meta",
  filePath: "src/data/normalized/countries_meta.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "countriesMeta",
  onFinish(output) {
    let meta = output[0];
    meta = mapKeys(meta, (v, k) => camelCase(k));
    return meta;
  },
});

parseCsvToJS({
  fileName: "countries_codes_meta",
  filePath: "src/data/normalized/countries_codes_meta.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "countriesCodes",
  onFinish(output) {
    output = map(output, (_) => mapKeys(_, (v, k) => camelCase(k)));
    return output;
  },
});

parseCsvToJS({
  fileName: "currencies_meta",
  filePath: "src/data/normalized/currencies_meta.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "currenciesMeta",
  onFinish(output) {
    output = map(output, (_) => mapKeys(_, (v, k) => camelCase(k)));
    return output;
  },
});

parseCsvToJS({
  fileName: "languages",
  filePath: "src/data/normalized/languages.new.csv",
  outDir: "src/data/js",
  fileType: "ts",
  variableName: "languages",
  onFinish(output) {
    output = map(output, (_) => mapKeys(_, (v, k) => camelCase(k)));
    return output;
  },
});
