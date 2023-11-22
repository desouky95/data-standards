import { describe, it } from "mocha";
import { currencies } from "../src";
import assert from "assert";
import _ from "lodash";
import { countries } from "@desoukysvyc/data-collector";
describe("Currency", () => {
  describe("All", () => {
    it("Should return an array", () => {
      assert(_.isArray(currencies));
    });
  });

  describe("Code", () => {
    it("should find USD", function () {
      assert.equal(
        currencies.query({ code: "USD" })[0].name,
        "United States dollar"
      );
    });
  });

  describe("formatting", function () {
    it("decimals should be numbers", function () {
      assert(_.isNumber(currencies.query({ code: "USD" })[0].decimal));
    });
  });
  describe("Symbol", () => {
    it("should find $", function () {
      assert.equal(currencies.query({ code: "USD" })[0].symbol, "$");
    });
    it("should not find Moroccan dirham ", function () {
      assert.equal(currencies.query({ code: "MAD" })[0].symbol, "MAD");
    });
  });
});
