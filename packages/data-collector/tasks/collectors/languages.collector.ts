import { getData } from "@desoukysvyc/data-utils";

getData({
  url: "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes",
  filePath: "src/data/csv/languages.csv",
  cb($) {
    const languages: Map<string, Array<string>> = new Map();
    $("table.wikitable.sortable tbody tr").map(function () {
      const name = $(this).find("td:first-child a").text().trim();
      const alpha2 = $(this).find("td:nth-child(2) a").text().trim();
      const alpha3 = $(this).find("td:nth-child(3)").text().trim();

      if (!alpha2) return;
      languages.set(alpha2, [name, alpha2, alpha3]);
    });

    const csvHeader = ["Name", "Alpha2", "Alpha3"];
    const dataToWrite = [csvHeader, ...languages.values()]
      .map((_) => _.join(","))
      .join("\n");
    return dataToWrite;
  },
});
