import { getData } from "@desoukysvyc/data-utils";

getData({
  filePath: "src/data/csv/calling_codes.csv",
  url: "https://en.wikipedia.org/wiki/List_of_country_calling_codes#Alphabetical_order",
  cb($) {
    const callingCodes: Map<string, Array<string>> = new Map();

    $("h2 span#Alphabetical_order")
      .parent()
      .next("table.wikitable")
      .find("tbody tr")
      .map(function () {
        const countryOrService = $(this)
          .find("td:first-child")
          .text()
          .trim()
          .replace(/\(.*?\)|(,(.*))/gm, "");
        const code = $(this)
          .find("td:nth-child(2) a")
          .text()
          .trim()
          .replace(/\(.*?\)/gm, "");
        if (countryOrService == "") return;
        callingCodes.set(countryOrService, [countryOrService, `"+${code}"`]);
      });
    const csvHeader = ["Country / Service", "Code"];
    const dataToWrite = [csvHeader, ...callingCodes.values()]
      .map((_) => _.join(","))
      .join("\n");
    return dataToWrite;
  },
});
