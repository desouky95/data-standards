import assert from "assert";
import _ from "lodash";
import { describe, it } from "mocha";
import { countries, currencies, callingCodes, fifaCodes, iocCodes, } from "../src";
describe("Data", () => {
    describe("Countries", () => {
        it("Should be array", () => {
            assert(_.isArray(countries));
        });
    });
    describe("Currencies", () => {
        it("Should be array", () => {
            assert(_.isArray(currencies));
        });
    });
    describe("Calling Codes", () => {
        it("Should be array", () => {
            assert(_.isArray(callingCodes));
        });
    });
    describe("Fifa", () => {
        it("Should be array", () => {
            assert(_.isArray(fifaCodes));
        });
    });
    // describe("Languages", () => {
    //   it("Should be array", () => {
    //     assert(_.isArray(languages));
    //   });
    // });
    describe("ioc Codes", () => {
        it("Should be array", () => {
            assert(_.isArray(iocCodes));
        });
    });
});
