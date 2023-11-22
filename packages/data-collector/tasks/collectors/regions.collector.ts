import { getData } from "@desoukysvyc/data-utils";

getData({
  filePath: "src/data/csv/country_regions.csv",
  url: "https://en.wikipedia.org/wiki/List_of_countries_by_the_United_Nations_geoscheme",
  cb($) {
    const regions: Map<string, Array<string>> = new Map();
    const tableDataElement = $("table.wikitable").find("tbody");

    tableDataElement.find("tr").map(function () {
      const continent = $(this).find("td:nth-child(4) a").text().trim();
      const countryOrArea = $(this)
        .find("td:first-child a")
        .attr("title")
        ?.trim();
      const intermediateRegion = $(this)
        .find("td:nth-child(2) a")
        .text()
        .trim();
      const subRegion = $(this).find("td:nth-child(3) a").text().trim();
      const getContinent = () => {
        if (!continent) return;
        if (continent === "Americas") {
          if (intermediateRegion === "South America") return "South America";
          return "North America";
        }
        return continent;
      };
      const getRegion = () => {
        const continent = getContinent();

        if (!continent) return countryOrArea;
        if (continent === "Africa")
          return intermediateRegion === "" ? subRegion : intermediateRegion;
        if (continent === "South America") return "Southern America";
        if (intermediateRegion === "Channel Islands") return subRegion;
        if (subRegion === "Australia and New Zealand") return "Australia";
        return intermediateRegion === "" ? subRegion : intermediateRegion;
      };
      if (countryOrArea)
        regions.set(countryOrArea, [
          `"${countryOrArea}"`,
          getContinent() ?? getRegion() ?? "",
          getRegion() ?? "",
        ]);
    });

    const csvHeader = ["Country / Area", "Continent", "Region"];
    const dataToWrite = [csvHeader, ...regions.values()]
      .map((_) => _.join(","))
      .join("\n");
    return dataToWrite;
  },
});

// getData({
//   filePath: "src/data/csv/continent_regions.csv",
//   url: "https://en.wikipedia.org/wiki/List_of_countries_by_the_United_Nations_geoscheme",
//   cb($) {
//     const regions: Map<string, Array<string>> = new Map();
//     const tableDataElement = $("table.wikitable").find("tbody");

//     tableDataElement.find("tr").map(function () {
//       const continent = $(this).find("td:nth-child(4) a").text().trim();
//       const countryOrArea = $(this)
//         .find("td:first-child a")
//         .attr("title")
//         ?.trim();
//       const intermediateRegion = $(this)
//         .find("td:nth-child(2) a")
//         .text()
//         .trim();
//       const subRegion = $(this).find("td:nth-child(3) a").text().trim();

//       const getContinent = () => {
//         if (!continent) return;
//         if (continent === "Americas") {
//           if (intermediateRegion === "South America") return "South America";
//           return "North America";
//         }
//         return continent;
//       };
//       const getRegion = () => {
//         const continent = getContinent();

//         if (!continent) return countryOrArea;
//         if (continent === "Africa")
//           return intermediateRegion === "" ? subRegion : intermediateRegion;
//         if (continent === "South America") return "Southern America";
//         if (intermediateRegion === "Channel Islands") return subRegion;
//         if (subRegion === "Australia and New Zealand") return "Australia";
//         return intermediateRegion === "" ? subRegion : intermediateRegion;
//       };
//       if (countryOrArea)
//         regions.set(countryOrArea, [
//           `"${countryOrArea}"`,
//           getContinent() ?? getRegion() ?? "",
//           getRegion() ?? "",
//         ]);
//     });

//     const csvHeader = ["Continent", "Regions"];
//     const dataToWrite = [csvHeader, ...regions.values()]
//       .map((_) => _.join(","))
//       .join("\n");
//     return dataToWrite;
//   },
// });
