import { createTypescript, getData } from "@desoukysvyc/data-utils";
import { urls } from "../../utils/urls";
import axios from "axios";
import { load } from "cheerio";
import  _ from "lodash";

export default async function collect() {
  const handleFifa = async () => {
    const response = await axios.get(urls.fifaCodes);
    const $ = load(response.data);
    const footballFederations: Map<
      string,
      { country: string; federationName: string; code: string }
    > = new Map();
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
              footballFederations.set(country, {
                country,
                federationName: federationName ?? "",
                code,
              });
          });
      });

    const data = _.orderBy(Array.from(footballFederations.values()), "country");



  
    return data;
  };

  const handleIOC = async () => {
    const response = await axios.get(urls.olympicCodes);
    const $ = load(response.data);
    const nationalIOCs: Map<string, { country: string; code: string }> =
      new Map();

    $("h2 span#Current_NOCs")
      .parent()
      .next()
      .next("table.wikitable")
      .find("tbody tr")
      .map(function () {
        const code = $(this).find("td:first-child span").text().trim();
        const country = $(this).find("td:nth-child(2) a").text().trim();

        if (country) nationalIOCs.set(code, { country, code });
      });

    const data = _.sortBy(Array.from(nationalIOCs.values()), "country");

   
    return data;
  };

  const handleComparisonISO = async () => {
    const response = await axios.get(urls.fifaComparisonCountryCodes);
    const $ = load(response.data);

    const rows = $(
      "table.wikitable:first-of-type tbody tr:has(td:nth-child(4):not(:empty),td:nth-child(5):not(:empty))"
    );

    const data = rows
      .map(function () {
        const iso = $(this).find("td:nth-child(5)").text().trim();
        const fifa = $(this).find("td:nth-child(4)").text().trim();
        const ioc = $(this).find("td:nth-child(3)").text().trim();
        return { iso, fifa, ioc };
      })
      .toArray();

    return data;
  };

  return {
    fifaCodes: await handleFifa(),
    iocCodes: await handleIOC(),
    comparisonIso: await handleComparisonISO(),
  };
}
