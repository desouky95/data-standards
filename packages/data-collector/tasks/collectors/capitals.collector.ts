import { getData } from "@desoukysvyc/data-utils";

getData({
  filePath: "src/data/csv/capitals.csv",
  url: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_and_their_capitals_in_native_languages",
  cb($) {
    const countriesCapitals: Map<string, Array<string>> = new Map();
    $("table.wikitable").map(function () {
      $(this)
        .find("tbody tr")
        .map(function () {
          const country = $(this)
            .find("td:first-child")
            .text()
            .trim()
            .replace(/\[.*?\]/gm, "");
          if (!country) return;
          const capital = $(this)
            .find("td:nth-child(2) a")
            .text()
            .trim()
            .replace(/\(.*?\)|\[.*?\]/gm, "");
          countriesCapitals.set(country, [`"${country}"`, `"${capital}"`]);
        });
    });

    const csvHeader = ["Country", "Capital"];
    const dataToWrite = [csvHeader, ...countriesCapitals.values()]
      .map((_) => _.join(","))
      .join("\n");
    return dataToWrite;
  },
});
