import { getData } from "@desoukysvyc/data-utils";
import axios from "axios";
import { load } from "cheerio";

getData({
  filePath: "src/data/csv/countries.csv",
  url: "https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes",
  async cb($) {
    const countries: Map<string, Array<string>> = new Map();
    // const countries: string[][] = [];
    const currenciesResponse = await axios.get(
      "https://en.wikipedia.org/wiki/ISO_4217"
    );
    const circulatingCurrenciesResponse = await axios.get(
      "https://en.wikipedia.org/wiki/List_of_circulating_currencies"
    );
    const languagesResponse = await axios.get(
      "https://en.wikipedia.org/wiki/List_of_official_languages_by_country_and_territory"
    );

    const languagesLookupResponse = await axios.get(
      "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
    );

    const capitalsResponse = await axios.get(
      "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_and_their_capitals_in_native_languages"
    );

    const callingCodesResponse = await axios.get(
      "https://en.wikipedia.org/wiki/List_of_country_calling_codes#Alphabetical_order"
    );

    const $currency = load(currenciesResponse.data);
    const $circulatingCurrency = load(circulatingCurrenciesResponse.data);
    const $language = load(languagesResponse.data);
    const $languageLookup = load(languagesLookupResponse.data);
    const $capitals = load(capitalsResponse.data);
    const $callingCodes = load(callingCodesResponse.data);

    $("table.wikitable tbody tr").map(function () {
      // const name = $(this).find("td:first-child a").text().trim();
      const isSingleRow = $(this).children("td").length;
      if (isSingleRow === 1) {
        return;
      }
      let multipleCountry =
        $(this).find("td:first-child a[title!='']").length > 2;
      let name = $(this)
        .find("td:first-child a[title!='']:not(:has(img))")
        .attr("title")
        ?.trim();
      if (!name) return;
      const officialName = $(this)
        .find("td:nth-child(2) a[title!='']")
        .text()
        .trim();
      const alpha2 = $(this).find("td:nth-child(4) a span").text().trim();
      const alpha3 = $(this).find("td:nth-child(5) a span").text().trim();
      const numericCode = $(this).find("td:nth-child(6) a span").text().trim();
      const internetTLD = $(this)
        .find("td:last-child a[title!='']")
        .map((_, el) => $(el).text().trim())
        .toArray()
        .join(",");

      let secondaryName = $(this)
        .find("td:first-child a[title!='']:not(:has(img))")
        .text()
        ?.trim()
        .replace(/\(.*?\)|(,(.*))/gm, "")
        .trim();

      let currencies = $currency("table.wikitable:first tbody")
        .find(
          `tr:has(a[title="${name}"]),tr:has(a[title="${secondaryName}"]),tr:has(a:contains("${name}")),tr:has(a:contains("${secondaryName}")),tr:has(td:contains(${name})),tr:has(td:contains(${secondaryName}))`
        )
        .find("td:nth-child(1)")
        .map(function () {
          return $(this).text().trim();
        })
        .toArray()
        .join(",");

      if (currencies.length === 0) {
        const currenciesTable = $circulatingCurrency("<tbody></tbody>");
        const currencyRow = $circulatingCurrency(
          "table.wikitable:first tbody"
        ).find(
          `tr:has(a[title="${name}"]),tr:has(a[title="${secondaryName}"]),tr:has(a:contains("${name}")),tr:has(a:contains("${secondaryName}"))`
        );
        const span = currencyRow.find("td:first-child").attr("rowspan");
        let next;
        if (span) {
          next = currencyRow.nextUntil(
            `tr:has(td:first-child[rowspan!=""]):has(td:first-child a[title!="${name}"][title!="${secondaryName}"])`
          );
        }
        currenciesTable.append(currencyRow).append(next);
        currencies = currenciesTable
          .find("tr")
          .map(function () {
            if (
              $circulatingCurrency(this).find("td:first-child").attr("rowspan")
            ) {
              return $circulatingCurrency(this)
                .find("td:nth-child(4)")
                .text()
                .trim();
            }
            return $circulatingCurrency(this)
              .find("td:nth-child(3)")
              .text()
              .trim();
          })
          .toArray()
          .join(",");
      }

      const getLanguages = () => {
        let languagesRow = $language("table.wikitable tbody")
          .find(
            `tr:has(td:nth-child(1):has(a:contains("${name}"))),tr:has(td:nth-child(1):has(a:contains("${secondaryName}")))
          `
          )
          .first();
        if (languagesRow.length === 0) {
          const sovereignty = $(this).find("td:nth-child(3)").text().trim();
          languagesRow = $language("table.wikitable tbody").find(
            `tr:has(a:contains('${sovereignty}'))`
          );
        }
        if (languagesRow.length === 0)
          console.log({ [name ?? secondaryName]: languagesRow.length });

        const regex = /\[.*?\]|\(.*?\)/gm;

        const languagesCol = languagesRow.find("td:nth-child(2)");
        if (languagesCol.has("ul").length > 0) {
          return languagesCol
            .find("ul li")
            .map(function () {
              return $language(this).text().trim().replace(regex, "");
            })
            .toArray()
            .filter((_) => _ !== "");
        }
        if (languagesCol.has("a").length > 0)
          return languagesCol
            .find("a[title!='De facto']")
            .map(function () {
              return $language(this).text().trim().replace(regex, "");
            })
            .toArray()
            .filter((_) => _ !== "");
        return [languagesCol.text().trim().replace(regex, "")].filter(
          (_) => _ !== ""
        );
      };

      const capitalSelector = (value) =>
        `table.wikitable tbody tr:has(td:first-child:has(a[title="${value}"])) td:nth-child(2)`;
      const capital = $capitals(
        `${capitalSelector(name)},
        ${capitalSelector(secondaryName)},
        ${capitalSelector(officialName)}`
      )
        .text()
        .trim()
        .replace(/\(.*?\)|\[.*?\]/gm, "");

      const langs = getLanguages().map((lang) => {
        const exist = $languageLookup(
          `table.wikitable tbody tr:has(td:first-child a[title~="${lang.trim()}"])`
        );
        const mapped = exist
          .map(function () {
            return $languageLookup(this).find("td:nth-child(3)").text().trim();
          })
          .toArray()
          .filter((_) => _ !== "");
        return mapped[0];
      }).join(',');

      const callingCodesTable = $callingCodes("h2 span#Alphabetical_order")
        .parent()
        .next("table.wikitable");

      const callingCode = callingCodesTable
        .find("tr ")
        .filter((i, el) => {
          const countryName = $callingCodes(el).find("td:first-child").text();
          return (
            countryName.includes(name ?? secondaryName) ||
            countryName.includes(secondaryName) ||
            countryName.includes(officialName)
          );
        })
        .first()
        .find("td:nth-child(2)")
        .text()
        .trim()
        .replace(/\(.*?\)/gm, "");

      if (!alpha3 || !name) return;

      countries.set(alpha3, [
        multipleCountry ? `"${officialName}"` : name,
        multipleCountry ? `"${officialName}"` : secondaryName,
        `"${officialName}"`,
        alpha2,
        alpha3,
        numericCode,
        `"${internetTLD}"`,
        `"${currencies}"`,
        `"${langs}"`,
        `"${capital}"`,
        callingCode.length > 0 ? `"+${callingCode}"` : "",
      ]);
    });

    const values = [...countries.values()];

    const csvHeader = [
      "Name",
      "Secondary Name",
      "Official Name",
      "Alpha 2",
      "Alpha 3",
      "Numeric Code",
      "Internet TLD",
      "Currencies",
      "Languages",
      "Capital",
      "Calling Code",
    ];

    if (values.some((_) => _.length != csvHeader.length))
      throw new Error("Rows Columns not matched");

    const dataToWrite = [csvHeader, ...values]
      .map((_) => _.join(","))
      .join("\n");
    return dataToWrite;
  },
});

getData({
  url: "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3",
  filePath: "src/data/csv/countries_meta.csv",
  cb($) {
    const rows = $(".plainlist ul li")
      .map(function () {
        return $(this).find("span.monospaced").text().trim();
      })
      .toArray();
    const csvHeader = ["Total"];
    const dataToWrite = [csvHeader, [rows.length]]
      .map((_) => _.join(","))
      .join("\n");
    return dataToWrite;
  },
});

getData({
  url: "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3",
  filePath: "src/data/csv/countries_codes_meta.csv",
  cb($) {
    const rows = $(".plainlist ul li")
      .map(function () {
        return Array.from([$(this).find("span.monospaced").text().trim()]);
      })
      .toArray();
    const csvHeader = ["Code"];
    const dataToWrite = [csvHeader, rows].map((_) => _.join("\n")).join("\n");
    return dataToWrite;
  },
});
