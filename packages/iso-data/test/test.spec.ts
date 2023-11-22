import assert from "assert";
import _ from "lodash";
import { describe, it } from "mocha";
import { fifaCodes, callingCodes, capitals, iocCodes } from "../src";

describe("Fifa", () => {
  describe("All", () => {
    it("Should Be Array", () => {
      assert(_.isArray(fifaCodes));
    });
  });

  describe("Code", () => {
    it("Should Find Egypt", () => {
      assert.equal(fifaCodes.query({ code: "EGY" })[0].country, "Egypt");
    });
  });
});

describe("Calling Codes", () => {
  describe("All", () => {
    it("Should Be Array", () => {
      assert(_.isArray(callingCodes));
    });
  });

  describe("Code", () => {
    it("Should Find Egypt", () => {
      assert.equal(
        callingCodes.query({ code: "+20" })[0].countryService,
        "Egypt"
      );
    });
  });
});

describe("Olympic Codes", () => {
  describe("All", () => {
    it("Should Be Array", () => {
      assert(_.isArray(iocCodes));
    });
  });

  describe("Code", () => {
    it("Should Find USA", () => {
      assert.equal(iocCodes.query({ code: "USA" })[0].country, "United States");
    });
  });
});

describe("Capitals", () => {
  describe("All", () => {
    it("Should Be Array", () => {
      assert(_.isArray(capitals));
    });
  });

  describe("Code", () => {
    it("Should Find Cairo", () => {
      assert.equal(capitals.query({ country: "Egypt" })[0].capital, "Cairo");
    });
  });
});
