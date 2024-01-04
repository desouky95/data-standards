import { createTypescript, getData } from "@desoukysvyc/data-utils";
import axios from "axios";
import { clean, urls } from "../../utils/urls";
import { load } from "cheerio";
import _ from "lodash";

export default async function collect() {
  const response = await axios.get(urls.countriesCapitals);

  const $ = load(response.data);

  const countriesCapitals: Map<string, { country: string; capital: string }> =
    new Map();
  $("table.wikitable").map(function () {
    $(this)
      .find("tbody tr")
      .map(function () {
        const country = clean($(this).find("td:first-child").text().trim())
          .replace(/\(.*?\)/gm, "")
          .trim();
        if (!country) return;
        const capital = clean($(this).find("td:nth-child(2) a").text().trim());
        countriesCapitals.set(country, { capital, country });
      });
  });

  const data = _.sortBy(Array.from(countriesCapitals.values()), "country");
 

  return data;
}
