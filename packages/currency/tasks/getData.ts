import { writeFile } from "fs";
import { Scrapper } from "@desoukysvyc/data-utils";
import { outputFile } from "fs-extra";

const scrapper = new Scrapper();

scrapper.getData({
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

        const locations = $(this)
          .find('td:nth-child(5) a[title=""]')
          .map(function () {
            return $(this).text().trim();
          })
          .toArray()
          .filter((_) => _ !== "")
          .join(",");

        if (name == "") return;

        currencies.set(code, [
          code,
          num,
          decimalSeparator,
          name,
          `"${locations}"`,
        ]);
      });

    const csvHeader = ["Code", "Num", "Decimal", "Name", "Locations"];

    const dataToWrite = [csvHeader, ...currencies.values()]
      .map((_) => _.join(","))
      .join("\n");

    outputFile("src/data/fetched_data.csv", dataToWrite, {}, (err) => {
      console.error(err);
    });
  },
});
