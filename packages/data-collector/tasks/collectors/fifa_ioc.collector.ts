import { getData } from "@desoukysvyc/data-utils";
getData({
  filePath: "src/data/csv/fifa.csv",
  url: "https://en.wikipedia.org/wiki/List_of_FIFA_country_codes#FIFA_member_codes",
  cb($) {
    const footballFederations: Map<string, Array<string>> = new Map();

    $("h2 span#Non-FIFA_member_codes")
      .parent()
      .prevAll("table.wikitable")
      .map(function () {
        $(this)
          .find("tbody tr")
          .map(function () {
            const country = $(this).find("td:first-child a").text().trim();
            const federationName = $(this)
              .find("td:first-child a")
              .attr("title")
              ?.trim();
            const code = $(this).find("td:nth-child(2)").text().trim();
            if (country)
              footballFederations.set(country, [
                country,
                federationName ?? "",
                code,
              ]);
          });
      });

    const csvHeader = ["Country", "Federation", "Code"];
    const dataToWrite = [csvHeader, ...footballFederations.values()]
      .map((_) => _.join(","))
      .join("\n");

    return dataToWrite;
  },
});

getData({
  filePath: "src/data/csv/olympic_codes.csv",
  url: "https://en.wikipedia.org/wiki/List_of_IOC_country_codes#Current_NOCs",
  cb($) {
    const nationalIOCs: Map<string, Array<string>> = new Map();

    $("h2 span#Current_NOCs")
      .parent()
      .next()
      .next("table.wikitable")
      .find("tbody tr")
      .map(function () {
        const code = $(this).find("td:first-child span").text().trim();
        const country = $(this).find("td:nth-child(2) a").text().trim();

        if (country) nationalIOCs.set(country, [country, code]);
      });

    const csvHeader = ["Country", "Code"];
    const dataToWrite = [csvHeader, ...nationalIOCs.values()]
      .map((_) => _.join(","))
      .join("\n");

    return dataToWrite;
  },
});
