import assert from "assert";
import _ from "lodash";
import { describe, it } from "mocha";
import { languages } from "../src";

describe("Languages", () => {
  describe("All", () => {
    it("should be array", () => {
      assert(_.isArray(languages));
    });
  });

  describe("Alpha 3", () => {
    it("Should Find Arabic", () => {
      assert.equal(languages.query({ alpha3: "ara" })[0].name, "Arabic");
    });
  });

  describe("Alpha 2", () => {
    it("Should Find English", () => {
      assert.equal(languages.query({ alpha2: "en" })[0].name, "English");
    });
  });
});
