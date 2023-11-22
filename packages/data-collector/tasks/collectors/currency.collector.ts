import { getData } from "@desoukysvyc/data-utils";
import getCurrencySymbol from "currency-symbol-map";
getData({
  filePath: "src/data/csv/currencies.csv",
  url: "https://en.wikipedia.org/wiki/ISO_4217",
  cb($) {
    const currencies: Map<string, Array<string>> = new Map();

    // const regex = new RegExp(/\(.*?\)/gm);
    $(".wikitable")
      .first()
      .find("tbody")
      .find("tr")
      .map(function () {
        const code = $(this).find("td:first-child").text().trim();
        const num = $(this).find("td:nth-child(2)").text().trim();
        const decimalSeparator = $(this)
          .find("td:nth-child(3)")
          .contents()
          .first()
          .text()
          .trim()
          .replace(".", "");
        const regex = new RegExp(/\(.*?\)|\[.*?\]/gm);
        const name = $(this)
          .find("td:nth-child(4)")
          .contents()
          .first()
          .text()
          .trim()
          .replace(regex, "");

        if (name == "") return;

        const symbol = getCurrencySymbol(code);

        currencies.set(code, [code, num, decimalSeparator, name, symbol ?? code]);
      });

    const csvHeader = ["Code", "Num", "Decimal", "Name", "Symbol"];

    const dataToWrite = [csvHeader, ...currencies.values()]
      .map((_) => _.join(","))
      .join("\n");

    return dataToWrite;
  },
});

getData({
  filePath: "src/data/csv/currencies_meta.csv",
  url: "https://en.wikipedia.org/wiki/ISO_4217",
  cb($) {
    const currencies: Map<string, { code: string; locations: Array<string> }> =
      new Map();

    // const regex = new RegExp(/\(.*?\)/gm);
    $(".wikitable")
      .first()
      .find("tbody")
      .find("tr")
      .map(function () {
        const code = $(this).find("td:first-child").text().trim();

        const locations = $(this)
          .find('td:nth-child(5) a[title!=""]')
          .map(function () {
            return $(this).text().trim();
          })
          .toArray()
          .filter((_) => _ !== "");

        if (!code) return;

        const symbol = getCurrencySymbol(code);

        currencies.set(code, { code, locations });
      });

    const Total = ["Total", [...currencies.values()].length];
    const WithoutLocations = [
      "Without Locations",
      [...currencies.values()].filter((_) => _.locations.length == 0).length,
    ];
    const WithMultipleLocations = [
      "Multiple Locations",
      [...currencies.values()].filter((_) => _.locations.length > 1).length,
    ];
    const csvHeader = ["Meta", "Value"];

    const dataToWrite = [
      csvHeader,
      Total,
      WithoutLocations,
      WithMultipleLocations,
    ]
      .map((_) => _.join(","))
      .join("\n");

    return dataToWrite;
  },
});
