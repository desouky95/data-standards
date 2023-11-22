import { normalizeCsv } from "@desoukysvyc/data-utils";

normalizeCsv({
  filePath: "src/data/csv/currencies.csv",
  firstHeader: "Code",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/countries.csv",
  firstHeader: "Name",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/capitals.csv",
  firstHeader: "Country",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/calling_codes.csv",
  firstHeader: "Country / Service",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/fifa.csv",
  firstHeader: "Country",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/olympic_codes.csv",
  firstHeader: "Country",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/country_regions.csv",
  firstHeader: "Country / Area",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/countries_meta.csv",
  firstHeader: "Total",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/countries_codes_meta.csv",
  firstHeader: "Code",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/currencies_meta.csv",
  firstHeader: "Meta",
  outDir: "src/data/normalized",
});

normalizeCsv({
  filePath: "src/data/csv/languages.csv",
  firstHeader: "Name",
  outDir: "src/data/normalized",
});

// normalizeCsv({
//   filePath: "src/data/csv/country_languages.csv",
//   firstHeader: "Name",
//   outDir: "src/data/normalized",
// });
