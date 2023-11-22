import assert from "assert";
import { describe, it } from "mocha";
import { countries as test } from "country-data";
import { countries, countriesFootballFederations } from "../src";
import {
  countriesMeta,
  countriesCodes,
  currencies,
  languages,
} from "@desoukysvyc/data-collector";
import _, { differenceBy, isArray } from "lodash";

describe("countries", function () {
  describe("all", function () {
    it("should be array", function () {
      assert(isArray(countries));
    });
  });

  describe("alpha2", function () {
    it("should find USA", function () {
      assert.equal(countries.query({ alpha2: "US" })[0].name, "United States");
    });
    it("should find USA Secondary Name", function () {
      assert.equal(
        countries.query({ alpha2: "US" })[0].secondaryName,
        "United States of America"
      );
    });
    it("should find Egypt", function () {
      assert.equal(countries.query({ alpha2: "EG" })[0].name, "Egypt");
    });
  });

  describe("alpha3", function () {
    it("should find France", function () {
      assert.equal(countries.query({ alpha3: "FRA" })[0].name, "France");
    });
    it("should find France currency", function () {
      assert(countries.query({ alpha3: "FRA" })[0].currencies);
    });
  });
  describe("Fifa", () => {
    it("should find England Football Federation - Country Name", function () {
      assert.equal(
        countriesFootballFederations.query({ code: "ENG" })[0].country,
        "England"
      );
    });
  });
  describe("Currencies", () => {
    it("should find Egypt Currencies", function () {
      assert(
        countries.query({ alpha3: "EGY" })[0].currencies,
        "Egypt Currencies"
      );
    });
  });

  describe("Capitals", () => {
    it("should find Morocco capital", function () {
      assert(countries.query({ alpha3: "MAR" })[0].capital, "Rabat");
    });
  });

  describe("Languages", () => {
    it("should find Algeria Languages", function () {
      assert(isArray(countries.query({ alpha3: "DZA" })[0].languages));
    });
  });
  describe("#Total", () => {
    it("should return total countries meta ", () => {
      const _ = test.all
        .filter((_) => _.status == "assigned")
        .map((_) => ({ alpha3: _.alpha3, name: _.name }));
      const data = countries.map((_) => ({ alpha3: _.alpha3, name: _.name }));
      const differences = differenceBy(_, data, "alpha3");
      assert.equal(_.length, countriesMeta.total, "Not equal");
    });
  });
  describe("#Indices", () => {
    it("should find no differences", () => {
      const data = countries.map((_) => ({ code: _.alpha3 }));
      const diff = differenceBy(countriesCodes, data, "code");
      assert.equal(countriesCodes.length, data.length, JSON.stringify(diff));
    });
  });

  describe("Check country structure", () => {
    _.each(countries, (country) => {
      describe(country.name, () => {
        it("Should have correct alpha2, alpha3", () => {
          assert(
            country.alpha2.match(/[A-Z]{2}/g),
            `Alpha2 (${country.alpha2}) formatted correctly`
          );
          assert(
            country.alpha3.match(/[A-Z]{3}/g),
            `Alpha3 (${country.alpha3}) formatted correctly`
          );
        });
      });
    });
  });
  describe("Check countries currencies", () => {
    _.each(countries, (country) => {
      describe(`${country.name}-(${country.alpha3})`, () => {
        _.each(country.currencies, (currency) => {
          it(currency, () => {
            assert(currencies.find((_) => _.code == currency));
          });
        });
      });
    });
  });

  describe("Check countries languages", () => {
    _.each(countries, (country) => {
      describe(`${country.name}-(${country.alpha3})`, () => {
        _.each(country.languages, (language) => {
          it(language, () => {
            assert(languages.find((_) => _.alpha3 == language));
          });
        });
      });
    });
  });
});
