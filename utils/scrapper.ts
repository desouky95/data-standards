import axios from "axios";
import { load } from "cheerio";
import { mainURL } from "./urls";
import { mkdir, writeFile } from "fs";
export class Scrapper {
  protected baseURL = mainURL;
  protected currenciesURL = "https://en.wikipedia.org/wiki/ISO_4217";
  protected callingCodesURLS =
    "https://en.wikipedia.org/wiki/List_of_country_calling_codes#Alphabetical_order";
  protected regionsURL =
    "https://en.wikipedia.org/wiki/List_of_countries_by_the_United_Nations_geoscheme";

  protected fifaCodesURL =
    "https://en.wikipedia.org/wiki/List_of_FIFA_country_codes#FIFA_member_codes";

  protected iocCodesURL =
    "https://en.wikipedia.org/wiki/List_of_IOC_country_codes#Current_NOCs";

  protected capitalsURL =
    "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_and_their_capitals_in_native_languages";
  async getCountriesList() {
    const response = await axios.get(this.baseURL);

    const $ = load(response.data);

    const countries: Map<string, Array<string>> = new Map();
    // const countries: string[][] = [];
    $("table.wikitable tbody tr")
      .map(function () {
        const name = $(this).find("td:first-child a").text().trim();
        const officialName = $(this).find("td:nth-child(2) a").text().trim();
        const alpha2 = $(this).find("td:nth-child(4) a span").text().trim();
        const alpha3 = $(this).find("td:nth-child(5) a span").text().trim();
        const numericCode = $(this)
          .find("td:nth-child(6) a span")
          .text()
          .trim();
        const internetTLD = $(this).find("td:last-child a").text().trim();

        if (name !== "" || name)
          countries.set(name, [
            name,
            officialName,
            alpha2,
            alpha3,
            numericCode,
            internetTLD,
          ]);
      })
      .toArray();
    const csvHeader = [
      "Name",
      "Official Name",
      "Alpha 2",
      "Alpha 3",
      "Numeric Code",
      "Internet TLD",
    ];

    const dataToWrite = [csvHeader, ...countries.values()]
      .map((_) => _.join(","))
      .join("\n");

    writeFile("data/countries.csv", dataToWrite, (err) => {});
  }

  async getCurrenciesList() {
    const response = await axios.get(this.currenciesURL);

    const $ = load(response.data);

    const currencies: Map<string, Array<string>> = new Map();

    const regex = new RegExp(/\(.*?\)/gm);
    $(".wikitable")
      .first()
      .find("tbody")
      .find("tr")
      .map(function () {
        const code = $(this).find("td:first-child").text().trim();
        const num = $(this).find("td:nth-child(2)").text().trim();
        const decimalSeparator = $(this).find("td:nth-child(3)").text().trim();
        let name = $(this).find("td:nth-child(4) a:first-child").text().trim();
        const nameElement = $(this).find("td:nth-child(4)");
        if (
          nameElement.find("a").parent().hasClass("reference") ||
          !nameElement.find("a").text()
        ) {
          name = nameElement.text().replace(regex, "").trim();
        }
        name = name.replace(regex, "");

        const locations = $(this)
          .find('td:nth-child(5) a:not([title=""])')
          .map(function () {
            return $(this).text().trim();
          })
          .toArray()
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
    writeFile("data/currencies.csv", dataToWrite, (err) => {});
  }

  async getCallingCodes() {
    const response = await axios.get(this.callingCodesURLS);

    const $ = load(response.data);

    const callingCodes: Map<string, Array<string>> = new Map();

    $("h2 span#Alphabetical_order")
      .parent()
      .next("table.wikitable")
      .find("tbody tr")
      .map(function () {
        const countryOrService = $(this).find("td:first-child").text().trim();
        const code = $(this).find("td:nth-child(2) a").text().trim();
        const timeZone = $(this).find("td:nth-child(3)").text().trim();
        const dst = $(this).find("td:nth-child(4)").text().trim();
        if (countryOrService == "") return;
        callingCodes.set(countryOrService, [
          countryOrService,
          code,
          timeZone,
          dst,
        ]);
      });
    const csvHeader = ["Country / Service", "Code", "Time Zone", "DST"];
    const dataToWrite = [csvHeader, ...callingCodes.values()]
      .map((_) => _.join(","))
      .join("\n");
    writeFile("data/calling_codes.csv", dataToWrite, (err) => {});
  }

  async getCountriesRegions() {
    const response = await axios.get(this.regionsURL);
    const $ = load(response.data);

    const regions: Map<string, Array<string>> = new Map();
    const tableDataElement = $("table.wikitable").find("tbody");

    tableDataElement.find("tr").map(function () {
      const continent = $(this).find("td:nth-child(4) a").text().trim();
      const countryOrArea = $(this).find("td:first-child a").text().trim();
      const intermediateRegion = $(this)
        .find("td:nth-child(2) a")
        .text()
        .trim();
      const subRegion = $(this).find("td:nth-child(3) a").text().trim();
      const unsd = $(this)
        .find("td:last-child a")
        .map(function () {
          const code = $(this).find("span").text().trim();
          const title = $(this).attr("title")?.trim();
          return `  (${code}) ${title}    `;
        })
        .toArray()
        .join("<");
      if (countryOrArea)
        regions.set(countryOrArea, [
          countryOrArea,
          continent,
          intermediateRegion,
          subRegion,
          unsd,
        ]);
    });

    const csvHeader = [
      "Country / Area",
      "Continent",
      "Intermediate Region",
      "Sub Region",
      "UNSD",
    ];
    const dataToWrite = [csvHeader, ...regions.values()]
      .map((_) => _.join(","))
      .join("\n");
    writeFile("data/regions.csv", dataToWrite, (err) => {});
  }

  async getFifaAndIOC() {
    this.getFifaCodes();
    this.getIOCCodes();
  }
  async getCountriesCapital() {
    const response = await axios.get(this.capitalsURL);
    const $ = load(response.data);
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
          const capital = $(this).find("td:nth-child(2) a").text().trim();
          countriesCapitals.set(country, [country, capital]);
        });
    });

    const csvHeader = ['Country','Capital']
    const dataToWrite = [csvHeader,...countriesCapitals.values()].map(_ => _.join(',')).join('\n')
    writeFile('data/capitals.csv',dataToWrite,(err)=>{})
  }

  private async getFifaCodes() {
    const response = await axios.get(this.fifaCodesURL);
    const $ = load(response.data);
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
    writeFile("data/fifa.csv", dataToWrite, (err) => {});
  }

  private async getIOCCodes() {
    const response = await axios.get(this.iocCodesURL);
    const $ = load(response.data);
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
    writeFile("data/olympics_codes.csv", dataToWrite, (err) => {});
  }
}
