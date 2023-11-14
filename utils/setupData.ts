import { Scrapper } from "./scrapper";

const scrapper = new Scrapper();

(async () => {
  await scrapper.getCountriesRegions();
  await scrapper.getCountriesList();
  await scrapper.getCountriesCapital();
  await scrapper.getCurrenciesList();
  await scrapper.getCallingCodes();
  await scrapper.getFifaAndIOC();
})();
