import { createTypescript, getData } from "@desoukysvyc/data-utils";
import axios from "axios";
import { clean, urls } from "../../utils/urls";
import { load } from "cheerio";
import _ from "lodash";

export default async function collect() {
  const response = await axios.get(urls.callingCodes);
  const $ = load(response.data);
  const callingCodes: Map<string, { countryOrService: string; code: string }> =
    new Map();

  $("h2 span#Alphabetical_order")
    .parent()
    .next("table.wikitable")
    .find("tbody tr")
    .map(function () {
      let countryOrService = clean(
        $(this)
          .find("td:first-child")
          .text()
          .trim()
          .replace(/State \(Holy See\)/gm, "")
          .replace(/US Virgin Islands/gm, "Virgin Islands")
      )
        .replace(/\(.*?\)/gm, "")

        .trim();
      if (countryOrService.split(",").length > 1)
        countryOrService = `${countryOrService
          .split(",")[1]
          .trim()} ${countryOrService.split(",")[0].trim()}`.trim();
      let code = clean($(this).find("td:nth-child(2) a").text().trim());
      // .replace(/\(|\)/gm, "")
      // .replace(/ /gm, "-");
      let prefix = code.match(/\(.*?\)/gm);
      if (prefix && prefix[0].split(",").length > 1) {
        const selected = prefix[0].replace(/\(|\)/gm, "").split(",")[0];
        code = `${code.replace(/\(.*?\)/gm, "").trim()}-${selected.trim()}`;
      } else code = code.replace(/\(|\)/gm, "").replace(/ /gm, "-");
      if (countryOrService == "") return;
      callingCodes.set(countryOrService, {
        countryOrService,
        code: `+${code.trim()}`,
      });
    });

  const data = _.sortBy(Array.from(callingCodes.values()), "countryOrService");

  

  return data;
}
