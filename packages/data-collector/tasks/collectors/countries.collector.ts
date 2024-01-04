import { createTypescript, getData } from "@desoukysvyc/data-utils";
import axios from "axios";
import { load } from "cheerio";
import { booleanify, clean, urls } from "../../utils/urls";
import _ from "lodash";
const { mergeWith, isArray, uniq } = _
const statusMap = {
  "user-assigned": "user-assigned",
  "exceptionally reserved": "exceptionally-reserved",
  "transitionally reserved": "transitionally-reserved",
  "indeterminately reserved": "indeterminately-reserved",
  deleted: "deleted",
  unassigned: "unassigned",
  assigned: "assigned",
};
const states = [
  "user-assigned",
  "exceptionally reserved",
  "transitionally reserved",
  "indeterminately reserved",
  "deleted",
  "unassigned",
];

type Iso3166 = { code: string; state: keyof typeof statusMap; note?: string };
type CollectedCountry = {
  name: string;
  alpha2: "AF";
  alpha3: string;
  numeric: string;
  independent: true;
  status: keyof typeof statusMap;
  altNames: Array<string>;
  officialName: string;
  ccTLD: Array<string>;
  sovereignty: string;
};
export default async function collect() {
  let assigned: any[] = [];
  let iso31661: any[] = [];
  let reserved: any[] = [];

  const handleIso3166 = async () => {
    const response = await axios.get(urls.iso31661Overview);
    const $ = load(response.data);

    const table = $("table.wikitable")[1];
    $(table)
      .find("td")
      .each(function () {
        const code = clean($(this).text());
        const status = clean($(this).attr("title") ?? "");
        let state = "assigned";
        const colon = states.indexOf(":");
        const semicolon = colon === -1 ? -1 : status.indexOf(";", colon);
        const note =
          colon === -1
            ? undefined
            : status
              .slice(colon + 1, semicolon === -1 ? status.length : semicolon)
              .replace(/\([^)]*\)/g, "")
              .replace(/\)/g, "")
              .trim();
        if (status === "Escape code") {
          state = "unassigned";
        }

        for (let stateType of states) {
          if (new RegExp("^" + stateType, "i").test(status)) {
            state = statusMap[stateType as keyof typeof statusMap];
            break;
          }
        }

        iso31661.push({ code, state, note });
      });

    const reservedTable = $("h4:has(span#Transitional_reservations)")
      .next()
      .next("table.wikitable");

    const exceptionalTable = $("h4:has(span#Exceptional_reservations)")
      .next()
      .next("table.wikitable");

    const indeterminateTable = $("h4:has(span#Indeterminate_reservations)")
      .next()
      .next("table.wikitable");

    const deletedTable = $("h2:has(span#Deleted_codes)")
      .next()
      .next("table.wikitable");

    let rows = $(reservedTable).find("tbody tr");
    const entries: any[] = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const [alpha2, , , , , , notes] = $(row)
        .find("td")
        .map(function () {
          return clean($(this).text());
        })
        .toArray();

      const name = clean($(row).find("td:nth-child(2) a:first-child").text());
      if (!name) continue;
      entries.push({
        alpha2,
        name,
        notes,
      });
    }

    rows = exceptionalTable.find("tbody tr");
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const [alpha2, name, , , notes] = $(row)
        .find("td")
        .map(function () {
          return clean($(this).text());
        })
        .toArray();
      if (!name) continue;

      entries.push({ alpha2, name, notes });
    }

    rows = indeterminateTable.find("tbody tr");
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const [alpha2, name] = $(row)
        .find("td")
        .map(function () {
          return clean($(this).text());
        })
        .toArray();
      if (!name) continue;

      entries.push({ alpha2, name, notes: "" });
    }
    rows = deletedTable.find("tbody tr");

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const [alpha2, name, , notes] = $(row)
        .find("td")
        .map(function () {
          return clean($(this).text());
        })
        .toArray();
      if (!name) continue;
      entries.push({ alpha2, name, notes });
    }

    reserved = _.map(entries, (_) => ({
      ..._,
      state: iso31661.find((i) => _.alpha2 === i.code).state,
    }));

    reserved = _.sortBy(reserved, "alpha2");

    iso31661 = _.sortBy(iso31661, "code");
  };

  const handleAssigned = async () => {
    const response = await axios.get(urls.iso3166);
    const $ = load(response.data);
    const table = $("table.wikitable")[1];
    for (let index = 0; index < $(table).find("tr").length; index++) {
      const row = $(table).find("tr")[index];
      const [name, alpha2, alpha3, numeric, , independent] = $(row)
        .find("td")
        .map(function () {
          return clean($(this).text());
        })
        .toArray();
      if (!name) continue;
      const altNames = [
        clean($(row).find("td:first-child a[title!='']").attr("title") ?? ""),
        name.split(",")[0].trim(),
        name.replace(/\(.*?\)/gm, "").trim(),
        alpha3 === "NLD" ? `${name.split(",")[0]} (the)` : "",
      ];
      const isoInstance = iso31661.find((_) => _.code === alpha2);
      if (!isoInstance)
        throw new Error(`Assigned Country not found ==> ${alpha2}`);

      assigned.push({
        name,
        alpha2,
        alpha3,
        numeric,
        independent: booleanify(independent),
        status: isoInstance.state,
        altNames,
      });

      assigned = _.sortBy(assigned, "name");
    }
  };

  const handleExtended = async () => {
    const response = await axios.get(urls.iso3166Extended);
    const $ = load(response.data);
    const table = $("table.wikitable");
    const entries: any[] = [];
    const cells = $(table).find("tr");
    for (let index = 0; index < cells.length; index++) {
      const row = cells[index];
      const [, officialName, sovereignty, , alpha3, numeric, , ccTLD] = $(row)
        .find("td")
        .map(function () {
          return clean($(this).text());
        })
        .toArray() as any as string[];
      const name = clean($(row).find("td:first-child a:first-of-type").text());
      if (!name || $(row).children().length < 2) continue;
      const alpha2 = clean($(row).find("td:nth-child(4) a span").text().trim());
      const isoInstance = assigned.find((_) => _.alpha2 == alpha2);
      if (!isoInstance)
        throw new Error(`${alpha2} not found in assigned codes`);
      entries.push({
        alpha2,
        officialName,
        ccTLD: ccTLD.split(" "),
        altNames: isoInstance.altNames.concat([name, officialName]),
        sovereignty,
      });
    }
    assigned = _.sortBy(
      _.map(assigned, (_) =>
        mergeWith(
          _,
          entries.find((e) => e.alpha2 == _.alpha2),
          (v, src) => {
            if (isArray(v)) return uniq(v.concat(src));
          }
        )
      ),
      "name"
    );
  };

  const handleExtraAltNames = async () => {
    const response = await axios.get(urls.iso3166AltNames);
    const $ = load(response.data);
    const tables = $("table.wikitable");

    const entries: any[] = [];
    for (let indexT = 0; indexT < tables.length; indexT++) {
      const table = tables[indexT];

      const cells = $(table).find("tr");
      for (let index = 0; index < cells.length; index++) {
        const row = cells[index];
        const [alpha3] = $(row)
          .find("td")
          .map(function () {
            return clean($(this).text());
          })
          .toArray() as any as string[];
        if (!alpha3) continue;
        const name = clean($(row).find("td:nth-child(2) a").text().trim());
        const isoInstance = assigned.find((_) => _.alpha3 == alpha3);

        if (!isoInstance)
          throw new Error(`${alpha3} not found in assigned codes`);
        entries.push({
          alpha3,
          altNames: isoInstance.altNames.concat([name]),
        });
      }
    }

    // assigned = sortBy(
    //   map(entries, (_) => ({ ..._, altNames: uniq(_.altNames) })),
    //   "name"
    // );

    assigned = _.sortBy(
      _.map(assigned, (_) =>
        mergeWith(
          _,
          entries.find((e) => e.alpha3 == _.alpha3),
          (v, src) => {
            if (isArray(v)) return uniq(v.concat(src));
          }
        )
      ),
      "name"
    );
  };

  await handleIso3166();
  await handleAssigned();
  await handleExtended();
  await handleExtraAltNames();

  assigned = _.map(assigned, (_) => ({
    ..._,
    altNames: _.altNames.filter((_: string) => _ !== ""),
  }));

 

  return {
    iso31661: _.sortBy(iso31661, "name") as Array<Iso3166>,
    reserved,
    assigned: assigned as Array<CollectedCountry>,
  };
}
