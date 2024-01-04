import Pocketbase from "pocketbase";

import { Country } from "@desoukysvyc/countries";
// import { Currency } from "@desoukysvyc/currency";

const pb = new Pocketbase("http://127.0.0.1:8090");

async function init() {
  const collection = await pb.admins.authWithPassword(
    "ismaildesouky95@gmail.com",
    "0100929164"
  );

  for (const country of Country.all) {
    const fifa = await pb
      .collection("fifa_codes")
      .getFirstListItem(`code='${country.fifa}'`);
    const ioc = await pb
      .collection("ioc_codes")
      .getFirstListItem(`code='${country.ioc}'`);

    // const currencies = await pb.collection("ioc_codes").getFullList({
    //   filter: country.currencies.map((_) => `alpha3='${_}'`).join("||"),
    // });

    await pb.collection("countries").create({
      name: country.name,
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      altNames: country.altNames,
      numeric: country.numeric,
      independent: country.independent,
      officialName: country.officialName,
      ccTLD: country.ccTLD,
      fifa: fifa.id,
      ioc: ioc.id,
      callingCode: country.callingCode,
      sovereignty: country.sovereignty,
      capital: country.capital,
      status: country.status,
      // currencies: currencies.map((_) => _.id),
    });
  }
}

init()
  .then(() => {
    console.log("init completed");
  })
  .catch((err) => {
    console.error(err);
  });
