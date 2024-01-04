import { createTypescript, getData } from "@desoukysvyc/data-utils";
import axios from "axios";
import { parse } from "csv";
import { createReadStream } from "fs";
import { clean, cleanLanguage, urls } from "../../utils/urls";
import { Cheerio, load, Element, CheerioAPI } from "cheerio";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { cwd } from "process";
import _ from "lodash";

type CountryLanguage = {
  name: string;
  official: string[];
  regional: string[];
  minority: string[];
  national: string[];
  widelySpoken: string[];
};

type Iso6393FileOutput = {
  Id: string;
  Part2B: string;
  Part2T: string;
  Part1: string;
  Scope: string;
  Language_Type: string;
  Ref_Name: string;
  Comment: string;
};
type Iso6393Output = {
  iso639_3: string;
  iso639_2B: string;
  ios639_2T: string;
  ios639_1T: string;
  scope: string;
  type: string;
  name: string;
  note: string;
};
type Iso6392Output = {
  iso639_2: string;
  ios639_1: string;
  name: string;
};

const scopes = {
  I: "individual",
  M: "macrolanguage",
  S: "special",
};

const types = {
  A: "ancient",
  C: "constructed",
  E: "extinct",
  H: "historical",
  L: "living",
  S: "special",
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function collect() {
  const handleIso6392 = async () => {
    const filePath = cwd() + "/data/ISO-639-2_utf-8.txt";
    const url = new URL(filePath);
    const input = createReadStream(url.pathname);
    const records: string[][] = [];
    const parser = parse({
      delimiter: "|",
    });

    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    input.pipe(parser);

    return new Promise<Iso6392Output[]>((resolve, reject) => {
      parser.on("error", function (err) {
        console.error(err.message);
        reject(err);
      });

      parser.on("end", function () {
        const mapped = records.map((_) => ({
          iso639_2: _[0],
          ios639_1: _[1],
          name: _[3],
        }));
        resolve(mapped);
      });
    });
  };
  const handleIso6393 = async () => {
    const response = await axios.get(urls.iso639_3, {
      responseType: "stream",
      responseEncoding: "utf-8",
    });
    const input = response.data;
    const records: Iso6393FileOutput[] = [];
    const parser = parse({
      delimiter: "\t",
      columns: [
        "Id",
        "Part2B",
        "Part2T",
        "Part1",
        "Scope",
        "Language_Type",
        "Ref_Name",
        "Comment",
      ],
      escape: "\t",
    });

    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    input.pipe(parser);

    return new Promise<
      {
        iso639_3: string;
        iso639_2B: string;
        ios639_2T: string;
        ios639_1T: string;
        scope: string;
        type: string;
        name: string;
        note: string;
      }[]
    >((resolve, reject) => {
      parser.on("error", function (err) {
        console.error(err.name);
        reject(err);
      });

      parser.on("end", function () {
        const header = records.splice(0, 1).flat(1);
        const mapped = records.map((_) => ({
          iso639_3: _.Id,
          iso639_2B: _.Part2B,
          ios639_2T: _.Part2T,
          ios639_1T: _.Part1,
          scope: scopes[_.Scope as keyof typeof scopes],
          type: types[_.Language_Type as keyof typeof types],
          name: _.Ref_Name,
          note: _.Comment,
        }));
        resolve(mapped);
      });
    });
  };

  const handleRow = function ($: CheerioAPI, element: Cheerio<Element>) {
    const isList = $(element).find("ul");
    let languages: string[] = [];
    if (isList.length === 0) {
      let text;
      text = $(element).find("a").first().text();
      if (!text) text = element.text().trim();
      if (!text) return [];
      languages.push(text);
    } else {
      let text;
      text = element
        .find("ul li")
        .map(function () {
          const haveLinks = $(this).find("a");
          if (haveLinks.length === 0) return $(this).text();
          const firstLinkText = $(this).find("a").first().text().trim();
          const match = $(this)
            .text()
            .trim()
            .match(/\[.*?\]|\(.*?\)/gm);
          if (match && match[0].includes(firstLinkText)) return $(this).text();
          return firstLinkText;
        })
        .toArray();
      languages = languages.concat(text);
    }

    return languages.map((_) => cleanLanguage(_));
  };
  const handleLanguagesByCountry = async () => {
    const response = await axios.get(urls.isoLanguagesByCountry);
    const $ = load(response.data);
    const table = $("table.wikitable");
    const rows = $(table).find("tbody tr:has(td)");
    const countriesLanguages = new Map<string, CountryLanguage>();

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const name = clean($(row).find("td:first-child").text());
      const official = handleRow($, $(row).find("td:nth-child(2)"));
      const regional = handleRow($, $(row).find("td:nth-child(3)"));
      const minority = handleRow($, $(row).find("td:nth-child(4)"));
      const national = handleRow($, $(row).find("td:nth-child(5)"));
      const widelySpoken = handleRow($, $(row).find("td:nth-child(6)"));
      countriesLanguages.set(name, {
        name,
        official,
        regional,
        minority,
        national,
        widelySpoken,
      });
    }

    return [...countriesLanguages.values()];
  };

  const iso6392 = await handleIso6392();
  const iso6393 = await handleIso6393();
  const countriesLanguages = await handleLanguagesByCountry();

  const countriesWithCodesIso6392 = countriesLanguages.map((v) => {
    const withoutName = _.omit(v, "name");
    const mapped = _.uniq(
      _.concat(
        ..._.map(_.values(withoutName), (f) =>
          _.filter(
            _.map(f, (name) => {
              let language = iso6392.find(
                (l) => l.name.toLowerCase() === name.toLowerCase()
              );
              if (!language)
                language = iso6392.find((l) =>
                  l.name.toLowerCase().includes(name.toLowerCase())
                );
              if (!language) {
                return null;
              }
              if (!language.iso639_2) {
                console.log(language);
              }
              return language?.iso639_2;
            }),
            (name) => !!name
          )
        )
      )
    );
    return { name: v.name, languages: mapped };
  });

  return { countriesLanguages: countriesWithCodesIso6392, iso6392, iso6393 };
}
